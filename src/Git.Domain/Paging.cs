using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Git.Domain
{
    public class Paging<T>
    {
        private const int MinimumPageSize = 1;

        public Paging(long total, IEnumerable<T> data, int page, int pageSize, int lastPage)
        {
            Total = total;
            Data = data;
            Page = page;
            PageSize = pageSize;
            LastPage = lastPage;
        }

        [JsonProperty(PropertyName = "data")]
        public IEnumerable<T> Data { get; }
        [JsonProperty(PropertyName = "page")]
        public int Page { get; }      
        [JsonProperty(PropertyName = "nextPage")]
        public int? NextPage
        {
            get
            {
                if (Page < LastPage)
                {
                    return Page + 1;
                }
                return null;
            }
        }
        [JsonProperty(PropertyName = "previousPage")]
        public int? PreviousPage
        {
            get
            {
                if (Page == 1)
                {
                    return null;                    
                }

                return Page - 1;
            }
        }
        [JsonProperty(PropertyName = "lastPage")]
        public int LastPage { get; }
        [JsonProperty(PropertyName = "pageSize")]
        public int PageSize { get; }
        [JsonProperty(PropertyName = "total")]
        public long Total { get; }

        public static Paging<T> Create(long total, IEnumerable<T> data, int page, int pageSize, int lastPage)
        {
            return new Paging<T>(total, data, page, pageSize, lastPage);
        }

        public static Paging<T> Generate(IEnumerable<T> allData, int pageSize, int page)
        {
            if (allData == null)
            {
                throw new ArgumentNullException(nameof(allData));
            }

            if (pageSize <= 0)
            {
                pageSize = MinimumPageSize;
            }

            int total = allData.Count();
            var maxPageCount = total % pageSize != 0
                ? total / pageSize + 1
                : total / pageSize;

            var zeroIndexedCurrentPage = page - 1;
            if (IsCurrentPageLessThanZero(zeroIndexedCurrentPage))
            {
                zeroIndexedCurrentPage = 0;
            }

            if (IsPageGreaterThanZeroOrLastPage(page, maxPageCount))
            {
                zeroIndexedCurrentPage = maxPageCount - 1;
            }

            var skip = zeroIndexedCurrentPage * pageSize;
            var data = allData.Skip(skip).Take(pageSize);
            return Paging<T>.Create(total, data, zeroIndexedCurrentPage + 1, data.Count(), maxPageCount);
        }

        private static bool IsCurrentPageLessThanZero(int zeroIndexedCurrentPage)
        {
            return zeroIndexedCurrentPage < 0;
        }

        private static bool IsPageGreaterThanZeroOrLastPage(int page, int maxPageCount)
        {
            return maxPageCount > 0 && page >= maxPageCount;
        }
    }
}