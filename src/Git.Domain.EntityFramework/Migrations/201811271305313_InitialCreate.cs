namespace Git.Domain.EntityFramework.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AccidentStatistics",
                c => new
                    {
                        AccidentStatisticId = c.Int(nullable: false, identity: true),
                        TflId = c.Int(nullable: false),
                        Latitude = c.String(),
                        Longitude = c.String(),
                        Location = c.String(),
                        Date = c.DateTime(nullable: false),
                        Severity = c.Int(nullable: false),
                        Borough = c.String(),
                    })
                .PrimaryKey(t => t.AccidentStatisticId);
            
            CreateTable(
                "dbo.Casualties",
                c => new
                    {
                        CasualtyId = c.Int(nullable: false, identity: true),
                        Age = c.Int(nullable: false),
                        Class = c.String(),
                        Severity = c.Int(nullable: false),
                        Mode = c.String(),
                        AgeBand = c.String(),
                    })
                .PrimaryKey(t => t.CasualtyId);
            
            CreateTable(
                "dbo.Vehicles",
                c => new
                    {
                        VehicleId = c.Int(nullable: false, identity: true),
                        VehicleType = c.String(),
                    })
                .PrimaryKey(t => t.VehicleId);
            
            CreateTable(
                "dbo.CasualtyAccidentStatistics",
                c => new
                    {
                        Casualty_CasualtyId = c.Int(nullable: false),
                        AccidentStatistic_AccidentStatisticId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Casualty_CasualtyId, t.AccidentStatistic_AccidentStatisticId })
                .ForeignKey("dbo.Casualties", t => t.Casualty_CasualtyId, cascadeDelete: true)
                .ForeignKey("dbo.AccidentStatistics", t => t.AccidentStatistic_AccidentStatisticId, cascadeDelete: true)
                .Index(t => t.Casualty_CasualtyId)
                .Index(t => t.AccidentStatistic_AccidentStatisticId);
            
            CreateTable(
                "dbo.VehicleAccidentStatistics",
                c => new
                    {
                        Vehicle_VehicleId = c.Int(nullable: false),
                        AccidentStatistic_AccidentStatisticId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Vehicle_VehicleId, t.AccidentStatistic_AccidentStatisticId })
                .ForeignKey("dbo.Vehicles", t => t.Vehicle_VehicleId, cascadeDelete: true)
                .ForeignKey("dbo.AccidentStatistics", t => t.AccidentStatistic_AccidentStatisticId, cascadeDelete: true)
                .Index(t => t.Vehicle_VehicleId)
                .Index(t => t.AccidentStatistic_AccidentStatisticId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.VehicleAccidentStatistics", "AccidentStatistic_AccidentStatisticId", "dbo.AccidentStatistics");
            DropForeignKey("dbo.VehicleAccidentStatistics", "Vehicle_VehicleId", "dbo.Vehicles");
            DropForeignKey("dbo.CasualtyAccidentStatistics", "AccidentStatistic_AccidentStatisticId", "dbo.AccidentStatistics");
            DropForeignKey("dbo.CasualtyAccidentStatistics", "Casualty_CasualtyId", "dbo.Casualties");
            DropIndex("dbo.VehicleAccidentStatistics", new[] { "AccidentStatistic_AccidentStatisticId" });
            DropIndex("dbo.VehicleAccidentStatistics", new[] { "Vehicle_VehicleId" });
            DropIndex("dbo.CasualtyAccidentStatistics", new[] { "AccidentStatistic_AccidentStatisticId" });
            DropIndex("dbo.CasualtyAccidentStatistics", new[] { "Casualty_CasualtyId" });
            DropTable("dbo.VehicleAccidentStatistics");
            DropTable("dbo.CasualtyAccidentStatistics");
            DropTable("dbo.Vehicles");
            DropTable("dbo.Casualties");
            DropTable("dbo.AccidentStatistics");
        }
    }
}
