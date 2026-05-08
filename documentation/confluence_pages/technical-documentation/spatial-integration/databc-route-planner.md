---
source: [DataBC Route Planner](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302739/DataBC+Route+Planner)
last_updated: 2026-05-08
---

# DataBC Route Planner

## Obtaining CRT project segment geometry from the DataBC Route Planner

https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/route-planner

- Present user with map containing JavaScript tools to place two pins on the map. JavaScript calls DataBC Route Planner tool to return a line string.
- The DataBC Route Planner takes as input a start coordinate pair and an end coordinate pair and returns JSON which includes a "route" array of coordinate pairs representing the road centreline between the given start and end points.
- There might be some back and forth as the user adjusts the end points to get the correct representation of the project segment.
- At this point the web page application has a spatial representation of the project segment. This can either be:

  - Pushed directly to the MS SQL database via the .NET application; or
  - Sent via MoTI GeoServer, as is done in the HEDS application.

The saved segment, along with previously saved segments, would then be displayed on the map via MoTI GeoServer.

### Example request

```
https://router.api.gov.bc.ca/directions.json?criteria=shortest&points=-123.11980164036277%2C49.01394500068247%2C-123.07514873349294%2C49.039529918456594&roundTrip=false&apikey=<insert MoTI api key>
```

### Response

The response includes route description, distance (km), time, a route array of coordinate pairs, and turn-by-turn directions.

Key fields:
- `route`: Array of [lon, lat] coordinate pairs representing the road centreline
- `distance`: Total distance in km
- `time`: Travel time in seconds
- `directions`: Turn-by-turn navigation instructions

### Transportation Web Map (TWM)

MoTI's map framework example use of DataBC Router (See Router Tab):

https://dev-www.th.gov.bc.ca/twm/?c=default&lon=-123&lat=54.5&z=5&sb=1&
