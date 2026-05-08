---
source: [01 - Calculate Segment Lengths](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302818/01+-+Calculate+Segment+Lengths)
last_updated: 2026-05-08
---

# 01 - Calculate Segment Lengths

## Project Ratios Calculation

### Algorithm

For each segment in the project, calculate and save its length.

Sum the Total length of all segments = SumOfAllSegmentLengths

(SQL Server has a STLength() function but I'm not sure if the results are useful.

I recommend that the [GeoServer Query Post](https://moti-imb.atlassian.net/wiki/pages/viewpage.action?pageId=102302807) method be called with each line segment to obtain each length. It can be sent an arbitrary polygon which will never overlap a segment.

#### Line Length Post Query Example

Note: this line, from the DataBC router has a driven distance of 11.967 km

- lineXY:-122.39013\,49.0614\,-122.39311\,49.06257\,-122.41412\,49.07085\,...,-122.53062\,49.11666
- lineSRID:4326

Note: this polygon is in the ocean and should never intersect any segment

- polyXY:-140.58\,47.033\,-140.58\,47.043\,-140.48\,47.043\,-140.48\,47.033\,-140.58\,47.033
- polySRID:4326

Note: this URL is proxied by CRT to MoTI's internal geoserver

- URL: ogs-internal/wfs

##### POST body

```xml
<?xml version="1.0" encoding="UTF-8" ?><wfs:GetFeature service="WFS" version="1.1.0" outputFormat="json" maxFeatures="1"
viewParams="lineSRID:4326;
polySRID:4326;
lineXY:-122.39013\,49.0614\,...,-122.53062\,49.11666;
polyXY:-140.58\,47.033\,-140.58\,47.043\,-140.48\,47.043\,-140.48\,47.033\,-140.58\,47.033"
xmlns:topp="http://www.openplans.org/topp"
xmlns:wfs="http://www.opengis.net/wfs"
xmlns="http://www.opengis.net/ogc"
xmlns:gml="http://www.opengis.net/gml"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-basic.xsd">
<wfs:Query typeName="iss:ISS_LINE_WITHIN_POLYGON"/>
</wfs:GetFeature>
```

#### Response

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "ISS_LINE_WITHIN_POLYGON.fid-2729b86f_178ad5a832f_-8000",
      "geometry": null,
      "geometry_name": "CLIPPED_LINE",
      "properties": {
        "SRID": null,
        "COMPLETE_LENGTH_KM": 11.9611411437511,
        "CLIPPED_LENGTH_KM": null
      }
    }
  ],
  "totalFeatures": 1,
  "numberMatched": 1,
  "numberReturned": 1,
  "timeStamp": "2021-04-07T17:21:33.529Z",
  "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::404000"}}
}
```

The attribute of interest is:

`features[0].properties.COMPLETE_LENGTH_KM`

which, in this example is: 11.961 km
