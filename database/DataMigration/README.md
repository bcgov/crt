# Mapping Access data to CRT data

How-To Map the CRTDB access database data into a CRT database.  
*NOTE: Assumes database scripts have been run up to version S06_05*

Manual mapping may or may not be needed, however it is advisable to perform it as the CRT databases on the different environments may, while unlikely have generated different ID's. If the CRT is newly created and the scripts match the assumed version above you can skip to this [section](#executing-the-map)

## Manual Mapping

A number of the Access tables will require some manual adjustment in order to perform the mapping, to help simplify this process there is a mapping.xslx spreadsheet that can be used. 

The following tables will require manual mapping adjustments, Project Manager just requires a script to be run to load the PM data.

|  | Access Table | CRT Table |
| --- | --- | --- |
| [Details](#mapping-tblaccomplishments) | tblAccomplishments | CRT_CODE_LOOKUP |
| [Details](#mapping-tbltowns) | tblTowns | CRT_CODE_LOOKUP |
| [Details](#mapping-tblprojectmanager) | tblProjectManager | CRT_CODE_LOOKUP |
<br>

### Mapping tblAccomplishments 

1. Open the Mapping workbook -> ./Mapping.xslx
2. Open the file ./01_ETL_MAP_QTY_ACCOMP_V1_dml.sql
3. Execute the following query to retrieve the legacy Access records
    ```sql
    SELECT ID, [Accomplishment Type] FROM tblAccomplishments
    WHERE Active = 1 
    OR ID = 30	-- 30 is inactive but referenced by the accomplishments table
    ORDER BY [Accomplishment Type]
    ```
4. Copy the results and paste them starting at Row 3 Col A (don't copy headers) into the **Qty-Accomp** sheet of the workbook
5. Execute the following query to retrieve the associated CRT code lookup records
    ```sql
    SELECT CODE_LOOKUP_ID, CODE_NAME FROM CRT_CODE_LOOKUP
    WHERE (CODE_SET = 'ACCOMPLISHMENT' OR CODE_SET = 'QUANTITY')
    AND END_DATE IS NULL
    ORDER BY CODE_NAME
    ```
6. Copy the results and paste them starting at Row 3 Col C (don't copy headers) into the **Qty-Accomp** sheet of the workbook
7. You'll notice there are more legacy entries than CRT ones. You'll need to make the following manual adjustments
    - The first mismatch should be ***GAS/Seal Coat (lane km)***. Highlight Col C & D of this row and Insert, Shift Cells Down
    - Enter in the values for ***Hwy - GAS/Seal Coat  (lane km)***  
    - The next mismatch will be ***GAS/Seal Coat (m2)***. Highlight Col C & D of this row and Insert, Shift Cells Down
    - Enter in the values for ***Hwy - GAS/Seal Coat  (m2)***  
    - The last mismatch will be ***Gravelled (m3)***. Highlight Col C & D of this row and Insert, Shift Cells Down
    - Enter in the values for ***Gravel in Stockpile  (m3)***  
  
    | Legacy Value | Updated CRT Value |
    | --- | --- |
    | GAS/Seal Coat (lane km) | Hwy - GAS/Seal Coat  (lane km) |
    | GAS/Seal Coat (m2) | Hwy - GAS/Seal Coat  (m2) |
    | Gravelled (m3) | Gravel in Stockpile  (m3) |

8. Once the mapping is corrected you must recopy the formula in Col E to allow it to re-evaluate. Hightlight Cell E3 and double click the bottom right corner.
9. Copy the generated SQL inserts and paste them into the _01_ETL_MAP_QTYACCOMP_V1_dml.sql_ file where the generated inserts go. (It's commented)

[Back to Top](#mapping-access-data-to-crt-data)
  


---
### Mapping tblTowns

1. Open the Mapping workbook -> ./Mapping.xslx
2. Open the file ./11_ETL_MAP_NEARESTTOWN_V1_dml.sql
3. Execute the following query to retrieve the legacy Access records
    ```sql
    SELECT ID, [Town Name] 
    FROM tblTowns
    WHERE ID NOT IN (3, 121)    --no null and - values
    ORDER BY [Town Name]
    ```
4. Copy the results and paste them starting at Row 3 Col A (don't copy headers) into the **NearestTown** sheet of the workbook
    5. Execute the following query to retrieve the associated CRT code lookup records
    ```sql
    SELECT CODE_LOOKUP_ID, CODE_NAME 
    FROM CRT_CODE_LOOKUP 
    WHERE CODE_SET = 'NEARST_TWN'
    ORDER BY CODE_NAME
    ```
6. Copy the results and paste them starting at Row 3 Col C (don't copy headers) into the **NearestTown** sheet of the workbook
7. You'll notice there are more legacy entries than CRT ones. You'll need to make the following manual adjustments
    Use the following table to make the adjustments as needed in order to get the values to line up. Most of the discrepencies are caused by duplicate values.
    Insert Cells where appropriate in order to map the duplicates
  

    
    | Duplicate Value |
    | --- |
    | Port Mcneill |
    | Surrey |
    | Vancouver | 
    | Various |
    | Williams Lake |

8. Check the value for Tête Jaune Cache, it was imported with a name of Tte Jaune Cache so appears lower in the Code Lookup list. Make the neccessary adjustment.
8. Once the mapping is corrected you must recopy the formula in Col E to allow it to re-evaluate. Hightlight Cell E3 and double click the bottom right corner.
9. Copy the generated SQL inserts and paste them into the **11_ETL_MAP_NEARESTTOWN_V1_dml.sql** file where the generated inserts go. (It's commented)

[Back to Top](#mapping-access-data-to-crt-data)
  


---
### Mapping tblProjectManager

1. Perform the insertion of the Program Manager data from the Access Database, this can be accomplished by executing the following script...
    ```sql
    -- straight across copy of PM's in Legacy Access DB into CRT 

    BEGIN TRANSACTION
    SET NOCOUNT ON;

    DECLARE @legacyId int, @itemCount int = 10;
    DECLARE @legacyName nvarchar(255);

    DECLARE pm_cursor CURSOR FOR
        SELECT ID, REPLACE([Full Name], '''', '''''') FROM tblProjectManagers
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
    ```
2. Execute the file ./14_ETL_MAP_PROJECT_MANAGER_V1_dml.sql

[Back to Top](#mapping-access-data-to-crt-data)
  


---
### Executing the Map


[Back to Top](#mapping-access-data-to-crt-data)
  


---