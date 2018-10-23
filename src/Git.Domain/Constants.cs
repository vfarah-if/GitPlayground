using Git.Domain.Models.TFL;

namespace Git.Domain
{
    public static class Constants
    {
        public static class AccidentStatisticSorting
        {
            public static readonly SortOptions<AccidentStatistic> ByDateAscending
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Date));

            public static readonly SortOptions<AccidentStatistic> ByDateDescending
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Date), true);
        }
    }
}
