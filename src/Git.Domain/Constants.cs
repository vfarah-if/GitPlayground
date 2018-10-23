using Git.Domain.Models.TFL;

namespace Git.Domain
{
    public static class Constants
    {
        public static class AccidentStatisticSorting
        {
            public static readonly SortOptions<AccidentStatistic> ByDateAscendingOptions
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Date));

            public static readonly SortOptions<AccidentStatistic> ByDateDescendingOptions
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Date), true);
        }
    }
}
