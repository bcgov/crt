/*** Script to retrieve data from legacy tables 
	and map that data to the new CRT code lookup
	tables.

-- retrieve values from Legacy table
SELECT ID, [Geo Region Name] FROM tblRegions
ORDER BY [Geo Region Name]

--retrieve values from CRT Code Table
SELECT CODE_LOOKUP_ID, CODE_NAME FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'ECONOMIC_REGION'
AND END_DATE IS NULL
ORDER BY CODE_NAME

***/

BEGIN TRANSACTION

IF OBJECT_ID('dbo.MAP_ECONOMIC_REGION', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_ECONOMIC_REGION;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_ECONOMIC_REGION
(
	LEGACY_ID numeric(9, 0) NOT NULL,
	CRT_ID numeric(9, 0) NOT NULL
)  ON [PRIMARY]

COMMIT
GO

BEGIN TRANSACTION

INSERT INTO MAP_ECONOMIC_REGION VALUES (5, 520);  --Cariboo > Cariboo
INSERT INTO MAP_ECONOMIC_REGION VALUES (3, 521);  --Kootenays > Kootenay
INSERT INTO MAP_ECONOMIC_REGION VALUES (1, 518);  --Lower Mainland > Lower Mainland/Southwest
INSERT INTO MAP_ECONOMIC_REGION VALUES (6, 523);  --North Central > Nechako
INSERT INTO MAP_ECONOMIC_REGION VALUES (7, 524);  --North East > North Coast
INSERT INTO MAP_ECONOMIC_REGION VALUES (8, 525);  --North West > Northeast
INSERT INTO MAP_ECONOMIC_REGION VALUES (9, 517);  --Province > Province
INSERT INTO MAP_ECONOMIC_REGION VALUES (4, 519);  --Thompson Okanagan > Thompson Okanagan
INSERT INTO MAP_ECONOMIC_REGION VALUES (2, 522);  --Vancouver Island > Vancouver Island and Coast

COMMIT
GO

DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) 
FROM tblRegions

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'ECONOMIC_REGION'
AND END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_ECONOMIC_REGION

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT CodeLookup Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'

--SELECT * FROM MAP_ECONOMIC_REGION

BEGIN
	DECLARE @missing int;

	SELECT @missing = COUNT(*) 
	FROM tblEconRegionRatio
	WHERE EconRegion IN (SELECT ID FROM 
		(SELECT * FROM MAP_ECONOMIC_REGION mer
		RIGHT JOIN tblRegions tr
		ON tr.ID = mer.LEGACY_ID) AS Regions
		WHERE LEGACY_ID IS NULL)

	PRINT 'Found ' + CONVERT(varchar, @missing) + ' Project Accomplishments linked to un-mapped QtyAccomp'
END

/*
-- Should be zero

SELECT *
FROM tblEconRegionRatio
WHERE EconRegion IN (SELECT ID FROM 
	(SELECT * FROM MAP_ECONOMIC_REGION mer
	RIGHT JOIN tblRegions tr
	ON tr.ID = mer.LEGACY_ID) AS Regions
	WHERE LEGACY_ID IS NULL)
*/