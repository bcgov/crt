using AutoMapper;
using Crt.Data.Database.Entities;
using Crt.Data.Repositories.Base;
using Crt.Model;
using Crt.Model.Dtos;
using Crt.Model.Dtos.Project;
using Crt.Model.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Crt.Data.Repositories
{
    public interface IProjectRepository
    {
        Task<PagedDto<ProjectSearchDto>> GetProjectsAsync(decimal[] regions,
            string searchText, bool? isInProgress, decimal[] projectManagerIds,
            int pageSize, int pageNumber, string orderBy, string direction);
        Task<ProjectDto> GetProjectAsync(decimal projectId);
        Task<CrtProject> CreateProjectAsync(ProjectCreateDto project);
        Task UpdateProjectAsync(ProjectUpdateDto project);
        Task DeleteProjectAsync(ProjectDeleteDto project);
        Task<bool> ProjectNumberAlreadyExists(decimal projectId, string projectNumber, decimal regionId);
        Task<ProjectTenderDto> GetProjectTenderAsync(decimal projectId);
        Task<ProjectPlanDto> GetProjectPlanAsync(decimal projectId);
    }

    public class ProjectRepository : CrtRepositoryBase<CrtProject>, IProjectRepository
    {
        public ProjectRepository(AppDbContext dbContext, IMapper mapper, CrtCurrentUser currentUser) 
            : base(dbContext, mapper, currentUser)
        {
        }

        public async Task<PagedDto<ProjectSearchDto>> GetProjectsAsync(decimal[] regions,
            string searchText, bool? isInProgress, decimal[] projectManagerIds,
            int pageSize, int pageNumber, string orderBy, string direction)
        {
            var query = DbSet.AsNoTracking();

            query = query.Where(x => _currentUser.UserInfo.RegionIds.Contains(x.RegionId));

            if (regions.Length > 0)
            {
                query = query.Where(x => regions.Contains(x.RegionId));
            }

            if (searchText.IsNotEmpty())
            {
                query = query
                    .Where(x => x.ProjectName.Contains(searchText) || x.ProjectNumber.Contains(searchText) 
                        || x.Description.Contains(searchText) || x.Scope.Contains(searchText));
            }

            if (isInProgress != null)
            {
                query = (bool)isInProgress
                    ? query.Where(x => x.EndDate == null || x.EndDate > DateTime.Today)
                    : query.Where(x => x.EndDate != null && x.EndDate <= DateTime.Today);
            }

            if (projectManagerIds.Length > 0)
            {
                query = query.Where(x => projectManagerIds.Contains(x.ProjectMgrId ?? 0));
            }

            query = query.Include(x => x.Region);
            
            var results = await Page<CrtProject, ProjectSearchDto>(query, pageSize, pageNumber, orderBy, direction);

            foreach (var result in results.SourceList)
            {
                //get winning contractor name
                var winningContractor = DbContext.CrtTenders.AsNoTracking()
                    .Include(x => x.WinningCntrctrLkup)
                    .Where(x => x.ProjectId == result.ProjectId && x.WinningCntrctrLkupId != null)
                    .OrderBy(x => x.DbAuditLastUpdateTimestamp)
                    .FirstOrDefault()?.WinningCntrctrLkup.CodeName;
                
                result.WinningContractorName = winningContractor;

                //get sum of project value (using FinTarget Amounts)
                var projectValue = DbContext.CrtFinTargets.AsNoTracking()
                    .Where(x => x.ProjectId == result.ProjectId && x.Amount != null)
                    .Sum(x => x.Amount);

                result.ProjectValue = projectValue;
            }

            return results;
        }

        public async Task<ProjectDto> GetProjectAsync(decimal projectId)
        {
            var project = await DbSet.AsNoTracking()
                .Include(x => x.ProjectMgr)
                .Include(x => x.NearstTwnLkup)
                .Include(x => x.CapIndxLkup)
                .Include(x => x.CrtNotes)
                .Include(x => x.RcLkup)
                .Include(x => x.Region)
                .FirstOrDefaultAsync(x => x.ProjectId == projectId);

            return Mapper.Map<ProjectDto>(project);
        }

        public async Task<CrtProject> CreateProjectAsync(ProjectCreateDto project)
        {
            var projectEntity = new CrtProject();

            Mapper.Map(project, projectEntity);

            await DbSet.AddAsync(projectEntity);

            return projectEntity;
        }

        public async Task UpdateProjectAsync(ProjectUpdateDto project)
        {
            var projectEntity = await DbSet
                                .FirstAsync(x => x.ProjectId == project.ProjectId);

            projectEntity.EndDate = project.EndDate?.Date;

            Mapper.Map(project, projectEntity);
        }

        public async Task DeleteProjectAsync(ProjectDeleteDto project)
        {
            var projectEntity = await DbSet
                                .FirstAsync(x => x.ProjectId == project.ProjectId);

            projectEntity.EndDate = project.EndDate?.Date;
        }

        public async Task<bool> ProjectNumberAlreadyExists(decimal projectId, string projectNumber, decimal regionId)
        {
            var projects = await DbSet.AsNoTracking()
                .Where(x => x.ProjectNumber == projectNumber && x.RegionId == regionId)
                .Select(x => new { x.ProjectId })
                .ToListAsync();

            return projects.Any(x => x.ProjectId != projectId);
        }

        public async Task<ProjectTenderDto> GetProjectTenderAsync(decimal projectId)
        {
            var project = await DbSet.AsNoTracking()
                .Include(x => x.CrtTenders)
                    .ThenInclude(x => x.WinningCntrctrLkup)
                .Include(x => x.CrtQtyAccmps)
                    .ThenInclude(x => x.FiscalYearLkup)
                .Include(x => x.CrtQtyAccmps)
                    .ThenInclude(x => x.QtyAccmpLkup)
                .FirstOrDefaultAsync(x => x.ProjectId == projectId);

            return Mapper.Map<ProjectTenderDto>(project);
        }

        public async Task<ProjectPlanDto> GetProjectPlanAsync(decimal projectId)
        {
            var project = await DbSet.AsNoTracking()
                .Include(x => x.CrtFinTargets)
                    .ThenInclude(x => x.FiscalYearLkup)
                .Include(x => x.CrtFinTargets)
                    .ThenInclude(x => x.PhaseLkup)
                .Include(x => x.CrtFinTargets)
                    .ThenInclude(x => x.FundingTypeLkup)
                .Include(x => x.CrtFinTargets)
                    .ThenInclude(x => x.Element)
                .FirstOrDefaultAsync(x => x.ProjectId == projectId);

            return Mapper.Map<ProjectPlanDto>(project);
        }
    }
}
