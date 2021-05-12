/*** Script to retrieve data from legacy tables 
	and map that data to the new CRT code lookup
	tables.

-- retrieve values from Legacy table
SELECT ID, [Town Name] 
FROM tblTowns
WHERE ID NOT IN (3, 121)
ORDER BY [Town Name]

--retrieve values from CRT Code Table
SELECT CODE_LOOKUP_ID, CODE_NAME 
FROM CRT_CODE_LOOKUP 
WHERE CODE_SET = 'NEARST_TWN'
ORDER BY CODE_NAME

***/

BEGIN TRANSACTION
IF OBJECT_ID('dbo.MAP_NEAREST_TWN', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_NEAREST_TWN;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_NEAREST_TWN
(
	LEGACY_ID numeric(9, 0) NOT NULL,
	CRT_ID numeric(9, 0) NOT NULL
)  ON [PRIMARY]

COMMIT
GO

BEGIN TRANSACTION
SET NOCOUNT ON;

/*** Generated Inserts Go Here ***/

/*** END: Generated Inserts ***/

COMMIT
GO

DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) FROM tblTowns

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'NEARST_TWN'
AND END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_NEAREST_TWN

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT CodeLookup Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'

--SELECT * FROM MAP_NEAREST_TWN

BEGIN
	DECLARE @missing int;

	SELECT @missing = COUNT(*) 
	FROM tblProjects tp
	JOIN tblTowns town
	ON town.ID = tp.[Nearest Town]
	WHERE [Nearest Town] IN (SELECT ID FROM 
		(SELECT * FROM MAP_NEAREST_TWN mnt
		RIGHT JOIN tblTowns tt
		ON tt.ID = mnt.LEGACY_ID) AS NearestTown
		WHERE LEGACY_ID IS NULL)
	AND [Town Name] IS NOT NULL

	PRINT 'Found ' + CONVERT(varchar, @missing) + ' Projects linked to un-mapped Nearest Town'
END

/*
-- should be zero, as we filtered out those with NULL town name

SELECT town.ID, town.[Town Name], tp.*
FROM tblProjects tp
JOIN tblTowns town
ON town.ID = tp.[Nearest Town]
WHERE [Nearest Town] IN (SELECT ID FROM 
	(SELECT * FROM MAP_NEAREST_TWN mnt
	RIGHT JOIN tblTowns tt
	ON tt.ID = mnt.LEGACY_ID) AS NearestTown
	WHERE LEGACY_ID IS NULL)
AND [Town Name] IS NOT NULL
*/

