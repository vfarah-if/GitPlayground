using System.Collections.Generic;

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

        public virtual List<AccidentStatistic> AccidentStatistics{ get; set; }
   
    }
}