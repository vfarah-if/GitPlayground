using System;
using System.Linq.Expressions;

namespace Git.Domain.EntityFramework
{
    public class SortOptions<TSortObject>
    {
        public SortOptions(Expression<Func<TSortObject, object>> sortBy, 
            bool isAscending = true)
        {
            SortBy = sortBy;
            IsAscending = isAscending;
        }

        public Expression<Func<TSortObject, object>> SortBy { get; }
        public bool IsAscending { get; }

        public static SortOptions<TSortObject> OrderBy(Expression<Func<TSortObject, object>> sortBy, bool ascending = true)
        {
            return new SortOptions<TSortObject>(sortBy, ascending);
        }
    }
}
