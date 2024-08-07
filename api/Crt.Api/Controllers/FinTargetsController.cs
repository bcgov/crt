using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos.FinTarget;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/projects/{projectId}/targets")]
    [ApiController]
    public class FinTargetsController : CrtControllerBase
    {
        private IProjectService _projectService;
        private IFinTargetService _finTargetService;

        public FinTargetsController(CrtCurrentUser currentUser, IProjectService projectService, IFinTargetService finTargetService)
            : base(currentUser)
        {
            _projectService = projectService;
            _finTargetService = finTargetService;
        }

        [HttpGet("{id}", Name = "GetFinTarget")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<FinTargetDto>> GetFinTargetByIdAsync(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var finTarget = await _finTargetService.GetFinTargetByIdAsync(id);
            if (finTarget == null)
            {
                return NotFound();
            }

            return finTarget;
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<FinTargetDto>> CreateFinTarget(decimal projectId, FinTargetCreateDto finTarget)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            finTarget.ProjectId = projectId;

            var response = await _finTargetService.CreateFinTargetAsync(finTarget);
            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetFinTarget", new { projectId, id = response.finTargetId }, await _finTargetService.GetFinTargetByIdAsync(response.finTargetId));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateFinTarget(decimal projectId, decimal id, FinTargetUpdateDto finTarget)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            finTarget.ProjectId = projectId;

            if (id != finTarget.FinTargetId)
            {
                throw new Exception($"The finTarget ID from the query string does not match that of the body.");
            }

            var response = await _finTargetService.UpdateFinTargetAsync(finTarget);

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
        public async Task<ActionResult> DeleteFinTarget(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var response = await _finTargetService.DeleteFinTargetAsync(projectId, id);

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

        private async Task<ActionResult> IsProjectAuthorized(decimal projectId)
        {
            var project = await _projectService.GetProjectAsync(projectId);

            if (project == null)
            {
                return NotFound();
            }

            var problem = IsRegionIdAuthorized(project.RegionId);
            if (problem != null)
            {
                return Unauthorized(problem);
            }

            return null;
        }

        [HttpPost("{id}/clone", Name="CloneFinTarget")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<FinTargetDto>> CloneFinTarget(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var response = await _finTargetService.CloneFinTargetAsync(projectId, id);

            if (response.NotFound)
            {
                return NotFound();
            }

            return CreatedAtRoute("CloneFinTarget", new { projectId, response.id }, await _finTargetService.GetFinTargetByIdAsync(response.id));
        }
    }
}
