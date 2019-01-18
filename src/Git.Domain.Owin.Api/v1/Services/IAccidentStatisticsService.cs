using System.Threading.Tasks;
using Git.Domain;
using Git.Domain.Models.TFL;
using Git.Owin.Api.Models;

namespace Git.Owin.Api.v1.Services
{
    public interface IAccidentStatisticsService
    {
        Task<Paging<AccidentStatistic>> GetAccidentStatistics(AccidentStatisticsQuery accidentStatisticsQuery);
    }
}