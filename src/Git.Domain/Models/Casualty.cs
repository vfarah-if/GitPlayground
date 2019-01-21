using Newtonsoft.Json;

namespace Git.Domain.Models
{
    /// <example>
    ///      {
    ///        "age": 0,
    ///        "class": "string",
    ///        "severity": "string",
    ///        "mode": "string",
    ///        "ageBand": "string"
    ///      }
    /// </example>>
    public class Casualty
    {
        public int Age { get; set; }

        public string Class { get; set; }

        public Severity Severity { get; set; }

        public string Mode { get; set; }

        public string AgeBand { get; set; }

    }
}