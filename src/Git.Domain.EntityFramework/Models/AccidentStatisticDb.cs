using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Git.Domain.Models.TFL;

namespace Git.Domain.EntityFramework.Models
{
    [Table("AccidentStatistics")]
    public class AccidentStatisticDb
    {
        public AccidentStatisticDb()
        {
            // ReSharper disable once VirtualMemberCallInConstructor
            Casualties = new HashSet<CasualtyDb>();
            // ReSharper disable once VirtualMemberCallInConstructor
            Vehicles = new HashSet<VehicleDb>();
        }

        [Key]
        public int AccidentStatisticId { get; set; }

        public int TflId { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public string Location { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime Date { get; set; }

        public Severity Severity { get; set; }

        public string Borough { get; set; }

        public virtual ICollection<CasualtyDb> Casualties { get; set; }

        public virtual ICollection<VehicleDb> Vehicles { get; set; }        
    }
}
