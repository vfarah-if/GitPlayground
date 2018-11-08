using System;
using System.Collections.Generic;
using System.Linq;

namespace Git.Domain
{
    public class Paged<T>
    {
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

        public static Paged<T> Create(long total, IEnumerable<T> data, int page, int pageSize)
        {
            return new Paged<T>(total, data, page, pageSize);
        }

        public static Paged<T> Generate(IEnumerable<T> allData, int pageSize, int page)
        {
            long total = allData.LongCount();
            // ReSharper disable once PossibleLossOfFraction because fraction loss with paging will be fine
            double pageCount = total / pageSize;
            var maxPageCount = Convert.ToInt32(Math.Round(pageCount, MidpointRounding.AwayFromZero));
            var zeroIndexedCurrentPage = page - 1;
            if (zeroIndexedCurrentPage < 0)
            {
                zeroIndexedCurrentPage = 0;
            }
            if (zeroIndexedCurrentPage > maxPageCount)
            {
                zeroIndexedCurrentPage = maxPageCount;
            }

            var skip = zeroIndexedCurrentPage * pageSize;
            var data = allData.Skip(skip).Take(pageSize);
            return Paged<T>.Create(total, data, zeroIndexedCurrentPage + 1, data.Count());
        }
    }
}