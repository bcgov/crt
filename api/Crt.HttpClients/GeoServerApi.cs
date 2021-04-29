using Crt.HttpClients.Models;
using Crt.Model.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using GJFeature = GeoJSON.Net.Feature;  // use an alias since Feature exists in HttpClients.Models

namespace Crt.HttpClients
{
    public interface IGeoServerApi
    {
        Task<double> GetTotalSegmentLength(string lineString);
        Task<(double totalLength, double clippedLength)> GetSegmentLengthWithinPolygon(string lineString, string polygonLineString);
        Task<string> GetProjectExtent(decimal projectId);
        Task<List<PolygonLayer>> GetPolygonOfInterestForServiceArea(string boundingBox);
        Task<List<PolygonLayer>> GetPolygonOfInterestForDistrict(string boundingBox);
        HttpClient Client { get; }
        public string Path { get; }
    }

    public class GeoServerApi : IGeoServerApi
    {
        public HttpClient Client { get; private set; }
        public string Path { get; private set; }
        private GeoServerQueries _queries;
        private IApi _api;
        private ILogger<IGeoServerApi> _logger;

        //the default polyXY is in the ocean and is only used when retrieving 
        // the full length of a segment, that way it doesn't get clipped
        private const string DEFAULT_POLYXY = "-140.58\\,47.033";
        private const string DEFAULT_SRID = "4326";

        public GeoServerApi(HttpClient client, IApi api, IConfiguration config, ILogger<IGeoServerApi> logger)
        {
            Client = client;
            _queries = new GeoServerQueries();
            _api = api;

            var env = config.GetEnvironment();
            Path = config.GetValue<string>($"GeoServer{env}:Path");
            _logger = logger;
        }

        public async Task<double> GetTotalSegmentLength(string lineString)
        {
            double totalLength = 0;

            var body = string.Format(_queries.LineWithinPolygonQuery, DEFAULT_SRID, lineString, DEFAULT_SRID, DEFAULT_POLYXY);
            var content = await (await _api.PostWithRetry(Client, Path, body)).Content.ReadAsStringAsync();

            var featureCollection = SpatialUtils.ParseJSONToFeatureCollection(content);
            if (featureCollection != null)
            {
                foreach (GJFeature.Feature feature in featureCollection.Features)
                {
                    totalLength += Convert.ToDouble(feature.Properties["COMPLETE_LENGTH_KM"]);
                }
            }

            return totalLength;
        }

        public async Task<(double totalLength, double clippedLength)> GetSegmentLengthWithinPolygon(string lineString, string polygonLineString)
        {
            double length = 0, clippedLength = 0;

            var body = string.Format(_queries.LineWithinPolygonQuery, DEFAULT_SRID, lineString, DEFAULT_SRID, polygonLineString);
            var content = await (await _api.PostWithRetry(Client, Path, body)).Content.ReadAsStringAsync();

            var featureCollection = SpatialUtils.ParseJSONToFeatureCollection(content);
            if (featureCollection != null)
            {
                foreach (GJFeature.Feature feature in featureCollection.Features)
                {
                    length += Convert.ToDouble(feature.Properties["COMPLETE_LENGTH_KM"]);
                    clippedLength += Convert.ToDouble(feature.Properties["CLIPPED_LENGTH_KM"]);
                }
            }

            return (length, clippedLength);
        }

        public async Task<string> GetProjectExtent(decimal projectId)
        {
            var query = Path + string.Format(_queries.BoundingBoxForProject, projectId);
            var content = await (await _api.GetWithRetry(Client, query)).Content.ReadAsStringAsync();

            var featureCollection = SpatialUtils.ParseJSONToFeatureCollection(content);
            
            return (featureCollection != null) ? string.Join(",", featureCollection.BoundingBoxes) : null;
        }

        public async Task<List<PolygonLayer>> GetPolygonOfInterestForServiceArea(string boundingBox)
        {
            List<PolygonLayer> layerPolygons = new List<PolygonLayer>();

            //build the query and get the geoJSON return
            var query = Path + string.Format(_queries.PolygonOfInterest, "hwy:DSA_CONTRACT_AREA", boundingBox);
            var content = await (await _api.GetWithRetry(Client, query)).Content.ReadAsStringAsync();
            
            var featureCollection = SpatialUtils.ParseJSONToFeatureCollection(content);
            
            //continue if we have a feature collection
            if (featureCollection != null)
            {
                //iterate the features in the parsed geoJSON collection
                foreach (GJFeature.Feature feature in featureCollection.Features)
                {
                    var simplifiedGeom = SpatialUtils.GenerateSimplifiedPolygonGeometry(feature);

                    layerPolygons.Add(new PolygonLayer
                    {
                        NTSGeometry = simplifiedGeom,
                        Name = (string)feature.Properties["CONTRACT_AREA_NAME"],
                        Number = feature.Properties["CONTRACT_AREA_NUMBER"].ToString()
                    });
                }
            }
            
            return layerPolygons;
        }

        public async Task<List<PolygonLayer>> GetPolygonOfInterestForDistrict(string boundingBox)
        {
            List<PolygonLayer> layerPolygons = new List<PolygonLayer>();

            //build the query and get the geoJSON return
            var query = Path + string.Format(_queries.PolygonOfInterest, "hwy:DSA_DISTRICT_BOUNDARY", boundingBox);
            var content = await (await _api.GetWithRetry(Client, query)).Content.ReadAsStringAsync();

            var featureCollection = SpatialUtils.ParseJSONToFeatureCollection(content);

            //continue if we have a feature collection
            if (featureCollection != null)
            {
                foreach (GJFeature.Feature feature in featureCollection.Features)
                {
                    var simplifiedGeom = SpatialUtils.GenerateSimplifiedPolygonGeometry(feature);

                    layerPolygons.Add(new PolygonLayer
                    {
                        NTSGeometry = simplifiedGeom,
                        Name = (string)feature.Properties["DISTRICT_NAME"],
                        Number = feature.Properties["DISTRICT_NUMBER"].ToString()
                    });
                }
            }
            
            return layerPolygons;
        }
    }
}
