/*** Scripts to retrieve data, inject into appropriate worksheet of excel workbook ./Mapping.xslx

-- retrieve values from Legacy table
SELECT ID, [Accomplishment Type] FROM tblAccomplishments
WHERE Active = 1 
OR ID = 30	-- 30 is inactive but referened by accomplishments table
ORDER BY [Accomplishment Type]

--retrieve values from CRT Code Table
SELECT CODE_LOOKUP_ID, CODE_NAME FROM CRT_CODE_LOOKUP
WHERE (CODE_SET = 'ACCOMPLISHMENT' OR CODE_SET = 'QUANTITY')
AND END_DATE IS NULL
ORDER BY CODE_NAME

***/

BEGIN TRANSACTION
IF OBJECT_ID('dbo.MAP_ACCOMPLISHMENT', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_ACCOMPLISHMENT;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_ACCOMPLISHMENT
(
	LEGACY_ID numeric(9, 0) NOT NULL,
	CRT_ID numeric(9, 0) NOT NULL
)  ON [PRIMARY]

COMMIT
GO

BEGIN TRANSACTION
SET NOCOUNT ON;

/*** Generated Inserts Go Here ***/

/***END: Generated Inserts ***/

COMMIT
GO

DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) 
FROM tblAccomplishments
WHERE Active = 1

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'ACCOMPLISHMENT'
AND END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_ACCOMPLISHMENT

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT CodeLookup Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'

--SELECT * FROM MAP_ACCOMPLISHMENT

BEGIN
	DECLARE @missing int;

	SELECT @missing = COUNT(*) 
	FROM tblProjectAccomplishments 
    WHERE Accomplishment IN (SELECT ID FROM 
		(SELECT * FROM MAP_ACCOMPLISHMENT ma
		RIGHT JOIN tblAccomplishments ta
		ON ta.ID = ma.LEGACY_ID
		WHERE ta.Active = 1) AS QtyAccomp
		WHERE LEGACY_ID IS NULL)

	PRINT 'Found ' + CONVERT(varchar, @missing) + ' Project Accomplishments linked to un-mapped QtyAccomp'
END

/*
-- Found 7 Project Accomplishments linked to un-mapped QtyAccomp

SELECT *
  FROM tblProjectAccomplishments
WHERE Accomplishment IN (SELECT ID FROM 
(SELECT * FROM MAP_ACCOMPLISHMENT ma
RIGHT JOIN tblAccomplishments ta
ON ta.ID = ma.LEGACY_ID
WHERE ta.Active = 1) AS QtyAccomp
WHERE LEGACY_ID IS NULL)
*/
