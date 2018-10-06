using Newtonsoft.Json;

namespace Git.Domain.Models.TFL
{
    public class Vehicle   
    {
        [JsonProperty(PropertyName = "type")]
        public string VehicleType { get; set; }
    }
}