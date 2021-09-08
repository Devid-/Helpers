interface RegexMatch {
    [groupIndex: number]: string;
    index: number;
}


export class Helpers {
    public static isObject(obj: any): obj is object {
        return !!obj && obj instanceof Object;
    }

    /**
     * Addition to the methods that use regex so that the dot does not have to be escaped
     *
     * @private
     * @param {string} str
     * @returns
     * @memberof ClarionObject
     */
    public static escapeRegExp(str: string) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    }

    /**
     * Replaces all the occurances of the specified string in the given text with the specified replacement.
     *
     * @static
     * @param {string} text
     * @param {(string | RegExp)} find
     * @param {string} [replace='']
     * @returns
     * @memberof Helpers
     */
    public static replaceAll(text: string, find: string | RegExp, replace: string = '') {
        if (!text) {
            return '';
        }

        const findRegExp: RegExp = find instanceof RegExp ? find : new RegExp(Helpers.escapeRegExp(find), 'g');
        return text.replace(findRegExp, replace);
    }

    /**
     * Checks if specified text is in lower case
     *
     * @static
     * @param {string} text
     * @returns {boolean}
     * @memberof Helpers
     */
    public static isInLowerCase(text: string): boolean {
        if (/\p{Ll}/gu.test(text)) {
            // Unicode Aware Regex, matches an lowercase letter that has a uppercase variant
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if specified text is in upper case
     *
     * @static
     * @param {string} text
     * @returns {boolean}
     * @memberof Helpers
     */
    public static isInUpperCase(text: string): boolean {
        if (/\p{Lu}/gu.test(text)) {
            // Unicode Aware Regex, matches an uppercase letter that has a lowercase variant
            return true;
        }

        return false;
    }

    /**
     * Transforms a given text to upper and removes white spaces from both ends.
     *
     * @static
     * @param {string} value
     * @returns
     * @memberof Helpers
     */
    public static toUpperCaseAndTrim(value: string) {
        if (value) {
            return value.trim().toUpperCase();
        }

        return '';
    }

    // tslint:disable-next-line: completed-docs
    public static getMatches(str: string, regex: RegExp): RegexMatch[] {
        const matches: RegexMatch[] = [];
        let match = regex.exec(str);
        while (match) {
            matches.push(match);
            match = regex.exec(str);
        }
        return matches;
    }

    /**
     * Check if specified value is not null or undefined
     *
     * @static
     * @memberof Helpers
     */
    public static isNotEmpty<TValue>(value: TValue | null | undefined): value is TValue {
        return value !== null && value !== undefined;
    }

    /**
     * Checks if a specified value is null or undefined
     *
     * @static
     * @template T
     * @param {(T | null | undefined)} value
     * @returns {(value is null | undefined)}
     * @memberof Helpers
     */
    public static isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
        return value === null || value === undefined;
    }

    /**
     * Specifies if a specified value is of type number
     *
     * @static
     * @param {(string | number)} value
     * @returns {boolean}
     * @memberof Helpers
     */
    public static isNumber(value: string | number): boolean {
        return !isNaN(<any>value);
    }

    /**
     * Checks if a specified value is a promise
     *
     * @static
     * @param {*} obj
     * @returns {obj is Promise<any>}
     * @memberof Helpers
     */
    public static isPromise(obj: any): obj is Promise<any> {
        const isPromise: boolean = !!obj && obj instanceof Promise;
        return isPromise;
    }

    /**
     * Creates a promise that will complete after a time delay
     *
     * @static
     * @param {number} delayMs
     * @returns {Promise<any>}
     * @memberof Helpers
     */
    public static delay(delayMs: number): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(delayMs);
            }, delayMs);
        });
    }

    /**
     * Returns a enum from a given string.
     *
     * @static
     * @template T
     * @param {T} type
     * @param {string} enumAsString
     * @param {string} [errorMessage=`The type ${type} is invalid!`] if enum not found throws a error with the specified message
     * @returns {T[keyof T]}
     * @memberof Helpers
     */
    public static getEnumFromString<T>(type: T, enumAsString: string, errorMessage: string = `The type ${type} is invalid!`): T[keyof T] {
        const casted = enumAsString as keyof T;
        if (casted === undefined) {
            throw new Error(errorMessage);
        }

        return type[casted];
    }
}

export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
};

export const notEmptyChild = <TValue>(value: (TValue | null | undefined)[]): value is TValue[] => {
    return !value.some((option) => option === undefined || option === null);
};

export const isNullOrUndefined = <T>(value: T | null | undefined): value is null | undefined => {
    return value === null || value === undefined;
};

export const notFalsy = <TValue>(value: TValue | null | undefined | 0 | ''): value is TValue => {
    return !!value;
};

export const sortObjectKeys = <T extends { [key: string]: any }>(obj: T): T => <T>Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, <any>{});

export const isNumber = (value: string | number): boolean => {
    return !isNaN(<any>value);
};

export const toArray = <T>(element: T | T[] | undefined | null): T[] => {
    if (element === undefined || element === null) {
        return [];
    }
    if (element instanceof Array) {
        return element;
    } else {
        return [element];
    }
};

/**
 * If one of the given values is null or undefined, the other one is returned.
 * If both are set, the given check-function is used to determin, which value should be returned.
 * @param value1
 * @param value2
 * @param check
 */
export const getDefinedValue = (value1?: number, value2?: number, check?: (v: number, v2: number) => number): number | undefined => {
    if (isNullOrUndefined(value1)) {
        return value2;
    }
    if (isNullOrUndefined(value2)) {
        return value1;
    }

    return check && check(value1, value2);
};

export const fallback = <T>(value: T | undefined | null, fallbackValue: T): T => {
    return isNullOrUndefined(value) ? fallbackValue : value;
};

export function fallbackEmpty(value?: string): string;
export function fallbackEmpty<T>(value: T | undefined, fallbackValue: T): T;
export function fallbackEmpty<T>(value: T | undefined, fallbackValue?: T): T {
    if (isNullOrUndefined(value) || <any>value === '') {
        if (isNullOrUndefined(fallbackValue)) {
            return <any>'';
        } else {
            return fallbackValue;
        }
    }
    return value;
}

export const isEqual = (value1: any, value2: any) => {
    if (typeof value1 === 'number' || typeof value2 === 'number') {
        return Number(value1) === Number(value2);
    } else {
        return value1 === value2;
    }
};

export const selectMany = <T, U>(array: T[], selector: (x: T) => U[]): U[] => {
    const result = array.map((x) => selector(x));
    if (!result.length) {
        return [];
    }
    return result.reduce((a, b) => a.concat(b));
};