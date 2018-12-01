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
        private readonly IAccidentStatisticDbContext _accidentStatisticDbContext;

        public AccidentStatisticRepository(IAccidentStatisticDbContext accidentStatisticDbContext)
        {
            _accidentStatisticDbContext = accidentStatisticDbContext;
        }

        public async Task<Paged<AccidentStatisticDb>> Get(
            Expression<Func<AccidentStatisticDb, bool>> filter = null,            
            Expression<Func<AccidentStatisticDb, object>> sortBy = null,
            bool inReverse = false,
            int page = 1,
            int pageSize = 100)
        {
            if (page < 1)
            {
                page = 1;
            }

            // Should validate the maximum page size but will leave it open for abuse :)

            var skip = (page - 1) * pageSize;
            if (sortBy == null)
            {
                sortBy = db => db.Date;
                inReverse = true;
            }

            var accidentCount = await Count(filter);

            var maxPageCount = accidentCount % pageSize != 0
                ? accidentCount / pageSize + 1
                : accidentCount / pageSize;

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
            IEnumerable<AccidentStatisticDb> accidents = inReverse
                ? await accidentQuery
                    .OrderByDescending(sortBy)
                    .Skip(skip)
                    .Take(pageSize)
                    .ToListAsync()
                : await accidentQuery
                    .OrderBy(sortBy)
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
