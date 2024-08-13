using System;

namespace Crt.Model
{
    public static class Constants
    {
        public const string AppName = "CRT";
        public const string AuthDir = "IDIR";
        public static DateTime MaxDate = new DateTime(9999, 12, 31);
        public static DateTime MinDate = new DateTime(1900, 1, 1);
        public static decimal MaxFileSize = 2097152;
        public const string VancouverTimeZone = "America/Vancouver";
        public const string PacificTimeZone = "Pacific Standard Time";
        public const string SystemAdmin = "SYSTEM_ADMIN";
        public const double SpatialPointSize = 0.001;
    }

    public static class ExportQuery
    {
        public const string CqlFilter = "cql_filter";
        public const string ServiceAreas = "serviceAreas";
        public const string OutputFormat = "outputFormat";
        public const string Format = "format";
        public const string TypeName = "typeName";
        public const string Layers = "layers";
        public const string FromDate = "fromDate";
        public const string ToDate = "toDate";
        public const string Count = "count";
    }

    public static class ExportQueryEndpointConfigName
    {
        public const string WFS = "WFSExportPath";
        public const string WMS = "KMLExportPath";
    }

    public static class Permissions
    {
        public const string CodeWrite = "CODE_W";
        public const string CodeRead = "CODE_R";
        public const string UserWrite = "USER_W";
        public const string UserRead = "USER_R";
        public const string RoleWrite = "ROLE_W";
        public const string RoleRead = "ROLE_R";
        public const string ExportRead = "EXPORT_R";
        public const string ProjectRead = "PROJECT_R";
        public const string ProjectWrite = "PROJECT_W";
        public const string ApiClientWrite = "API_W";
        // Use this permission to disable all write access for all users
        public const string AllWrite = "ALL_W";

    }

    public static class Entities
    {
        public const string User = "user";
        public const string Role = "role";
        public const string Project = "project";
        public const string Note = "note";
        public const string FinTarget = "fintarget";
        public const string Qty = "qty";
        public const string Accmp = "accmp";
        public const string Tender = "tender";
        public const string Segment = "segment";
        public const string Ratio = "ratio";
        public const string CodeTable = "codetable";
        public const string Element = "element";
    }

    public static class FieldTypes
    {
        public const string String = "S";
        public const string Decimal = "N";
        public const string Date = "D";
    }

    public static class Fields
    {
        public const string Username = "Username";
        public const string FirstName = "FirstName";
        public const string LastName = "LastName";
        public const string Email = "Email";
        public const string EndDate = "EndDate";

        public const string RoleId = "RoleId";
        public const string RegionId = "RegionId";
        public const string Name = "Name";
        public const string Description = "Description";

        public const string PermissionId = "PermissionId";

        public const string ApiClientId = "ApiClientId";

        public const string ProjectId = "ProjectId";
        public const string ProjectNumber = "ProjectNumber";
        public const string ProjectName = "ProjectName";
        public const string Scope = "Scope";
        public const string CapIndxLkupId = "CapIndxLkupId";
        public const string NerstTwnLkupId = "NerstTwnLkupId";
        public const string RcLkupId = "RcLkupId";
        public const string ProjectMgrLkupId = "ProjectMgrLkupId";
        public const string AnncmentValue = "AnncmentValue";
        public const string C035Value = "C035Value";
        public const string AnncmentComment = "AnncmentComment";
        public const string EstimatedValue = "EstimatedValue";

        public const string NoteType = "NoteType";
        public const string Comment = "Comment";

        public const string Amount = "Amount";
        public const string FiscalYearLkupId = "FiscalYearLkupId";
        public const string ElementId = "ElementId";
        public const string PhaseLkupId = "PhaseLkupId";
        public const string FundingTypeLkupId = "FundingTypeLkupId";

        public const string QtyAccmpLkupId = "QtyAccmpLkupId";
        public const string Forecast = "Forecast";
        public const string Schedule7 = "Schedule7";
        public const string Actual = "Actual";

        public const string TenderNumber = "TenderNumber";
        public const string PlannedDate = "PlannedDate";
        public const string ActualDate = "ActualDate";
        public const string TenderValue = "TenderValue";
        public const string WinningCntrctrLkupId = "WinningCntrctrLkupId";
        public const string BidValue = "BidValue";

        public const string SegmentRoute = "SegmentRoute";

        public const string Ratio = "Ratio";
        public const string RatioRecordLkupId = "RatioRecordLkupId";
        public const string RatioRecordTypeLkupId = "RatioRecordTypeLkupId";
        public const string ServiceAreaId = "ServiceAreaId";
        public const string DistrictId = "DistrictId";

        public const string CodeName = "CodeName";
        public const string CodeValueText = "CodeValueText";
        public const string CodeLookup = "CodeLookup";

        public const string Code = "Code";
        public const string ProgramLkupId = "ProgramLkupId";
        public const string ProgramCategoryLkupId = "ProgramCategoryLkupId";
        public const string ServiceLineLkupId = "ServiceLineLkupId";

        public const string DisplayOrder = "DisplayOrder";
    }

    public class DateColNames
    {
        public const string EndDate = "END_DATE";
    }

    public static class CodeSet
    {
        public const string CapIndx = "CAP_INDX";
        public const string Rc = "RC";
        public const string NearstTwn = "NEARST_TWN";
        public const string Phase = "PHASE";
        public const string FiscalYear = "FISCAL_YEAR";
        public const string Quantity = "QUANTITY";
        public const string Accomplishment = "ACCOMPLISHMENT";
        public const string Contractor = "CONTRACTOR";
        public const string FundingType = "FUNDING_TYPE";
        public const string RatioRecordType = "RATIO_RECORD_TYPE";
        public const string ElectoralDistrict = "ELECTORAL_DISTRICT";
        public const string Highway = "HIGHWAY";
        public const string EconomicRegion = "ECONOMIC_REGION";
        public const string District = "DISTRICT";
        public const string ServiceArea = "SERVICE_AREA";
        public const string CodeSetLookup = "CODE_SET_LOOKUP";
        public const string ProjectManager = "PROJECT_MANAGER";
        public const string Program = "PROGRAM";
        public const string ProgramCategory = "PROGRAM_CATEGORY";
        public const string ServiceLine = "SERVICE_LINE";
    }

    public static class RatioRecordType
    {
        public const string ElectoralDistrict = "Electoral District";
        public const string EconomicRegion = "Economic Region";
        public const string Highway = "Highway";
        public const string District = "District";
        public const string ServiceArea = "Service Area";
    }

    public static class CrtEnvironments
    {
        public const string Dev = "DEV";
        public const string Test = "TST";
        public const string Train = "TRN";
        public const string Uat = "UAT";
        public const string Prod = "PRD";
        public const string Unknown = "UNKNOWN";
    }

    public static class DotNetEnvironments
    {
        public const string Dev = "DEVELOPMENT";
        public const string Test = "STAGING";
        public const string Train = "TRAINING";
        public const string Uat = "UAT";
        public const string Prod = "PRODUCTION";
        public const string Unknown = "UNKNOWN";
    }

    public static class FeatureType
    {
        public const string None = "None";
        public const string Point = "Point";
        public const string Line = "Line";
        public const string PointLine = "Point/Line";
    }

    /// <summary>
    /// Spatial Data
    /// None - Non-Location specific reporting Fields
    /// GPS - Location specific reporting fields(GPS)
    /// LRS - Location specific reporting (without GPS)
    /// </summary>
    public enum SpatialData
    {
        None,
        Gps,
        Lrs
    }

    public enum SpValidationResult
    {
        Success, Fail, NonSpatial
    }

    public static class GpsCoords
    {
        public const decimal MaxLongitude = -109;
        public const decimal MinLongitude = -141;
        public const decimal MaxLatitude = 62;
        public const decimal MinLatitude = 47;
    }

    public static class KeycloakMapperConfig
    {
        public const string DefaultProtocol = "openid-connect";
        public const string OidcAudienceMapper = "oidc-audience-mapper";
        public const string OidcHardcodedClaimMapper = "oidc-hardcoded-claim-mapper";
        public const string IncludedClientAudience = "included.client.audience";
        public const string IncludedCustomAudience = "included.custom.audience";
        public const string AccessTokenClaim = "access.token.claim";
        public const string ClaimName = "claim.name";
        public const string ClaimValue = "claim.value";
        public const string JsonTypeLabel = "jsonType.label";
        public const string ApiClient = "api_client";
    }

    public static class LdapAttrs
    {
        public const string SamAccountName = "sAMAccountName";
        public const string BcgovGuid = "bcgovGUID";
    }

    public static class NoteTypes
    {
        public const string Status = "STATUS";
        public const string Emr = "EMR";
    }
}
