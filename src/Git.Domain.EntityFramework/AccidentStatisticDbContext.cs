using System.Data.Entity;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatisticDbContext: DbContext
    {
        public DbSet<AccidentStatistic> AccidentStatistics { get; set; }
        public DbSet<Casualty> Casualties { get; set; }
        public DbSet<Vehicle> Vehicles{ get; set; }
    }
}
