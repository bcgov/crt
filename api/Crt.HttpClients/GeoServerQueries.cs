using System.IO;
using System.Reflection;

namespace Crt.HttpClients
{
    public class GeoServerQueries
    {
        private string _lineWithinPolygonQuery;
        public string LineWithinPolygonQuery
        {
            get
            {
                var folder = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "XmlTemplates");
                return _lineWithinPolygonQuery ?? (_lineWithinPolygonQuery = File.ReadAllText(Path.Combine(folder, "ISSLineWithinPolygon.xml")));
            }
        }

        public readonly string BoundingBoxForProject
            = "service=WFS&version=2.0.0&request=GetFeature&typeName=crt:CRT_SEGMENT_RECORD_VW&outputFormat=application/json&cql_filter=project_id={0}";
        
        public readonly string PolygonOfInterest
            = "service=WFS&version=2.0.0&request=GetFeature&typeName={0}&outputFormat=application/json&srsName=EPSG:4326&BBOX={1},EPSG:4326";
    }
}
