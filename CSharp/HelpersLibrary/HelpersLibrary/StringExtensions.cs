namespace HelpersLibrary
{
    using System;
    using System.Collections.Generic;
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

        /// <summary>Limits the specified string. </summary>
        /// <param name="text">The string. </param>
        /// <param name="numberOfCharacters">The number of characters. </param>
        /// <returns>Limited string. </returns>
        public static string Limit(this string text, int numberOfCharacters)
        {
            numberOfCharacters = Math.Abs(numberOfCharacters);
            if (string.IsNullOrEmpty(text))
            {
                return text;
            }

            if (numberOfCharacters == 0)
            {
                return string.Empty;
            }

            if (text.Length <= numberOfCharacters)
            {
                return text;
            }

            return text.Substring(0, numberOfCharacters);
        }

        public static string JoinMultiline(this string[] values, string separator = "\r\n")
        {
            if (values != null && values.Length > 0)
            {
                return string.Join(separator, values);
            }

            return string.Empty;
        }

        public static string JoinMultiline(this IEnumerable<string> values, string separator = "\r\n")
        {
            if (values != null)
            {
                return string.Join(separator, values);
            }

            return string.Empty;
        }

        public static string[] SplitMultiline(this string value, StringSplitOptions splitOptions = StringSplitOptions.None)
        {
            if (!string.IsNullOrEmpty(value))
            {
                return value.Split(new[] { Environment.NewLine }, splitOptions);
            }

            return new string[0];
        }
    }
}
