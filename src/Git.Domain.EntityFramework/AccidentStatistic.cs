using System;
using System.Collections.Generic;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatistic
    {
        public int AccidentStatisticId { get; set; }

        public int TflId { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public string Location { get; set; }

        public DateTime Date { get; set; }

        public Severity Severity { get; set; }

        public string Borough { get; set; }

        public virtual List<Casualty> Casualties { get; set; }

        public virtual List<Vehicle> Vehicles { get; set; }
    }
}
