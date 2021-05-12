/*
This script should only be run once, unlike the code lookups.
If you do ever run this more than once, you need to reset the sequence 
and clean the CRT_PROJECT table, not recommended!!

DELETE FROM CRT_RATIO

ALTER SEQUENCE CRT_RATIO_ID_SEQ
 RESTART WITH 1

---
DELETE FROM CRT_SEGMENT

ALTER SEQUENCE CRT_SEGMENT_ID_SEQ
 RESTART WITH 1

---
DELETE FROM CRT_TENDER

ALTER SEQUENCE CRT_TENDER_ID_SEQ
 RESTART WITH 1

--
DELETE FROM CRT_QTY_ACCMP

ALTER SEQUENCE CRT_QTY_ACCMP_ID_SEQ
 RESTART WITH 1

--
DELETE FROM CRT_FIN_TARGET

ALTER SEQUENCE CRT_FIN_TARGET_ID_SEQ
 RESTART WITH 1

--
DELETE FROM CRT_NOTE

ALTER SEQUENCE CRT_NOTE_ID_SEQ
 RESTART WITH 1

--
DELETE FROM CRT_PROJECT;

ALTER SEQUENCE CRT_PROJECT_ID_SEQ
 RESTART WITH 1 


*/
BEGIN TRANSACTION

IF OBJECT_ID('dbo.MAP_PROJECT', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_PROJECT;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_PROJECT
(
	LEGACY_ID numeric(9, 0) NOT NULL,
	CRT_ID numeric(9, 0) NOT NULL
)  ON [PRIMARY]

COMMIT
GO

BEGIN TRANSACTION
SET NOCOUNT ON;

DECLARE @utcdate DATETIME = (SELECT getutcdate() AS utcdate)
DECLARE @app_guid UNIQUEIDENTIFIER = (SELECT CASE WHEN SUSER_SID() IS NOT NULL THEN SUSER_SID() ELSE (SELECT CONVERT(uniqueidentifier,STUFF(STUFF(STUFF(STUFF('B00D00A0AC0A0D0C00DD00F0D0C00000',9,0,'-'),14,0,'-'),19,0,'-'),24,0,'-'))) END AS  app_guid)
DECLARE @app_user VARCHAR(30) = (SELECT CASE WHEN SUBSTRING(SUSER_NAME(),CHARINDEX('\',SUSER_NAME())+1,LEN(SUSER_NAME())) IS NOT NULL THEN SUBSTRING(SUSER_NAME(),CHARINDEX('\',SUSER_NAME())+1,LEN(SUSER_NAME())) ELSE CURRENT_USER END AS app_user)
DECLARE @app_user_dir VARCHAR(12) = (SELECT CASE WHEN LEN(SUBSTRING(SUSER_NAME(),0,CHARINDEX('\',SUSER_NAME(),0)))>1 THEN SUBSTRING(SUSER_NAME(),0,CHARINDEX('\',SUSER_NAME(),0)) ELSE 'WIN AUTH' END AS app_user_dir)

DECLARE @legProjId int, @crtProjId int;
DECLARE @prjNum varchar(50), @prjName varchar(255), @desc varchar(max), @scope varchar(max), @prjAnncmtComm varchar(max);
DECLARE @prjRegionId int, @prjCapIndxId int, @prjNrstTwnId int, @prjRCId int, @prjPMId int;
DECLARE @prjAnncmtVal money, @prjC035Val money;
DECLARE @prjEndDate datetime;
DECLARE @projNumSeq int = 1;

DECLARE @insertedTableVar TABLE (newProjId int);

DECLARE prj_cursor CURSOR FOR
     SELECT ID
		 , [Project Number] AS ProjectNumber
		 , ISNULL([Project Name], '') AS ProjectName
		 , [Key Accomplishments] AS Description
		 , [Project Description] AS Scope
		 , mr.CRT_ID AS RegionId
		 , mci.CRT_ID AS CapIndex
		 , mnt.CRT_ID AS NearestTown
		 , mrc.CRT_ID AS RC
		 , mpm.CRT_ID AS ProjectManager
		 , [Announced Value] AS AnncmentValue
		 , [C-035 Value] AS C035Value
		 , [Announcment Notes] AS AnncmentComment
		 , CASE 
			WHEN Active = 1 
			THEN NULL 
			ELSE _SharePointModifiedDate 
			END AS EndDate 
	FROM tblProjects prj
	LEFT JOIN MAP_REGION mr
	ON mr.LEGACY_ID = [MOTI Region]
	LEFT JOIN MAP_CAP_INDX mci
	ON mci.LEGACY_ID = [Capital Index]
	LEFT JOIN MAP_NEAREST_TWN mnt
	ON mnt.LEGACY_ID = [Nearest Town]
	LEFT JOIN MAP_RC mrc
	ON mrc.LEGACY_ID = DefaultRC
	LEFT JOIN MAP_PROJECT_MANAGER mpm
	ON mpm.LEGACY_ID = [Project Manager]

OPEN prj_cursor

WHILE 1 = 1
BEGIN
	FETCH NEXT FROM prj_cursor 
	INTO @legProjId, @prjNum, @prjName, @desc, @scope, @prjRegionId, @prjCapIndxId, @prjNrstTwnId, @prjRCId
	, @prjPMId, @prjAnncmtVal, @prjC035Val, @prjAnncmtComm, @prjEndDate;
	
	IF @@FETCH_STATUS <> 0
	BEGIN
		BREAK;
	END;
	
	IF @prjNum IS NULL OR @prjNum = 'TBD'
	BEGIN
		SET @prjNum = 'TBD' + CONVERT(varchar, FORMAT(@projNumSeq,'D5'));
		SET @projNumSeq = @projNumSeq + 1;
	END;
	
	--PRINT @prjNum;

	INSERT INTO CRT_PROJECT 
		 (PROJECT_NUMBER
		, PROJECT_NAME
		, DESCRIPTION
		, SCOPE
		, REGION_ID
		, CAP_INDX_LKUP_ID
		, NEARST_TWN_LKUP_ID
		, RC_LKUP_ID
		, PROJECT_MGR_LKUP_ID
		, ANNCMENT_VALUE
		, C035_VALUE
		, ANNCMENT_COMMENT
		, END_DATE
		, APP_CREATE_USERID
		, APP_CREATE_TIMESTAMP
		, APP_CREATE_USER_GUID
		, APP_LAST_UPDATE_USERID
		, APP_LAST_UPDATE_TIMESTAMP
		, APP_LAST_UPDATE_USER_GUID)
	OUTPUT INSERTED.PROJECT_ID INTO @insertedTableVar
	VALUES (@prjNum
		, @prjName
		, @desc
		, @scope
		, @prjRegionId
		, @prjCapIndxId
		, @prjNrstTwnId
		, @prjRCId
		, @prjPMId
		, @prjAnncmtVal * 1000
		, @prjC035Val * 1000
		, @prjAnncmtComm
		, @prjEndDate
		, @app_user
		, @utcdate
		, @app_guid
		, @app_user
		, @utcdate
		, @app_guid)
	
	INSERT INTO MAP_PROJECT VALUES (@legProjId, (SELECT MAX(newProjId) FROM @insertedTableVar));

END;

CLOSE prj_cursor
DEALLOCATE prj_cursor

COMMIT
GO

DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

SELECT @legacyCnt = COUNT(*) FROM tblProjects
SELECT @crtCnt = COUNT(*) FROM CRT_PROJECT

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Projects and ' + CONVERT(varchar, @crtCnt) + ' CRT Projects'