---
source: [DataBC Spatial Services](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302802/DataBC+Spatial+Services)
last_updated: 2026-05-08
---

# DataBC Spatial Services

## CRT Use Case

CRT uses DataBC's Spatial Services as follows:

- To display relevant context in a map setting. CRT map client makes requests of the form:
  - `https://openmaps.gov.bc.ca/geo/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=pub%3AWHSE_BASEMAPPING.DRA_DGTL_ROAD_ATLAS_MPAR_SP&CRS=EPSG%3A3857&...`

- The specific layers are:
  - The Digital Road Atlas (DRA) also known as the Integrated Transportation Network (ITN). This is also a display of the data used by the Route Planner tool to generate CRT Project Segments. Layer name is `pub:WHSE_BASEMAPPING.DRA_DGTL_ROAD_ATLAS_MPAR_SP`
  - Current BC Electoral districts. Layer name is `pub:WHSE_ADMIN_BOUNDARIES.EBC_PROV_ELECTORAL_DIST_SVW`
  - Census Economic Regions. Layer name is `pub:WHSE_HUMAN_CULTURAL_ECONOMIC.CEN_ECONOMIC_REGIONS_SVW`

- To calculate the project ratios based on length of Project Segments which fall into Electoral Districts and Economic Regions.
