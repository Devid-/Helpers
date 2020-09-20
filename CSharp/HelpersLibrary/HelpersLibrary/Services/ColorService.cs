namespace HelpersLibrary
{
    using System;
    using System.Globalization;
    using System.Text.RegularExpressions;
    using System.Windows.Media;

    public enum RgbColorModel
    {
        /// <summary>
        /// HSL → hue, saturation, lightness or luminance
        /// </summary>
        HSL = 0,

        /// <summary>
        /// HSV → hue, saturation, value
        /// </summary>
        HSV = 1
    }

    public class ColorService
    {
        const double Epsilon = 0.0001;


        /// <summary>
        /// Converts a Brush to its corresponding hex color
        /// </summary>
        /// <param name="color"></param>
        /// <returns></returns>
        public static string BrushToHex(Brush color)
        {
            return ColorToHex(((SolidColorBrush)color).Color);
        }

        /// <summary>
        /// Convert Brush to Color
        /// </summary>
        /// <param name="colorBrush"></param>
        /// <returns></returns>
        public static Color? BrushToColor(Brush colorBrush)
        {
            if (colorBrush == null)
            {
                return null;
            }

            var solidColorBrush = (SolidColorBrush)colorBrush;
            var color = solidColorBrush.Color;
            color.A = (byte)(solidColorBrush.Opacity * color.A);
            return color;
        }

        /// <summary>
        /// Converts Color to Brush
        /// </summary>
        /// <param name="color"></param>
        /// <param name="opacity">Opacity of the Brush</param>
        /// <returns></returns>
        public static Brush ColorToBrush(Color? color, double opacity = 100)
        {
            if (color == null)
            {
                return null;
            }

            var result = new SolidColorBrush((Color)color)
            {
                Opacity = opacity
            };
            result.Freeze();
            return result;
        }

        /// <summary>
        /// Converts a specified color to (A)HEX color format. 
        /// </summary>
        /// <param name="color"></param>
        /// <returns></returns>
        public static string ColorToHex(Color? color)
        {
            if (color == null)
            {
                return string.Empty;
            }

            var colorValue = color.Value;

            if (colorValue.A == 255)
            {
                return "#" + colorValue.R.ToString("X2") + colorValue.G.ToString("X2") + colorValue.B.ToString("X2");
            }

            return "#" + colorValue.A.ToString("X2") + colorValue.R.ToString("X2") + colorValue.G.ToString("X2") + colorValue.B.ToString("X2");
        }

        /// <summary>
        /// Converts a (A)HEX to Color
        /// </summary>
        /// <param name="hexColor"></param>
        /// <returns></returns>
        public static Color? HexToColor(string hexColor)
        {
            if (string.IsNullOrWhiteSpace(hexColor))
            {
                return null;
            }

            hexColor = GetHex(hexColor.ToLower())?.Trim()?.TrimStart('#');

            if (hexColor == null)
            {
                return null;
            }

            if (!HexColorValidate("#" + hexColor))
            {
                return null;
            }

            if (hexColor.Length == 6)
            {
                return Color.FromArgb(255, // hardcoded opaque
                                      byte.Parse(hexColor.Substring(0, 2), NumberStyles.HexNumber),
                                      byte.Parse(hexColor.Substring(2, 2), NumberStyles.HexNumber),
                                      byte.Parse(hexColor.Substring(4, 2), NumberStyles.HexNumber));
            }

            return Color.FromArgb(byte.Parse(hexColor.Substring(0, 2), NumberStyles.HexNumber),
                                  byte.Parse(hexColor.Substring(2, 2), NumberStyles.HexNumber),
                                  byte.Parse(hexColor.Substring(4, 2), NumberStyles.HexNumber),
                                  byte.Parse(hexColor.Substring(6, 2), NumberStyles.HexNumber));
        }

        /// <summary>
        /// Converts the RGB(A) color to  (A)HEX color format
        /// </summary>
        /// <param name="red"></param>
        /// <param name="green"></param>
        /// <param name="blue"></param>
        /// <param name="alpha"></param>
        /// <returns></returns>
        public static string RgbToHex(byte red, byte green, byte blue, byte alpha = 255)
        {
            return ColorToHex(Color.FromArgb(alpha, red, green, blue));
        }

        /// <summary>
        /// Converts a (A)HEX color to RGB(A) format
        /// </summary>
        /// <param name="hexColor"></param>
        /// <param name="red"></param>
        /// <param name="green"></param>
        /// <param name="blue"></param>
        /// <param name="alpha"></param>
        public static void HexToRgb(string hexColor, out byte red, out byte green, out byte blue, out byte alpha)
        {
            var color = HexToColor(hexColor);

            if (color != null)
            {
                alpha = color.Value.A;
                red = color.Value.R;
                green = color.Value.G;
                blue = color.Value.B;
            }
            else
            {
                throw new ArgumentException($"{hexColor} is invalid hex color format");
            }
        }

        /// <summary>
        /// Converts a Color to (A)RGB component
        /// </summary>
        /// <param name="color"></param>
        /// <param name="red"></param>
        /// <param name="green"></param>
        /// <param name="blue"></param>
        /// <param name="alpha"></param>
        public static void ColorToRgb(Color color, out byte red, out byte green, out byte blue, out byte alpha)
        {
            alpha = color.A;
            red = color.R;
            green = color.G;
            blue = color.B;
        }

        /// <summary>
        /// Converts the given color in RGB to Color
        /// </summary>
        /// <param name="red"></param>
        /// <param name="green"></param>
        /// <param name="blue"></param>
        /// <param name="alpha">range: [0-255]</param>
        /// <returns></returns>
        public static Color RgbToColor(byte red, byte green, byte blue, byte alpha = 255)
        {
            return Color.FromArgb(alpha, red, green, blue);
        }

        /// <summary>
        /// Converts a Color to a HSL (hue, saturation, luminance) form. HSB and HSL are the same
        /// </summary>
        /// <param name="color"></param>
        /// <param name="hue"></param>
        /// <param name="saturation"></param>
        /// <param name="luminance"></param>
        /// <param name="alpha">range: [0 - 255]</param>
        public static void ColorToHSL(Color color, out double hue, out double saturation, out double luminance, out double alpha)
        {
            hue = GetHue(color);
            saturation = GetSaturation(color, RgbColorModel.HSL);
            luminance = GetLuminance(color);
            alpha = color.A;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="hue">[0-360]</param>
        /// <param name="saturation">[0-100]</param>
        /// <param name="luminance">[0-100]</param>
        /// <param name="alpha"></param>
        /// <returns></returns>
        public static Color HslToColor(double hue, double saturation, double luminance, double alpha = 255)
        {
            float red;
            float green;
            float blue;

            var hueReal = hue / 360;
            var saturationReal = saturation / 100;
            var luminanceReal = luminance / 100;

            if (Math.Abs(saturationReal) < Epsilon)
            {
                red = green = blue = (float)luminanceReal; // achromatic
            }
            else
            {
                var q = luminanceReal < 0.5 ? luminanceReal * (1 + saturationReal) : luminanceReal + saturationReal - luminanceReal * saturationReal;
                var p = 2 * luminanceReal - q;

                red = HueToRgb(p, q, hueReal + 1f / 3f);
                green = HueToRgb(p, q, hueReal);
                blue = HueToRgb(p, q, hueReal - 1f / 3f);
            }

            return Color.FromArgb((byte)alpha, (byte)(red * 255), (byte)(green * 255), (byte)(blue * 255));
        }

        private static float HueToRgb(double p, double q, double t)
        {
            if (t < 0)
            {
                t += 1;
            }

            if (t > 1)
            {
                t -= 1;
            }

            if (t < 1d / 6d)
            {
                return (float)(p + (q - p) * 6 * t);
            }

            if (t < 1d / 2d)
            {
                return (float)q;
            }

            if (t < 2d / 3d)
            {
                return (float)(p + (q - p) * (2d / 3d - t) * 6);
            }

            return (float)p;
        }

        /// <summary>
        /// Converts the HSV values to a Color
        /// </summary>
        /// <param name="color"></param>
        /// <param name="hue">value between [0 - 360], hue refers to the color of the image itself</param>
        /// <param name="saturation">value between [0 - 100], describes the intensity (purity) of hue. As the saturation increases, the colors appear to be more pure. As the saturation decreases, the colors appear to be more washed-out or pale.</param>
        /// <param name="value">[0 - 100], determines the brightness</param>
        /// <param name="alpha">range: [0 - 255]</param>
        public static void ColorToHSV(Color color, out double hue, out double saturation, out double value, out double alpha)
        {
            int max = Math.Max(color.R, Math.Max(color.G, color.B));
            int min = Math.Min(color.R, Math.Min(color.G, color.B));

            hue = GetHue(color);
            saturation = Math.Round(((max == 0) ? 0 : 1d - (1d * min / max)) * 100);
            value = Math.Round((max / 255d) * 100);
            alpha = color.A;
        }

        /// <summary>
        /// Converts HSV to Color
        /// </summary>
        /// <param name="hue">value between [0 - 360], hue refers to the color of the image itself</param>
        /// <param name="saturation">value between [0 - 100], describes the intensity (purity) of hue. As the saturation increases, the colors appear to be more pure. As the saturation decreases, the colors appear to be more washed-out or pale.</param>
        /// <param name="value">value between [0 - 100], determines the brightness</param>
        /// <param name="alpha"></param>
        /// <returns></returns>
        public static Color HsvToColor(double hue, double saturation, double value, double alpha = 255)
        {
            var hueReal = hue / 360;
            var saturationReal = saturation / 100;
            var valueReal = value / 100;

            double red = 0;
            double green = 0;
            double blue = 0;
            double i = Math.Floor(hueReal * 6);
            double f = hueReal * 6 - i;
            double p = valueReal * (1 - saturationReal);
            double q = valueReal * (1 - f * saturationReal);
            double t = valueReal * (1 - (1 - f) * saturationReal);

            switch (i % 6)
            {
                case 0:
                    {
                        red = valueReal;
                        green = t;
                        blue = p;
                        break;
                    }
                case 1:
                    {
                        red = q;
                        green = valueReal;
                        blue = p;
                        break;
                    }
                case 2:
                    {
                        red = p;
                        green = valueReal;
                        blue = t;
                        break;
                    }
                case 3:
                    {
                        red = p;
                        green = q;
                        blue = valueReal;
                        break;
                    }
                case 4:
                    {
                        red = t;
                        green = p;
                        blue = valueReal;
                        break;
                    }
                case 5:
                    {
                        red = valueReal;
                        green = p;
                        blue = q;
                        break;
                    }
            }

            return Color.FromArgb((byte)alpha, (byte)(red * 255), (byte)(green * 255), (byte)(blue * 255));
        }

        public static double GetSaturation(Color color, RgbColorModel rgbColorModel = RgbColorModel.HSV)
        {
            if (rgbColorModel == RgbColorModel.HSL)
            {
                var res = Math.Round((decimal)System.Drawing.Color.FromArgb(color.A, color.R, color.G, color.B).GetSaturation() * 100);
                return (double)res;
            }

            ColorToHSV(color, out _, out var saturation, out _, out _);

            return saturation;
        }

        /// <summary>
        /// Returns the hue component of a color. Same for HSL and HSC.
        /// </summary>
        /// <param name="color"></param>
        /// <returns></returns>
        public static double GetHue(Color color)
        {
            decimal hue = Math.Round((decimal)System.Drawing.Color.FromArgb(color.A, color.R, color.G, color.B).GetHue());
            return (double)hue;
        }

        public static double GetLuminance(Color color)
        {
            decimal luminance = Math.Round((decimal)System.Drawing.Color.FromArgb(color.A, color.R, color.G, color.B).GetBrightness() * 100);
            return (double)luminance;
        }

        public static double GetValueHsv(Color color)
        {
            ColorToHSV(color, out _, out _, out var value, out _);

            return value;
        }

        public static Color GrayScale(Color color)
        {
            return DeSaturate(color, 100);
        }

        /// <summary>
        /// Returns the inverse (negative) of a color. The red, green, and blue values are inverted, while the opacity is left alone
        /// </summary>
        /// <param name="color"></param>
        /// <returns>Color</returns>
        public static Color Invert(Color color)
        {
            ColorToHSV(color, out var hue, out var saturation, out var value, out var alpha);
            double newHue = (hue + 180) % 360;
            Color resultColor = HsvToColor(newHue, saturation, value, alpha);

            return resultColor;
        }

        /// <summary>
        /// Makes a color more saturated. Takes a color and a number between 0% and 100%, and returns a color with the saturation increased by that amount.
        /// </summary>
        /// <param name="color"></param>
        /// <param name="percent">number between 0 and 100</param>
        /// <returns></returns>
        public static Color Saturate(Color color, double percent)
        {
            ColorToHSL(color, out var hue, out var saturation, out var luminance, out var alpha);

            saturation += percent;
            double newSaturation = Math.Min(100, Math.Max(0, saturation));

            return HslToColor(hue, newSaturation, luminance, alpha);
        }

        /// <summary>
        /// Makes a color less saturated. Takes a color and a number between 0% and 100%, and returns a color with the saturation decreased by that amount.
        /// </summary>
        /// <param name="color"></param>
        /// <param name="percent">number between 0 and 100</param>
        /// <returns>Color</returns>
        public static Color DeSaturate(Color color, double percent)
        {
            ColorToHSL(color, out var hue, out var saturation, out var luminance, out var alpha);

            saturation -= percent;
            double newSaturation = Math.Min(100, Math.Max(0, saturation));

            return HslToColor(hue, newSaturation, luminance, alpha);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="color"></param>
        /// <param name="alpha">range: [0 - 255]</param>
        /// <returns></returns>
        public static Color SetAlphaComponent(Color color, int alpha)
        {
            return SetRgba(color, -1, -1, -1, alpha);
        }

        public static Color SetRedComponent(Color color, int red)
        {
            return SetRgba(color, red);
        }

        public static Color SetGreenComponent(Color color, int green)
        {
            return SetRgba(color, -1, green);
        }

        public static Color SetBlueComponent(Color color, int blue)
        {
            return SetRgba(color, -1, -1, blue);
        }

        /// <summary>
        /// Modifies the Opacity, Red, Green, Blue component of a specified color. If a component of a color should not be changed,
        /// set the component to -1
        /// </summary>
        /// <param name="color"></param>
        /// <param name="alpha">Alpha: 0-255 (if should be omitted set to -1)</param>
        /// <param name="red">Red: 0-255 (if should be omitted set to -1)</param>
        /// <param name="green">Green: 0-255 (if should be omitted set to -1)</param>
        /// <param name="blue">Blue: 0-255 (if should be omitted set to -1)</param>
        /// <returns>Color</returns>
        public static Color SetRgba(Color color, int red = -1, int green = -1, int blue = -1, int alpha = -1)
        {
            Color newColor = color;

            if (alpha > -1)
            {
                newColor.A = (byte)alpha;
            }

            if (red > -1)
            {
                newColor.R = (byte)red;
            }

            if (green > -1)
            {
                newColor.G = (byte)green;
            }

            if (blue > -1)
            {
                newColor.B = (byte)blue;
            }

            return newColor;
        }

        public static SolidColorBrush GetSolidColorBrush(string colorHex, bool throws = true)
        {
            if (string.IsNullOrEmpty(colorHex))
            {
                return null;
            }

            colorHex = colorHex.Trim();

            if (!Regex.IsMatch(colorHex, "^#([A-F0-9]{2}){3,4}$", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline))
            {
                if (throws)
                {
                    throw new ArgumentException("Color in hex representation has to be between 6 and 8 characters");
                }

                return null;
            }

            colorHex = colorHex.Substring(1);

            byte a = 255;
            byte r;
            byte g;
            byte b;

            if (colorHex.Length == 6)
            {
                // alpha value is missing
                r = (byte)(Convert.ToUInt32(colorHex.Substring(0, 2), 16));
                g = (byte)(Convert.ToUInt32(colorHex.Substring(2, 2), 16));
                b = (byte)(Convert.ToUInt32(colorHex.Substring(4, 2), 16));
            }
            else
            {
                // alpha value is present
                a = (byte)(Convert.ToUInt32(colorHex.Substring(0, 2), 16));
                r = (byte)(Convert.ToUInt32(colorHex.Substring(2, 2), 16));
                g = (byte)(Convert.ToUInt32(colorHex.Substring(4, 2), 16));
                b = (byte)(Convert.ToUInt32(colorHex.Substring(6, 2), 16));
            }

            SolidColorBrush myBrush = new SolidColorBrush(Color.FromArgb(a, r, g, b));
            myBrush.Freeze();
            return myBrush;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="color"></param>
        /// <param name="percent">valid values from 0 to 100</param>
        /// <returns></returns>
        public static Color Lighten(Color color, double percent)
        {
            double absolute = (percent * 255) / 100;

            return Color.FromArgb(color.A,
                                  (byte)Math.Min(255, Math.Max(0, color.R + absolute)),
                                  (byte)Math.Min(255, Math.Max(0, color.G + absolute)),
                                  (byte)Math.Min(255, Math.Max(0, color.B + absolute)));

            //ColorToHSV(color, out var hue, out var saturation, out var value);
            //return HsvToColor(hue, saturation, value + (value * percent / 100), color.A);
        }

        public static Color Darken(Color color, double percent)
        {
            return Lighten(color, -percent);
        }

        /// <summary>
        ///  Get the color that results from the blending of two colors
        /// </summary>
        /// <param name="fromHexColor"></param>
        /// <param name="toHexColor"></param>
        /// <param name="percent">valid values from 0 to 100</param>
        /// <returns></returns>
        public static string Blend(string fromHexColor, string toHexColor, double percent)
        {
            Color? colorFrom = HexToColor(fromHexColor);
            Color? colorTo = HexToColor(toHexColor);

            if (!colorFrom.HasValue && !colorTo.HasValue)
            {
                return "";
            }

            if (!colorFrom.HasValue)
            {
                return ColorToHex(colorTo.Value);
            }

            if (!colorTo.HasValue)
            {
                return ColorToHex(colorFrom.Value);
            }

            Color color1 = colorFrom.Value;
            Color color2 = colorTo.Value;

            Color colorNew = Blend(color1, color2, percent);

            return ColorToHex(colorNew);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fromColor"></param>
        /// <param name="toColor"></param>
        /// <param name="percent">valid values from 0 to 100</param>
        /// <returns></returns>
        public static Color Blend(Color fromColor, Color toColor, double percent)
        {
            percent = Math.Max(Math.Min(100, Math.Abs(percent)), 0);

            return Color.FromArgb(
                                  (byte)Interpolate(fromColor.A, toColor.A, percent),
                                  (byte)Interpolate(fromColor.R, toColor.R, percent),
                                  (byte)Interpolate(fromColor.G, toColor.G, percent),
                                  (byte)Interpolate(fromColor.B, toColor.B, percent)
                                 );
        }

        /// <summary>
        /// Checks if the given hex color is of valid format
        /// </summary>
        /// <param name="hexColor"></param>
        /// <returns></returns>
        public static bool HexColorValidate(string hexColor)
        {
            if (hexColor == null)
            {
                return false;
            }

            return Regex.IsMatch(hexColor.Trim(), "^#([0-9a-fA-F]{6}$|[0-9a-fA-F]{8})$", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline);
        }

        private static double Interpolate(double from, double to, double percent)
        {
            return from + (to - from) * (percent / 100);
        }

    }
}

