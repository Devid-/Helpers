using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HelpersLibrary
{
    public static class EnumerableExtensions
    {
        public static bool HasAny<T>(this IEnumerable<T> collection)
        {
            return (collection != null) && collection.Any();
        }

        public static IEnumerable<T> ForEachReturn<T>(this IEnumerable<T> elements, Action<T> action)
        {
            return elements.Select(element =>
            {
                action(element);
                return element;
            });
        }

    }
}
