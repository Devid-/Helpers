namespace HelpersLibrary
{
    using System.Globalization;

    public static class StringExtensions
    {
        public static int ToInt(this string value, int defaultValue)
        {
            return int.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out int result) ? result : defaultValue;
        }

        public static long ToLong(this string value, long defaultValue)
        {
            return long.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out long result) ? result : defaultValue;
        }

        public static decimal ToDecimal(this string value, decimal defaultValue)
        {
            return decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal result) ? result : defaultValue;
        }
    }
}
