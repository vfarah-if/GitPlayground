using Git.Domain.EntityFramework.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Git.Domain.EntityFramework
{    
    public class AccidentStatisticRepository : IAccidentStatisticRepository
    {
//        private const int MaxPageSize = 1000;
        private readonly IAccidentStatisticDbContext _accidentStatisticDbContext;

        public AccidentStatisticRepository(IAccidentStatisticDbContext accidentStatisticDbContext)
        {
            _accidentStatisticDbContext = accidentStatisticDbContext;
        }

        public async Task<Paged<AccidentStatisticDb>> Get(
            Expression<Func<AccidentStatisticDb, bool>> filter = null,
            SortOptions<AccidentStatisticDb> sortOption = null,
            int page = 1,
            int pageSize = 100)
        {
            if (page < 1)
            {
                Trace.TraceWarning($"Page was {page} and will be set to the minimum page of 1");
                page = 1;
            }

            /* Should validate the maximum page size but will leave it open for abuse as :)
                as it is a smallish database, readonly and it is a great way to see why
                it is bad to leave it open
             */
              // Uncomment if you want it done better and write some tests for it :)
//            if (pageSize > MaxPageSize)
//            {
//                pageSize = MaxPageSize;
//            }

            if (sortOption == null)
            {
                Trace.TraceWarning($"The default date sorting descending will be assumed");
                sortOption = SortOptions<AccidentStatisticDb>.OrderBy(x => x.Date);
            }

            var accidentCount = await Count(filter);

            var maxPageCount = accidentCount % pageSize != 0
                ? accidentCount / pageSize + 1
                : accidentCount / pageSize;
            Trace.TraceInformation($"The maximum page count is {maxPageCount}");

            if (page > maxPageCount)
            {
                Trace.TraceWarning($"The current page {page} is below the maximum page of {maxPageCount} so will be defaulted to the last page");
                page = maxPageCount;
            }

            var skip = (page - 1) * pageSize;
            Trace.TraceInformation($"The skip is {skip}");

            IQueryable<AccidentStatisticDb> accidentQuery = filter != null
                ? _accidentStatisticDbContext?
                    .AccidentStatistics
                    .Where(filter)
                    .Include(x => x.Casualties)
                    .Include(x => x.Vehicles)
                    .AsQueryable()
                : _accidentStatisticDbContext
                    .AccidentStatistics
                    .Include(x => x.Casualties)
                    .Include(x => x.Vehicles)
                    .AsQueryable();

            Debug.Assert(accidentQuery != null, nameof(accidentQuery) + " != null");
            IEnumerable<AccidentStatisticDb> accidents = await accidentQuery
                    .OrderIt(sortOption.SortBy, sortOption.IsAscending)
                    .Skip(skip)
                    .Take(pageSize)
                    .ToListAsync();            

            return Paged<AccidentStatisticDb>.Create(accidentCount, accidents, page, accidents.Count(), maxPageCount);
        }

        public async Task<int> Count(Expression<Func<AccidentStatisticDb, bool>> filter = null)
        {
            return filter != null 
                ? await _accidentStatisticDbContext.AccidentStatistics.CountAsync(filter) 
                : await _accidentStatisticDbContext.AccidentStatistics.CountAsync();
        }

        public void Dispose()
        {
            _accidentStatisticDbContext?.Dispose();
        }
    }
}
