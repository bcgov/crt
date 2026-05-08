---
source: [GeoServer Query (POST)](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302807/GeoServer+Query+POST)
last_updated: 2026-05-08
---

# GeoServer Query (POST)

## GeoServer Query (POST):

Summary: This spatial operation is not supported in MS SQL server, but is in Oracle. This query takes a line string and a polygon and returns the clipped segment of the line inside that polygon, the length of the clipped line and the length of the original line. It requires SM headers of an account with membership to TRAN ALL.

1. Modify the GeoServer XML Query Packet by replacing the following template variables with values:

- `{{lineXY}}` - Comma delimited x/y coordinate pairs with comma escaped with a `\` (i.e. -117.54330771\,50.6519965\,-117.543310\,50.6520....)
- `{{lineSRID}}` - The spatial reference system which the line coordinates is provided in (i.e. 4326)
- `{{polyXY}}` - Comma delimited x/y coordinate pairs with comma escaped with a `\`
- `{{polySRID}}` - The spatial reference system which the polygon coordinates is provided in (i.e. 4326)

##### GeoServer XML Query Packet Template

```xml
<?xml version="1.0" encoding="UTF-8" ?><wfs:GetFeature service="WFS" version="1.1.0" outputFormat="json" maxFeatures="1"
viewParams="lineSRID:{{lineSRID}};
lineXY:{{lineXY}};
polySRID:{{polySRID}};
polyXY:{{polyXY}}"
xmlns:topp="http://www.openplans.org/topp"
xmlns:wfs="http://www.opengis.net/wfs"
xmlns="http://www.opengis.net/ogc"
xmlns:gml="http://www.opengis.net/gml"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-basic.xsd">
<wfs:Query typeName="iss:ISS_LINE_WITHIN_POLYGON"/>
</wfs:GetFeature>
```

2. POST the XML packet to the proxied **ogs-internal/wfs** endpoint.

3. Expect the following JSON result:

##### No Overlap Example

When the segment does not intersect the polygon (`CLIPPED_LENGTH_KM: null`):

```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": null,
    "geometry_name": "CLIPPED_LINE",
    "properties": {
      "SRID": null,
      "COMPLETE_LENGTH_KM": 1.69012622120398,
      "CLIPPED_LENGTH_KM": null
    }
  }],
  "totalFeatures": 1
}
```

##### Segment Overlaps Polygon Example

When the segment intersects the polygon, the response includes `CLIPPED_LENGTH_KM` with a value and a `CLIPPED_LINE` geometry representing the portion of the segment within the polygon.
