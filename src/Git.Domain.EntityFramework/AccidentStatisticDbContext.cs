using System.Data.Entity;
using System.Diagnostics.CodeAnalysis;
using Git.Domain.EntityFramework.Models;

namespace Git.Domain.EntityFramework
{
    [ExcludeFromCodeCoverage]
    public class AccidentStatisticDbContext : DbContext, IAccidentStatisticDbContext
    {
        public AccidentStatisticDbContext(ILogger logger)
        {
            Database.SetInitializer(new AccidentStatisticDbInitializer(logger));
        }
        public DbSet<AccidentStatisticDb> AccidentStatistics { get; set; }
        public DbSet<CasualtyDb> Casualties { get; set; }
        public DbSet<VehicleDb> Vehicles{ get; set; }
    }
}
