using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Linq;



#nullable disable

namespace Crt.Data.Database.Entities
{
    public partial class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CrtCodeLookup> CrtCodeLookups { get; set; }
        public virtual DbSet<CrtCodeLookupHist> CrtCodeLookupHists { get; set; }
        public virtual DbSet<CrtDistrict> CrtDistricts { get; set; }
        public virtual DbSet<CrtElement> CrtElements { get; set; }
        public virtual DbSet<CrtElementHist> CrtElementHists { get; set; }
        public virtual DbSet<CrtFinTarget> CrtFinTargets { get; set; }
        public virtual DbSet<CrtFinTargetHist> CrtFinTargetHists { get; set; }
        public virtual DbSet<CrtNote> CrtNotes { get; set; }
        public virtual DbSet<CrtNoteHist> CrtNoteHists { get; set; }
        public virtual DbSet<CrtPermission> CrtPermissions { get; set; }
        public virtual DbSet<CrtPermissionHist> CrtPermissionHists { get; set; }
        public virtual DbSet<CrtProject> CrtProjects { get; set; }
        public virtual DbSet<CrtProjectHist> CrtProjectHists { get; set; }
        public virtual DbSet<CrtQtyAccmp> CrtQtyAccmps { get; set; }
        public virtual DbSet<CrtQtyAccmpHist> CrtQtyAccmpHists { get; set; }
        public virtual DbSet<CrtRatio> CrtRatios { get; set; }
        public virtual DbSet<CrtRatioHist> CrtRatioHists { get; set; }
        public virtual DbSet<CrtRegion> CrtRegions { get; set; }
        public virtual DbSet<CrtRegionDistrict> CrtRegionDistricts { get; set; }
        public virtual DbSet<CrtRegionDistrictHist> CrtRegionDistrictHists { get; set; }
        public virtual DbSet<CrtRegionUser> CrtRegionUsers { get; set; }
        public virtual DbSet<CrtRegionUserHist> CrtRegionUserHists { get; set; }
        public virtual DbSet<CrtRole> CrtRoles { get; set; }
        public virtual DbSet<CrtRoleHist> CrtRoleHists { get; set; }
        public virtual DbSet<CrtRolePermission> CrtRolePermissions { get; set; }
        public virtual DbSet<CrtRolePermissionHist> CrtRolePermissionHists { get; set; }
        public virtual DbSet<CrtSegment> CrtSegments { get; set; }
        public virtual DbSet<CrtSegmentHist> CrtSegmentHists { get; set; }
        public virtual DbSet<CrtSegmentRecordVw> CrtSegmentRecordVws { get; set; }
        public virtual DbSet<CrtServiceArea> CrtServiceAreas { get; set; }
        public virtual DbSet<CrtServiceAreaHist> CrtServiceAreaHists { get; set; }
        public virtual DbSet<CrtSystemUser> CrtSystemUsers { get; set; }
        public virtual DbSet<CrtSystemUserHist> CrtSystemUserHists { get; set; }
        public virtual DbSet<CrtTender> CrtTenders { get; set; }
        public virtual DbSet<CrtTenderHist> CrtTenderHists { get; set; }
        public virtual DbSet<CrtUserRole> CrtUserRoles { get; set; }
        public virtual DbSet<CrtUserRoleHist> CrtUserRoleHists { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CrtCodeLookup>(entity =>
            {
                entity.HasKey(e => e.CodeLookupId)
                    .HasName("CRT_CODE_LKUP_PK");

                entity.ToTable("CRT_CODE_LOOKUP");

                entity.HasComment("A range of lookup values used to decipher codes used in submissions to business legible values for reporting purposes.  As many code lookups share this table, views are available to join for reporting purposes.");

                entity.HasIndex(e => new { e.CodeSet, e.CodeValueNum, e.CodeName, e.DisplayOrder }, "CRT_CODE_LKUP_VAL_NUM_UC")
                    .IsUnique();

                entity.HasIndex(e => new { e.CodeSet, e.CodeValueText, e.CodeName, e.DisplayOrder }, "CRT_CODE_LKUP_VAL_TXT_UC")
                    .IsUnique();

                entity.Property(e => e.CodeLookupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("CODE_LOOKUP_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_CODE_LKUP_ID_SEQ])")
                    .HasComment("Unique identifier for a record.");

                entity.Property(e => e.CodeName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("CODE_NAME")
                    .HasComment("Display name or business name for a submission value.  These values are for display in analytical reporting.");

                entity.Property(e => e.CodeSet)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("CODE_SET")
                    .HasComment("Unique identifier for a group of lookup codes.  A database view is available for each group for use in analytics.");

                entity.Property(e => e.CodeValueFormat)
                    .HasMaxLength(12)
                    .IsUnicode(false)
                    .HasColumnName("CODE_VALUE_FORMAT")
                    .HasComment("Specifies if the code value is text or numeric.");

                entity.Property(e => e.CodeValueNum)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("CODE_VALUE_NUM")
                    .HasComment(" Numeric enumeration values provided in submissions.   These values are used for validating submissions and for display of CODE NAMES in analytical reporting.  Values must be unique per CODE SET.");

                entity.Property(e => e.CodeValueText)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("CODE_VALUE_TEXT")
                    .HasComment("Look up code values provided in submissions.   These values are used for validating submissions and for display of CODE NAMES in analytical reporting.  Values must be unique per CODE SET.");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DisplayOrder)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISPLAY_ORDER")
                    .HasComment("When displaying list of values, value can be used to present list in desired order.");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("The latest date submissions will be accepted.");
            });

            modelBuilder.Entity<CrtCodeLookupHist>(entity =>
            {
                entity.HasKey(e => e.CodeLookupHistId)
                    .HasName("CRT_CODE__H_PK");

                entity.ToTable("CRT_CODE_LOOKUP_HIST");

                entity.HasIndex(e => new { e.CodeLookupHistId, e.EndDateHist }, "CRT_CODE__H_UK")
                    .IsUnique();

                entity.Property(e => e.CodeLookupHistId)
                    .HasColumnName("CODE_LOOKUP_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_CODE_LOOKUP_H_ID_SEQ])");

                entity.Property(e => e.CodeLookupId)
                    .HasColumnType("numeric(18, 0)")
                    .HasColumnName("CODE_LOOKUP_ID");

                entity.Property(e => e.CodeName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("CODE_NAME");

                entity.Property(e => e.CodeSet)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("CODE_SET");

                entity.Property(e => e.CodeValueFormat)
                    .HasMaxLength(12)
                    .IsUnicode(false)
                    .HasColumnName("CODE_VALUE_FORMAT");

                entity.Property(e => e.CodeValueNum)
                    .HasColumnType("numeric(18, 0)")
                    .HasColumnName("CODE_VALUE_NUM");

                entity.Property(e => e.CodeValueText)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("CODE_VALUE_TEXT");

                entity.Property(e => e.ConcurrencyControlNumber).HasColumnName("CONCURRENCY_CONTROL_NUMBER");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID");

                entity.Property(e => e.DisplayOrder)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISPLAY_ORDER");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");
            });

            modelBuilder.Entity<CrtDistrict>(entity =>
            {
                entity.HasKey(e => e.DistrictId)
                    .HasName("CRT_DISTRICT_PK");

                entity.ToTable("CRT_DISTRICT");

                entity.HasComment("Ministry Districts lookup values.");

                entity.HasIndex(e => new { e.DistrictNumber, e.DistrictName, e.EndDate }, "CRT_DIST_NO_NAME_UK")
                    .IsUnique();

                entity.Property(e => e.DistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISTRICT_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_DIST_ID_SEQ])")
                    .HasComment("Unique identifier for district records");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DistrictName)
                    .IsRequired()
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("DISTRICT_NAME")
                    .HasComment("The name of the District");

                entity.Property(e => e.DistrictNumber)
                    .HasColumnType("numeric(2, 0)")
                    .HasColumnName("DISTRICT_NUMBER")
                    .HasComment("Number assigned to represent the District");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the entity ends or changes");
            });

            modelBuilder.Entity<CrtElement>(entity =>
            {
                entity.HasKey(e => e.ElementId)
                    .HasName("CRT_ELMNT_PK");

                entity.ToTable("CRT_ELEMENT");

                entity.HasIndex(e => new { e.ElementId, e.Code, e.ProgramLkupId, e.ProgramCategoryLkupId, e.ServiceLineLkupId }, "CRT_PROJECT_ELEM_FK_I");

                entity.Property(e => e.ElementId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ELEMENT_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_ELEMENT_ID_SEQ])");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP");

                entity.Property(e => e.AppCreateUserGuid).HasColumnName("APP_CREATE_USER_GUID");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP");

                entity.Property(e => e.AppLastUpdateUserGuid).HasColumnName("APP_LAST_UPDATE_USER_GUID");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID");

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("CODE");

                entity.Property(e => e.Comment)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("COMMENT");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION");

                entity.Property(e => e.DisplayOrder)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISPLAY_ORDER")
                    .HasComment("Number with which project element is ordered on the UI");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE");

                entity.Property(e => e.IsActive)
                    .HasColumnName("IS_ACTIVE")
                    .HasComment("Active flag for Element");

                entity.Property(e => e.ProgramCategoryLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROGRAM_CATEGORY_LKUP_ID")
                    .HasComment("Lookup ID for the funding vertical within which the element belongs (e.g. Transit, Preservation, Capital)");

                entity.Property(e => e.ProgramLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROGRAM_LKUP_ID")
                    .HasComment("Lookup ID for the program within the program category to which the element belongs (e.g. RSIP, SRIP)");

                entity.Property(e => e.ServiceLineLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_LINE_LKUP_ID")
                    .HasComment("Lookup ID for the code to which Element is charged");

                entity.HasOne(d => d.ProgramCategoryLkup)
                    .WithMany(p => p.CrtElementProgramCategoryLkups)
                    .HasForeignKey(d => d.ProgramCategoryLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_ELEMENT_PROG_CAT_PROG_CAT_FK");

                entity.HasOne(d => d.ProgramLkup)
                    .WithMany(p => p.CrtElementProgramLkups)
                    .HasForeignKey(d => d.ProgramLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_ELEMENT_PROG_PROG_FK");

                entity.HasOne(d => d.ServiceLineLkup)
                    .WithMany(p => p.CrtElementServiceLineLkups)
                    .HasForeignKey(d => d.ServiceLineLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_ELEMENT_SRV_LINE_SRV_LINE_FK");
            });

            modelBuilder.Entity<CrtElementHist>(entity =>
            {
                entity.HasKey(e => e.ElementHistId)
                    .HasName("CRT_ELEMENT_HIST_PK");

                entity.ToTable("CRT_ELEMENT_HIST");

                entity.HasComment("Defines CRT project element history");

                entity.Property(e => e.ElementHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ELEMENT_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_ELEMENT_H_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("CODE")
                    .HasComment("Unique identifier for element code");

                entity.Property(e => e.Comment)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("COMMENT")
                    .HasComment("Comment on project element");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Description of project element");

                entity.Property(e => e.DisplayOrder)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISPLAY_ORDER")
                    .HasComment("Number with which project element is ordered on the UI");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ElementId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ELEMENT_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.IsActive)
                    .HasColumnName("IS_ACTIVE")
                    .HasComment("Active flag for Element");

                entity.Property(e => e.ProgramCategoryLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROGRAM_CATEGORY_LKUP_ID")
                    .HasComment("Lookup ID for the funding vertical within which the element belongs (e.g. Transit, Preservation, Capital)");

                entity.Property(e => e.ProgramLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROGRAM_LKUP_ID")
                    .HasComment("Lookup ID for the program within the program category to which the element belongs (e.g. RSIP, SRIP)");

                entity.Property(e => e.ServiceLineLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_LINE_LKUP_ID")
                    .HasComment("Lookup ID for the code to which Element is charged");
            });

            modelBuilder.Entity<CrtFinTarget>(entity =>
            {
                entity.HasKey(e => e.FinTargetId)
                    .HasName("CRT_FIN_TARGET_PK");

                entity.ToTable("CRT_FIN_TARGET");

                entity.HasComment("Defines CRT financial targets");

                entity.HasIndex(e => new { e.FiscalYearLkupId, e.PhaseLkupId }, "CRT_FIN_TARGET_FK_I");

                entity.Property(e => e.FinTargetId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FIN_TARGET_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_FIN_TARGET_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.Amount)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("AMOUNT")
                    .HasDefaultValueSql("((0))")
                    .HasComment("Dollar value associated with financial target");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Description of the selected financial target - planning to be completed in the next fiscal year");

                entity.Property(e => e.ElementId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ELEMENT_ID")
                    .HasComment("Project Element ID FK");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.FiscalYearLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FISCAL_YEAR_LKUP_ID")
                    .HasComment("Fiscal Year lookup ID associated with Financial Target ");

                entity.Property(e => e.FundingTypeLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FUNDING_TYPE_LKUP_ID")
                    .HasComment("Funding type allows users to plan their program outside the bounds of current fiscal/allocation	");

                entity.Property(e => e.PhaseLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PHASE_LKUP_ID")
                    .HasComment("Project phase identifier on the lookup table");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID");

                entity.HasOne(d => d.Element)
                    .WithMany(p => p.CrtFinTargets)
                    .HasForeignKey(d => d.ElementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_ELEMENT_CRT_FIN_TARGET");

                entity.HasOne(d => d.FiscalYearLkup)
                    .WithMany(p => p.CrtFinTargetFiscalYearLkups)
                    .HasForeignKey(d => d.FiscalYearLkupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_FIN_TARGET_FSCL_YR");

                entity.HasOne(d => d.FundingTypeLkup)
                    .WithMany(p => p.CrtFinTargetFundingTypeLkups)
                    .HasForeignKey(d => d.FundingTypeLkupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_FIN_TARGET_FUND_TYP");

                entity.HasOne(d => d.PhaseLkup)
                    .WithMany(p => p.CrtFinTargetPhaseLkups)
                    .HasForeignKey(d => d.PhaseLkupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_FIN_TARGET_PHS");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.CrtFinTargets)
                    .HasForeignKey(d => d.ProjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_PROJECT_CRT_FIN_TARGET");
            });

            modelBuilder.Entity<CrtFinTargetHist>(entity =>
            {
                entity.HasKey(e => e.FinTargetHistId)
                    .HasName("CRT_FIN_TARGET_HIST_PK");

                entity.ToTable("CRT_FIN_TARGET_HIST");

                entity.HasComment("Defines CRT financial targets");

                entity.Property(e => e.FinTargetHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FIN_TARGET_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_FIN_TARGET_H_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.Amount)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("AMOUNT")
                    .HasDefaultValueSql("((0))")
                    .HasComment("Dollar value associated with financial target");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Description of the selected financial target - planning to be completed in the next fiscal year");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ElementId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ELEMENT_ID")
                    .HasComment("Project Element ID FK");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.FinTargetId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FIN_TARGET_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.FiscalYearLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FISCAL_YEAR_LKUP_ID")
                    .HasComment("Fiscal Year lookup ID associated with Financial Target ");

                entity.Property(e => e.FundingTypeLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FUNDING_TYPE_LKUP_ID")
                    .HasComment("Funding type allows users to plan their program outside the bounds of current fiscal/allocation	");

                entity.Property(e => e.PhaseLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PHASE_LKUP_ID")
                    .HasComment("Project phase identifier on the lookup table");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("ID linked with the project");
            });

            modelBuilder.Entity<CrtNote>(entity =>
            {
                entity.HasKey(e => e.NoteId)
                    .HasName("CRT_NOTE_PK");

                entity.ToTable("CRT_NOTE");

                entity.HasComment("Defines CRT projects");

                entity.HasIndex(e => new { e.ProjectId, e.NoteId }, "CRT_NOTE_FK_I");

                entity.Property(e => e.NoteId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("NOTE_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_NOTE_ID_SEQ])")
                    .HasComment("Identifier for the notes attached to the project.");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.Comment)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("COMMENT")
                    .HasComment("Comments on the project");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.NoteType)
                    .IsRequired()
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .HasColumnName("NOTE_TYPE")
                    .HasComment("A system generated unique identifier that specifies the note type: as either STATUS or EMR");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.CrtNotes)
                    .HasForeignKey(d => d.ProjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_PROJECT_CRT_NOTE");
            });

            modelBuilder.Entity<CrtNoteHist>(entity =>
            {
                entity.HasKey(e => e.NoteHistId)
                    .HasName("CRT_NOTE_HIST_PK");

                entity.ToTable("CRT_NOTE_HIST");

                entity.HasComment("History of CRT project notes");

                entity.Property(e => e.NoteHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("NOTE_HIST_ID")
                    .HasComment("Identifier for the note history attached to the project.");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.Comment)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("COMMENT")
                    .HasComment("Comments on the project");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.NoteId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("NOTE_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_NOTE_H_ID_SEQ])")
                    .HasComment("Identifier for the notes attached to the project.");

                entity.Property(e => e.NoteType)
                    .IsRequired()
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .HasColumnName("NOTE_TYPE")
                    .HasComment("A system generated unique identifier that specifies the note type: as either STATUS or EMR");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID");
            });

            modelBuilder.Entity<CrtPermission>(entity =>
            {
                entity.HasKey(e => e.PermissionId)
                    .HasName("CRT_PERMISSION_PK");

                entity.ToTable("CRT_PERMISSION");

                entity.HasComment("Permission definition table for assignment to individual system users.");

                entity.Property(e => e.PermissionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PERMISSION_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_PERM_ID_SEQ])")
                    .HasComment("Unique identifier for a record");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Description of a permission.");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date permission was deactivated");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("NAME")
                    .HasComment("Business name for a permission");
            });

            modelBuilder.Entity<CrtPermissionHist>(entity =>
            {
                entity.HasKey(e => e.PermissionHistId)
                    .HasName("CRT_PERMISSION_H_PK");

                entity.ToTable("CRT_PERMISSION_HIST");

                entity.HasComment("Permission definition table for assignment to individual system users.");

                entity.HasIndex(e => new { e.EndDateHist, e.PermissionHistId }, "CRT_PERM_H_UK")
                    .IsUnique();

                entity.Property(e => e.PermissionHistId)
                    .HasColumnName("PERMISSION_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_PERMISSION_H_ID_SEQ])");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Description of a permission.");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date permission was deactivated");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("NAME")
                    .HasComment("Business name for a permission");

                entity.Property(e => e.PermissionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PERMISSION_ID")
                    .HasComment("Unique identifier for a record");
            });

            modelBuilder.Entity<CrtProject>(entity =>
            {
                entity.HasKey(e => e.ProjectId)
                    .HasName("CRT_PROJECT_PK");

                entity.ToTable("CRT_PROJECT");

                entity.HasIndex(e => new { e.ProjectNumber, e.CapIndxLkupId, e.NearstTwnLkupId, e.RcLkupId, e.ProjectMgrLkupId }, "CRT_PROJECT_FK_I");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_PROJECT_ID_SEQ])");

                entity.Property(e => e.AnncmentComment)
                    .IsUnicode(false)
                    .HasColumnName("ANNCMENT_COMMENT");

                entity.Property(e => e.AnncmentValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("ANNCMENT_VALUE");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP");

                entity.Property(e => e.AppCreateUserGuid).HasColumnName("APP_CREATE_USER_GUID");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP");

                entity.Property(e => e.AppLastUpdateUserGuid).HasColumnName("APP_LAST_UPDATE_USER_GUID");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID");

                entity.Property(e => e.C035Value)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("C035_VALUE");

                entity.Property(e => e.CapIndxLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("CAP_INDX_LKUP_ID");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.Description)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE");

                entity.Property(e => e.EstimatedValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("ESTIMATED_VALUE")
                    .HasComment("Project Value determined through available information, in the absence of formal announcement and/or C-035 Values");

                entity.Property(e => e.NearstTwnLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("NEARST_TWN_LKUP_ID");

                entity.Property(e => e.ProjectMgrLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_MGR_LKUP_ID");

                entity.Property(e => e.ProjectName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("PROJECT_NAME");

                entity.Property(e => e.ProjectNumber)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("PROJECT_NUMBER");

                entity.Property(e => e.RcLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RC_LKUP_ID");

                entity.Property(e => e.RegionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_ID");

                entity.Property(e => e.Scope)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("SCOPE");

                entity.HasOne(d => d.CapIndxLkup)
                    .WithMany(p => p.CrtProjectCapIndxLkups)
                    .HasForeignKey(d => d.CapIndxLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_PROJECT_CAP_INDX_FK");

                entity.HasOne(d => d.NearstTwnLkup)
                    .WithMany(p => p.CrtProjectNearstTwnLkups)
                    .HasForeignKey(d => d.NearstTwnLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_PROJECT_NRST_TWN_FK");

                entity.HasOne(d => d.ProjectMgrLkup)
                    .WithMany(p => p.CrtProjectProjectMgrLkups)
                    .HasForeignKey(d => d.ProjectMgrLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_PROJECT_PRJ_MGR_FK");

                entity.HasOne(d => d.RcLkup)
                    .WithMany(p => p.CrtProjectRcLkups)
                    .HasForeignKey(d => d.RcLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_PROJECT_RC_NUM_FK");

                entity.HasOne(d => d.Region)
                    .WithMany(p => p.CrtProjects)
                    .HasForeignKey(d => d.RegionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_REGION_CRT_PROJECT");
            });

            modelBuilder.Entity<CrtProjectHist>(entity =>
            {
                entity.HasKey(e => e.ProjectHistId)
                    .HasName("CRT_PROJECT_HIST_PK");

                entity.ToTable("CRT_PROJECT_HIST");

                entity.HasIndex(e => new { e.ProjectHistId, e.EndDateHist }, "CRT_PROJECT_H_UK")
                    .IsUnique();

                entity.Property(e => e.ProjectHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_PROJECT_H_ID_SEQ])");

                entity.Property(e => e.AnncmentComment)
                    .IsUnicode(false)
                    .HasColumnName("ANNCMENT_COMMENT");

                entity.Property(e => e.AnncmentValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("ANNCMENT_VALUE");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP");

                entity.Property(e => e.AppCreateUserGuid).HasColumnName("APP_CREATE_USER_GUID");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP");

                entity.Property(e => e.AppLastUpdateUserGuid).HasColumnName("APP_LAST_UPDATE_USER_GUID");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID");

                entity.Property(e => e.C035Value)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("C035_VALUE");

                entity.Property(e => e.CapIndxLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("CAP_INDX_LKUP_ID");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.Description)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.EstimatedValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("ESTIMATED_VALUE")
                    .HasComment("Project Value determined through available information, in the absence of formal announcement and/or C-035 Values");

                entity.Property(e => e.NearstTwnLkupId)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .HasColumnName("NEARST_TWN_LKUP_ID");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID");

                entity.Property(e => e.ProjectMgrLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_MGR_LKUP_ID");

                entity.Property(e => e.ProjectName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("PROJECT_NAME");

                entity.Property(e => e.ProjectNumber)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("PROJECT_NUMBER");

                entity.Property(e => e.RcLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RC_LKUP_ID");

                entity.Property(e => e.RegionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_ID");

                entity.Property(e => e.Scope)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("SCOPE");
            });

            modelBuilder.Entity<CrtQtyAccmp>(entity =>
            {
                entity.HasKey(e => e.QtyAccmpId)
                    .HasName("CRT_QTY_ACCMP_PK");

                entity.ToTable("CRT_QTY_ACCMP");

                entity.HasComment("Defines CRT project quantity and accomplishment");

                entity.HasIndex(e => new { e.ProjectId, e.QtyAccmpLkupId }, "CRT_QTY_ACCMP_FK_I");

                entity.Property(e => e.QtyAccmpId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("QTY_ACCMP_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_QTY_ACCMP_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.Actual)
                    .HasColumnType("numeric(10, 3)")
                    .HasColumnName("ACTUAL")
                    .HasComment("actual value of quantity or accomplishment.");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.Comment)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("COMMENT")
                    .HasComment("comments on entries associated with either quantity or accomplishment");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Marks the status of quantity and/or accomplishment item");

                entity.Property(e => e.FiscalYearLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FISCAL_YEAR_LKUP_ID")
                    .HasComment("Unique identifier linked with fiscal year on the look up table");

                entity.Property(e => e.Forecast)
                    .HasColumnType("numeric(10, 3)")
                    .HasColumnName("FORECAST")
                    .HasDefaultValueSql("((0))")
                    .HasComment("forecast value associated with quantity or accomplishment");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("ID linked with the project");

                entity.Property(e => e.QtyAccmpLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("QTY_ACCMP_LKUP_ID")
                    .HasComment("Unique identifier linked with the look up table offering extra attributes");

                entity.Property(e => e.Schedule7)
                    .HasColumnType("numeric(10, 3)")
                    .HasColumnName("SCHEDULE7")
                    .HasComment("determined value of quantity before the actual. Can only apply to quantity");

                entity.HasOne(d => d.FiscalYearLkup)
                    .WithMany(p => p.CrtQtyAccmpFiscalYearLkups)
                    .HasForeignKey(d => d.FiscalYearLkupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_QTY_ACCMP_FSCL_YR");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.CrtQtyAccmps)
                    .HasForeignKey(d => d.ProjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_PROJECT_CRT_QTY_ACCMP");

                entity.HasOne(d => d.QtyAccmpLkup)
                    .WithMany(p => p.CrtQtyAccmpQtyAccmpLkups)
                    .HasForeignKey(d => d.QtyAccmpLkupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_QTY_ACCMP_QTY_ACCMP");
            });

            modelBuilder.Entity<CrtQtyAccmpHist>(entity =>
            {
                entity.HasKey(e => e.QtyAccmpHistId)
                    .HasName("CRT_QTY_ACCMP_HIST_PK");

                entity.ToTable("CRT_QTY_ACCMP_HIST");

                entity.HasComment("Defines CRT project quantity and accomplishment");

                entity.Property(e => e.QtyAccmpHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("QTY_ACCMP_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_QTY_ACCMP_H_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.Actual)
                    .HasColumnType("numeric(10, 3)")
                    .HasColumnName("ACTUAL")
                    .HasComment("Project Element ID FK");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.Comment)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("COMMENT")
                    .HasComment("Description of the selected financial target - planning to be completed in the next fiscal year");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.FiscalYearLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("FISCAL_YEAR_LKUP_ID")
                    .HasComment("Unique identifier linked with fiscal year on the look up table");

                entity.Property(e => e.Forecast)
                    .HasColumnType("numeric(10, 3)")
                    .HasColumnName("FORECAST")
                    .HasDefaultValueSql("((0))")
                    .HasComment("Dollar value associated with financial target");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("ID linked with the project");

                entity.Property(e => e.QtyAccmpId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("QTY_ACCMP_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.QtyAccmpLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("QTY_ACCMP_LKUP_ID")
                    .HasComment("Fiscal Year lookup ID associated with Financial Target ");

                entity.Property(e => e.Schedule7)
                    .HasColumnType("numeric(10, 3)")
                    .HasColumnName("SCHEDULE7")
                    .HasComment("Forecast type allows users to plan their program outside the bounds of current fiscal/allocation	");
            });

            modelBuilder.Entity<CrtRatio>(entity =>
            {
                entity.HasKey(e => e.RatioId)
                    .HasName("CRT_RATIO_PK");

                entity.ToTable("CRT_RATIO");

                entity.HasComment("Defines CRT financial targets");

                entity.HasIndex(e => new { e.RatioId, e.ServiceAreaId, e.DistrictId, e.RatioRecordLkupId }, "CRT_RATIO_FK_I");

                entity.Property(e => e.RatioId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RATIO_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_RATIO_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISTRICT_ID")
                    .HasComment("Unique idenifier for districts");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.Ratio)
                    .HasColumnType("numeric(9, 5)")
                    .HasColumnName("RATIO")
                    .HasComment("Proportion of the project that falls within a ratio object e.g. electoral district,economic region, highway");

                entity.Property(e => e.RatioRecordLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RATIO_RECORD_LKUP_ID")
                    .HasComment("Link to code lookup table ratio record values for electoral district, economic region, highway");

                entity.Property(e => e.RatioRecordTypeLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RATIO_RECORD_TYPE_LKUP_ID")
                    .HasComment("Link to code lookup table for type of record i.e. service area, electoral district, economic region, highway, district");

                entity.Property(e => e.ServiceAreaId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_AREA_ID")
                    .HasComment("Unique idenifier for service area");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.CrtRatios)
                    .HasForeignKey(d => d.ProjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_PROJECT_CRT_RATIO");

                entity.HasOne(d => d.RatioRecordLkup)
                    .WithMany(p => p.CrtRatioRatioRecordLkups)
                    .HasForeignKey(d => d.RatioRecordLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_RATIO_RECORD");

                entity.HasOne(d => d.RatioRecordTypeLkup)
                    .WithMany(p => p.CrtRatioRatioRecordTypeLkups)
                    .HasForeignKey(d => d.RatioRecordTypeLkupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_CODE_LOOKUP_RATIO_RECORD_TYPE");
            });

            modelBuilder.Entity<CrtRatioHist>(entity =>
            {
                entity.HasKey(e => e.RatioHistId)
                    .HasName("CRT_RATIO_HIST_PK");

                entity.ToTable("CRT_RATIO_HIST");

                entity.HasComment("Defines CRT financial targets");

                entity.Property(e => e.RatioHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RATIO_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_RATIO_H_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISTRICT_ID")
                    .HasComment("Unique identifier for district records");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.Ratio)
                    .HasColumnType("numeric(9, 5)")
                    .HasColumnName("RATIO")
                    .HasComment("Proportion of the project that falls within a ratio object e.g. electoral district,economic region, highway");

                entity.Property(e => e.RatioId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RATIO_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.RatioRecordLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RATIO_RECORD_LKUP_ID")
                    .HasComment("Link to code lookup table ratio record values for electoral district, economic region, highway");

                entity.Property(e => e.RatioRecordTypeLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("RATIO_RECORD_TYPE_LKUP_ID")
                    .HasComment("Link to code lookup table for type of record i.e. service area, electoral district, economic region, highway, district");

                entity.Property(e => e.ServiceAreaId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_AREA_ID")
                    .HasComment("Unique idenifier for service area");
            });

            modelBuilder.Entity<CrtRegion>(entity =>
            {
                entity.HasKey(e => e.RegionId)
                    .HasName("CRT_REGION_PK");

                entity.ToTable("CRT_REGION");

                entity.HasComment("Ministry Region lookup values");

                entity.HasIndex(e => new { e.RegionNumber, e.RegionName, e.EndDate, e.RegionId }, "CRT_REG_NO_NAME_UK")
                    .IsUnique();

                entity.Property(e => e.RegionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_REG_ID_SEQ])")
                    .HasComment("Unique ID for a ministry organizational unit (Region) responsible for an exclusive geographic area within the province.  ");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the entity ends or changes");

                entity.Property(e => e.RegionName)
                    .IsRequired()
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("REGION_NAME")
                    .HasComment("Name of the Ministry region");

                entity.Property(e => e.RegionNumber)
                    .HasColumnType("numeric(2, 0)")
                    .HasColumnName("REGION_NUMBER")
                    .HasComment("Number assigned to the Ministry region");
            });

            modelBuilder.Entity<CrtRegionDistrict>(entity =>
            {
                entity.HasKey(e => e.RegionDistrictId)
                    .HasName("CRT_REGION_DISTR_PK");

                entity.ToTable("CRT_REGION_DISTRICT");

                entity.HasComment("Ministry Region District lookup values");

                entity.HasIndex(e => new { e.EndDate, e.RegionId, e.DistrictId }, "CRT_REG_DIS_NO_NAME_UK")
                    .IsUnique();

                entity.Property(e => e.RegionDistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_DISTRICT_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_REG_DIST_ID_SEQ])")
                    .HasComment("Unique identifier");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISTRICT_ID")
                    .HasComment("unique identifier for Ministry district");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the entity ends or changes");

                entity.Property(e => e.RegionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_ID")
                    .HasComment("unique identifier for Ministry region");

                entity.HasOne(d => d.District)
                    .WithMany(p => p.CrtRegionDistricts)
                    .HasForeignKey(d => d.DistrictId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_DISTRICT_CRT_REGION_DISTRICT");

                entity.HasOne(d => d.Region)
                    .WithMany(p => p.CrtRegionDistricts)
                    .HasForeignKey(d => d.RegionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_REGION_CRT_REGION_DISTRICT");
            });

            modelBuilder.Entity<CrtRegionDistrictHist>(entity =>
            {
                entity.HasKey(e => e.RegionDistrictHistId)
                    .HasName("CRT_REGION_DISTR_H_PK");

                entity.ToTable("CRT_REGION_DISTRICT_HIST");

                entity.HasComment("Ministry Region lookup values");

                entity.HasIndex(e => new { e.RegionDistrictHistId, e.EndDateHist }, "CRT_REG_DIS_H_NO_NAME_UK")
                    .IsUnique();

                entity.Property(e => e.RegionDistrictHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_DISTRICT_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_REG_DIST_H_ID_SEQ])")
                    .HasComment("Unique identifier");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DistrictId)
                    .HasColumnType("numeric(2, 0)")
                    .HasColumnName("DISTRICT_ID")
                    .HasComment("unique identifier for Ministry district");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the entity ends or changes");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.RegionDistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_DISTRICT_ID")
                    .HasComment("Unique identifier");

                entity.Property(e => e.RegionId)
                    .HasColumnType("numeric(2, 0)")
                    .HasColumnName("REGION_ID")
                    .HasComment("unique identifier for Ministry region");
            });

            modelBuilder.Entity<CrtRegionUser>(entity =>
            {
                entity.HasKey(e => e.RegionUserId)
                    .HasName("CRT_REGION_USR_PK");

                entity.ToTable("CRT_REGION_USER");

                entity.HasComment("Association between USER and REGION defining which users can submit or access data.");

                entity.HasIndex(e => e.SystemUserId, "CRT_REGION_USER_FK_I");

                entity.Property(e => e.RegionUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_USER_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_REGION_USR_ID_SEQ])")
                    .HasComment("Unique identifier for REGION User");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date reflecting when a user can no longer transmit submissions.");

                entity.Property(e => e.RegionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_ID")
                    .HasComment("identifier for REGION");

                entity.Property(e => e.SystemUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SYSTEM_USER_ID")
                    .HasComment("Unique identifier of related user");

                entity.HasOne(d => d.Region)
                    .WithMany(p => p.CrtRegionUsers)
                    .HasForeignKey(d => d.RegionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_REGION_CRT_REGION_USER");

                entity.HasOne(d => d.SystemUser)
                    .WithMany(p => p.CrtRegionUsers)
                    .HasForeignKey(d => d.SystemUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_SYSTEM_USER_CRT_REGION_USER");
            });

            modelBuilder.Entity<CrtRegionUserHist>(entity =>
            {
                entity.HasKey(e => e.RegionUserHistId)
                    .HasName("CRT_REGION_U_H_PK");

                entity.ToTable("CRT_REGION_USER_HIST");

                entity.HasComment("History of association between USER and REGION defining which users can submit or access data.");

                entity.HasIndex(e => new { e.RegionUserHistId, e.EndDateHist }, "CRT_REGION_U_H_UK")
                    .IsUnique();

                entity.Property(e => e.RegionUserHistId)
                    .HasColumnName("REGION_USER_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_REGION_USER_H_ID_SEQ])")
                    .HasComment("Unique identifier for REGION History");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date reflecting when a user can no longer transmit submissions.");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.RegionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_ID")
                    .HasComment("identifier for REGION");

                entity.Property(e => e.RegionUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("REGION_USER_ID")
                    .HasComment("Unique identifier for REGION");

                entity.Property(e => e.SystemUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SYSTEM_USER_ID")
                    .HasComment("Unique identifier of related user");
            });

            modelBuilder.Entity<CrtRole>(entity =>
            {
                entity.HasKey(e => e.RoleId)
                    .HasName("CRT_ROLE_PK");

                entity.ToTable("CRT_ROLE");

                entity.HasComment("Role description table for groups of permissions.");

                entity.Property(e => e.RoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_RL_ID_SEQ])")
                    .HasComment("Unique identifier for a record");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Description of a permission.");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date permission was deactivated");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("NAME")
                    .HasComment("Business name for a permission");
            });

            modelBuilder.Entity<CrtRoleHist>(entity =>
            {
                entity.HasKey(e => e.RoleHistId)
                    .HasName("CRT_RL_H_PK");

                entity.ToTable("CRT_ROLE_HIST");

                entity.HasComment("Role History description table for groups of permissions.");

                entity.HasIndex(e => new { e.RoleHistId, e.EndDateHist }, "CRT_RL_H_UK")
                    .IsUnique();

                entity.Property(e => e.RoleHistId)
                    .HasColumnName("ROLE_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_ROLE_H_ID_SEQ])");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Description of a permission.");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date permission was deactivated");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("NAME")
                    .HasComment("Business name for a permission");

                entity.Property(e => e.RoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_ID")
                    .HasComment("Unique identifier for a record");
            });

            modelBuilder.Entity<CrtRolePermission>(entity =>
            {
                entity.HasKey(e => e.RolePermissionId)
                    .HasName("CRT_RL_PERM_PK");

                entity.ToTable("CRT_ROLE_PERMISSION");

                entity.HasComment("Role to Permission associative table for assignment of permissions to parent roles.");

                entity.HasIndex(e => e.PermissionId, "CRT_RL_PERM_PERM_FK_I");

                entity.HasIndex(e => e.RoleId, "CRT_RL_PERM_RL_FK_I");

                entity.HasIndex(e => new { e.RoleId, e.PermissionId, e.EndDate }, "CRT_RL_PERM_UN_CH")
                    .IsUnique();

                entity.Property(e => e.RolePermissionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_PERMISSION_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_RL_PERM_ID_SEQ])")
                    .HasComment("Unique identifier for a record");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date record was deactivated");

                entity.Property(e => e.PermissionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PERMISSION_ID")
                    .HasComment("Unique idenifier for related permission");

                entity.Property(e => e.RoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_ID")
                    .HasComment("Unique idenifier for related role");

                entity.HasOne(d => d.Permission)
                    .WithMany(p => p.CrtRolePermissions)
                    .HasForeignKey(d => d.PermissionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_PERMISSION_CRT_ROLE_PERMISSION");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.CrtRolePermissions)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_ROLE_CRT_ROLE_PERMISSION");
            });

            modelBuilder.Entity<CrtRolePermissionHist>(entity =>
            {
                entity.HasKey(e => e.RolePermissionHistId)
                    .HasName("CRT_RL_PE_H_PK");

                entity.ToTable("CRT_ROLE_PERMISSION_HIST");

                entity.HasComment("History of Role to Permission associative table for assignment of permissions to parent roles.");

                entity.HasIndex(e => new { e.EndDateHist, e.RolePermissionHistId }, "CRT_RL_PE_H_UK")
                    .IsUnique();

                entity.Property(e => e.RolePermissionHistId)
                    .HasColumnName("ROLE_PERMISSION_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_ROLE_PERMISSION_H_ID_SEQ])")
                    .HasComment("Unique identifier for a record");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date record was deactivated");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST")
                    .HasComment("Date record was deactivated");

                entity.Property(e => e.PermissionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PERMISSION_ID")
                    .HasComment("Unique idenifier for related permission");

                entity.Property(e => e.RoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_ID")
                    .HasComment("Unique idenifier for related role");

                entity.Property(e => e.RolePermissionId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_PERMISSION_ID")
                    .HasComment("Unique identifier for a record");
            });

            modelBuilder.Entity<CrtSegment>(entity =>
            {
                entity.HasKey(e => e.SegmentId)
                    .HasName("CRT_SEGMENT_PK");

                entity.ToTable("CRT_SEGMENT");

                entity.HasIndex(e => new { e.SegmentId, e.ProjectId }, "CRT_SEGMENT_ELEM_FK_I");

                entity.Property(e => e.SegmentId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SEGMENT_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_SEGMENT_ID_SEQ])");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP");

                entity.Property(e => e.AppCreateUserGuid).HasColumnName("APP_CREATE_USER_GUID");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP");

                entity.Property(e => e.AppLastUpdateUserGuid).HasColumnName("APP_LAST_UPDATE_USER_GUID");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())");

                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Segment description field which provides more information to better qualify the segment. It is stored and displayed on the project segment screen alongside the start and end coordinates");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE");

                entity.Property(e => e.EndLatitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("END_LATITUDE");

                entity.Property(e => e.EndLongitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("END_LONGITUDE");

                entity.Property(e => e.Geometry)
                    .HasColumnType("geometry")
                    .HasColumnName("GEOMETRY");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID");

                entity.Property(e => e.StartLatitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("START_LATITUDE");

                entity.Property(e => e.StartLongitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("START_LONGITUDE");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.CrtSegments)
                    .HasForeignKey(d => d.ProjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_PROJECT_CRT_SEGMENT");
            });

            modelBuilder.Entity<CrtSegmentHist>(entity =>
            {
                entity.HasKey(e => e.SegmentHistId)
                    .HasName("CRT_SEGMENT_HIST_PK");

                entity.ToTable("CRT_SEGMENT_HIST");

                entity.HasComment("Defines CRT project elements");

                entity.Property(e => e.SegmentHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SEGMENT_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_SEGMENT_H_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("DESCRIPTION")
                    .HasComment("Segment description field which provides more information to better qualify the segment. It is stored and displayed on the project segment screen alongside the start and end coordinates");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.EndLatitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("END_LATITUDE")
                    .HasComment("Spatial Coordinates denoting the End Latitude for the project/project segment");

                entity.Property(e => e.EndLongitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("END_LONGITUDE")
                    .HasComment("Spatial Coordinates denoting the end Longitude for the project/project segment");

                entity.Property(e => e.Geometry)
                    .HasColumnType("geometry")
                    .HasColumnName("GEOMETRY")
                    .HasComment("Line or point depicting the underlying geometry  	");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.SegmentId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SEGMENT_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.StartLatitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("START_LATITUDE")
                    .HasComment("Spatial Coordinates denoting the starting Latitude for the project/project segment");

                entity.Property(e => e.StartLongitude)
                    .HasColumnType("numeric(16, 8)")
                    .HasColumnName("START_LONGITUDE")
                    .HasComment("Spatial Coordinates denoting the starting Longitude for the project/project segment	");
            });

            modelBuilder.Entity<CrtSegmentRecordVw>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("CRT_SEGMENT_RECORD_VW");

                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("description");

                entity.Property(e => e.Geometry)
                    .HasColumnType("geometry")
                    .HasColumnName("geometry");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("project_id");

                entity.Property(e => e.ProjectName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("project_name");

                entity.Property(e => e.SegmentId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("segment_id");
            });

            modelBuilder.Entity<CrtServiceArea>(entity =>
            {
                entity.HasKey(e => e.ServiceAreaId)
                    .HasName("CRT_SERVICE_AREA_PK");

                entity.ToTable("CRT_SERVICE_AREA");

                entity.HasComment("Service Area lookup values");

                entity.HasIndex(e => new { e.ServiceAreaNumber, e.ServiceAreaName, e.EndDate }, "CRT_SRV_ARA_UK")
                    .IsUnique();

                entity.Property(e => e.ServiceAreaId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_AREA_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_SRV_ARA_ID_SEQ])")
                    .HasComment("Unique idenifier for table records");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISTRICT_ID")
                    .HasComment("Unique identifier for DISTRICT.");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the entity ends or changes");

                entity.Property(e => e.ServiceAreaName)
                    .IsRequired()
                    .HasMaxLength(60)
                    .IsUnicode(false)
                    .HasColumnName("SERVICE_AREA_NAME")
                    .HasComment("Name of the service area");

                entity.Property(e => e.ServiceAreaNumber)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_AREA_NUMBER")
                    .HasComment("Assigned number of the Service Area");

                entity.HasOne(d => d.District)
                    .WithMany(p => p.CrtServiceAreas)
                    .HasForeignKey(d => d.DistrictId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_DISTRICT_CRT_SERVICE_AREA");
            });

            modelBuilder.Entity<CrtServiceAreaHist>(entity =>
            {
                entity.HasKey(e => e.ServiceAreaHistId)
                    .HasName("CRT_SRV_A_H_PK");

                entity.ToTable("CRT_SERVICE_AREA_HIST");

                entity.HasComment("Service Area lookup values");

                entity.HasIndex(e => new { e.ServiceAreaHistId, e.EndDateHist }, "CRT_SRV_A_H_UK")
                    .IsUnique();

                entity.Property(e => e.ServiceAreaHistId)
                    .HasColumnName("SERVICE_AREA_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_SRV_ARA_ID_SEQ])")
                    .HasComment("Unique idenifier for history table records ");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.DistrictId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("DISTRICT_ID")
                    .HasComment("Unique identifier for DISTRICT.");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the entity ends or changes");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.ServiceAreaId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_AREA_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_SRV_ARA_ID_SEQ])")
                    .HasComment("Unique idenifier for table records");

                entity.Property(e => e.ServiceAreaName)
                    .IsRequired()
                    .HasMaxLength(60)
                    .IsUnicode(false)
                    .HasColumnName("SERVICE_AREA_NAME")
                    .HasComment("Name of the service area");

                entity.Property(e => e.ServiceAreaNumber)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SERVICE_AREA_NUMBER")
                    .HasComment("Assigned number of the Service Area");
            });

            modelBuilder.Entity<CrtSystemUser>(entity =>
            {
                entity.HasKey(e => e.SystemUserId)
                    .HasName("CRT_SYSTEM_USER_PK");

                entity.ToTable("CRT_SYSTEM_USER");

                entity.HasComment("Defines users and their attributes as found in IDIR");

                entity.Property(e => e.SystemUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SYSTEM_USER_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [SYS_USR_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.ApiClientId)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("API_CLIENT_ID")
                    .HasComment("This ID is used to track Keycloak client ID created for the users");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("EMAIL")
                    .HasComment("Contact email address within Active Directory (Email = SMGOV_EMAIL)");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date a user can no longer access the system or invoke data submissions.");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("FIRST_NAME")
                    .HasComment("First Name of the user");

                entity.Property(e => e.LastName)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("LAST_NAME")
                    .HasComment("Last Name of the user");

                entity.Property(e => e.UserGuid)
                    .HasColumnName("USER_GUID")
                    .HasComment("A system generated unique identifier.  Reflects the active directory unique idenifier for the user.");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(32)
                    .IsUnicode(false)
                    .HasColumnName("USERNAME")
                    .HasComment("IDIR or BCeID Active Directory defined universal identifier (SM_UNIVERSALID or userID) attributed to a user.  This value can change over time, while USER_GUID will remain consistant.");
            });

            modelBuilder.Entity<CrtSystemUserHist>(entity =>
            {
                entity.HasKey(e => e.SystemUserHistId)
                    .HasName("CRT_SYS_U_H_PK");

                entity.ToTable("CRT_SYSTEM_USER_HIST");

                entity.HasIndex(e => new { e.SystemUserHistId, e.EndDateHist }, "CRT_SYS_U_H_UK")
                    .IsUnique();

                entity.Property(e => e.SystemUserHistId)
                    .HasColumnName("SYSTEM_USER_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_SYSTEM_USER_H_ID_SEQ])");

                entity.Property(e => e.ApiClientId)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("API_CLIENT_ID")
                    .HasComment("This ID is used to track Keycloak client ID created for the users");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("EMAIL")
                    .HasComment("Contact email address within Active Directory (Email = SMGOV_EMAIL)");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date a user can no longer access the system or invoke data submissions.");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("FIRST_NAME")
                    .HasComment("First Name of the user");

                entity.Property(e => e.LastName)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("LAST_NAME")
                    .HasComment("Last Name of the user");

                entity.Property(e => e.SystemUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SYSTEM_USER_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.UserGuid)
                    .HasColumnName("USER_GUID")
                    .HasComment("A system generated unique identifier.  Reflects the active directory unique idenifier for the user.");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(32)
                    .IsUnicode(false)
                    .HasColumnName("USERNAME")
                    .HasComment("IDIR Active Directory defined universal identifier (SM_UNIVERSALID or userID) attributed to a user.  This value can change over time, while USER_GUID will remain consistant.");
            });

            modelBuilder.Entity<CrtTender>(entity =>
            {
                entity.HasKey(e => e.TenderId)
                    .HasName("CRT_TENDER_PK");

                entity.ToTable("CRT_TENDER");

                entity.HasComment("Defines CRT tender for the project");

                entity.HasIndex(e => new { e.ProjectId, e.TenderNumber }, "CRT_TENDER_FK_I");

                entity.Property(e => e.TenderId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("TENDER_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_TENDER_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.ActualDate)
                    .HasColumnType("date")
                    .HasColumnName("ACTUAL_DATE")
                    .HasComment("Date that tender actually takes place");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.BidValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("BID_VALUE")
                    .HasComment("Bid amount in response to tender");

                entity.Property(e => e.Comment)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("COMMENT")
                    .HasComment("Comments on the tender item");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.PlannedDate)
                    .HasColumnType("date")
                    .HasColumnName("PLANNED_DATE")
                    .HasComment("Date the tender is planned for");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("ID linked with the project");

                entity.Property(e => e.TenderNumber)
                    .IsRequired()
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("TENDER_NUMBER")
                    .HasComment("Number associated with a tender");

                entity.Property(e => e.TenderValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("TENDER_VALUE")
                    .HasComment("Dollar value of tender. This field is captured on the screen as  \"Ministry Estimate\"");

                entity.Property(e => e.WinningCntrctrLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("WINNING_CNTRCTR_LKUP_ID")
                    .HasComment("Unique identifier for the winning contractor of the tender");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.CrtTenders)
                    .HasForeignKey(d => d.ProjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_PROJECT_CRT_TENDER");

                entity.HasOne(d => d.WinningCntrctrLkup)
                    .WithMany(p => p.CrtTenders)
                    .HasForeignKey(d => d.WinningCntrctrLkupId)
                    .HasConstraintName("CRT_CODE_LOOKUP_CRT_TENDER");
            });

            modelBuilder.Entity<CrtTenderHist>(entity =>
            {
                entity.HasKey(e => e.TenderHistId)
                    .HasName("CRT_TENDER_HIST_PK");

                entity.ToTable("CRT_TENDER_HIST");

                entity.HasComment("Defines CRT tender for the project");

                entity.Property(e => e.TenderHistId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("TENDER_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_TENDER_H_ID_SEQ])")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.ActualDate)
                    .HasColumnType("date")
                    .HasColumnName("ACTUAL_DATE")
                    .HasComment("Date that tender actually takes place");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.BidValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("BID_VALUE")
                    .HasComment("Bid amount in response to tender");

                entity.Property(e => e.Comment)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("COMMENT")
                    .HasComment("Comments on the tender item");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date the project is completed. This shows is proxy for project status, either active or complete");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.PlannedDate)
                    .HasColumnType("date")
                    .HasColumnName("PLANNED_DATE")
                    .HasComment("Date the tender is planned for");

                entity.Property(e => e.ProjectId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("PROJECT_ID")
                    .HasComment("ID linked with the project");

                entity.Property(e => e.TenderId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("TENDER_ID")
                    .HasComment("A system generated unique identifier.");

                entity.Property(e => e.TenderNumber)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("TENDER_NUMBER")
                    .HasComment("Number associated with a tender");

                entity.Property(e => e.TenderValue)
                    .HasColumnType("numeric(12, 2)")
                    .HasColumnName("TENDER_VALUE")
                    .HasComment("Dollar value of tender. This field is captured on the screen as  \"Ministry Estimate\"");

                entity.Property(e => e.WinningCntrctrLkupId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("WINNING_CNTRCTR_LKUP_ID")
                    .HasComment("Unique identifier for the winning contractor of the tender");
            });

            modelBuilder.Entity<CrtUserRole>(entity =>
            {
                entity.HasKey(e => e.UserRoleId)
                    .HasName("CRT_USR_RL_PK");

                entity.ToTable("CRT_USER_ROLE");

                entity.HasComment("Associative table for assignment of roles to individual system users.");

                entity.HasIndex(e => e.RoleId, "CRT_USR_RL_RL_FK_I");

                entity.HasIndex(e => new { e.EndDate, e.SystemUserId, e.RoleId }, "CRT_USR_RL_UQ_CH")
                    .IsUnique();

                entity.HasIndex(e => e.SystemUserId, "CRT_USR_RL_USR_FK_I");

                entity.Property(e => e.UserRoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("USER_ROLE_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_USR_RL_ID_SEQ])")
                    .HasComment("Unique identifier for a record");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasDefaultValueSql("((1))")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasDefaultValueSql("(getutcdate())")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasDefaultValueSql("(user_name())")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date a user is no longer assigned the role.  The APP_CREATED_TIMESTAMP and the END_DATE can be used to determine which roles were assigned to a user at a given point in time.");

                entity.Property(e => e.RoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_ID")
                    .HasComment("Unique identifier for related ROLE");

                entity.Property(e => e.SystemUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SYSTEM_USER_ID")
                    .HasComment("Unique identifier for related SYSTEM USER");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.CrtUserRoles)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_USR_RL_RL_FK");

                entity.HasOne(d => d.SystemUser)
                    .WithMany(p => p.CrtUserRoles)
                    .HasForeignKey(d => d.SystemUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CRT_USR_RL_SYS_USR_FK");
            });

            modelBuilder.Entity<CrtUserRoleHist>(entity =>
            {
                entity.HasKey(e => e.UserRoleHistId)
                    .HasName("CRT_USR_R_H_PK");

                entity.ToTable("CRT_USER_ROLE_HIST");

                entity.HasComment("Associative table for assignment of roles to individual system users.");

                entity.HasIndex(e => new { e.UserRoleHistId, e.EndDateHist }, "CRT_USR_R_H_UK")
                    .IsUnique();

                entity.Property(e => e.UserRoleHistId)
                    .HasColumnName("USER_ROLE_HIST_ID")
                    .HasDefaultValueSql("(NEXT VALUE FOR [CRT_USER_ROLE_H_ID_SEQ])")
                    .HasComment("Unique identifier for a record history");

                entity.Property(e => e.AppCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_CREATE_TIMESTAMP")
                    .HasComment("Date and time of record creation");

                entity.Property(e => e.AppCreateUserGuid)
                    .HasColumnName("APP_CREATE_USER_GUID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_CREATE_USERID")
                    .HasComment("Unique idenifier of user who created record");

                entity.Property(e => e.AppLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("APP_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time of last record update");

                entity.Property(e => e.AppLastUpdateUserGuid)
                    .HasColumnName("APP_LAST_UPDATE_USER_GUID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.AppLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("APP_LAST_UPDATE_USERID")
                    .HasComment("Unique idenifier of user who last updated record");

                entity.Property(e => e.ConcurrencyControlNumber)
                    .HasColumnName("CONCURRENCY_CONTROL_NUMBER")
                    .HasComment("Record under edit indicator used for optomisitc record contention management.  If number differs from start of edit, then user will be prompted to that record has been updated by someone else.");

                entity.Property(e => e.DbAuditCreateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_CREATE_TIMESTAMP")
                    .HasComment("Date and time record created in the database");

                entity.Property(e => e.DbAuditCreateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_CREATE_USERID")
                    .HasComment("Named database user who created record");

                entity.Property(e => e.DbAuditLastUpdateTimestamp)
                    .HasColumnType("datetime")
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_TIMESTAMP")
                    .HasComment("Date and time record was last updated in the database.");

                entity.Property(e => e.DbAuditLastUpdateUserid)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("DB_AUDIT_LAST_UPDATE_USERID")
                    .HasComment("Named database user who last updated record");

                entity.Property(e => e.EffectiveDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("EFFECTIVE_DATE_HIST")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE")
                    .HasComment("Date a user is no longer assigned the role.  The APP_CREATED_TIMESTAMP and the END_DATE can be used to determine which roles were assigned to a user at a given point in time.");

                entity.Property(e => e.EndDateHist)
                    .HasColumnType("datetime")
                    .HasColumnName("END_DATE_HIST");

                entity.Property(e => e.RoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("ROLE_ID")
                    .HasComment("Unique identifier for related ROLE");

                entity.Property(e => e.SystemUserId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("SYSTEM_USER_ID")
                    .HasComment("Unique identifier for related SYSTEM USER");

                entity.Property(e => e.UserRoleId)
                    .HasColumnType("numeric(9, 0)")
                    .HasColumnName("USER_ROLE_ID")
                    .HasComment("Unique identifier for a record");
            });

            modelBuilder.HasSequence("CRT_CODE_LKUP_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_CODE_LOOKUP_H_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999);

            modelBuilder.HasSequence("CRT_DIST_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_ELEMENT_H_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999);

            modelBuilder.HasSequence("CRT_ELEMENT_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_FIN_TARGET_H_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_FIN_TARGET_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_NOTE_H_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_NOTE_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999);

            modelBuilder.HasSequence("CRT_PERM_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_PERMISSION_H_ID_SEQ")
                .HasMin(1)
                .HasMax(2147483647);

            modelBuilder.HasSequence("CRT_PROJECT_H_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_PROJECT_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999);

            modelBuilder.HasSequence("CRT_QTY_ACCMP_H_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_QTY_ACCMP_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999999);

            modelBuilder.HasSequence("CRT_RATIO_H_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_RATIO_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_REG_DIST_H_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999);

            modelBuilder.HasSequence("CRT_REG_DIST_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999);

            modelBuilder.HasSequence("CRT_REG_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_REGION_USER_H_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999999);

            modelBuilder.HasSequence("CRT_REGION_USR_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_RL_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_RL_PERM_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("CRT_ROLE_H_ID_SEQ")
                .HasMin(1)
                .HasMax(2147483647);

            modelBuilder.HasSequence("CRT_ROLE_PERMISSION_H_ID_SEQ")
                .HasMin(1)
                .HasMax(2147483647);

            modelBuilder.HasSequence("CRT_SEGMENT_H_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_SEGMENT_ID_SEQ")
                .HasMin(1)
                .HasMax(99999999999);

            modelBuilder.HasSequence("CRT_SERVICE_AREA_H_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999);

            modelBuilder.HasSequence("CRT_SRV_ARA_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999);

            modelBuilder.HasSequence("CRT_SYSTEM_USER_H_ID_SEQ")
                .HasMin(1)
                .HasMax(2147483647);

            modelBuilder.HasSequence("CRT_TENDER_H_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999999);

            modelBuilder.HasSequence("CRT_TENDER_ID_SEQ")
                .HasMin(1)
                .HasMax(9999999999999);

            modelBuilder.HasSequence("CRT_USER_ROLE_H_ID_SEQ")
                .HasMin(1)
                .HasMax(2147483647);

            modelBuilder.HasSequence("CRT_USR_RL_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            modelBuilder.HasSequence("SYS_USR_ID_SEQ")
                .HasMin(1)
                .HasMax(999999999);

            OnModelCreatingPartial(modelBuilder);
        }

        public class BlankTriggerAddingConvention : IModelFinalizingConvention
        {
            public virtual void ProcessModelFinalizing(
                IConventionModelBuilder modelBuilder,
                IConventionContext<IConventionModelBuilder> context)
            {
                foreach (var entityType in modelBuilder.Metadata.GetEntityTypes())
                {
                    var table = StoreObjectIdentifier.Create(entityType, StoreObjectType.Table);
                    if (table != null
                        && entityType.GetDeclaredTriggers().All(t => t.GetDatabaseName(table.Value) == null))
                    {
                        entityType.Builder.HasTrigger(table.Value.Name + "_Trigger");
                    }

                    foreach (var fragment in entityType.GetMappingFragments(StoreObjectType.Table))
                    {
                        if (entityType.GetDeclaredTriggers().All(t => t.GetDatabaseName(fragment.StoreObject) == null))
                        {
                            entityType.Builder.HasTrigger(fragment.StoreObject.Name + "_Trigger");
                        }
                    }
                }
            }
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Conventions.Add(_ => new BlankTriggerAddingConvention());
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
