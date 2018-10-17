using System;
using System.Collections.Generic;

namespace Git.Domain
{
    public class Cache<TKey, TValue>
    {
        private readonly Dictionary<TKey, CacheItem<TValue>> _cache = new Dictionary<TKey, CacheItem<TValue>>();

        public void Store(TKey key, TValue value, TimeSpan expiresAfter)
        {
            _cache[key] = new CacheItem<TValue>(value, expiresAfter);
        }

        public TValue Get(TKey key)
        {
            if (!_cache.ContainsKey(key)) return default(TValue);
            var cached = _cache[key];
            if (DateTimeOffset.Now - cached.Created >= cached.ExpiresAfter)
            {
                InvalidateCacheFor(key);
                return default(TValue);
            }
            return cached.Value;
        }

        public bool InvalidateCacheFor(TKey key)
        {
            return _cache.ContainsKey(key) && _cache.Remove(key);
        }
    }
}
