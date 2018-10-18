using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Git.Domain.Models.TFL;

namespace Git.Domain
{
    public interface ITransportForLondonClient
    {
        Task<IList<object>> GetAllAccidentStatisticsAsDynamic(int year);

        Task<IReadOnlyList<AccidentStatistic>> GetAllAccidentStatistics(int year,
            Func<AccidentStatistic, bool> filter = null, 
            SortOptions<AccidentStatistic> sortOptions = null);

        Task<Paged<AccidentStatistic>> GetAccidentStatistics(
            int year, 
            int page = 1, 
            int pageSize = 100, 
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null
        );
    }
}