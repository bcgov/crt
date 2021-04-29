using Crt.Model.Dtos.CodeLookup;
using Crt.Model.Dtos.District;
using Crt.Model.Dtos.ServiceArea;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Crt.Model.Dtos.Ratio
{
    public class RatioListDto : RatioSaveDto
    {
        [JsonPropertyName("id")]
        public decimal RatioId { get; set; }
        [JsonIgnore]
        public virtual CodeLookupDto RatioRecordLkup { get; set; }
        [JsonIgnore]
        public virtual CodeLookupDto RatioRecordTypeLkup { get; set; }
        /*[JsonIgnore]
        public virtual ServiceAreaDto ServiceAreaLkup { get; set; }
        [JsonIgnore]
        public virtual DistrictDto DistrictLkup { get; set; }*/
        public string RatioRecordName { get => RatioRecordLkup?.CodeName; }
        public string RatioRecordType { get => RatioRecordTypeLkup?.CodeName; }
        public string ServiceAreaName { get; set; }
        public string DistrictName { get; set; }
        public bool CanDelete { get => true; }
    }
}
