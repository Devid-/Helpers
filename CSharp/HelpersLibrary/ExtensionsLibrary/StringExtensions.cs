using System;
using System.Globalization;

namespace ExtensionsLibrary
{
    public static class StringExtensions
    {
        public static int ToInt(this string value, int defaultValue)
        {
            if (int.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
            {
                return result;
            }

            return defaultValue;
        }

        public static long ToLong(this string value, long defaultValue)
        {
            if (long.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
            {
                return result;
            }

            return defaultValue;
        }

        public static decimal ToDecimal(this string value, decimal defaultValue)
        {
            if (decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
            {
                return result;
            }

            return defaultValue;
        }

    }
}
