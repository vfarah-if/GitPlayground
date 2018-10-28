using Git.Domain.Models.TFL;

namespace Git.Domain
{
    public static class Constants
    {
        public static class AccidentStatisticSorting
        {
            // Ascending
            public static readonly SortOptions<AccidentStatistic> ByDateAscending
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Date));
            public static readonly SortOptions<AccidentStatistic> ByLocationAscending
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Location));
            public static readonly SortOptions<AccidentStatistic> BySeverityAscending
                            = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Severity));
            // Descending
            public static readonly SortOptions<AccidentStatistic> ByDateDescending
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Date), true);
            public static readonly SortOptions<AccidentStatistic> ByLocationDescending
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Location), true);
            public static readonly SortOptions<AccidentStatistic> BySeverityDescending
                = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Severity), true);
        }
    }
}
