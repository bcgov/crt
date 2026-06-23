# Step 3 — SQL / Database Script Analysis Findings

## Files Scanned

All 61 SQL files in the `database/` directory:
- `database/S*.sql` — DDL schema and DML seed/migration scripts
- `database/DataMigration/*.sql` (14 ETL migration scripts)

---

## Findings

### DB-001 — Dynamic SQL via `sp_executesql` with `CAST` of Integer Values in ETL Scripts

| Field | Value |
|---|---|
| **ID** | DB-001 |
| **Severity** | **Low** — Values are database-sourced integers; not exploitable from external input |
| **Category** | Informational |
| **Location** | `database/DataMigration/02_ETL_MAP_PHASE_V1_dml.sql`, line 73 (and 13 similar scripts) |
| **OWASP** | A03:2021 – Injection |
| **CWE** | CWE-89 – SQL Injection (informational only — not confirmed exploitable) |

**Evidence:**
```sql
-- database/DataMigration/02_ETL_MAP_PHASE_V1_dml.sql, lines 70-73
SET @cmd = N'INSERT INTO MAP_PHASE VALUES (' 
    + CAST(@legacyId AS varchar) + ', ' 
    + CAST(@codeId AS varchar) + '); --' + @codeName;
EXEC sp_executesql @cmd;
```

**Description:** The ETL migration scripts build dynamic SQL strings using `CAST` of cursor-fetched integer IDs and string names from internal database tables. The values come from legacy database cursors (`tblProjectPhases`, `CRT_CODE_LOOKUP`), not from user input or external APIs. `@legacyId` and `@codeId` are `int`/`numeric` types, so SQL injection via these fields is not possible. `@codeName` is appended as a comment (`--`), which is also benign.

**Impact:** No exploitation risk in the current context. These are one-time ETL migration scripts. However, the pattern of dynamic SQL construction is an anti-pattern that should be avoided in any future scripts.

**Recommendation:** For data migration scripts, prefer static parameterised INSERT statements or set-based INSERT...SELECT patterns rather than cursor-based dynamic SQL. This eliminates the risk if the data source ever becomes less trusted.

---

## No Issues Found

The following patterns were checked across all 61 SQL files with no issues found:

- **`GRANT ALL`**: No overly broad privilege grants found. Permission grants are role-specific.
- **Hardcoded passwords or credentials**: No password literals found in any SQL script.
- **Dynamic SQL with string variables**: The `sp_executesql` calls use `CAST` of typed integer/numeric columns only; no `nvarchar` user data is interpolated into SQL command text (the `@codeName` appended as `--` comment is safe).
- **Privilege escalation patterns**: No `EXECUTE AS`, `WITH GRANT OPTION` on sensitive objects, or `sysadmin` role grants found.
- **Sensitive data in seed scripts**: Seed/lookup data contains code names and configuration values only — no PII, credentials, or connection strings.
- **Row-level security**: The application uses application-level region authorization (enforced in C# controllers via `IsRegionIdAuthorized`). No database-level row security policies are present, which is acceptable given the application enforces access at the API layer.
