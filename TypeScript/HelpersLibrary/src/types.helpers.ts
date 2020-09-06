export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
};

export const isNullOrUndefined = <T>(value: T | null | undefined): value is null | undefined => {
    return value === null || value === undefined;
};

export const isNumber = (value: string | number): boolean => {
    return !isNaN(<any>value);
};


export class TypesHelpers {
    public static isPromise(obj: any): obj is Promise<any> {
        return !!obj && obj instanceof Promise;
    }

    public static isObject(obj: any): obj is object {
        return !!obj && obj instanceof Object;
    }
}