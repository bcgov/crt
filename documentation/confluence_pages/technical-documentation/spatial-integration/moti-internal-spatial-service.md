---
source: [MoTI Internal Spatial Service (GeoServer)](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302800/MoTI+Internal+Spatial+Service+GeoServer)
last_updated: 2026-05-08
---

# MoTI Internal Spatial Service (GeoServer)

### GeoServer Environments

CRT map displays image and vector data from MoTI's Internal Spatial Service (often referred to as GeoServer). The requests are made through JavaScript libraries hosted in the browser client. Because the CRT application and the Spatial Service are hosted on different servers, the Spatial Service are proxied to avoid Cross Site Scripting (XSS) inhibitions in the browser. Requests of the form "ogs-internal" are proxied to Spatial Service endpoints of:

| Environment | URL |
|---|---|
| Development (DEV) | https://devoas4.apps.th.gov.bc.ca/ogs-geoV06 |
| Staging (STG - NA for CRT) | https://tstoas5.apps.th.gov.bc.ca/ogs-geoV06 |
| Test (TST) | https://tstoas5.apps.th.gov.bc.ca/ogs-geoV06 |
| User Acceptance Test (UAT) | https://tstoas5.apps.th.gov.bc.ca/ogs-geoV06 |
| Production (PRD) | https://prdoas5.apps.th.gov.bc.ca/ogs-geoV06 |

#### Notes

- *There are only three Spatial Service environments, so, staging (not used by CRT), uat and tst will be based on the same data*.
- *These URLs are hosted on the Oracle Application Server and are SiteMinder protected*.

### Project Segment Layer

Project Segments are displayed on the CRT map (once the firewall rules are corrected) as a **layer**.

The system components of this layer are:

- A Data Store, which is essentially a connection string to the CRT_<ENV> database via the APP_CRT_PROXY_OGS_READ userid.
- A Feature Type, which configures the SEGMENT_RECORD view as a layer.
- A Styled Layer Descriptor (SLD), which configures the colour, line width, labelling, etc. of the layer on the map display.

These components must exist in each environment.
