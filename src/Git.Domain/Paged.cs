using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Git.Domain
{
    public class Paged<T>
    {
        public Paged(long total, IEnumerable<T> data, int page, int pageSize, int lastPage)
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

        public static Paged<T> Create(long total, IEnumerable<T> data, int page, int pageSize, int lastPage)
        {
            return new Paged<T>(total, data, page, pageSize, lastPage);
        }

        public static Paged<T> Generate(IEnumerable<T> allData, int pageSize, int page)
        {
            if (allData == null)
            {
                throw new ArgumentNullException(nameof(allData));
            }
            long total = allData.LongCount();
            var maxPageCount = (int) Math.Ceiling((double) total / pageSize);
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
            return Paged<T>.Create(total, data, zeroIndexedCurrentPage + 1, data.Count(), maxPageCount);
        }
    }
}