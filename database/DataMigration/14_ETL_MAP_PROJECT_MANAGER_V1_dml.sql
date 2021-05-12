/***
-- straight across copy of PM's in Legacy Access DB into CRT 

BEGIN TRANSACTION
SET NOCOUNT ON;

DECLARE @legacyId int, @itemCount int = 10;
DECLARE @legacyName nvarchar(255);

DECLARE pm_cursor CURSOR FOR
SELECT ID
	 , CASE WHEN [Full Name] IS NULL 
			THEN 'None' 
			ELSE REPLACE([Full Name], '''', '''''') 
		END AS legacyName 
FROM tblProjectManagers
WHERE Active = 1
ORDER BY [Full Name]

OPEN pm_cursor

WHILE 1 = 1
BEGIN
	FETCH NEXT FROM pm_cursor INTO @legacyId, @legacyName;

	IF @@FETCH_STATUS <> 0
	BEGIN
		BREAK;
	END;

	INSERT INTO CRT_CODE_LOOKUP (CODE_SET, CODE_NAME, CODE_VALUE_TEXT, CODE_VALUE_NUM, DISPLAY_ORDER, CODE_VALUE_FORMAT)
		VALUES ('PROJECT_MANAGER', @legacyName, NULL, NULL, @itemCount, 'STRING');
	
	SET @itemCount = @itemCount + 10;
END;

CLOSE pm_cursor;
DEALLOCATE pm_cursor;

COMMIT
GO

*/

/*** Scripts to retrieve data, inject into appropriate worksheet of excel workbook ./Mapping.xslx

-- retrieve values from Legacy table
SELECT ID, [Full Name] FROM tblProjectManagers
WHERE Active = 1
ORDER BY [Full Name]

--retrieve values from CRT Code Table
SELECT CODE_LOOKUP_ID, CODE_NAME FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'PROJECT_MANAGER'
AND END_DATE IS NULL
ORDER BY CODE_LOOKUP_ID

***/

BEGIN TRANSACTION

IF OBJECT_ID('dbo.MAP_PROJECT_MANAGER', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_PROJECT_MANAGER;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_PROJECT_MANAGER
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

DECLARE pm_cursor CURSOR FOR
	SELECT tpm.ID, tpm.[Full Name], ccl.CODE_LOOKUP_ID, ccl.CODE_NAME FROM
	(SELECT ID, [Full Name], ROW_NUMBER() OVER( ORDER BY [Full Name] ) AS SORT FROM tblProjectManagers
	WHERE Active = 1) tpm
	LEFT JOIN
	(SELECT CODE_LOOKUP_ID, CODE_NAME, ROW_NUMBER() OVER( ORDER BY CODE_LOOKUP_ID ) AS SORT FROM CRT_CODE_LOOKUP
	WHERE CODE_SET = 'PROJECT_MANAGER'
	AND END_DATE IS NULL) ccl
	ON ccl.SORT = tpm.SORT
	ORDER BY tpm.[Full Name], ccl.CODE_LOOKUP_ID

OPEN pm_cursor

WHILE 1 = 1
BEGIN
	FETCH NEXT FROM pm_cursor into @legacyId, @legacyName, @codeId, @codeName;

	IF @@FETCH_STATUS <> 0
	BEGIN
		BREAK;
	END;
	
	--INSERT INTO MAP_PROJECT_MANAGER VALUES (353, 925);  --Aaron Barrett > Aaron Barrett

	SET @cmd = N'INSERT INTO MAP_PROJECT_MANAGER VALUES (' + CAST(@legacyId AS varchar) + ', ' + CAST(@codeId AS varchar) + '); --' + @codeName;

	PRINT @cmd;
	EXEC sp_executesql @cmd;
END;

CLOSE pm_cursor
DEALLOCATE pm_cursor

COMMIT
GO


DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) 
FROM tblProjectManagers
WHERE Active = 1

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_CODE_LOOKUP
WHERE CODE_SET = 'PROJECT_MANAGER'
AND END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_PROJECT_MANAGER

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT CodeLookup Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'

--SELECT * FROM MAP_PROJECT_MANAGER

BEGIN
	DECLARE @missing int;

	SELECT @missing = COUNT(*) 
	FROM tblProjects
	WHERE [Project Manager] IN (SELECT ID FROM 
		(SELECT * FROM MAP_PROJECT_MANAGER mpm
		RIGHT JOIN tblProjectManagers tpm
		ON tpm.ID = mpm.LEGACY_ID
		WHERE tpm.Active = 1) AS PM
		WHERE LEGACY_ID IS NULL)

	PRINT 'Found ' + CONVERT(varchar, @missing) + ' Projects linked to un-mapped Project Managers'
END

/*
-- Should be Zero

SELECT [Project Manager], *
FROM tblProjects
WHERE [Project Manager] IN (SELECT ID FROM 
	(SELECT * FROM MAP_PROJECT_MANAGER mpm
	RIGHT JOIN tblProjectManagers tpm
	ON tpm.ID = mpm.LEGACY_ID
	WHERE tpm.Active = 1) AS PM
	WHERE LEGACY_ID IS NULL)

*/
