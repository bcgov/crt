/*** Scripts to retrieve data, inject into appropriate worksheet of excel workbook ./Mapping.xslx

-- retrieve values from Legacy table
SELECT ID, Code FROM tblElements
ORDER BY Code ASC

--retrieve values from CRT Code Table
SELECT ELEMENT_ID, CODE FROM CRT_ELEMENT 
WHERE END_DATE IS NULL
ORDER BY CODE ASC

***/

BEGIN TRANSACTION

IF OBJECT_ID('dbo.MAP_ELEMENT', 'U') IS NOT NULL
	DROP TABLE dbo.MAP_ELEMENT;
COMMIT
GO

BEGIN TRANSACTION

CREATE TABLE dbo.MAP_ELEMENT
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

DECLARE el_cursor CURSOR FOR
	SELECT te.ID, te.Code, ce.ELEMENT_ID, ce.CODE FROM 
	(SELECT ID, Code, ROW_NUMBER() OVER( ORDER BY CODE ) AS SORT FROM tblElements WHERE CODE <> 'Sl'
	UNION ALL
	SELECT ID, Code, 0 AS SORT FROM tblElements WHERE CODE = 'Sl') AS te
	LEFT JOIN
	(SELECT ELEMENT_ID, CODE, ROW_NUMBER() OVER( ORDER BY CODE ) AS SORT FROM CRT_ELEMENT 
	WHERE END_DATE IS NULL
	UNION ALL
	SELECT ELEMENT_ID, CODE, 0 FROM CRT_ELEMENT 
	WHERE END_DATE IS NULL AND CODE = 'Unknown') as ce
	ON ce.SORT = te.SORT
	ORDER BY te.SORT


OPEN el_cursor

WHILE 1 = 1
BEGIN
	FETCH NEXT FROM el_cursor into @legacyId, @legacyName, @codeId, @codeName;

	IF @@FETCH_STATUS <> 0
	BEGIN
		BREAK;
	END;
	
	--INSERT INTO MAP_ELEMENT VALUES (63, 4);  --At > At

	SET @cmd = N'INSERT INTO MAP_ELEMENT VALUES (' + CAST(@legacyId AS varchar) + ', ' + CAST(@codeId AS varchar) + '); --' + @legacyName + ' > ' + @codeName;

	PRINT @cmd;
	EXEC sp_executesql @cmd;
END;

CLOSE el_cursor
DEALLOCATE el_cursor

COMMIT
GO

DECLARE @legacyCnt int, @crtCnt int, @mappedCnt int;

-- retrieve values from Legacy table
SELECT @legacyCnt = COUNT(*) 
FROM tblElements
WHERE Active = 1

--retrieve values from CRT Code Table
SELECT @crtCnt = COUNT(*) 
FROM CRT_ELEMENT
WHERE END_DATE IS NULL

SELECT @mappedCnt = COUNT(*) 
FROM MAP_ELEMENT

PRINT CHAR(10) + 'Found ' + CONVERT(varchar, @legacyCnt) + ' Legacy Items and ' + CONVERT(varchar, @crtCnt) + ' CRT Element Items'
PRINT 'Mapped ' + CONVERT(varchar, @mappedCnt) + ' Total Items'

--SELECT * FROM MAP_ELEMENT

BEGIN
	DECLARE @missing int;

	SELECT @missing = COUNT(*) 
	FROM tblFinancialForecast
	WHERE Element IN (SELECT ID FROM 
		(SELECT * FROM MAP_ELEMENT me
		RIGHT JOIN tblElements te
		ON te.ID = me.LEGACY_ID) AS Element
		WHERE LEGACY_ID IS NULL)

	PRINT 'Found ' + CONVERT(varchar, @missing) + ' Projects linked to un-mapped Phases'
END

/*
-- There is an element missing.. ID: 46, Code: Sl, Desc: Unknown
-- Should find zero! 

SELECT *
FROM tblFinancialForecast
WHERE Element IN (SELECT ID FROM 
	(SELECT * FROM MAP_ELEMENT me
	RIGHT JOIN tblElements te
	ON te.ID = me.LEGACY_ID) AS Element
	WHERE LEGACY_ID IS NULL)
*/

