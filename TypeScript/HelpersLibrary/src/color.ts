
export interface IArgb {
    alpha?: number;
    red?: number;
    green?: number;
    blue?: number;
}

export interface IHsl {
    hue: number;
    saturation: number;
    luminance: number;
    alpha?: number;
}

export interface IHsv {
    hue: number;
    saturation: number;
    value: number;
    alpha?: number;
}

export enum RgbColorModel {
    HSL = 0,
    HSV = 1,
}


export class Color {


    /**
     * [R, G, B, A], range is from 0 to 255
     *
     * @private
     */
    private readonly colors: number[] = [];

    get R(): number {
        return this.colors[0];
    }
    set R(red: number) {
        this.colors[0] = Math.floor(Math.min(Math.max(0, red), 255));
    }

    get G(): number {
        return this.colors[1];
    }
    set G(green: number) {
        this.colors[1] = Math.floor(Math.min(Math.max(0, green), 255));
    }

    get B(): number {
        return this.colors[2];
    }
    set B(blue: number) {
        this.colors[2] = Math.floor(Math.min(Math.max(0, blue), 255));
    }

    get A(): number {
        return this.colors[3];
    }
    /**
     * Range: [0 - 255]
     *
     */
    set A(alpha: number) {
        this.colors[3] = Math.floor(Math.min(Math.max(0, alpha), 255));
    }

    get Hex() {
        return this.toHex();
    }
    set Hex(aHex: string) {
        const rgba = Color.HexToRgb(aHex);

        this.A = rgba.alpha!;
        this.R = rgba.red!;
        (this.G = rgba.green!), (this.B = rgba.blue!);
    }

    get RGBA(): IArgb {
        return {
            alpha: this.colors[3],
            red: this.colors[0],
            green: this.colors[1],
            blue: this.colors[2],
        };
    }
    set RGBA(argb: IArgb) {
        this.colors[3] = argb.alpha!;
        this.colors[2] = argb.blue!;
        this.colors[1] = argb.green!;
        this.colors[0] = argb.red!;
    }

    get Hue(): number {
        return this.toHsl().hue;
    }

    get Luminance(): number {
        return this.toHsl().luminance;
    }

    get SaturationHsv(): number {
        return this.toHsv().saturation;
    }

    get SaturationHsl(): number {
        return this.toHsl().saturation;
    }

    get valueHsv(): number {
        return this.toHsv().value;
    }

    /**
     * Creates an instance of Color.
     * @param colors following formats are supported: [A]HEX, RGB[A](R,G,B,[A]) or number array with either 3 or 4 numbers [R, G, B, A].
     * The RGBA values range from 0 to 255 (value outside of this range is either 0 or 255)
     */
    private constructor(colors: number[] | string | IArgb) {
        if (typeof colors === 'string') {
            colors = colors.replace(/\s/g, '').toLowerCase();

            if (colors.startsWith('#')) {
                const rgba: IArgb = Color.HexToRgb(colors);

                if (rgba.alpha === undefined) {
                    this.colors = [rgba.red || 0, rgba.green || 0, rgba.blue || 0, 255];
                } else {
                    this.colors = [rgba.red || 0, rgba.green || 0, rgba.blue || 0, rgba.alpha];
                }
            } else if (colors.startsWith('rgba(')) {
                colors = colors.substring(5, colors.length - 1);

                const f: string[] = colors.split(',');
                const red: number = parseInt(f[0], 10);
                const green: number = parseInt(f[1], 10);
                const blue: number = parseInt(f[2], 10);
                const alpha: number = Number(f[3]);

                this.colors = [red, green, blue, alpha];
            } else if (colors.startsWith('rgb(')) {
                colors = colors.substring(4, colors.length - 1);
                const f: string[] = colors.split(',');
                const red: number = parseInt(f[0], 10);
                const green: number = parseInt(f[1], 10);
                const blue: number = parseInt(f[2], 10);

                this.colors = [red, green, blue, 255];
            }
        } else if (Array.isArray(colors)) {
            this.colors = colors;
        } else {
            // colors is type of Iargb
            this.colors = [colors.red || 0, colors.green || 0, colors.blue || 0, 255];
            if (colors.alpha) {
                this.colors[3] = colors.alpha;
            }
        }

        this.R = this.colors[0];
        this.G = this.colors[1];
        this.B = this.colors[2];

        if (this.colors.length === 3) {
            this.colors = [...this.colors, 255];
            this.A = 255;
        } else if (this.colors.length === 4) {
            // rgb to rgbA
            this.A = this.colors[3];
        } else {
            throw new Error('Color accepts an array of either 3 or 4 values!');
        }
    }

    /**
     * Checks whether a given string is a valid (A)HEX color representation
     *
     * @param {string} hexColor
     * @returns {boolean}
     * @memberof Color
     */
    public static hexColorValidate(hexColor: string): boolean {
        return /^#[0-9aA-fF]{6,8}$/.test(hexColor.trim());
    }

    /**
     * Converts a HSL (hue, saturation, luminance/brightness) to Color
     *
     * @static
     * @param {number} hue value contained in the set [0, 360]
     * @param {number} saturation value contained in the set [0, 100]
     * @param {number} luminance value contained in the set [0, 100]
     * @param {number} [alpha=255]
     * @returns {Color}
     * @memberof Color
     */
    public static hslToColor(hue: number, saturation: number, luminance: number, alpha: number = 255): Color {
        let red;
        let green;
        let blue;

        const hueReal = hue / 360;
        const saturationReal = saturation / 100;
        const luminanceReal = luminance / 100;

        if (saturation === 0) {
            red = green = blue = luminanceReal; // achromatic
        } else {
            const q = luminanceReal < 0.5 ? luminanceReal * (1 + saturationReal) : luminanceReal + saturationReal - luminanceReal * saturationReal;
            const p = 2 * luminanceReal - q;

            red = this.hueToRgb(p, q, hueReal + 1 / 3);
            green = this.hueToRgb(p, q, hueReal);
            blue = this.hueToRgb(p, q, hueReal - 1 / 3);
        }

        return new Color({ red: red * 255, green: green * 255, blue: blue * 255, alpha });
    }

    /**
     * Converts an HSV color to Color
     *
     * @static
     * @param {number} hue value between 0 and 360
     * @param {number} saturation value between 0 and 100
     * @param {number} value value between 0 and 100
     * @param {number} [alpha=255]
     * @returns {Color}
     * @memberof Color
     */
    public static hsvToColor(hue: number, saturation: number, value: number, alpha: number = 255): Color {
        const hueReal = hue / 360;
        const saturationReal = saturation / 100;
        const valueReal = value / 100;

        let red: number;
        let green: number;
        let blue: number;
        const i = Math.floor(hueReal * 6);
        const f = hueReal * 6 - i;
        const p = valueReal * (1 - saturationReal);
        const q = valueReal * (1 - f * saturationReal);
        const t = valueReal * (1 - (1 - f) * saturationReal);

        switch (i % 6) {
            case 0: {
                red = valueReal;
                green = t;
                blue = p;
                break;
            }
            case 1: {
                red = q;
                green = valueReal;
                blue = p;
                break;
            }
            case 2: {
                red = p;
                green = valueReal;
                blue = t;
                break;
            }
            case 3: {
                red = p;
                green = q;
                blue = valueReal;
                break;
            }
            case 4: {
                red = t;
                green = p;
                blue = valueReal;
                break;
            }
            case 5: {
                red = valueReal;
                green = p;
                blue = q;
                break;
            }
        }

        return new Color({ red: red! * 255, green: green! * 255, blue: blue! * 255, alpha });
    }

    public static RgbToHex(red: number, green: number, blue: number, alpha: number = 255): string {
        return new Color({ red, green, blue, alpha }).toHex();
    }

    public static HexToRgb(aHex: string): IArgb {
        if (!Color.hexColorValidate(aHex)) {
            throw new Error(`${aHex} is not a valid (A)HEX format!`);
        }

        if (aHex.length === 7) {
            return {
                red: parseInt(aHex.slice(1, 3), 16),
                green: parseInt(aHex.slice(3, 5), 16),
                blue: parseInt(aHex.slice(5, 7), 16),
                alpha: 255,
            };
        } else {
            return {
                alpha: parseInt(aHex.slice(1, 3), 16),
                red: parseInt(aHex.slice(3, 5), 16),
                green: parseInt(aHex.slice(5, 7), 16),
                blue: parseInt(aHex.slice(7, 9), 16),
            };
        }
    }

    public static getColor(color?: number[] | string): Color | undefined {
        if (!color) {
            return undefined;
        }

        if (color instanceof Array) {
            return new Color(color);
        }

        if (color.startsWith('#')) {
            return new Color(color);
        }

        if (color.startsWith('rgb')) {
            return new Color(color);
        }

        color = Color.toHexFromColorName(color);

        if (color) {
            return new Color(color);
        }

        return undefined;
    }

    public static RandomColor(): Color {
        return new Color([Color.getRandomInt(0, 255), Color.getRandomInt(0, 255), Color.getRandomInt(0, 255)]);
    }

    public static Create(colors: number[] | string) {
        return Color.getColor(colors);
    }

    public static blend<T>(color: Color | undefined, colorTo: Color | undefined, percentage: number, map: (color: Color) => T) {
        let result: Color | undefined;
        if (!color) {
            result = colorTo;
        } else {
            result = color.blend(colorTo, percentage);
        }
        if (result && map) {
            return map(result);
        } else {
            return undefined;
        }
    }

    public static lighten<T>(color: Color, percent: number, map?: (color: Color) => T) {
        const result: Color = color.lighten(percent);

        if (result && map) {
            return map(result);
        }

        return undefined;
    }

    private static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // tslint:disable-next-line:member-ordering
    private static toHexFromColorName(color: string): string | undefined {
        const colors = {
            aliceblue: '#f0f8ff',
            antiquewhite: '#faebd7',
            aqua: '#00ffff',
            aquamarine: '#7fffd4',
            azure: '#f0ffff',
            beige: '#f5f5dc',
            bisque: '#ffe4c4',
            black: '#000000',
            blanchedalmond: '#ffebcd',
            blue: '#0000ff',
            blueviolet: '#8a2be2',
            brown: '#a52a2a',
            burlywood: '#deb887',
            cadetblue: '#5f9ea0',
            chartreuse: '#7fff00',
            chocolate: '#d2691e',
            coral: '#ff7f50',
            cornflowerblue: '#6495ed',
            cornsilk: '#fff8dc',
            crimson: '#dc143c',
            cyan: '#00ffff',
            darkblue: '#00008b',
            darkcyan: '#008b8b',
            darkgoldenrod: '#b8860b',
            darkgray: '#a9a9a9',
            darkgreen: '#006400',
            darkkhaki: '#bdb76b',
            darkmagenta: '#8b008b',
            darkolivegreen: '#556b2f',
            darkorange: '#ff8c00',
            darkorchid: '#9932cc',
            darkred: '#8b0000',
            darksalmon: '#e9967a',
            darkseagreen: '#8fbc8f',
            darkslateblue: '#483d8b',
            darkslategray: '#2f4f4f',
            darkturquoise: '#00ced1',
            darkviolet: '#9400d3',
            deeppink: '#ff1493',
            deepskyblue: '#00bfff',
            dimgray: '#696969',
            dodgerblue: '#1e90ff',
            firebrick: '#b22222',
            floralwhite: '#fffaf0',
            forestgreen: '#228b22',
            fuchsia: '#ff00ff',
            gainsboro: '#dcdcdc',
            ghostwhite: '#f8f8ff',
            gold: '#ffd700',
            goldenrod: '#daa520',
            gray: '#808080',
            green: '#008000',
            greenyellow: '#adff2f',
            honeydew: '#f0fff0',
            hotpink: '#ff69b4',
            'indianred ': '#cd5c5c',
            indigo: '#4b0082',
            ivory: '#fffff0',
            khaki: '#f0e68c',
            lavender: '#e6e6fa',
            lavenderblush: '#fff0f5',
            lawngreen: '#7cfc00',
            lemonchiffon: '#fffacd',
            lightblue: '#add8e6',
            lightcoral: '#f08080',
            lightcyan: '#e0ffff',
            lightgoldenrodyellow: '#fafad2',
            lightgrey: '#d3d3d3',
            lightgreen: '#90ee90',
            lightpink: '#ffb6c1',
            lightsalmon: '#ffa07a',
            lightseagreen: '#20b2aa',
            lightskyblue: '#87cefa',
            lightslategray: '#778899',
            lightsteelblue: '#b0c4de',
            lightyellow: '#ffffe0',
            lime: '#00ff00',
            limegreen: '#32cd32',
            linen: '#faf0e6',
            magenta: '#ff00ff',
            maroon: '#800000',
            mediumaquamarine: '#66cdaa',
            mediumblue: '#0000cd',
            mediumorchid: '#ba55d3',
            mediumpurple: '#9370d8',
            mediumseagreen: '#3cb371',
            mediumslateblue: '#7b68ee',
            mediumspringgreen: '#00fa9a',
            mediumturquoise: '#48d1cc',
            mediumvioletred: '#c71585',
            midnightblue: '#191970',
            mintcream: '#f5fffa',
            mistyrose: '#ffe4e1',
            moccasin: '#ffe4b5',
            navajowhite: '#ffdead',
            navy: '#000080',
            oldlace: '#fdf5e6',
            olive: '#808000',
            olivedrab: '#6b8e23',
            orange: '#ffa500',
            orangered: '#ff4500',
            orchid: '#da70d6',
            palegoldenrod: '#eee8aa',
            palegreen: '#98fb98',
            paleturquoise: '#afeeee',
            palevioletred: '#d87093',
            papayawhip: '#ffefd5',
            peachpuff: '#ffdab9',
            peru: '#cd853f',
            pink: '#ffc0cb',
            plum: '#dda0dd',
            powderblue: '#b0e0e6',
            purple: '#800080',
            rebeccapurple: '#663399',
            red: '#ff0000',
            rosybrown: '#bc8f8f',
            royalblue: '#4169e1',
            saddlebrown: '#8b4513',
            salmon: '#fa8072',
            sandybrown: '#f4a460',
            seagreen: '#2e8b57',
            seashell: '#fff5ee',
            sienna: '#a0522d',
            silver: '#c0c0c0',
            skyblue: '#87ceeb',
            slateblue: '#6a5acd',
            slategray: '#708090',
            snow: '#fffafa',
            springgreen: '#00ff7f',
            steelblue: '#4682b4',
            tan: '#d2b48c',
            teal: '#008080',
            thistle: '#d8bfd8',
            tomato: '#ff6347',
            turquoise: '#40e0d0',
            violet: '#ee82ee',
            wheat: '#f5deb3',
            white: '#ffffff',
            whitesmoke: '#f5f5f5',
            yellow: '#ffff00',
            yellowgreen: '#9acd32',
        };



        if (typeof colors[color.toLowerCase()] !== 'undefined') {
            return colors[color.toLowerCase()];
        }

        return undefined;
    }

    private static hueToRgb(p: number, q: number, t: number): number {
        if (t < 0) {
            t += 1;
        }

        if (t > 1) {
            t -= 1;
        }

        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }

        if (t < 1 / 2) {
            return q;
        }

        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }

        return p;
    }

    /**
     * Converts a color to its (A)HEX color representation.
     */
    public toHex(): string {
        if (this.A === 255) {
            return ('#' + this.componentToHex(this.R) + this.componentToHex(this.G) + this.componentToHex(this.B)).toUpperCase();
        }
        return ('#' + this.componentToHex(this.A) + this.componentToHex(this.R) + this.componentToHex(this.G) + this.componentToHex(this.B)).toUpperCase();
    }

    /**
     *
     *
     * @param toColor
     * @param percent range: [0 - 100]
     * @returns
     */
    public blend(toColor: Color | undefined, percent: number): Color {
        if (!toColor) {
            return this;
        }

        percent = Math.max(Math.min(100, Math.abs(percent)), 0);

        const red = this.interpolate(this.R, toColor.R, percent);
        const green = this.interpolate(this.G, toColor.G, percent);
        const blue = this.interpolate(this.B, toColor.B, percent);
        const alpha = this.interpolate(this.A, toColor.A, percent);

        return new Color({ red, green, blue, alpha });
    }

    /**
     *
     *
     * @param percent range: [0 - 100]
     * @returns
     */
    public lighten(percent: number): Color {
        const absolute: number = (percent * 255) / 100;
        return new Color([this.R + absolute, this.G + absolute, this.B + absolute, this.A]);
    }

    /**
     *
     *
     * @param percent range: [0 - 100]
     * @returns
     */
    public darken(percent: number): Color {
        return this.lighten(-percent);
    }

    /**
     *
     *
     * @param percent range: [0 - 100]
     * @returns
     */
    public saturate(percent: number): Color {
        const hslObject: IHsl = this.toHsl();
        hslObject.saturation += percent;
        const newSaturation: number = Math.min(100, Math.max(0, hslObject.saturation));

        return Color.hslToColor(hslObject.hue, newSaturation, hslObject.luminance, hslObject.alpha);
    }

    /**
     *
     *
     * @param percent range: [0 - 100]
     * @returns
     */
    public deSaturate(percent: number): Color {
        const hslObject: IHsl = this.toHsl();
        hslObject.saturation -= percent;
        const newSaturation: number = Math.min(100, Math.max(0, hslObject.saturation));

        return Color.hslToColor(hslObject.hue, newSaturation, hslObject.luminance, hslObject.alpha);
    }

    public grayScale(): Color {
        return this.deSaturate(100);
    }

    public invert(): Color {
        const hsvObject: IHsv = this.toHsv();
        const newHue: number = (hsvObject.hue + 180) % 360;

        return Color.hsvToColor(newHue, hsvObject.saturation, hsvObject.value, this.A);
    }

    public toRgba(overrideA?: number): string {
        if (overrideA !== undefined) {
            return `rgba( ${this.colors.slice(0, 3).concat(overrideA).join(',')} )`;
        }
        return `rgba(${this.R},${this.G},${this.B},${this.A / 255})`;
    }

    public toRgb(): string {
        return `rgb( ${this.colors.slice(0, 3).join(',')} )`;
    }

    /**
     * Converts color to HSL (hue, saturation, value)
     *
     * @returns {IHsl}
     * @memberof Color
     */
    public toHsl(): IHsl {
        const red: number = this.R / 255;
        const green: number = this.G / 255;
        const blue: number = this.B / 255;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);

        let hue = 0;
        let saturation = 0;
        const luminance = (max + min) / 2;

        if (max === min) {
            hue = saturation = 0; // achromatic
        } else {
            const diff = max - min;
            saturation = luminance > 0.5 ? diff / (2 - max - min) : diff / (max + min);
            switch (max) {
                case red:
                    hue = (green - blue) / diff + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / diff + 2;
                    break;
                case blue:
                    hue = (red - green) / diff + 4;
                    break;
            }

            hue /= 6;
        }

        return {
            hue: Math.round(hue * 360),
            saturation: Math.round(saturation * 100),
            luminance: Math.round(luminance * 100),
            alpha: this.A,
        };
    }

    /**
     * Converts an Color to HSV. Returns the hue [0 - 360], saturation [0 - 100] and value in the set [0, 100]
     *
     * @returns {IHsv}
     * @memberof Color
     */
    public toHsv(): IHsv {
        const red: number = this.R / 255;
        const green: number = this.G / 255;
        const blue: number = this.B / 255;

        const max: number = Math.max(red, green, blue);
        const min: number = Math.min(red, green, blue);

        let hue: number = max;
        let saturation: number = max;
        const value: number = max;

        const diff: number = max - min;
        saturation = max === 0 ? 0 : diff / max;

        if (max === min) {
            hue = 0; // achromatic
        } else {
            switch (max) {
                case red: {
                    hue = (green - blue) / diff + (green < blue ? 6 : 0);
                    break;
                }
                case green: {
                    hue = (blue - red) / diff + 2;
                    break;
                }
                case blue: {
                    hue = (red - green) / diff + 4;
                    break;
                }
            }
            hue /= 6;
        }

        return {
            hue: Math.round(hue * 360),
            saturation: Math.round(saturation * 100),
            value: Math.round(value * 100),
            alpha: this.A,
        };
    }

    private interpolate(start: number, end: number, percent: number): number {
        return start + (end - start) * (percent / 100);
    }

    private componentToHex(rgbComponentColor: number): string {
        const hex: string = rgbComponentColor.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }


}