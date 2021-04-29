using System.Collections.Generic;
using NetTopologySuite.Simplify;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using GeoJSON.Net.Feature;

//kept in HttpClients project as it contains the GeoJSON and NetTopology references
namespace Crt.HttpClients
{
    public static class SpatialUtils
    {
        /***
         * 
         * */
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
