using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Git.Domain.EntityFramework.Models;

namespace Git.Domain.EntityFramework
{
    public interface IAccidentStatisticRepository : IDisposable
    {
        Task<int> Count(Expression<Func<AccidentStatisticDb, bool>> filter = null);
        Task<Paging<AccidentStatisticDb>> Get(
            Expression<Func<AccidentStatisticDb, bool>> filter = null, 
            SortOptions<AccidentStatisticDb> sortOption = null,
            int page = 1, 
            int pageSize = 100);
    }
}