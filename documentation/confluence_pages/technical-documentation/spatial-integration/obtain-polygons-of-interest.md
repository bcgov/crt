---
source: [03 - Obtain the Polygons of Interest](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302822/03+-+Obtain+the+Polygons+of+Interest)
last_updated: 2026-05-08
---

# 03 - Obtain the Polygons of Interest

### Boundaries

For each Boundary type of Electoral Districts, Service Areas, MoTI Districts and Economic Region, collect the geometry and an identifying attribute of each polygon in the vicinity of the segments. The identifying attributes are required to match to the Ratio record in the database.

| Boundary of Interest | Identifying Attribute |
|---|---|
| Electoral District | ED_ABBREVIATION |
| MoTI Service Area | CONTRACT_AREA_NUMBER |
| MoTI District | DISTRICT_NUMBER |
| Economic Region | ECONOMIC_REGION_NAME |

**Boundary** is one of `{'pub:WHSE_ADMIN_BOUNDARIES.EBC_PROV_ELECTORAL_DIST_SVW','hwy:DSA_CONTRACT_AREA','hwy:DSA_DISTRICT_BOUNDARY','pub:WHSE_HUMAN_CULTURAL_ECONOMIC.CEN_ECONOMIC_REGIONS_SVW'}`

There are two URL endpoints required to obtain the Polygons.

#### URL EndPoints:

- DataBC for Electoral Districts and Economic Regions: https://openmaps.gov.bc.ca/geo/ows
- MoTI's Internal Spatial Service for Service Areas (aka Contract Areas) and Districts. Proxied in CRT as /ogs-internal/ows

#### URL Parameters:

- service=WFS
- version=2.0.0
- request=GetFeature
- outputFormat=application/json
- typeName={{Boundary}}
- bbox={{AllSegmentBBox}}

#### Example Call Electoral Districts:

`https://openmaps.gov.bc.ca/geo/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=pub%3AWHSE_ADMIN_BOUNDARIES.EBC_PROV_ELECTORAL_DIST_SVW&outputFormat=application%2Fjson&bbox=-125.20585,48.93954,-118.45954,52.88382`

*Response contains GeoJSON FeatureCollection with Electoral District polygons intersecting the bounding box, including ED_ABBREVIATION identifying attribute.*

#### Example Call Service Areas:

*Uses MoTI Internal Spatial Service with hwy:DSA_CONTRACT_AREA typeName and same bbox parameter.*

*Response contains GeoJSON FeatureCollection with Service Area polygons including CONTRACT_AREA_NUMBER identifying attribute.*
