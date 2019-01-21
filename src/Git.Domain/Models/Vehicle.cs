using Newtonsoft.Json;

namespace Git.Domain.Models
{
    public class Vehicle   
    {
        [JsonProperty(PropertyName = "type")]
        public string VehicleType { get; set; }
    }
}