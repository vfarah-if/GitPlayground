using System;
using System.Linq.Expressions;

namespace Git.Domain.EntityFramework
{
    public class SortOption<TSortObject>
    {
        public SortOption(Expression<Func<TSortObject, object>> sortBy, 
            bool isAscending = true)
        {
            SortBy = sortBy;
            IsAscending = isAscending;
        }

        public Expression<Func<TSortObject, object>> SortBy { get; }
        public bool IsAscending { get; }

        public static SortOption<TSortObject> OrderBy(Expression<Func<TSortObject, object>> sortBy, bool ascending = true)
        {
            return new SortOption<TSortObject>(sortBy, ascending);
        }
    }
}
