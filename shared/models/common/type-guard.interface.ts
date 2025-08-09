export interface TypeGuard {
    //@ts-ignore
    isValid(value);
}

export class BooleanTypeGuard implements TypeGuard {
    //@ts-ignore
    public isValid(value) {
        return typeof value === 'boolean';
    }
}

export class NumberTypeGuard implements TypeGuard {
    //@ts-ignore
    public isValid(value) {
        return typeof value === 'number';
    }
}
