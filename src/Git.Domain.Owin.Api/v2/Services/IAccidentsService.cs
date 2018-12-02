using System.Threading.Tasks;
using Git.Domain.EntityFramework.Models;
using Git.Domain.Owin.Api.Models;

namespace Git.Domain.Owin.Api.v2.Services
{
    public interface IAccidentsService
    {
        Task<Paged<AccidentStatisticDb>> GetAccidents(AccidentStatisticsQuery accidentStatisticsQuery);
    }
}