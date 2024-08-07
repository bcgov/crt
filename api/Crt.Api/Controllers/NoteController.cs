using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos.Note;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/projects/{projectId}/notes")]
    [ApiController]
    public class NoteController : CrtControllerBase
    {
        private INoteService _noteService;
        private IProjectService _projectService;

        public NoteController(CrtCurrentUser currentUser, INoteService noteService, IProjectService projectService)
             : base(currentUser)
        {
            _noteService = noteService;
            _projectService = projectService;
        }

        [HttpGet(Name = "GetNotes")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<List<NoteDto>>> GetNotes(decimal projectId)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var notes = await _noteService.GetNotesAsync(projectId);
            return Ok(notes);
        }

        [HttpGet("{id}", Name = "GetNote")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<NoteDto>> GetNote(decimal id, decimal projectId)
        {
            var result = await IsProjectAuthorized(projectId);
            if (result != null) return result;

            var note = await _noteService.GetNoteByIdAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            return Ok(note);
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<NoteDto>> CreateNote(decimal projectId, NoteCreateDto note)
        {
            if (projectId != note.ProjectId)
            {
                throw new Exception($"The note doesn't belong to the project [{projectId}]");
            }

            var response = await _noteService.CreateNoteAsync(note);

            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetProject", new { id = note.ProjectId }, await _projectService.GetProjectAsync(note.ProjectId));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateNote(decimal id, NoteUpdateDto note)
        {
            if (id != note.NoteId)
            {
                throw new Exception($"The Note ID from the query string does not match that of the body.");
            }

            var response = await _noteService.UpdateNoteAsync(note);

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

        [HttpDelete("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> DeleteActivityCode(decimal id)
        {
            var response = await _noteService.DeleteNoteAsync(id);

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
