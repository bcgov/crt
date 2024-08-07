using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos.QtyAccmp;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/projects/{projectId}/qtyaccmps")]
    [ApiController]
    public class QtyAccmpController : CrtControllerBase
    {
        private IProjectService _projectService;
        private IQtyAccmpService _qtyAccmpService;

        public QtyAccmpController(CrtCurrentUser currentUser, IProjectService projectService, IQtyAccmpService qtyAccmpService)
            : base(currentUser)
        {
            _projectService = projectService;
            _qtyAccmpService = qtyAccmpService;
        }

        [HttpGet("{id}", Name = "GetQtyAccmp")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<QtyAccmpDto>> GetQtyAccmpByIdAsync(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var qtyAccmp = await _qtyAccmpService.GetQtyAccmpByIdAsync(id);
            if (qtyAccmp == null)
            {
                return NotFound();
            }

            return qtyAccmp;
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<QtyAccmpCreateDto>> CreateQtyAccmp(decimal projectId, QtyAccmpCreateDto qtyAccmp)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            qtyAccmp.ProjectId = projectId;

            var response = await _qtyAccmpService.CreateQtyAccmpAsync(qtyAccmp);
            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetQtyAccmp", new { projectId = projectId, id = response.qtyAccmpId }, await _qtyAccmpService.GetQtyAccmpByIdAsync(response.qtyAccmpId));
        }

        [HttpPost("{id}/clone", Name="CloneQtyAccmp")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<QtyAccmpDto>> CloneQtyAccmp(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var response = await _qtyAccmpService.CloneQtyAccmpAsync(projectId, id);

            if (response.NotFound)
            {
                return NotFound();
            }

            return CreatedAtRoute("CloneQtyAccmp", new { projectId = projectId, id = response.id }, await _qtyAccmpService.GetQtyAccmpByIdAsync(response.id));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateQtyAccmp(decimal projectId, decimal id, QtyAccmpUpdateDto qtyAccmp)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            qtyAccmp.ProjectId = projectId;

            if (id != qtyAccmp.QtyAccmpId)
            {
                throw new Exception($"The qtyAccmp ID from the query string does not match that of the body.");
            }

            var response = await _qtyAccmpService.UpdateQtyAccmpAsync(qtyAccmp);

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
        public async Task<ActionResult> DeleteQtyAccmp(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var response = await _qtyAccmpService.DeleteQtyAccmpAsync(projectId, id);

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

    }
}
