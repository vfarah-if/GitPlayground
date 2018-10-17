using System.Collections.Generic;

namespace Git.Domain
{
    public class SortOptions<TCompareObject>
    {
        public SortOptions(IComparer<TCompareObject> comparer, bool inReverse = false)
        {
            Comparer = comparer;
            InReverse = inReverse;
        }

        public IComparer<TCompareObject> Comparer { get; }
        public bool InReverse { get; }
    }
}