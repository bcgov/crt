using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos.Segments;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Crt.Domain.Services.SegmentService;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/projects/{projectId}/segments")]
    [ApiController]
    public class SegmentController : CrtControllerBase
    {
        private IProjectService _projectService;
        private ISegmentService _segmentService;

        public SegmentController(CrtCurrentUser currentUser, IProjectService projectService, ISegmentService segmentService)
            : base(currentUser)
        {
            _projectService = projectService;
            _segmentService = segmentService;
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<SegmentCreateDto>> CreateSegment(decimal projectId, SegmentCreateDto segment)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            segment.ProjectId = projectId;

            var response = await _segmentService.CreateSegmentAsync(segment);
            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetSegment", new { projectId = projectId, id = response.segmentId }, await _segmentService.GetSegmentByIdAsync(response.segmentId));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<SegmentCreateDto>> UpdateSegment(decimal projectId, decimal id, SegmentUpdateDto segment)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            segment.ProjectId = projectId;
            segment.SegmentId = id;

            var response = await _segmentService.UpdateSegmentAsync(segment);

            if (response.notFound)
            {
                return NotFound();
            }

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return NoContent();
        }

        [HttpGet("{id}", Name = "GetSegment")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<SegmentListDto>> GetSegmentByIdAsync(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var segment = await _segmentService.GetSegmentByIdAsync(id);
            if (segment == null)
            {
                return NotFound();
            }

            return Ok(segment);
        }

        [HttpGet(Name = "GetSegments")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<List<SegmentListDto>>> GetSegmentsAsync(decimal projectId)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var segments = await _segmentService.GetSegmentsAsync(projectId);

            return Ok(segments);
        }

        [HttpDelete("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> DeleteSegment(decimal projectId, decimal id)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var response = await _segmentService.DeleteSegmentAsync(projectId, id);

            if (response.notFound)
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
