using Crt.Api.Authorization;
using Crt.Api.Controllers.Base;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.Dtos;
using Crt.Model.Dtos.CodeLookup;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Crt.Api.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/codetable")]
    [ApiController]
    public class CodeTableController : CrtControllerBase
    {
        private IFieldValidatorService _validator;
        private ICodeTableService _codeTableService;

        public CodeTableController(CrtCurrentUser currentUser, IFieldValidatorService validator, 
            ICodeTableService codeTableService) : base(currentUser)
        {
            _validator = validator;
            _codeTableService = codeTableService;
        }

        [HttpGet]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<PagedDto<CodeLookupListDto>>> GetCodeLookupsAsync(
            [FromQuery] string codeSet,
            [FromQuery] string searchText, [FromQuery] bool? isActive, 
            [FromQuery] int pageSize, [FromQuery] int pageNumber, [FromQuery] string orderBy = "DisplayOrder", [FromQuery] string direction = "")
        {
            return await _codeTableService.GetCodeTablesAsync(codeSet, searchText, isActive, pageSize, pageNumber, orderBy, direction);
        }

        [HttpPost]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult<CodeLookupCreateDto>> CreateCodeLookup(CodeLookupCreateDto codeLookup)
        {
            var response = await _codeTableService.CreateCodeLookupAsync(codeLookup);
            if (response.errors.Count > 0)
            {
                return ValidationUtils.GetValidationErrorResult(response.errors, ControllerContext);
            }

            return CreatedAtRoute("GetCodeLookup", new { id = response.codeLookupId }, await _codeTableService.GetCodeLookupByIdAsync(response.codeLookupId));
        }

        [HttpGet("{id}", Name = "GetCodeLookup")]
        [RequiresPermission(Permissions.ProjectRead)]
        public async Task<ActionResult<CodeLookupDto>> GetCodeLookupByIdAsync(decimal id)
        {
            var codeLookup = await _codeTableService.GetCodeLookupByIdAsync(id);
            if (codeLookup == null)
            {
                return NotFound();
            }

            return codeLookup;
        }

        [HttpPut("{id}")]
        [RequiresPermission(Permissions.AllWrite)]
        public async Task<ActionResult> UpdateCodeLookup(decimal id, CodeLookupUpdateDto codeLookup)
        {
            if (id != codeLookup.CodeLookupId)
            {
                throw new Exception($"The Code Lookup ID from the query string does not match that of the body.");
            }

            var response = await _codeTableService.UpdateCodeLookupAsync(codeLookup);

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
        public async Task<ActionResult> DeleteActivityCode(decimal id)
        {
            var response = await _codeTableService.DeleteCodeLookupAsync(id);

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
