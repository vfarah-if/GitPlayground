using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Git.Domain.Models.TFL;

namespace Git.Domain.EntityFramework
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