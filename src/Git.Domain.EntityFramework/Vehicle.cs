using System.Collections.Generic;

namespace Git.Domain.EntityFramework
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string VehicleType { get; set; }
        public virtual List<AccidentStatistic> AccidentStatistics { get; set; }
    }
}