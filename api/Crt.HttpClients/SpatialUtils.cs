using System.Collections.Generic;
using System.Linq;
using NetTopologySuite.Simplify;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using GeoJSON.Net.Feature;

//kept in HttpClients project as it contains the GeoJSON and NetTopology references
namespace Crt.HttpClients
{
    public static class SpatialUtils
    {
        /// <summary>
        /// Utility function takes an array of coordinates and builds them 
        /// into a string with a limit of 250 coordinate pairs in a group. 
        /// The group is placed into a string array that is then returned 
        /// for processing.
        /// This is to deal with GeoServer only accepting a max of 500 
        /// coordinate pairs and also ensures we don't hit MAX post size.
        /// </summary>
        /// <param name="coordinates"></param>
        /// <returns></returns>
        public static List<string> BuildGeometryStringList(Coordinate[] coordinates)
        {
            var geometryGroup = new List<string>();
            var geometryLineString = "";
            var coordinateCount = 0;
            
            foreach (Coordinate coordinate in coordinates)
            {
                geometryLineString += coordinate.X + "\\," + coordinate.Y + "\\,";
                coordinateCount++;
                if (coordinateCount == 250 || (coordinate == coordinates.Last()))
                {
                    geometryGroup.Add(geometryLineString.Substring(0, geometryLineString.Length - 2));
                    geometryLineString = "";
                    coordinateCount = 0;
                }
            }

            if (coordinates.Count() > 1)
            {
                //check the last item to see if it's a single since the GeoServer queries expect
                // at least 2 pairs we'll need to make some adjustments if there is a group with 1 pair
                // this won't exceed the paramter limit since it's 1000 (500 pairs)
                var count = geometryGroup.Count();
                if (geometryGroup[count - 1].Count(g => g == ',') == 1)
                {
                    var lastGroup = geometryGroup[count - 1];
                    var secondLastGroup = geometryGroup[count - 2];
                    secondLastGroup += "\\," + lastGroup;   //append the previously last group to the 2nd last group text
                    geometryGroup[count - 2] = secondLastGroup; //update the second last group
                    geometryGroup.RemoveAt(count - 1);  //remove the last group
                }
            }

            return geometryGroup;
        }

        public static string BuildGeometryString(Coordinate[] coordinates)
        {
            string geometryString = "";
            var isPoint = (coordinates.Length == 1);

            foreach (Coordinate coordinate in coordinates)
            {
                geometryString += coordinate.X + "\\," + coordinate.Y;
                if (coordinate != coordinates.Last())
                {
                    geometryString += "\\,";
                }
            }

            //geometry strings being used in the line within polygon requires 2 points or the query throws an error
            // so we'll double up the coordinates making the line start and end at the same point
            if (isPoint)
                geometryString += "\\," + geometryString;

            return geometryString;
        }

        public static Geometry GenerateSimplifiedPolygonGeometryFromMultilineString(Feature feature, double distanceTolerance = 0.001)
        {
            Geometry geometry;

            /// See GenerateSimplifiedPolygonGeometry for more comments on what is happening in the simplify process
            var multilineString = feature.Geometry as GeoJSON.Net.Geometry.MultiLineString;
            var coordinates = new List<Coordinate>();
            List<LineString> lineStrings = new List<LineString>();

            foreach (var line in multilineString.Coordinates)
            {
                foreach (var coordinate in line.Coordinates)
                {
                    coordinates.Add(new Coordinate(coordinate.Longitude, coordinate.Latitude));
                }
                lineStrings.Add(new LineString(coordinates.ToArray()));
            }

            MultiLineString mls = new MultiLineString(lineStrings.ToArray());
            var polygonGeom = mls.Buffer(0.003) as Polygon;

            polygonGeom.Normalize();

            do
            {
                geometry = TopologyPreservingSimplifier.Simplify(polygonGeom, distanceTolerance);
                distanceTolerance += 0.001;
            } while (geometry.Coordinates.Length > 500);

            return geometry;
        }

        public static Geometry GenerateSimplifiedPolygonGeometryFromLineString(Feature feature, double distanceTolerance = 0.001)
        {
            /// See GenerateSimplifiedPolygonGeometry for more comments on what is happening in the simplify process
            Geometry geometry;

            var lineString = feature.Geometry as GeoJSON.Net.Geometry.LineString;
            var coordinates = new List<Coordinate>();
            
            foreach (var coordinate in lineString.Coordinates)
            {
                coordinates.Add(new Coordinate(coordinate.Longitude, coordinate.Latitude));
            }

            LineString ls = new LineString(coordinates.ToArray());
            var polygonGeom = ls.Buffer(0.003) as Polygon;

            polygonGeom.Normalize();

            do
            {
                geometry = TopologyPreservingSimplifier.Simplify(polygonGeom, distanceTolerance);
                distanceTolerance += 0.001;
            } while (geometry.Coordinates.Length > 500);

            return geometry;
        }

        public static Geometry GenerateSimplifiedPolygonGeometry(Feature feature, double distanceTolerance = 0.001)
        {
            //* we'll pull out the rings and coordinates out and create a new collection
            //* of coordinates that we can then put into a NetTopology geometry object
            
            Geometry geometry;
            
            //  cast the feature geometry as a GeoJSON Polygon
            var polygon = feature.Geometry as GeoJSON.Net.Geometry.Polygon;
            var coordinates = new List<Coordinate>();

            foreach (var ring in polygon.Coordinates)
            {
                foreach (var coordinate in ring.Coordinates)
                {
                    coordinates.Add(new Coordinate(coordinate.Longitude, coordinate.Latitude));
                }
            }

            //generate the new NTS polygon & linear ring
            var polygonGeom = new Polygon(new LinearRing(coordinates.ToArray()));

            //normalize the polygon, converting it to the canonical form and ordering the 
            // coordinates within, this will help smooth the simplification process creating
            // less holes/overlap
            polygonGeom.Normalize();

            //we need the number of geomeotric pairs to be under 500 as there is a 1000 parameter limit on 
            // the GeoServer Oracle DB. We'll do the simplification and then adjust the distance tolerance
            // until this achieved
            do
            {
                //while DouglasPeucker is faster, topologypreserving works better for irregular shaped polygons
                /*var geometry = DouglasPeuckerSimplifier.Simplify(polygonGeom, 0.005);*/
                
                // the tolerance is how far from the original the simplification can be done, in Meters 
                // Lower number will result in more coordinates but closer representation of the original shape
                geometry = TopologyPreservingSimplifier.Simplify(polygonGeom, distanceTolerance);
                distanceTolerance += 0.001;
            } while (geometry.Coordinates.Length > 500);

            return geometry;
        }

        public static FeatureCollection ParseJSONToFeatureCollection(string jsonContent)
        {
            //create NTS JSON reader
            var reader = new GeoJsonReader();

            // pass the geoJSON to the reader and cast return to FeatureCollection
            var fc = reader.Read<FeatureCollection>(jsonContent);

            // fail out if no featureCollection
            if (fc == null)
                return null;
            else
                return fc;
        }
    }
}
