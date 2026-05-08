---
source: [02 - Calculate Project Extent](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302824/02+-+Calculate+Project+Extent)
last_updated: 2026-05-08
---

# 02 - Calculate Project Extent

The ratio calculation needs only query polygons which are touched by segments. To get only those polygons, the spatial extent, alternatively known as the Bounding Box (BBOX) or the Minimum Bounding Rectangle (MBR) is used to query each layer of interest to obtain the list of "polygons of interest".

### BBOX via GeoServer Query

#### URL EndPoint:

- MoTI's Internal Spatial Service. Proxied in CRT as /ogs-internal/ows

#### URL Parameters:

- service=WFS
- version=2.0.0
- request=GetFeature
- outputFormat=application/json
- typeName=crt:SEGMENT_RECORD
- cql_filter=project_id={{PROJECT_ID}} - for the project of interest

##### Example

`https://devoas4.apps.th.gov.bc.ca/ogs-geoV06/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=crt%3ASEGMENT_RECORD&outputFormat=application%2Fjson&cql_filter=project_id=6`

##### All Project Segments Response

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "SEGMENT_RECORD.fid-...",
      "geometry": {"type": "LineString", "coordinates": [...]},
      "geometry_name": "geometry",
      "properties": {
        "project_name": "123",
        "segment_id": 13,
        "project_id": 6,
        "description": "Island Hwy near Sheppard Rd",
        "bbox": [-123.56463, 48.6651, -123.55946, 48.67579]
      }
    }
  ],
  "totalFeatures": 4,
  "numberMatched": 4,
  "numberReturned": 4,
  "bbox": [48.6651, -123.81775, 49.20927, -121.70794]
}
```

From this response we are ONLY interested in the **bbox** object.

**bbox** is comprised of **[MinX,MinY,MaxX,MaxY]**

### BBOX via SQL Query

As there is no spatial aggregate function in MS SQL, the following series of statements are required.

Calculate spatial extent of all segments = AllSegmentBBox

```sql
MinX = SELECT MIN(S.GEOMETRY.STBoundary().STGeometryN(1).STX) FROM dbo.CRT_SEGMENT S WHERE PROJECT_ID = {{PROJECT_ID}}
MinY = SELECT MIN(S.GEOMETRY.STBoundary().STGeometryN(1).STY) FROM dbo.CRT_SEGMENT S WHERE PROJECT_ID = {{PROJECT_ID}}
MaxX = SELECT MAX(S.GEOMETRY.STBoundary().STGeometryN(2).STX) FROM dbo.CRT_SEGMENT S WHERE PROJECT_ID = {{PROJECT_ID}}
MaxY = SELECT MAX(S.GEOMETRY.STBoundary().STGeometryN(2).STY) FROM dbo.CRT_SEGMENT S WHERE PROJECT_ID = {{PROJECT_ID}}
```

```
AllSegmentBBox = MinX,MinY,MaxX,MaxY
example '-125.20585,48.93954,-118.45954,52.88382'
```
