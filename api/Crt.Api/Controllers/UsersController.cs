using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos;
using Crt.Model.Dtos.Keycloak;
using Crt.Model.Dtos.User;
using Crt.Model.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/users")]
    [ApiController]
    public class UsersController : CrtControllerBase
    {
        private IUserService _userService;
        private IKeycloakService _keyCloakService;

        public UsersController(IUserService userService, IKeycloakService keyCloakService, CrtCurrentUser currentUser)
               : base(currentUser)
        {
            _userService = userService;
            _keyCloakService = keyCloakService;
        }

        [HttpGet("current")]
        public ActionResult<UserCurrentDto> GetCurrentUser()
        {
            return Ok(_currentUser.UserInfo);
        }

        [HttpGet("userstatus")]
        public ActionResult<IEnumerable<UserStatusDto>> GetUserStatus()
        {
            var statuses = new List<UserStatusDto>()
            {
                new UserStatusDto
                {
                    UserStatusId = UserStatusDto.ACTIVE,
                    UserStatus = UserStatusDto.ACTIVE
                },
                new UserStatusDto
                {
                    UserStatusId = UserStatusDto.INACTIVE,
                    UserStatus = UserStatusDto.INACTIVE
                }
            };

            return Ok(statuses);
        }

        /// <summary>
        /// Search users
        /// </summary>
        /// <param name="regions">Region IDs</param>
        /// <param name="searchText">Search text for first name, last name, orgnization name, username</param>
        /// <param name="isActive">True or false</param>
        /// <param name="pageSize">Page size</param>
        /// <param name="pageNumber">Page number</param>
        /// <param name="orderBy">Order by column(s). Example: orderby=username</param>
        /// <param name="direction">Oder by direction.  Example: asc, desc</param>
        /// <returns></returns>
        [HttpGet]
        [RequiresPermission(Permissions.UserRead)]
        public async Task<ActionResult<PagedDto<UserSearchDto>>> GetUsersAsync(
            [FromQuery]string? regions,
            [FromQuery]string searchText, [FromQuery]bool? isActive,
            [FromQuery]int pageSize, [FromQuery]int pageNumber, [FromQuery]string orderBy = "username", [FromQuery]string direction = "")
        {
            return Ok(await _userService.GetUsersAsync(regions.ToDecimalArray(), searchText, isActive, pageSize, pageNumber, orderBy, direction));
        }

        [HttpGet("{id}", Name = "GetUser")]
        [RequiresPermission(Permissions.UserRead)]
        public async Task<ActionResult<UserDto>> GetUsersAsync(decimal id)
        {
            var user = await _userService.GetUserAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        [HttpGet("adaccount/{username}", Name = "GeAdAccount")]
        [RequiresPermission(Permissions.UserWrite)]
        public async Task<ActionResult<AdAccountDto>> GetAdAccountAsync(string username)
        {
            var adAccount = await _userService.GetAdAccountAsync(username);

            if (adAccount == null)
                return NotFound();

            return adAccount;
        }

        [HttpPost]
        [RequiresPermission(Permissions.UserWrite)]
        public async Task<ActionResult<UserDto>> CreateUser(UserCreateDto user)
        {
            var response = await _userService.CreateUserAsync(user);

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetUser", new { id = response.SystemUserId }, await _userService.GetUserAsync(response.SystemUserId));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.UserWrite)]
        public async Task<ActionResult> UpdateUser(decimal id, UserUpdateDto user)
        {
            if (id != user.SystemUserId)
            {
                throw new Exception($"The system user ID from the query string does not match that of the body.");
            }

            var response = await _userService.UpdateUserAsync(user);

            if (response.NotFound)
            {
                return NotFound();
            }

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        [RequiresPermission(Permissions.UserWrite)]
        public async Task<ActionResult> DeleteUser(decimal id, UserDeleteDto user)
        {
            if (id != user.SystemUserId)
            {
                throw new Exception($"The system user ID from the query string does not match that of the body.");
            }

            var response = await _userService.DeleteUserAsync(user);

            if (response.NotFound)
            {
                return NotFound();
            }

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return NoContent();
        }

        #region API Client
        [HttpGet("api-client", Name = "GetUserKeycloakClient")]
        [RequiresPermission(Permissions.ApiClientWrite)]
        public async Task<ActionResult<KeycloakClientDto>> GetUserKeycloakClient()
        {
            var client = await _keyCloakService.GetUserClientAsync();

            

            if (client == null)
            {
                return NotFound();
            }

            return Ok(client);
        }

        [HttpPost("api-client")]
        [RequiresPermission(Permissions.ApiClientWrite)]
        public async Task<ActionResult<KeycloakClientDto>> CreateUserKeycloakClient()
        {
            var response = await _keyCloakService.CreateUserClientAsync();

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetUserKeycloakClient", await _keyCloakService.GetUserClientAsync());
        }

        [HttpPost("api-client/secret")]
        [RequiresPermission(Permissions.ApiClientWrite)]
        public async Task<ActionResult> RegenerateUserKeycloakClientSecret()
        {
            var response = await _keyCloakService.RegenerateUserClientSecretAsync();

            if (response.NotFound)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(response.Error))
            {
                return ValidationUtils.GetValidationErrorResult(ControllerContext,
                     StatusCodes.Status500InternalServerError, "Unable to regenerate Keycloak client secret", response.Error);
            }

            return CreatedAtRoute("GetUserKeycloakClient", await _keyCloakService.GetUserClientAsync());
        }
        #endregion
    }
}
