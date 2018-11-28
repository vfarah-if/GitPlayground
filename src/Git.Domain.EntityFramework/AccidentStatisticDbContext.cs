using System.Data.Entity;
using System.Diagnostics.CodeAnalysis;
using Git.Domain.EntityFramework.Models;

namespace Git.Domain.EntityFramework
{
    [ExcludeFromCodeCoverage]
    public class AccidentStatisticDbContext: DbContext
    {
        public AccidentStatisticDbContext()
        {
            Database.SetInitializer(new AccidentStatisticDbInitializer());
        }
        public DbSet<AccidentStatisticDb> AccidentStatistics { get; set; }
        public DbSet<CasualtyDb> Casualties { get; set; }
        public DbSet<VehicleDb> Vehicles{ get; set; }
    }
}
