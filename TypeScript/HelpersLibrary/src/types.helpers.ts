export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
};

export const isNullOrUndefined = <T>(value: T | null | undefined): value is null | undefined => {
    return value === null || value === undefined;
};

export const notFalsy = <TValue>(value: TValue | null | undefined | 0 | ''): value is TValue => {
    return !!value;
};

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



export class TypesHelpers {
    public static isPromise(obj: any): obj is Promise<any> {
        return !!obj && obj instanceof Promise;
    }

    public static isObject(obj: any): obj is object {
        return !!obj && obj instanceof Object;
    }
}