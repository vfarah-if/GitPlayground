using System.Data.Entity;
using System.Diagnostics;
using System.Linq;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatisticDbInitializer : DropCreateDatabaseAlways<AccidentStatisticDbContext>
    {
        protected override void Seed(AccidentStatisticDbContext context)
        {
            if (!context.AccidentStatistics.Any())
            {
                GenerateDataFromLiveFeed(context);
            }

            base.Seed(context);
        }

        private void GenerateDataFromLiveFeed(AccidentStatisticDbContext context)
        {
            Trace.TraceInformation("About to generate data from the TFL live feed ...");
        }
    }
}
