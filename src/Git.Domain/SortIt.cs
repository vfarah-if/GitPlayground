using System;
using System.Collections.Generic;

namespace Git.Domain
{
    public static class SortIt<TSource>
    {
        public static SortIt<TSource, TKey> With<TKey>
            (Func<TSource, TKey> projection)
        {
            return new SortIt<TSource, TKey>(projection);
        }

        //TODO: Tests for adding a comparer
        public static SortIt<TSource, TKey> With<TKey>
            (Func<TSource, TKey> projection, IComparer<TKey> comparer)
        {
            return new SortIt<TSource, TKey>(projection, comparer);
        }
    }

    public class SortIt<TSource, TKey> : IComparer<TSource>
    {
        readonly Func<TSource, TKey> projection;
        readonly IComparer<TKey> comparer;

        public SortIt(Func<TSource, TKey> projection)
            : this(projection, null)
        {
        }

        public SortIt(Func<TSource, TKey> projection,
            IComparer<TKey> comparer)
        {
            this.comparer = comparer ?? Comparer<TKey>.Default;
            this.projection = projection ?? throw new ArgumentNullException(nameof(projection));
        }

        public int Compare(TSource x, TSource y)
        {
            if (x == null && y == null)
            {
                return 0;
            }
            if (x == null)
            {
                return -1;
            }
            return y == null ? 1 : comparer.Compare(projection(x), projection(y));
        }
    }
}
