using System;
using System.Linq;
using System.Linq.Expressions;

namespace Git.Domain.EntityFramework
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> OrderIt<T>(this IQueryable<T> source, Expression<Func<T, object>> keySelector, bool ascending)
        {
            var selectorBody = keySelector.Body;
            if (selectorBody.NodeType == ExpressionType.Convert)
                selectorBody = ((UnaryExpression)selectorBody).Operand;
            var selector = Expression.Lambda(selectorBody, keySelector.Parameters);
            var queryBody = Expression.Call(typeof(Queryable),
                ascending ? "OrderBy" : "OrderByDescending",
                new [] { typeof(T), selectorBody.Type },
                source.Expression, Expression.Quote(selector));
            return source.Provider.CreateQuery<T>(queryBody);
        }
    }
}
