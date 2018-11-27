using System.Data.Entity.Migrations;
using System.Diagnostics;

namespace Git.Domain.EntityFramework.Migrations
{

    internal sealed class Configuration : DbMigrationsConfiguration<Git.Domain.EntityFramework.AccidentStatisticDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(AccidentStatisticDbContext context)
        {
            Debugger.Break();
            base.Seed(context);
        }
    }
}
