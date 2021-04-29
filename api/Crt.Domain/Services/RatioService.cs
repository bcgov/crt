using Crt.Data.Database;
using Crt.Data.Repositories;
using Crt.Domain.Services.Base;
using Crt.HttpClients;
using Crt.HttpClients.Models;
using Crt.Model;
using Crt.Model.Dtos.Ratio;
using Crt.Model.Dtos.Segments;
using Crt.Model.Utils;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crt.Domain.Services
{

    public interface IRatioService
    {
        Task<RatioDto> GetRatioByIdAsync(decimal ratioId);
        Task<IEnumerable<RatioDto>> GetRatiosByRatioTypeAsync(decimal ratioTypeId);
        Task<(decimal ratioId, Dictionary<string, List<string>> errors)> CreateRatioAsync(RatioCreateDto ratio);
        Task<(bool NotFound, Dictionary<string, List<string>> errors)> UpdateRatioAsync(RatioUpdateDto ratio);
        Task<(bool NotFound, Dictionary<string, List<string>> errors)> DeleteRatioAsync(decimal projectId, decimal ratioId);
        Task<(bool NotFound, Dictionary<string, List<string>> errors)> CalculateProjectRatios(decimal projectId);
    }

    public class RatioService : CrtServiceBase, IRatioService
    {
        private IRatioRepository _ratioRepo;
        private IUserRepository _userRepo;
        private ISegmentRepository _segmentRepo;
        private IGeoServerApi _geoServerApi;
        private IDataBCApi _dataBCApi;
        private IServiceAreaRepository _serviceAreaRepo;
        private IDistrictRepository _districtRepo;
        private IEnumerable<Model.Dtos.ServiceArea.ServiceAreaDto> serviceAreas;
        private IEnumerable<Model.Dtos.District.DistrictDto> districts;

        public RatioService(CrtCurrentUser currentUser, IFieldValidatorService validator, IUnitOfWork unitOfWork,
                IRatioRepository ratioRepo, ISegmentRepository segmentRepo, IUserRepository userRepo, IGeoServerApi geoServerApi, 
                IDataBCApi dataBCApi, IServiceAreaRepository serviceAreaRepo, IDistrictRepository districtRepo)
            : base(currentUser, validator, unitOfWork)
        {
            _ratioRepo = ratioRepo;
            _userRepo = userRepo;
            _segmentRepo = segmentRepo;
            _geoServerApi = geoServerApi;
            _dataBCApi = dataBCApi;
            _serviceAreaRepo = serviceAreaRepo;
            _districtRepo = districtRepo;
        }

        public async Task<(decimal ratioId, Dictionary<string, List<string>> errors)> CreateRatioAsync(RatioCreateDto ratio)
        {
            var errors = new Dictionary<string, List<string>>();
            errors = _validator.Validate(Entities.Ratio, ratio, errors);

            await ValidateRatio(ratio, errors);

            if (errors.Count > 0)
            {
                return (0, errors);
            }

            var crtRatio = await _ratioRepo.CreateRatioAsync(ratio);

            _unitOfWork.Commit();

            return (crtRatio.RatioId, errors);
        }

        public async Task<(bool NotFound, Dictionary<string, List<string>> errors)> DeleteRatioAsync(decimal projectId, decimal ratioId)
        {
            var ratio = await _ratioRepo.GetRatioByIdAsync(ratioId);

            if (ratio == null || ratio.ProjectId != projectId)
            {
                return (true, null);
            }

            //errors is returned but is always empty?
            var errors = new Dictionary<string, List<string>>();

            await _ratioRepo.DeleteRatioAsync(ratioId);

            _unitOfWork.Commit();

            return (false, errors);
        }

        public async Task<RatioDto> GetRatioByIdAsync(decimal ratioId)
        {
            return await _ratioRepo.GetRatioByIdAsync(ratioId);
        }

        public async Task<IEnumerable<RatioDto>> GetRatiosByRatioTypeAsync(decimal ratioTypeId)
        {
            return await _ratioRepo.GetRatiosByRatioTypeAsync(ratioTypeId);
        }

        public async Task<(bool NotFound, Dictionary<string, List<string>> errors)> UpdateRatioAsync(RatioUpdateDto ratio)
        {
            var crtRatio = await _ratioRepo.GetRatioByIdAsync(ratio.RatioId);

            if (crtRatio == null || ratio.ProjectId != ratio.ProjectId)
            {
                return (true, null);
            }

            var errors = new Dictionary<string, List<string>>();
            errors = _validator.Validate(Entities.Ratio, ratio, errors);

            await ValidateRatio(ratio, errors);

            if (errors.Count > 0)
            {
                return (false, errors);
            }

            await _ratioRepo.UpdateRatioAsync(ratio);

            _unitOfWork.Commit();

            return (false, errors);
        }

        public async Task<(bool NotFound, Dictionary<string, List<string>> errors)> CalculateProjectRatios(decimal projectId)
        {
            var totalLengthOfSegments = 0.0;
            var errors = new Dictionary<string, List<string>>();

            serviceAreas = await _serviceAreaRepo.GetAllServiceAreasAsync();
            districts = await _districtRepo.GetAllDistrictsAsync();

            //clear the current ratios
            await _ratioRepo.DeleteAllRatiosByProjectIdAsync(projectId);

            //load the project segments
            List<SegmentGeometryListDto> projectSegments = await _segmentRepo.GetSegmentGeometryListsAsync(projectId);
            
            //  determine the project extent
            var segmentBBox = await _geoServerApi.GetProjectExtent(projectId);

            //iterate thru the segments 
            foreach (var segment in projectSegments)
            {
                //get the full segment length and add to the total
                var segmentLength = 
                    await _geoServerApi.GetTotalSegmentLength(BuildGeometryStringFromCoordinates(segment.Geometry));
                totalLengthOfSegments += segmentLength;
            }
            
            //get polygons of interest for each Electoral District, Service Area, MoTI District & Economic Region
            var saTask = Task.Run(async() => await _geoServerApi.GetPolygonOfInterestForServiceArea(segmentBBox));
            var diTask = Task.Run(async() => await _geoServerApi.GetPolygonOfInterestForDistrict(segmentBBox));
            var ecTask = Task.Run(async() => await _dataBCApi.GetPolygonOfInterestForElectoralDistrict(segmentBBox));
            var erTask = Task.Run(async() => await _dataBCApi.GetPolygonOfInterestForEconomicRegion(segmentBBox));
            
            Task.WaitAll(saTask, diTask, ecTask, erTask);

            var serviceAreaPolygons = saTask.Result;
            var districtPolygons = diTask.Result;
            var electoralPolygons = ecTask.Result;
            var economicRegionPolygons = erTask.Result;

            var taskList = new List<Task>();
            var newRatios = new ConcurrentBag<List<RatioCreateDto>>();

            //call function to create the ratios
            taskList.Add(Task.Run(async() => newRatios.Add(await CreateDeterminedRatios(serviceAreaPolygons, projectSegments, totalLengthOfSegments, projectId, RatioRecordType.ServiceArea))));
            taskList.Add(Task.Run(async () => newRatios.Add(await CreateDeterminedRatios(districtPolygons, projectSegments, totalLengthOfSegments, projectId, RatioRecordType.District))));
            taskList.Add(Task.Run(async () => newRatios.Add(await CreateDeterminedRatios(electoralPolygons, projectSegments, totalLengthOfSegments, projectId, RatioRecordType.ElectoralDistrict))));
            taskList.Add(Task.Run(async () => newRatios.Add(await CreateDeterminedRatios(economicRegionPolygons, projectSegments, totalLengthOfSegments, projectId, RatioRecordType.EconomicRegion))));

            Task.WaitAll(taskList.ToArray());

            foreach (var ratioGroup in newRatios)
            {
                var totalRatio = Convert.ToDecimal(ratioGroup.Sum(x => x.Ratio));
                if (ratioGroup.Sum(x => x.Ratio) >= 1.00M)
                    ratioGroup.First().Ratio -= totalRatio - 1.00M;
                else
                    ratioGroup.First().Ratio += 1.00M - totalRatio;

                foreach (var ratio in ratioGroup)
                {
                    await _ratioRepo.CreateRatioAsync(ratio);
                }
            }

            //save the determined ratios to the database
            _unitOfWork.Commit();

            return (false, errors);
        }

        private async Task<List<RatioCreateDto>> CreateDeterminedRatios(List<PolygonLayer> polygons, List<SegmentGeometryListDto> projectSegments,
            double totalLengthOfSegments, decimal projectId, string recordType)
        {
            //get the ratio record lookup id
            var ratioRecordTypeId = _validator.CodeLookup
                .Where(x => x.CodeSet == CodeSet.RatioRecordType 
                && x.CodeName == recordType).FirstOrDefault().CodeLookupId;
            var createdRatios = new List<RatioCreateDto>();

            //how much of this segment resides within the polygon
            foreach (var polygon in polygons)
            {
                //get the percentage of the segment
                var percentInPolygon = await GetPercentageOfSegmentWithinPolygon(totalLengthOfSegments, projectSegments, polygon);

                if (percentInPolygon > 0)
                {
                    //generate the new ratio
                    var newRatio = new RatioCreateDto
                    {
                        ProjectId = projectId,
                        Ratio = (decimal)percentInPolygon,
                        RatioRecordTypeLkupId = ratioRecordTypeId
                    };
                    
                    //branch code based on recordType as the linking Id is written to a different place
                    switch (recordType)
                    {
                        case RatioRecordType.ServiceArea:
                            //service Id lines up with the 
                            newRatio.ServiceAreaId = serviceAreas
                                .Where(x => x.ServiceAreaNumber == Convert.ToDecimal(polygon.Number))
                                .FirstOrDefault().ServiceAreaId;
                            break;
                        case RatioRecordType.EconomicRegion:
                            newRatio.RatioRecordLkupId = _validator.CodeLookup
                                .Where(x => x.CodeSet == CodeSet.EconomicRegion && x.CodeValueText == polygon.Number)
                                .FirstOrDefault().CodeLookupId;
                            break;
                        case RatioRecordType.ElectoralDistrict:
                            newRatio.RatioRecordLkupId = _validator.CodeLookup
                                .Where(x => x.CodeSet == CodeSet.ElectoralDistrict && x.CodeValueText == polygon.Name)
                                .FirstOrDefault().CodeLookupId;
                            break;
                        case RatioRecordType.District:
                            newRatio.DistrictId = districts
                                .Where(x => x.DistrictNumber == Convert.ToDecimal(polygon.Number))
                                .FirstOrDefault().DistrictId;
                            break;
                    }

                    createdRatios.Add(newRatio);
                }
            }

            return createdRatios;
        }

        private async Task<double> GetPercentageOfSegmentWithinPolygon(double totalLengthOfSegments, List<SegmentGeometryListDto> projectSegments, PolygonLayer layerPolygon)
        {
            var clippedLength = 0.0;

            foreach (var segment in projectSegments)
            {
                var result = await _geoServerApi.GetSegmentLengthWithinPolygon(BuildGeometryStringFromCoordinates(segment.Geometry)
                    , BuildGeometryStringFromCoordinates(layerPolygon.NTSGeometry));

                //get the clipped length, this is how much of this segment exists within the polygon
                clippedLength += result.clippedLength;
            }

            var percentInPolygon = Math.Round(clippedLength / totalLengthOfSegments, 2);
            
            return percentInPolygon;
        }

        private string BuildGeometryStringFromCoordinates(NetTopologySuite.Geometries.Geometry geometry)
        {
            string geometryString = "";
            var isPoint = (geometry.Coordinates.Length == 1);

            foreach (Coordinate coordinate in geometry.Coordinates)
            {
                geometryString += coordinate.X + "\\," + coordinate.Y;
                if (coordinate != geometry.Coordinates.Last())
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

        private async Task ValidateRatio(RatioSaveDto ratio, Dictionary<string, List<string>> errors)
        {
            if (ratio.DistrictId != null)
            {
                if (!await _ratioRepo.DistrictExists((decimal)ratio.DistrictId))
                {
                    errors.AddItem(Fields.DistrictId, $"District ID [{ratio.DistrictId}] does not exist");
                }
            }

            if (ratio.ServiceAreaId != null)
            {
                if (!await _ratioRepo.ServiceAreaExists((decimal)ratio.ServiceAreaId))
                {
                    errors.AddItem(Fields.ServiceAreaId, $"Service Area ID [{ratio.ServiceAreaId}] does not exist");
                }
            }
        }
    }
}
