using System.Collections.Generic;

namespace Git.Domain.EntityFramework
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string VehicleType { get; set; }
        public virtual AccidentStatistic AccidentStatistic { get; set; }

        public static Vehicle MapFrom(AccidentStatistic accidentStatistic, Models.TFL.Vehicle accidentStatisticVehicle)
        {
            var result = new Vehicle
            {
                AccidentStatistic = accidentStatistic,
                VehicleType = accidentStatisticVehicle.VehicleType
            };
            return result;
        }
    }
}