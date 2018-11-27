using System;
using System.Collections.Generic;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatistic
    {
        public AccidentStatistic()
        {
            Casualties = new HashSet<Casualty>();
            Vehicles = new HashSet<Vehicle>();
        }

        public int AccidentStatisticId { get; set; }

        public int TflId { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public string Location { get; set; }

        public DateTime Date { get; set; }

        public Severity Severity { get; set; }

        public string Borough { get; set; }

        public virtual ICollection<Casualty> Casualties { get; set; }

        public virtual ICollection<Vehicle> Vehicles { get; set; }

        public static AccidentStatistic MapFrom(Models.TFL.AccidentStatistic accidentStatistic)
        {
            var result = new AccidentStatistic
            {
                TflId = accidentStatistic.Id,
                Borough = accidentStatistic.Borough
            };
            MapVehicles(accidentStatistic, result);
            MapCasualties(accidentStatistic, result);
            Enum.TryParse(accidentStatistic.Severity.ToString(), true, out Severity severity);
            result.Severity = severity;
            return result;
        }

        private static void MapVehicles(Models.TFL.AccidentStatistic accidentStatistic, AccidentStatistic parent)
        {
            foreach (var accidentStatisticVehicle in accidentStatistic.Vehicles)
            {
                var newVehicle = Vehicle.MapFrom(parent, accidentStatisticVehicle);
                parent.Vehicles.Add(newVehicle);
            }
        }

        private static void MapCasualties(Models.TFL.AccidentStatistic accidentStatistic, AccidentStatistic parent)
        {
            foreach (var accidentStatisticCasualty in accidentStatistic.Casualties)
            {
                var newCasualty = Casualty.MapFrom(parent, accidentStatisticCasualty);
                parent.Casualties.Add(newCasualty);
            }
        }
    }
}
