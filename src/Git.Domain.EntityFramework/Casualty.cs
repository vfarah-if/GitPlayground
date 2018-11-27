using System;

namespace Git.Domain.EntityFramework
{
    public class Casualty
    {
        public int CasualtyId{ get; set; }

        public int Age { get; set; }

        public string Class { get; set; }

        public Severity Severity { get; set; }

        public string Mode { get; set; }

        public string AgeBand { get; set; }

        public virtual AccidentStatistic AccidentStatistic{ get; set; }

        public static Casualty MapFrom(AccidentStatistic accidentStatistic, Models.TFL.Casualty accidentStatisticCasualty)
        {
            var result = new Casualty
            {
                AccidentStatistic = accidentStatistic,
                Age = accidentStatisticCasualty.Age,
                AgeBand = accidentStatisticCasualty.AgeBand,
                Class = accidentStatisticCasualty.Class,
                Mode = accidentStatisticCasualty.Mode
            };
            Enum.TryParse(accidentStatisticCasualty.Severity.ToString(), false,
                out EntityFramework.Severity severity);
            result.Severity = severity;
            return result;
        }
    }
}