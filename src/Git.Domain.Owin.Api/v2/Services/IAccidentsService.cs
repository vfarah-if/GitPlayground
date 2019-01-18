using System.Threading.Tasks;
using Git.Domain;
using Git.Domain.EntityFramework.Models;
using Git.Owin.Api.Models;

namespace Git.Owin.Api.v2.Services
{
    public interface IAccidentsService
    {
        Task<Paging<AccidentStatisticDb>> GetAccidents(AccidentStatisticsQuery accidentStatisticsQuery);
    }
}