import * as deepdiff from 'deep-diff';

export class CompareUtils {
    public static isObjectsEqual(obj1: any, obj2: any, strict?: boolean, prefilter?: (path: string, key: string) => boolean): boolean {
        if (!strict && !obj1 && !obj2) {
            return true;
        }
        //@ts-ignore
        const diff = deepdiff.diff(obj1, obj2, prefilter);

        if (strict) {
            return !diff;
        }

        return !diff || !diff.some(d => d.kind !== 'E' || (!CompareUtils.emptyEqual(d.lhs, d.rhs) && !CompareUtils.stringEqual(d.lhs, d.rhs)));
    }

    private static emptyEqual(lhs:any, rhs:any) {
        // consider null, undefined and empty as equal
        return CompareUtils.isEmpty(lhs) && CompareUtils.isEmpty(rhs);
    }

    private static stringEqual(lhs:any, rhs:any) {
        // consider string '5' and number 5 as equal
        return `${lhs}` === `${rhs}`;
    }

    private static isEmpty(obj:any) {
        return obj === undefined || obj === null || obj === '';
    }
}
