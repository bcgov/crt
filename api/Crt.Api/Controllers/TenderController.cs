using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos.Tender;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/projects/{projectId}/tenders")]
    [ApiController]
    public class TenderController : CrtControllerBase
    {
        private IProjectService _projectService;
        private ITenderService _tenderService;

        public TenderController(CrtCurrentUser currentUser, IProjectService projectService, ITenderService tenderService)
            : base(currentUser)
        {
            _projectService = projectService;
            _tenderService = tenderService;
        }

        [HttpGet("{id}", Name = "GetTender")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<TenderDto>> GetTenderByIdAsync(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var tender = await _tenderService.GetTenderByIdAsync(id);
            if (tender == null)
            {
                return NotFound();
            }

            return Ok(tender);
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<TenderCreateDto>> CreateTender(decimal projectId, TenderCreateDto tender)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            tender.ProjectId = projectId;

            var response = await _tenderService.CreateTenderAsync(tender);
            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetTender", new { projectId = projectId, id = response.tenderId }, await _tenderService.GetTenderByIdAsync(response.tenderId));
        }

        [HttpPost("{id}/clone", Name ="CloneTender")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<TenderDto>> CloneTender(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var response = await _tenderService.CloneTenderAsync(projectId, id);
            if (response.NotFound)
            {
                return NotFound();
            }

            return CreatedAtRoute("CloneTender", new { projectId = projectId, id = response.id }, await _tenderService.GetTenderByIdAsync(response.id));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateTender(decimal projectId, decimal id, TenderUpdateDto tender)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            tender.ProjectId = projectId;

            if (id != tender.TenderId)
            {
                throw new Exception($"The tender ID from the query string does not match that of the body.");
            }

            var response = await _tenderService.UpdateTenderAsync(tender);

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
        public async Task<ActionResult> DeleteTender(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var response = await _tenderService.DeleteTenderAsync(projectId, id);

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
