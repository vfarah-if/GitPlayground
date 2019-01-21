using System;
using Git.Domain.EntityFramework.Models;
using Git.Domain.Models;

namespace Git.Domain.EntityFramework
{
    public static class MappingExtensions
    {
        public static AccidentStatisticDb ConvertFrom(this AccidentStatistic accidentStatistic)
        {
            var result = new AccidentStatisticDb
            {
                TflId = accidentStatistic.Id,
                Borough = accidentStatistic.Borough,
                Date = accidentStatistic.Date,
                Latitude = accidentStatistic.Latitude,
                Longitude = accidentStatistic.Longitude,
                Location = accidentStatistic.Location
            };
            result.ConvertVehicles(accidentStatistic);
            result.ConvertCasualties(accidentStatistic);
            Enum.TryParse(accidentStatistic.Severity.ToString(), true, out Severity severity);
            result.Severity = severity;
            return result;
        }

        public static CasualtyDb ConvertFrom(this AccidentStatisticDb accidentStatistic, Casualty casualty)
        {
            var result = new CasualtyDb
            {
                AccidentStatistic = accidentStatistic,
                Age = casualty.Age,
                AgeBand = casualty.AgeBand,
                Class = casualty.Class,
                Mode = casualty.Mode,
                Severity = casualty.Severity
            };
            return result;
        }

        public static VehicleDb ConvertFrom(this AccidentStatisticDb accidentStatistic, Vehicle vehicle)
        {
            var result = new VehicleDb
            {
                AccidentStatistic = accidentStatistic,
                VehicleType = vehicle.VehicleType
            };
            return result;
        }


        private static void ConvertVehicles(this AccidentStatisticDb accidentStatisticDb, AccidentStatistic tflAccidentStatistic)
        {
            foreach (var accidentStatisticVehicle in tflAccidentStatistic.Vehicles)
            {
                var newVehicle = accidentStatisticDb.ConvertFrom(accidentStatisticVehicle);
                accidentStatisticDb.Vehicles.Add(newVehicle);
            }
        }

        private static void ConvertCasualties(this AccidentStatisticDb accidentStatisticDb, AccidentStatistic tflAccidentStatistic)
        {
            foreach (var accidentStatisticCasualty in tflAccidentStatistic.Casualties)
            {
                accidentStatisticDb.Casualties.Add(accidentStatisticDb.ConvertFrom(accidentStatisticCasualty));
            }
        }
    }
}
