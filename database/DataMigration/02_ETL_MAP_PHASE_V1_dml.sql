/*** Scripts to retrieve data, inject into appropriate worksheet of excel workbook ./Mapping.xslx

-- retrieve values from Legacy table
SELECT ID, [Project Phase Description] FROM tblProjectPhases
WHERE Active = 1
ORDER BY [Project Phase Description]

--retrieve values from CRT Code Table
SELECT CODE_LOOKUP_ID, CODE_NAME FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'PHASE'
AND END_DATE IS NULL
ORDER BY CODE_NAME

***/

BEGIN TRANSACTION

IF OBJECT_ID('dbo.MAP_PHASE', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_PHASE;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_PHASE
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

DECLARE ph_cursor CURSOR FOR
	SELECT 
	  ID
	  , [Project Phase Description]
	  , COALESCE(CODE_NAME, 'Engineer') AS CODE_NAME
	  , COALESCE(CODE_LOOKUP_ID, (SELECT CODE_LOOKUP_ID FROM CRT_CODE_LOOKUP WHERE CODE_NAME = 'Engineer')) AS CODE_LOOKUP_ID
	  FROM 
	(SELECT ID, [Project Phase Description] FROM tblProjectPhases
	WHERE Active = 1) AS tpp
	LEFT JOIN 
	(SELECT CODE_LOOKUP_ID, CODE_NAME FROM CRT_CODE_LOOKUP
	WHERE CODE_SET = 'PHASE'
	AND END_DATE IS NULL) AS ccl
	ON tpp.[Project Phase Description] = ccl.CODE_NAME
	ORDER BY CODE_NAME, tpp.[Project Phase Description]

OPEN ph_cursor

WHILE 1 = 1
BEGIN
	FETCH NEXT FROM ph_cursor into @legacyId, @legacyName, @codeName, @codeId;

	IF @@FETCH_STATUS <> 0
	BEGIN
		BREAK;
	END;
	
	--INSERT INTO MAP_CAP_INDX VALUES (6, 6);  --Capitalizable/Expense-Some components<15yrs

	SET @cmd = N'INSERT INTO MAP_PHASE VALUES (' + CAST(@legacyId AS varchar) + ', ' + CAST(@codeId AS varchar) + '); --' + @codeName;

	PRINT @cmd;
	EXEC sp_executesql @cmd;
END;

CLOSE ph_cursor
DEALLOCATE ph_cursor

COMMIT
GO


DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) 
FROM tblProjectPhases
WHERE Active = 1

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'PHASE'
AND END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_PHASE

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT CodeLookup Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'

--SELECT * FROM MAP_PHASE

BEGIN
	DECLARE @missing int;

	SELECT @missing = COUNT(*) 
	FROM tblProjects
	WHERE [Project Phase] IN (SELECT ID FROM 
		(SELECT * FROM MAP_PHASE mp
		RIGHT JOIN tblProjectPhases pp
		ON pp.ID = mp.LEGACY_ID
		WHERE pp.Active = 1) AS Phase
		WHERE LEGACY_ID IS NULL)

	PRINT 'Found ' + CONVERT(varchar, @missing) + ' Projects linked to un-mapped Phases'
END

/*
-- Should find zero!

SELECT *
FROM tblProjects
WHERE [Project Phase] IN (SELECT ID FROM 
	(SELECT * FROM MAP_PHASE mp
	RIGHT JOIN tblProjectPhases pp
	ON pp.ID = mp.LEGACY_ID
	WHERE pp.Active = 1) AS Phase
	WHERE LEGACY_ID IS NULL)
*/
