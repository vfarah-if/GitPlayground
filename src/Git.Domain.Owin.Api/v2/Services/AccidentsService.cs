using Git.Domain.EntityFramework;
using Git.Domain.EntityFramework.Models;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Git.Domain.EntityFramework.SortOptions<Git.Domain.EntityFramework.Models.AccidentStatisticDb>;

namespace Git.Domain.Owin.Api.v2.Services
{
    public class AccidentsService : IAccidentsService
    {
        private readonly IAccidentStatisticRepository accidentStatisticRepository;
        private readonly Dictionary<string, EntityFramework.SortOptions<AccidentStatisticDb>> _sortOptions;

        public AccidentsService(IAccidentStatisticRepository accidentStatisticRepository)
        {
            this.accidentStatisticRepository = accidentStatisticRepository;
            _sortOptions = new Dictionary<string, EntityFramework.SortOptions<AccidentStatisticDb>>(StringComparer.InvariantCultureIgnoreCase)
            {
                { "DateAscending", OrderBy(sortBy:x => x.Date, ascending:true)},
                { "LocationAscending", OrderBy(x => x.Location, true)},
                { "BoroughAscending", OrderBy(x => x.Borough, true)},
                { "AccidentStatisticIdAscending", OrderBy(x => x.AccidentStatisticId, true)},
                { "TflIdAscending", OrderBy(x => x.TflId, true)},

                { "DateDescending",  OrderBy(x => x.Date)},
                { "LocationDescending", OrderBy(x => x.Location)},
                { "BoroughDescending", OrderBy(x => x.Borough)},
                { "AccidentStatisticIdDescending", OrderBy(x => x.AccidentStatisticId)},
                { "TflIdDescending", OrderBy(x => x.TflId)},
            };
        }

        public async Task<Paged<AccidentStatisticDb>> GetAccidents(AccidentStatisticsQuery accidentStatisticsQuery)
        {
            if (accidentStatisticsQuery == null)
            {
                throw new ArgumentNullException(nameof(accidentStatisticsQuery));
            }

            var severity = ParseSeverity(accidentStatisticsQuery.Severity);
            var result = await accidentStatisticRepository.Get(filter =>
                    filter.Date >= accidentStatisticsQuery.From &&
                    filter.Date <= accidentStatisticsQuery.To &&
                    filter.Severity == severity,
                ParseSortBy(accidentStatisticsQuery.SortBy),
                accidentStatisticsQuery.Page,
                accidentStatisticsQuery.PageSize);
            return result;
        }

        private EntityFramework.SortOptions<AccidentStatisticDb> ParseSortBy(string sortBy)
        {
            return string.IsNullOrEmpty(sortBy) 
                ? OrderBy(x => x.Date) 
                : _sortOptions[sortBy] ?? OrderBy(x => x.Date);
        }

        private static Severity ParseSeverity(string severity)
        {
            return Enum.TryParse(severity, true, out Severity result) ? result : Severity.Fatal;
        }
    }
}
