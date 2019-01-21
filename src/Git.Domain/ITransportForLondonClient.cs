using Git.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Git.Domain
{
    public interface ITransportForLondonClient
    {
        Task<IReadOnlyList<AccidentStatistic>> GetAllAccidentStatistics(
            int year,
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null);

        Task<Paging<AccidentStatistic>> GetAccidentStatistics(
            int year,
            int page = 1,
            int pageSize = 100,
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null);

        Task<Paging<AccidentStatistic>> GetAccidentStatistics(
            DateTime from,
            DateTime to,
            Severity severity,
            SortOptions<AccidentStatistic> sortOptions,
            int page = 1,
            int pageSize = 100
        );
    }
}