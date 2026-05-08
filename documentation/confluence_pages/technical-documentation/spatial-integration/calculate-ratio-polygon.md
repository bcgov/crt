---
source: [04 - Calculate Ratio for each Polygon of Interest](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302828/04+-+Calculate+Ratio+for+each+Polygon+of+Interest)
last_updated: 2026-05-08
---

# 04 - Calculate Ratio for each Polygon of Interest

The following is repeated for each Boundary type.

In other words, the Boundary(i..n) list below, must be populated four times. Once for each of: Electoral Districts, Service Areas, MoTI Districts and Economic Region.

```
For each Boundary(i, where i=1..n)
```

For each Segment(j where j=1..m)

calculate the length of Segment(j) within Boundary(i) (see JavaScript snippet below) and add that length to the SumOfSegmentLengthsInBoundary(i)

Ratio in Boundary(i) = SumOfSegmentLengthsInBoundary(i)/SumOfAllSegmentLengths

### Javascript Implementation

This is a JavaScript implementation of calling the calculation:

```javascript
lineXY = lineFeature.getGeometry().getCoordinates().toString().replaceAll(/,/g,'\\,');
polyXY = app.plugins.Identify2Tab.featureStore[0].values_.geometry.flatCoordinates.toString().replaceAll(/,/g,'\\,');

// Define the callback function that runs the aggregator after each layer returns a result
var callback = function(polygon, response){
  spinner.stop();
  var totalLength = response.features[0].properties.COMPLETE_LENGTH_KM
  var clipLength = response.features[0].properties.CLIPPED_LENGTH_KM
  var percentResult = (clipLength/totalLength)*100
  alert("This much: " + percentResult.toString());
}

// populate the template
var template = '<?xml version="1.0" encoding="UTF-8" ?><wfs:GetFeature service="WFS" version="1.1.0" outputFormat="json" maxFeatures="1"' +
  ' viewParams="lineSRID:'+lineSRID+';' +
  'lineXY:'+lineXY+';' +
  'polySRID:'+polySRID+';' +
  'polyXY:'+polyXY+'"' +
  ' xmlns:topp="http://www.openplans.org/topp"' +
  ' xmlns:wfs="http://www.opengis.net/wfs"' +
  ' xmlns="http://www.opengis.net/ogc"' +
  ' xmlns:gml="http://www.opengis.net/gml"' +
  ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
  ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-basic.xsd">' +
  '<wfs:Query typeName="iss:ISS_LINE_WITHIN_POLYGON"/>' +
  '</wfs:GetFeature>';

// Issue the request
$.ajax({
  type: "POST",
  url: returnEnvironmentUrl("ogs-internal") + "/wfs",
  dataType: "json",
  contentType: "text/xml",
  data: template,
  timeout: 15000
})
// Handle the response
.done(function(response) {
  callback(polygon, response);
})
// Handle a failure
.fail(function(jqxhr, settings, exception) {
  callback(polygon, exception);
  logger("ERROR", "GetRatios: Error querying "+exception);
});
```

This method is properly documented in the GeoServer Post.
