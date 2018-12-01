using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Git.Domain.EntityFramework.Models;

namespace Git.Domain.EntityFramework
{
    public interface IAccidentStatisticRepository : IDisposable
    {
        Task<int> Count(Expression<Func<AccidentStatisticDb, bool>> filter = null);
        Task<Paged<AccidentStatisticDb>> Get(
            Expression<Func<AccidentStatisticDb, bool>> filter = null, 
            Expression<Func<AccidentStatisticDb, object>> sortBy = null, 
            bool ascending = false,
            int page = 1, 
            int pageSize = 100);
    }
}