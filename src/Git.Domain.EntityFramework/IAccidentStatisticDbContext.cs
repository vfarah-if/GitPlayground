using System;
using System.Data.Entity;
using Git.Domain.EntityFramework.Models;

namespace Git.Domain.EntityFramework
{
    public interface IAccidentStatisticDbContext : IDisposable
    {
        DbSet<AccidentStatisticDb> AccidentStatistics { get; set; }
        DbSet<CasualtyDb> Casualties { get; set; }
        DbSet<VehicleDb> Vehicles { get; set; }
        Database Database { get; }
        ILogger Logger { get; }
    }
}