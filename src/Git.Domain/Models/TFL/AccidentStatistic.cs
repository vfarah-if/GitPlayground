using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using Newtonsoft.Json;

namespace Git.Domain.Models.TFL
{
    /// <example>
    /// {
    ///    "id": 0,
    ///    "lat": 0,
    ///    "lon": 0,
    ///    "location": "string",
    ///    "date": "2018-10-06T02:10:11.021Z",
    ///    "severity": "string",
    ///    "borough": "string",
    ///    "casualties": [
    ///      {
    ///        "age": 0,
    ///        "class": "string",
    ///        "severity": "string",
    ///        "mode": "string",
    ///        "ageBand": "string"
    ///      }
    ///    ],
    ///    "vehicles": [
    ///      {
    ///        "type": "string"
    ///      }
    ///    ]
    ///  }
    /// </example>>
    public class AccidentStatistic
    {
        public int Id { get; set; }

        [JsonProperty(PropertyName = "lat")]
        public string Latitude { get; set; }

        [JsonProperty(PropertyName = "lon")]
        public string Longitude { get; set; }

        public string Location { get; set; }

        [JsonProperty(PropertyName = "date")]
        public string DateAsString { get; set; }

        [JsonIgnore]
        public DateTime Date
        {
            get
            {
                return DateTime.ParseExact(DateAsString, "yyyy-MM-ddTHH:mm:ssZ", CultureInfo.InvariantCulture);
            }
        }

        public Severity Severity { get; set; }

        public string Borough { get; set; }

        public List<Casualty> Casualties { get; set; }

        public List<Vehicle> Vehicles { get; set; }
    }
}
