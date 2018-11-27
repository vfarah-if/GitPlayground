using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatistic
    {
        public AccidentStatistic()
        {
            // ReSharper disable once VirtualMemberCallInConstructor
            Casualties = new HashSet<Casualty>();
            // ReSharper disable once VirtualMemberCallInConstructor
            Vehicles = new HashSet<Vehicle>();
        }

        public int AccidentStatisticId { get; set; }

        public int TflId { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public string Location { get; set; }

        [Column(TypeName = "datetime2")]
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
                Borough = accidentStatistic.Borough,
                Date = accidentStatistic.Date,
                Latitude = accidentStatistic.Latitude,
                Longitude = accidentStatistic.Longitude,
                Location = accidentStatistic.Location
            };
            MapVehiclesOn(result, accidentStatistic);
            MapCasualtiesOn(result, accidentStatistic);
            Enum.TryParse(accidentStatistic.Severity.ToString(), true, out Severity severity);
            result.Severity = severity;
            return result;
        }

        private static void MapVehiclesOn(AccidentStatistic efAccidentStatistic, Models.TFL.AccidentStatistic tflAccidentStatistic)
        {
            foreach (var accidentStatisticVehicle in tflAccidentStatistic.Vehicles)
            {
                var newVehicle = Vehicle.MapFrom(efAccidentStatistic, accidentStatisticVehicle);
                efAccidentStatistic.Vehicles.Add(newVehicle);
            }
        }

        private static void MapCasualtiesOn(AccidentStatistic efAccidentStatistic, Models.TFL.AccidentStatistic tflAccidentStatistic)
        {
            foreach (var accidentStatisticCasualty in tflAccidentStatistic.Casualties)
            {
                var newCasualty = Casualty.MapFrom(efAccidentStatistic, accidentStatisticCasualty);
                efAccidentStatistic.Casualties.Add(newCasualty);
            }
        }
    }
}
