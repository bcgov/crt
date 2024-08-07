using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos;
using Crt.Model.Dtos.Element;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/elements")]
    [ApiController]
    public class ElementController : CrtControllerBase
    {
        private IElementService _elementService;

        public ElementController(CrtCurrentUser currentUser, IElementService elementService)
            : base(currentUser)
        {
            _elementService = elementService;
        }

        [HttpGet(Name = "GetElements")]
        [RequiresPermission(Permissions.CodeRead)]
        public async Task<ActionResult<IEnumerable<ElementDto>>> GetElementsAsync()
        {
            return Ok(await _elementService.GetElementsAsync());
        }

        [HttpGet("search", Name = "SearchElements")]
        [RequiresPermission(Permissions.CodeRead)]
        public async Task<ActionResult<PagedDto<ElementListDto>>> SearchElementAsync(
            [FromQuery] string searchText, [FromQuery] bool? isActive,
            [FromQuery] int pageSize, [FromQuery] int pageNumber, [FromQuery] string orderBy = Fields.DisplayOrder, [FromQuery] string direction = "")
        {
            return await _elementService.SearchElementsAsync(searchText, isActive, pageSize, pageNumber, orderBy, direction);
        }

        [HttpGet("{id}", Name = "GetElement")]
        [RequiresPermission(Permissions.CodeRead)]
        public async Task<ActionResult<IEnumerable<ElementDto>>> GetElementByIdAsync(decimal id)
        {
            var element = await _elementService.GetElementByIdAsync(id);

            if (element == null)
            {
                return NotFound();
            }

            return Ok(element);
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<ElementCreateDto>> CreateElement(ElementCreateDto element)
        {
            var response = await _elementService.CreateElementAsync(element);
            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetElement", new { id = response.elementId }, await _elementService.GetElementByIdAsync(response.elementId));
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateElement(decimal id, ElementUpdateDto element)
        {
            if (id != element.ElementId)
            {
                throw new Exception($"The Element ID from the query string does not match that of the body.");
            }

            var response = await _elementService.UpdateElementAsync(element);

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
            var response = await _elementService.DeleteElementAsync(id);

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
    }
}
