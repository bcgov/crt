/*** Scripts to retrieve data, inject into appropriate worksheet of excel workbook ./Mapping.xslx

-- retrieve values from Legacy table
SELECT ID, Category FROM tblCategories
WHERE Active = 1
ORDER BY CASE
	WHEN ID = 1 THEN 1 -- capital
	WHEN ID = 2 THEN 2 -- preservation
	WHEN ID = 6 THEN 3 -- stimulus
	WHEN ID = 3 THEN 4 -- transit
	WHEN ID = 4 THEN 5
	ELSE 9 -- default in case
END

--retrieve values from CRT Code Table
SELECT CODE_LOOKUP_ID, CODE_NAME FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'PROGRAM_CATEGORY'
AND END_DATE IS NULL
ORDER BY CODE_NAME

***/

BEGIN TRANSACTION

IF OBJECT_ID('dbo.MAP_PROGRAM_CATEGORY', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_PROGRAM_CATEGORY;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_PROGRAM_CATEGORY
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

DECLARE pc_cursor CURSOR FOR
	SELECT tc.ID, tc.Category, ccl.CODE_LOOKUP_ID, ccl.CODE_NAME FROM 
	(SELECT ID, Category,
	CASE WHEN ID = 1 THEN 2 -- capital
		WHEN ID = 2 THEN 4 -- preservation
		WHEN ID = 6 THEN 3 -- stimulus
		WHEN ID = 3 THEN 1 -- transit
		WHEN ID = 4 THEN 5 -- other
		ELSE 9 -- default in case
	END AS SORT
	FROM tblCategories
	WHERE Active = 1) AS tc
	LEFT JOIN
	(SELECT CODE_LOOKUP_ID, CODE_NAME, ROW_NUMBER() OVER( ORDER BY CODE_NAME ) AS SORT
	FROM CRT_CODE_LOOKUP
	WHERE CODE_SET = 'PROGRAM_CATEGORY'
	AND END_DATE IS NULL) AS ccl
	ON tc.SORT = ccl.SORT
	ORDER BY CODE_NAME, tc.SORT

OPEN pc_cursor

WHILE 1 = 1
BEGIN
	FETCH NEXT FROM pc_cursor into @legacyId, @legacyName, @codeId, @codeName;

	IF @@FETCH_STATUS <> 0
	BEGIN
		BREAK;
	END;
	
	--INSERT INTO MAP_PROGRAM_CATEGORY VALUES (1, 890);  --Capital Expansion > Capital

	SET @cmd = N'INSERT INTO MAP_PROGRAM_CATEGORY VALUES (' + CAST(@legacyId AS varchar) + ', ' + CAST(@codeId AS varchar) + '); --' + @codeName;

	PRINT @cmd;
	EXEC sp_executesql @cmd;
END;

CLOSE pc_cursor
DEALLOCATE pc_cursor

COMMIT
GO


DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) 
FROM tblCategories
WHERE Active = 1

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'PROGRAM_CATEGORY'
AND END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_PROGRAM_CATEGORY

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT CodeLookup Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'
