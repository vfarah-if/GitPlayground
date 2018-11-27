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
                        AccidentStatistic_AccidentStatisticId = c.Int(),
                    })
                .PrimaryKey(t => t.CasualtyId)
                .ForeignKey("dbo.AccidentStatistics", t => t.AccidentStatistic_AccidentStatisticId)
                .Index(t => t.AccidentStatistic_AccidentStatisticId);
            
            CreateTable(
                "dbo.Vehicles",
                c => new
                    {
                        VehicleId = c.Int(nullable: false, identity: true),
                        VehicleType = c.String(),
                        AccidentStatistic_AccidentStatisticId = c.Int(),
                    })
                .PrimaryKey(t => t.VehicleId)
                .ForeignKey("dbo.AccidentStatistics", t => t.AccidentStatistic_AccidentStatisticId)
                .Index(t => t.AccidentStatistic_AccidentStatisticId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Vehicles", "AccidentStatistic_AccidentStatisticId", "dbo.AccidentStatistics");
            DropForeignKey("dbo.Casualties", "AccidentStatistic_AccidentStatisticId", "dbo.AccidentStatistics");
            DropIndex("dbo.Vehicles", new[] { "AccidentStatistic_AccidentStatisticId" });
            DropIndex("dbo.Casualties", new[] { "AccidentStatistic_AccidentStatisticId" });
            DropTable("dbo.Vehicles");
            DropTable("dbo.Casualties");
            DropTable("dbo.AccidentStatistics");
        }
    }
}
