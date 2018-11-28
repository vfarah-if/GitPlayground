using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Git.Domain.Models.TFL;

namespace Git.Domain.EntityFramework.Models
{
    [Table("Casualties")]
    public class CasualtyDb
    {
        [Key]
        public int CasualtyId{ get; set; }

        public int Age { get; set; }

        public string Class { get; set; }

        public Severity Severity { get; set; }

        public string Mode { get; set; }

        public string AgeBand { get; set; }

        public virtual AccidentStatisticDb AccidentStatistic{ get; set; }
    }
}