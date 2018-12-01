using System;
using System.Text;
using Newtonsoft.Json;

namespace Git.Domain.Owin.Api.Models
{
    public class AccidentStatisticsQuery
    {
        public AccidentStatisticsQuery()
        {
            Page = 1;
            PageSize = 100;
        }

        // If you want to make it required
        // [Required]         
        [JsonProperty(PropertyName = "from")]
        public DateTime From { get; set; }
        //[Required]
        [JsonProperty(PropertyName = "to")]
        public DateTime To { get; set; }
        [JsonProperty(PropertyName = "severity")]
        public string Severity { get; set; }
        [JsonProperty(PropertyName = "sortBy")]
        public string SortBy { get; set; }
        [JsonProperty(PropertyName = "page")]
        public int Page { get; set; }
        [JsonProperty(PropertyName = "pageSize")]
        public int PageSize { get; set; }

        public override string ToString()
        {
            var stringBuilder = new StringBuilder();
            stringBuilder.AppendLine($"From : {this.From}");
            stringBuilder.AppendLine($"To : {this.To}");
            stringBuilder.AppendLine($"Severity : {this.Severity}");
            stringBuilder.AppendLine($"SortBy : {this.SortBy}");
            stringBuilder.AppendLine($"Page : {this.Page}");
            stringBuilder.AppendLine($"PageSize : {this.PageSize}");
            return stringBuilder.ToString();
        }

        internal static AccidentStatisticsQuery CreateDefault()
        {
            return new AccidentStatisticsQuery
            {
                From = new DateTime(DateTime.Now.Year - 1, 01, 01),
                To = new DateTime(DateTime.Now.Year - 1, 12, 31),
                Severity = "Fatal",
                SortBy = "DateDescending"
            };
        }
    }
}
