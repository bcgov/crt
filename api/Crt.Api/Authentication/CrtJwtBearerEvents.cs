using Crt.Api.Extensions;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Crt.Api.Authentication
{
    public class CrtJwtBearerEvents : JwtBearerEvents
    {
        private IUserService _userService;
        private CrtCurrentUser _curentUser;
        private ILogger<CrtJwtBearerEvents> _logger;

        public CrtJwtBearerEvents(IWebHostEnvironment env, IUserService userService,
            CrtCurrentUser currentUser, ILogger<CrtJwtBearerEvents> logger) : base()
        {
            _userService = userService;
            _curentUser = currentUser;
            _logger = logger;
        }

        public override async Task AuthenticationFailed(AuthenticationFailedContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            var problem = new ValidationProblemDetails()
            {
                Type = "https://crt.bc.gov.ca/exception",
                Title = "Access denied",
                Status = StatusCodes.Status401Unauthorized,
                Detail = "Authentication failed.",
                Instance = context.Request.Path
            };

            problem.Extensions.Add("traceId", context.HttpContext.TraceIdentifier);

            await context.Response.WriteJsonAsync(problem, "application/problem+json");
        }

        public override async Task TokenValidated(TokenValidatedContext context)
        {
            try
            {
                if (!(await PopulateCurrentUserFromDb(context.Principal)))
                {
                    context.Fail("Access Denied");
                    return;
                }

                _curentUser.UserInfo = await _userService.GetCurrentUserAsync();

                AddClaimsFromUserInfo(context.Principal, _curentUser.UserInfo);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                throw;
            }
        }

        private async Task<bool> PopulateCurrentUserFromDb(ClaimsPrincipal principal)
        {
            _ = bool.TryParse(principal.FindFirstValue(CrtClaimTypes.KcIsApiClient), out bool isApiClient);
            isApiClient = true;
            var preferredUsername = principal.FindFirstValue(CrtClaimTypes.PreferredUsername);
            string[] usernames = null;
            var username = "";
            var userGuid = new Guid("00000000-0000-0000-0000-000000000000");
            var email = "";
            if (preferredUsername.Contains("@"))
            {
                usernames = preferredUsername.Split("@");
                username = usernames[0].ToUpperInvariant();
                userGuid = new Guid(Guid.Parse(username).ToString());
                email = principal.FindFirstValue(ClaimTypes.Email).ToUpperInvariant();
            }
            else
            {
                username = principal.FindFirstValue(CrtClaimTypes.KcClientId).ToUpperInvariant();
                userGuid = new Guid(principal.FindFirstValue("idir_userid")?.ToUpperInvariant());
                email = principal.FindFirstValue(ClaimTypes.Email)?.ToUpperInvariant();
            }

          

            var user = await _userService.GetActiveUserEntityAsync(userGuid);
            if (user == null)
            {
                _logger.LogWarning($"Access Denied - User[{username}/{userGuid}] does not exist");
                return false;
            }

            //When it's an Api client, we don't want to use the username from the token because it's a hard-code value.
            //This is to support the scenario where username has changed for the GUID. Note GUID never changes and unique but username can change.
            if (isApiClient)
            {
                username = user.Username;
                email = user.Email;
            }

            _curentUser.UserGuid = userGuid;
            _curentUser.Username = username;
            _curentUser.Email = email;
            _curentUser.FirstName = user.FirstName;
            _curentUser.LastName = user.LastName;
            _curentUser.ApiClientId = user.ApiClientId;

            if (isApiClient) //no db update, so everything's done.
            {
                _logger.LogInformation($"ApiClient Login - {preferredUsername}/{username}");
                return true;
            }
            
            if (user.Username?.ToUpperInvariant() != username || user.Email?.ToUpperInvariant() != email) //when the info changed, update db with the latest info from LDAP service
            {
                if (await _userService.UpdateUserFromAdAsync(username, user.ConcurrencyControlNumber) != 0)
                {
                    _logger.LogWarning($"Username/Email changed from {user.Username}/{user.Email} to {username}/{email}.");
                }
            }

            return true;
        }

        private void AddClaimsFromUserInfo(ClaimsPrincipal principal, UserCurrentDto user)
        {
            var claims = new List<Claim>();

            foreach (var permission in user.Permissions)
            {
                claims.Add(new Claim(CrtClaimTypes.Permission, permission));
            }

            claims.Add(new Claim(ClaimTypes.Name, _curentUser.Username));

            principal.AddIdentity(new ClaimsIdentity(claims));
        }
    }
}
