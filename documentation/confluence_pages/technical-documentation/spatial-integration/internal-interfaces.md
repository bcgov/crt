---
source: [Internal Interfaces](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302742/Internal+Interfaces)
last_updated: 2026-05-08
---

# Internal Interfaces

CRT internal interfaces

| # | Interface name | Type | Parameters | Response |
|---|---|---|---|---|
| 1 | iss:ISS_LINE_WITHIN_POLYGON | REST | SQL view to return the portion line that intersects the passed polygon geometry, the SRID of that line, as well as the length of the original line and the length of the clipped line in kilometres. Uses the following VIEWPARAMS: polySRID (EPSG of passed coordinates), polyXY (comma delimited list), lineSRID (EPSG of passed coordinates), lineXY (comma delimited list) | response.features[0].properties.COMPLETE_LENGTH_KM, response.features[0].properties.CLIPPED_LENGTH_KM |
