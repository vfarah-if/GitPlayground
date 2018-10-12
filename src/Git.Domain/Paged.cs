using System.Collections.Generic;

namespace Git.Domain
{
    public class Paged<T> where T : class
    {
        public static Paged<T> Create(long total, IEnumerable<T> data, int page, int pageSize)
        {
            return new Paged<T>(total, data, page, pageSize);
        }

        public Paged(long total, IEnumerable<T> data, int page, int pageSize)
        {
            Total = total;
            Data = data;
            Page = page;
            PageSize = pageSize;
        }
        public long Total { get; }
        public IEnumerable<T> Data { get; }
        public int Page { get; }
        public int PageSize { get; }
    }
}