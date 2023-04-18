using Crt.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Crt.Data.Database.Entities
{
    public partial class AppDbContext
    {
        private const string ConcurrencyControlNumber = "ConcurrencyControlNumber";
        private const string AppCreateUserid = "AppCreateUserid";
        private const string AppCreateUserGuid = "AppCreateUserGuid";
        private const string AppCreateTimestamp = "AppCreateTimestamp";
        private const string AppLastUpdateUserid = "AppLastUpdateUserid";
        private const string AppLastUpdateUserGuid = "AppLastUpdateUserGuid";
        private const string AppLastUpdateTimestamp = "AppLastUpdateTimestamp";

        public readonly CrtCurrentUser _currentUser;
        private readonly IConfiguration _config;
        private readonly ILogger<AppDbContext> _logger;

        public AppDbContext(DbContextOptions<AppDbContext> options, CrtCurrentUser currentUser, IConfiguration config, ILogger<AppDbContext> logger)
            : base(options)
        {
            _currentUser = currentUser;
            _config = config;
            _logger = logger;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder
                .UseSqlServer(_config.GetValue<string>("ConnectionStrings:CRT"), o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
        }

        public override int SaveChanges()
        {
            PerformAudit();

            int result;

            try
            {
                result = base.SaveChanges();
            }
            catch (Exception e)
            {
                string exceptionMessage = e.ToString();
                _logger.LogError($"AppDbContext exception: {exceptionMessage}");
                throw;
            }

            return result;
        }

        #region Audit Helper

        private void PerformAudit()
        {
            IEnumerable<EntityEntry> modifiedEntries = ChangeTracker.Entries()
                    .Where(e => e.State == EntityState.Added ||
                                e.State == EntityState.Modified);

            DateTime currentTime = DateTime.UtcNow;

            foreach (var entry in modifiedEntries)
            {
                if (entry.Members.Any(m => m.Metadata.Name == AppCreateUserGuid)) //auditable entity
                {
                    entry.Member(AppLastUpdateUserid).CurrentValue = _currentUser.Username;
                    entry.Member(AppLastUpdateUserGuid).CurrentValue = _currentUser.UserGuid;
                    entry.Member(AppLastUpdateTimestamp).CurrentValue = currentTime; 

                    if (entry.State == EntityState.Added)
                    {
                        entry.Member(AppCreateUserid).CurrentValue = _currentUser.Username;
                        entry.Member(AppCreateUserGuid).CurrentValue = _currentUser.UserGuid;
                        entry.Member(AppCreateTimestamp).CurrentValue = currentTime;
                        entry.Member(ConcurrencyControlNumber).CurrentValue = (long)1;
                    }
                    else
                    {
                        var controlNumber = (long)entry.Member(ConcurrencyControlNumber).CurrentValue + 1;
                        entry.Member(ConcurrencyControlNumber).CurrentValue = controlNumber;
                    }
                }
                else if (entry.Members.Any(m => m.Metadata.Name == ConcurrencyControlNumber))
                {
                    if (entry.State == EntityState.Added)
                    {
                        entry.Member(ConcurrencyControlNumber).CurrentValue = (long)1;
                    }
                    else
                    {
                        var controlNumber = (long)entry.Member(ConcurrencyControlNumber).CurrentValue + 1;
                        entry.Member(ConcurrencyControlNumber).CurrentValue = controlNumber;
                    }
                }
            }
        }
        #endregion
    }
}
