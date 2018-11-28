using System.Data.Entity.Migrations;
using System.Diagnostics.CodeAnalysis;

namespace Git.Domain.EntityFramework.Migrations
{
    [ExcludeFromCodeCoverage]
    internal sealed class Configuration : DbMigrationsConfiguration<Git.Domain.EntityFramework.AccidentStatisticDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(AccidentStatisticDbContext context)
        {
            // NOTE: This seed method could have been used but I preferred the bespoke initializer,
            // see AccidentStatisticDbInitializer for more detail
            base.Seed(context);
        }
    }
}
