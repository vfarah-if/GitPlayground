namespace Git.Domain.EntityFramework.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OptimizeOrderBy : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.AccidentStatistics", "Date");
        }

        public override void Down()
        {
            DropIndex("dbo.AccidentStatistics", new[] {"Date"});
        }
    }
}
