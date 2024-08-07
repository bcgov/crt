using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos.Role;
using Microsoft.AspNetCore.Mvc;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/roles")]
    [ApiController]
    public class RolesController : CrtControllerBase
    {
        private IRoleService _roleSvc;

        public RolesController(CrtCurrentUser currentUser, IRoleService roleSvc)
             : base(currentUser)
        {
            _roleSvc = roleSvc;
        }

        [HttpGet]
        [RequiresPermission(Permissions.RoleRead)]
        public async Task<ActionResult<IEnumerable<RoleSearchDto>>> GetRolesAsync(
            [FromQuery]string searchText, [FromQuery]bool? isActive,
            [FromQuery]int pageSize, [FromQuery]int pageNumber, [FromQuery]string orderBy = "name", [FromQuery]string direction = "")
        {
            return Ok(await _roleSvc.GetRolesAync(searchText, isActive, pageSize, pageNumber, orderBy, direction));
        }

        [HttpGet("{id}", Name = "GetRole")]
        [RequiresPermission(Permissions.RoleRead)]
        public async Task<ActionResult<RoleDto>> GetRoleAsync(decimal id)
        {
            var role = await _roleSvc.GetRoleAsync(id);

            if (role == null)
                return NotFound();

            return Ok(role);
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<RoleDto>> CreateRole(RoleCreateDto role)
        {
            var response = await _roleSvc.CreateRoleAsync(role);

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetRole", new { id = response.RoleId }, await _roleSvc.GetRoleAsync(response.RoleId));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateRole(decimal id, RoleUpdateDto role)
        {
            if (id != role.RoleId)
            {
                throw new Exception($"The system role ID from the query string does not match that of the body.");
            }

            var response = await _roleSvc.UpdateRoleAsync(role);

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
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> DeleteRole(decimal id, RoleDeleteDto role)
        {
            if (id != role.RoleId)
            {
                throw new Exception($"The system role ID from the query string does not match that of the body.");
            }

            var response = await _roleSvc.DeleteRoleAsync(role);

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
    }
}