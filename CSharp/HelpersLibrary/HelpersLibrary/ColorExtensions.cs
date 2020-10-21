namespace HelpersLibrary
{
    using System.Windows.Media;
    using Services;

    public static class ColorExtensions
    {
        public static string ToHex(this Color color)
        {
            return ColorService.ColorToHex(color);
        }

        public static string ToHex(this Color? color)
        {
            return ColorService.ColorToHex(color);
        }

        public static void ToRgb(this Color color, out byte red, out byte green, out byte blue, out byte alpha)
        {
            ColorService.ColorToRgb(color, out red, out green, out blue, out alpha);
        }

        public static Brush ToBrush(this Color? color, int opacity = 100)
        {
            return ColorService.ColorToBrush(color, opacity);
        }

        public static Brush ToBrush(this Color color, int opacity = 100)
        {
            return ColorService.ColorToBrush(color, opacity);
        }

        public static Color? ToColor(this Brush color)
        {
            return ColorService.BrushToColor(color);
        }

        public static void ToHsl(this Color color, out double hue, out double saturation, out double luminance, out double alpha)
        {
            ColorService.ColorToHSL(color, out hue, out saturation, out luminance, out alpha);
        }

        public static void ToHsv(this Color color, out double hue, out double saturation, out double value, out double alpha)
        {
            ColorService.ColorToHSV(color, out hue, out saturation, out value, out alpha);
        }
    }
}
