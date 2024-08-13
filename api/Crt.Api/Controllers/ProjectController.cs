using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos;
using Crt.Model.Dtos.CodeLookup;
using Crt.Model.Dtos.Element;
using Crt.Model.Dtos.FinTarget;
using Crt.Model.Dtos.Project;
using Crt.Model.Dtos.QtyAccmp;
using Crt.Model.Dtos.Tender;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/projects")]
    [ApiController]
    public class ProjectController : CrtControllerBase
    {
        private IProjectService _projectService;

        public ProjectController(CrtCurrentUser currentUser, IProjectService projectService) 
            : base(currentUser)
        {
            _projectService = projectService;
        }

        [HttpGet]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<PagedDto<ProjectSearchDto>>> GetProjectsAsync(
            [FromQuery] string? regionIds,
            [FromQuery] string searchText, [FromQuery] bool? isInProgress, [FromQuery] string projectManagerIds,
            [FromQuery] int pageSize, [FromQuery] int pageNumber, [FromQuery] string orderBy = "ProjectNumber", [FromQuery] string direction = "")
        {
            return await _projectService.GetProjectsAsync(regionIds, searchText, isInProgress, projectManagerIds, pageSize, pageNumber, orderBy, direction);
        }

        [HttpGet("{id}", Name = "GetProject")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<ProjectDto>> GetProjectByIdAsync(decimal id)
        {
            var project = await _projectService.GetProjectAsync(id);

            if (project == null)
            {
                return NotFound();
            }

            var problem = IsRegionIdAuthorized(project.RegionId);
            if (problem != null)
            {
                return Unauthorized(problem);
            }

            return project;
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<ProjectCreateDto>> CreateProject(ProjectCreateDto project)
        {
            var problem = IsRegionIdAuthorized(project.RegionId);
            if (problem != null)
            {
                return Unauthorized(problem);
            }

            var response = await _projectService.CreateProjectAsync(project);

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetProject", new { id = response.projectId }, await _projectService.GetProjectAsync(response.projectId));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateProject(decimal id, ProjectUpdateDto project)
        {
            var problem = IsRegionIdAuthorized(project.RegionId);
            if (problem != null)
            {
                return Unauthorized(problem);
            }

            if (id != project.ProjectId)
            {
                throw new Exception($"The project ID from the query string does not match that of the body.");
            }

            var response = await _projectService.UpdateProjectAsync(project);

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
        public async Task<ActionResult> DeleteProject(decimal id, ProjectDeleteDto project)
        {
            if (id != project.ProjectId)
            {
                throw new Exception($"The system project ID from the query string does not match that of the body.");
            }

            var response = await _projectService.DeleteProjectAsync(project);

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

        [HttpGet("{id}/projecttender")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<ProjectTenderDto>> GetProjectTenderAsync(decimal id)
        {
            var projectTender = await _projectService.GetProjectTenderAsync(id);

            if (projectTender == null)
            {
                return NotFound();
            }

            var problem = IsRegionIdAuthorized(projectTender.RegionId);
            if (problem != null)
            {
                return Unauthorized(problem);
            }

            return projectTender;
        }

        [HttpGet("{id}/projectplan")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<ProjectPlanDto>> GetProjectPlanAsync(decimal id)
        {
            var projectPlan = await _projectService.GetProjectPlanAsync(id);

            if (projectPlan == null)
            {
                return NotFound();
            }

            var problem = IsRegionIdAuthorized(projectPlan.RegionId);
            if (problem != null)
            {
                return Unauthorized(problem);
            }

            return projectPlan;
        }

        [HttpGet("{id}/projectlocation")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<ProjectLocationDto>> GetProjectLocationAsync(decimal id)
        {
            var projectLocation = await _projectService.GetProjectLocationAsync(id);

            if (projectLocation == null)
            {
                return NotFound();
            }

            var problem = IsRegionIdAuthorized(projectLocation.RegionId);
            if (problem != null)
            {
                return Unauthorized(problem);
            }

            return projectLocation;
        }
    }
}
