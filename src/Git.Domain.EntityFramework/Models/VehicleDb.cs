using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Git.Domain.EntityFramework.Models
{
    [Table("Vehicles")]
    public class VehicleDb
    {
        [Key]
        public int VehicleId { get; set; }
        public string VehicleType { get; set; }
        public virtual AccidentStatisticDb AccidentStatistic { get; set; }
    }
}