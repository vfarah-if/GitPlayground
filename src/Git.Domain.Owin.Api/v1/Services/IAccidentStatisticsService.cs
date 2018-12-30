using System.Threading.Tasks;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.Models;

namespace Git.Domain.Owin.Api.v1.Services
{
    public interface IAccidentStatisticsService
    {
        Task<Paging<AccidentStatistic>> GetAccidentStatistics(AccidentStatisticsQuery accidentStatisticsQuery);
    }
}