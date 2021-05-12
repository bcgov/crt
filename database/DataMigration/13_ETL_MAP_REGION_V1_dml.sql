/*** Scripts to retrieve data, inject into appropriate worksheet of excel workbook ./Mapping.xslx

-- retrieve values from Legacy table
SELECT ID, RegionShort FROM tblMOTIRegions
WHERE Active = 1
ORDER BY RegionShort

--retrieve values from CRT Code Table
SELECT REGION_ID, REGION_NAME FROM CRT_REGION
WHERE END_DATE IS NULL
UNION ALL
SELECT REGION_ID, REGION_NAME FROM CRT_REGION
WHERE END_DATE IS NULL AND REGION_NAME = 'Headquarters'
ORDER BY REGION_NAME

***/

BEGIN TRANSACTION

IF OBJECT_ID('dbo.MAP_REGION', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_REGION;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_REGION
(
	LEGACY_ID numeric(9, 0) NOT NULL,
	CRT_ID numeric(9, 0) NOT NULL
)  ON [PRIMARY]

COMMIT
GO

BEGIN TRANSACTION
SET NOCOUNT ON

DECLARE @legacyId int, @codeId int;
DECLARE @legacyName nvarchar(255), @codeName varchar(255);
DECLARE @cmd nvarchar(max);

DECLARE rg_cursor CURSOR FOR
	SELECT tmr.ID, tmr.RegionShort, cr.REGION_ID, cr.REGION_NAME FROM 
	(SELECT ID, RegionShort,
	CASE WHEN ID = 6 THEN 0 -- ENG
		WHEN ID = 4 THEN 1 -- HQ
		WHEN ID = 3 THEN 2 -- NR
		WHEN ID = 1 THEN 3 -- SCR
		WHEN ID = 2 THEN 4 -- SIR
		ELSE 9 -- default in case
	END AS SORT
	FROM tblMOTIRegions
	WHERE Active = 1) as tmr
	LEFT JOIN
	(SELECT REGION_ID, REGION_NAME, ROW_NUMBER() OVER( ORDER BY REGION_NAME ) AS SORT FROM CRT_REGION
	WHERE END_DATE IS NULL
	UNION ALL
	SELECT REGION_ID, REGION_NAME, 0 AS SORT FROM CRT_REGION
	WHERE END_DATE IS NULL AND REGION_NAME = 'Headquarters') AS cr
	ON cr.SORT = tmr.SORT
	ORDER BY cr.REGION_NAME, tmr.RegionShort

OPEN rg_cursor

WHILE 1 = 1
BEGIN
	FETCH NEXT FROM rg_cursor into @legacyId, @legacyName, @codeId, @codeName;

	IF @@FETCH_STATUS <> 0
	BEGIN
		BREAK;
	END;
	
	--INSERT INTO MAP_REGION VALUES (6, 1);  --Headquarters > ENG

	SET @cmd = N'INSERT INTO MAP_REGION VALUES (' + CAST(@legacyId AS varchar) + ', ' + CAST(@codeId AS varchar) + '); --' + @codeName;

	PRINT @cmd;
	EXEC sp_executesql @cmd;
END;

CLOSE rg_cursor
DEALLOCATE rg_cursor

COMMIT
GO


DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) 
FROM tblMOTIRegions
WHERE Active = 1

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_REGION
WHERE END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_REGION

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT Region Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'

--SELECT * FROM MAP_REGION

BEGIN
	DECLARE @missing int;

	SELECT @missing = COUNT(*) 
	FROM tblProjects
	WHERE [MOTI Region] IN (SELECT ID FROM 
		(SELECT * FROM MAP_REGION mr
		RIGHT JOIN tblMOTIRegions tmr
		ON tmr.ID = mr.LEGACY_ID
		WHERE tmr.Active = 1) AS Region
		WHERE LEGACY_ID IS NULL)

	PRINT 'Found ' + CONVERT(varchar, @missing) + ' Projects linked to un-mapped Regions'
END

/*
-- Should find zero!

SELECT [MOTI Region], *
FROM tblProjects
	WHERE [MOTI Region] IN (SELECT ID FROM 
		(SELECT * FROM MAP_REGION mr
		RIGHT JOIN tblMOTIRegions tmr
		ON tmr.ID = mr.LEGACY_ID
		WHERE tmr.Active = 1) AS Region
		WHERE LEGACY_ID IS NULL)
*/
