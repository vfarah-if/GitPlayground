using Git.Domain.EntityFramework;
using Git.Domain.EntityFramework.Models;
using Git.Domain.Owin.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Git.Domain.Models.TFL;

namespace Git.Domain.Owin.Api.v2.Services
{
    public class AccidentsService : IAccidentsService
    {
        private readonly IAccidentStatisticRepository accidentStatisticRepository;

        public AccidentsService(IAccidentStatisticRepository accidentStatisticRepository)
        {
            this.accidentStatisticRepository = accidentStatisticRepository;
        }
        public Task<Paged<AccidentStatisticDb>> GetAccidents(AccidentStatisticsQuery accidentStatisticsQuery)
        {
            var severity = ParseSeverity(accidentStatisticsQuery.Severity);
            var result = accidentStatisticRepository.Get(filter =>
                    filter.Date >= accidentStatisticsQuery.From &&
                    filter.Date <= accidentStatisticsQuery.To && 
                    filter.Severity == severity,
                null, 
                accidentStatisticsQuery.Page,
                accidentStatisticsQuery.PageSize);
            return result;
        }

        private static Severity ParseSeverity(string severity)
        {
            return Enum.TryParse(severity, true, out Severity result) ? result : Severity.Fatal;
        }

    }
}
