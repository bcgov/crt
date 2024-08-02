using Crt.Data.Database;
using Crt.Data.Repositories;
using Crt.Domain.Services.Base;
using Crt.HttpClients;
using Crt.HttpClients.Models;
using Crt.Model;
using Crt.Model.Dtos.Ratio;
using Crt.Model.Dtos.Segments;
using Crt.Model.Utils;
using Microsoft.Extensions.Logging;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
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
        private ILogger<IRatioService> _logger;

        public RatioService(CrtCurrentUser currentUser, IFieldValidatorService validator, IUnitOfWork unitOfWork,
                IRatioRepository ratioRepo, ISegmentRepository segmentRepo, IUserRepository userRepo, IGeoServerApi geoServerApi, 
                IDataBCApi dataBCApi, IServiceAreaRepository serviceAreaRepo, IDistrictRepository districtRepo, ILogger<IRatioService> logger)
            : base(currentUser, validator, unitOfWork)
        {
            _ratioRepo = ratioRepo;
            _userRepo = userRepo;
            _segmentRepo = segmentRepo;
            _geoServerApi = geoServerApi;
            _dataBCApi = dataBCApi;
            _serviceAreaRepo = serviceAreaRepo;
            _districtRepo = districtRepo;
            _logger = logger;
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

            //get the ratio record lookup id for highways, we'll need this later to filter the ratios
            var highwayRatioRecordTypeId = _validator.CodeLookup
                .Where(x => x.CodeSet == CodeSet.RatioRecordType
                && x.CodeName == RatioRecordType.Highway).FirstOrDefault().CodeLookupId;

            serviceAreas = await _serviceAreaRepo.GetAllServiceAreasAsync();
            districts = await _districtRepo.GetAllDistrictsAsync();

            //load the project segments
            List<SegmentGeometryListDto> projectSegments = await _segmentRepo.GetSegmentGeometryListsAsync(projectId);
            
            //  determine the project extent
            var segmentBBox = await _geoServerApi.GetProjectExtent(projectId);

            //iterate thru the segments 
            foreach (var segment in projectSegments)
            {
                var segmentLength = 0.0;
                //get the full segment length and add to the total, points are set to a default non-zero value
                segmentLength = (segment.Geometry.GeometryType == Geometry.TypeNamePoint) 
                    ? Constants.SpatialPointSize : segmentLength = SpatialUtils.CalculateDistance(segment.Geometry);
                
                totalLengthOfSegments += segmentLength;
            }
            
            var taskList = new List<Task>();
            var newRatios = new ConcurrentBag<List<RatioCreateDto>>();

            taskList.Add(Task.Run(async () => newRatios.Add(await PerformServiceAreaRatioDetermination(projectSegments, segmentBBox, totalLengthOfSegments, projectId))));
            taskList.Add(Task.Run(async () => newRatios.Add(await PerformDistrictRatioDetermination(projectSegments, segmentBBox, totalLengthOfSegments, projectId))));
            taskList.Add(Task.Run(async () => newRatios.Add(await PerformElectoralRatioDetermination(projectSegments, segmentBBox, totalLengthOfSegments, projectId))));
            taskList.Add(Task.Run(async () => newRatios.Add(await PerformEconomicRegionRatioDetermination(projectSegments, segmentBBox, totalLengthOfSegments, projectId))));
            taskList.Add(Task.Run(async () => newRatios.Add(await PerformHighwayRatioDetermination(projectSegments, segmentBBox, totalLengthOfSegments, projectId))));

            Task.WaitAll(taskList.ToArray());

            //clear the current ratios
            await _ratioRepo.DeleteAllRatiosByProjectIdAsync(projectId);

            foreach (var ratioGroup in newRatios)
            {
                if (ratioGroup.Count > 0)
                {
                    var totalRatio = Convert.ToDecimal(ratioGroup.Sum(x => x.Ratio));
                    //adjust the largest of the ratios either, adding or taking away
                    if (ratioGroup.Sum(x => x.Ratio) >= 1.00M)
                    {
                        ratioGroup.Aggregate((i1, i2) => i1.Ratio > i2.Ratio ? i1 : i2).Ratio -= totalRatio - 1.00M;
                    }
                    else
                    {
                        //highways don't have to equal 1.00 so we won't adjust them to up
                        if (ratioGroup.FirstOrDefault().RatioRecordTypeLkupId != highwayRatioRecordTypeId)
                        {
                            ratioGroup.Aggregate((i1, i2) => i1.Ratio > i2.Ratio ? i1 : i2).Ratio += 1.00M - totalRatio;
                        }
                    } 

                    foreach (var ratio in ratioGroup)
                    {
                        await _ratioRepo.CreateRatioAsync(ratio);
                    }
                }
            }

            //save the determined ratios to the database
            _unitOfWork.Commit();

            return (false, errors);
        }

        private async Task<List<RatioCreateDto>> PerformServiceAreaRatioDetermination(List<SegmentGeometryListDto> projectSegments, string segmentBBox, 
            double totalLengthOfSegments, decimal projectId)
        {
            //get the ratio record lookup id
            var ratioRecordTypeId = _validator.CodeLookup
                .Where(x => x.CodeSet == CodeSet.RatioRecordType
                && x.CodeName == RatioRecordType.ServiceArea).FirstOrDefault().CodeLookupId;

            var createdRatios = new List<RatioCreateDto>();

            List<PolygonLayer> polygons = await _geoServerApi.GetPolygonOfInterestForServiceArea(segmentBBox);

            foreach (var polygon in polygons)
            {
                //get the percentage of the segment
                var percentInPolygon = GetPercentageOfSegmentWithinPolygon(totalLengthOfSegments, projectSegments, polygon);

                if (percentInPolygon > 0)
                {
                    //generate the new ratio
                    var newRatio = new RatioCreateDto
                    {
                        ProjectId = projectId,
                        Ratio = (decimal)percentInPolygon,
                        RatioRecordTypeLkupId = ratioRecordTypeId,
                        ServiceAreaId = serviceAreas
                            .Where(x => x.ServiceAreaNumber == Convert.ToDecimal(polygon.Number))
                            .FirstOrDefault().ServiceAreaId
                    };

                    createdRatios.Add(newRatio);
                }
            }

            return createdRatios;
        }

        private async Task<List<RatioCreateDto>> PerformDistrictRatioDetermination(List<SegmentGeometryListDto> projectSegments, string segmentBBox,
            double totalLengthOfSegments, decimal projectId)
        {
            //get the ratio record lookup id
            var ratioRecordTypeId = _validator.CodeLookup
                .Where(x => x.CodeSet == CodeSet.RatioRecordType
                && x.CodeName == RatioRecordType.District).FirstOrDefault().CodeLookupId;

            var createdRatios = new List<RatioCreateDto>();

            List<PolygonLayer> polygons = await _geoServerApi.GetPolygonOfInterestForDistrict(segmentBBox);

            foreach (var polygon in polygons)
            {
                //get the percentage of the segment
                var percentInPolygon = GetPercentageOfSegmentWithinPolygon(totalLengthOfSegments, projectSegments, polygon);

                if (percentInPolygon > 0)
                {
                    //generate the new ratio
                    var newRatio = new RatioCreateDto
                    {
                        ProjectId = projectId,
                        Ratio = (decimal)percentInPolygon,
                        RatioRecordTypeLkupId = ratioRecordTypeId,
                        DistrictId = districts
                            .Where(x => x.DistrictNumber == Convert.ToDecimal(polygon.Number))
                            .FirstOrDefault().DistrictId
                    };

                    createdRatios.Add(newRatio);
                }
            }

            return createdRatios;
        }

        private async Task<List<RatioCreateDto>> PerformElectoralRatioDetermination(List<SegmentGeometryListDto> projectSegments, string segmentBBox,
            double totalLengthOfSegments, decimal projectId)
        {
            //get the ratio record lookup id
            var ratioRecordTypeId = _validator.CodeLookup
                .Where(x => x.CodeSet == CodeSet.RatioRecordType
                && x.CodeName == RatioRecordType.ElectoralDistrict).FirstOrDefault().CodeLookupId;

            var createdRatios = new List<RatioCreateDto>();

            List<PolygonLayer> polygons = await _dataBCApi.GetPolygonOfInterestForElectoralDistrict(segmentBBox);

            foreach (var polygon in polygons)
            {
                //get the percentage of the segment
                var percentInPolygon = GetPercentageOfSegmentWithinPolygon(totalLengthOfSegments, projectSegments, polygon);

                if (percentInPolygon > 0)
                {
                    var existingRatioRecord = _validator.CodeLookup
                            .Where(x => x.CodeSet == CodeSet.ElectoralDistrict && x.CodeValueText == polygon.Name)
                            .FirstOrDefault();
                    if (existingRatioRecord == null) continue;

                    //generate the new ratio
                    var newRatio = new RatioCreateDto
                    {
                        ProjectId = projectId,
                        Ratio = (decimal)percentInPolygon,
                        RatioRecordTypeLkupId = ratioRecordTypeId,
                        RatioRecordLkupId = _validator.CodeLookup
                            .Where(x => x.CodeSet == CodeSet.ElectoralDistrict && x.CodeValueText == polygon.Name)
                            .FirstOrDefault().CodeLookupId
                    };

                    createdRatios.Add(newRatio);
                }
            }

            return createdRatios;
        }

        private async Task<List<RatioCreateDto>> PerformEconomicRegionRatioDetermination(List<SegmentGeometryListDto> projectSegments, string segmentBBox,
            double totalLengthOfSegments, decimal projectId)
        {
            //get the ratio record lookup id
            var ratioRecordTypeId = _validator.CodeLookup
                .Where(x => x.CodeSet == CodeSet.RatioRecordType
                && x.CodeName == RatioRecordType.EconomicRegion).FirstOrDefault().CodeLookupId;

            var createdRatios = new List<RatioCreateDto>();

            List<PolygonLayer> polygons = await _dataBCApi.GetPolygonOfInterestForEconomicRegion(segmentBBox);

            foreach (var polygon in polygons)
            {
                //get the percentage of the segment
                var percentInPolygon = GetPercentageOfSegmentWithinPolygon(totalLengthOfSegments, projectSegments, polygon);

                if (percentInPolygon > 0)
                {
                    var existingRatioRecord = _validator.CodeLookup
                            .Where(x => x.CodeSet == CodeSet.EconomicRegion && x.CodeValueText == polygon.Number)
                            .FirstOrDefault();
                    if (existingRatioRecord == null) continue;

                    //generate the new ratio
                    var newRatio = new RatioCreateDto
                    {
                        ProjectId = projectId,
                        Ratio = (decimal)percentInPolygon,
                        RatioRecordTypeLkupId = ratioRecordTypeId,
                        RatioRecordLkupId = _validator.CodeLookup
                            .Where(x => x.CodeSet == CodeSet.EconomicRegion && x.CodeValueText == polygon.Number)
                            .FirstOrDefault().CodeLookupId
                    };

                    createdRatios.Add(newRatio);
                }
            }

            return createdRatios;
        }

        private async Task<List<RatioCreateDto>> PerformHighwayRatioDetermination(List<SegmentGeometryListDto> projectSegments, string segmentBBox,
            double totalLengthOfSegments, decimal projectId)
        {
            //get the ratio record lookup id
            var ratioRecordTypeId = _validator.CodeLookup
                .Where(x => x.CodeSet == CodeSet.RatioRecordType
                && x.CodeName == RatioRecordType.Highway).FirstOrDefault().CodeLookupId;

            var createdRatios = new List<RatioCreateDto>();
            
            List<PolygonLayer> highwayLines = await _geoServerApi.GetHighwaysOfInterest(segmentBBox);

            foreach (var highwayLine in highwayLines)
            {
                var intersectedDistance = 0.0;

                //get the intersecting points of the segment geometry and the highway geometry
                foreach (var segment in projectSegments)
                {
                    //turn the segment into a polygon, buffered by half a meter
                    // i noticed that sometimes the highway data doesn't 
                    // always show up on the actual highway.. hwy 5 outside merrit for example ;(
                    var bufferedSegment = segment.Geometry.Buffer(0.00005);
                    var intersection = bufferedSegment.Intersection(highwayLine.NTSGeometry);

                    if (intersection != null)
                    {
                        var distance = SpatialUtils.CalculateDistance(intersection);
                        //because we turn the segment into a polygon it's possible for points to have
                        // a non-zero distance, since we defaulted points we'll reset it here
                        if (distance > 0 && segment.Geometry.GeometryType == Geometry.TypeNamePoint)
                        {
                            distance = Constants.SpatialPointSize;
                        }
                        intersectedDistance += distance;
                    }
                }

                var percentInPolygon = intersectedDistance / totalLengthOfSegments;
                if (percentInPolygon > 0 && percentInPolygon < 0.01)
                {
                    //sometimes the point in comparison to a long line segment will have a perecent 
                    // below 1%, and then round to 0, we'll avoid this by ensuring a found segment
                    // never goes below zero.
                    percentInPolygon = 0.01;
                }

                percentInPolygon = Math.Round(percentInPolygon, 2);

                if (percentInPolygon > 0)
                {
                    _logger.LogInformation($"Creating new ratio for Highway {highwayLine.Number}");
                    //generate the new ratio
                    var newRatio = new RatioCreateDto
                    {
                        ProjectId = projectId,
                        Ratio = (decimal)percentInPolygon,
                        RatioRecordTypeLkupId = ratioRecordTypeId,
                        RatioRecordLkupId = _validator.CodeLookup
                            .Where(x => x.CodeSet == CodeSet.Highway && x.CodeValueText == highwayLine.Number)
                            .FirstOrDefault().CodeLookupId
                    };

                    createdRatios.Add(newRatio);
                }
            } 

            //we need to check for duplicate ratios on the same highway
            var duplicates = createdRatios.GroupBy(x => x.RatioRecordLkupId)
                .SelectMany(g => g.Skip(1));

            foreach (var duplicate in duplicates)
            {
                //now find the parent and join them
                RatioCreateDto parent = createdRatios
                    .Where(x => x.RatioRecordLkupId == duplicate.RatioRecordLkupId)
                    .FirstOrDefault();

                if (parent != null)
                {
                    parent.Ratio += duplicate.Ratio;
                    createdRatios.Remove(duplicate);
                }
            }

            return createdRatios;
        }

        private double GetPercentageOfSegmentWithinPolygon(double totalLengthOfSegments, List<SegmentGeometryListDto> projectSegments, PolygonLayer layerPolygon)
        {
            var clippedLength = 0.0;

            foreach (var segment in projectSegments)
            {
                var distanceInPolygon = 0.0;
                var segmentWithinPolygon = SpatialUtils.LineCordinatesWithinPolygon(layerPolygon.NTSGeometry, segment.Geometry);
                if (segmentWithinPolygon != null)
                {
                    distanceInPolygon = SpatialUtils.CalculateDistance(segmentWithinPolygon);

                    //get the clipped length, this is how much of this segment exists within the polygon
                    clippedLength += distanceInPolygon;
                }
            }

            var percentInPolygon = clippedLength / totalLengthOfSegments;
            //sometimes the segment in comparison to a very long line segment will have a perecent 
            // below 1%, and then round to 0, we'll avoid this by ensuring a found segment
            // never goes below zero.
            if (percentInPolygon > 0 && percentInPolygon < 0.01)
            {
                percentInPolygon = 0.01;
            }

            percentInPolygon = Math.Round(percentInPolygon, 2);

            return percentInPolygon;
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
