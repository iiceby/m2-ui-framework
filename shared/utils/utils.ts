export class Utils {
    public static enumToArray(enumType): string[] {
        const res: string[] = [];
        for (const key in enumType) {
            if (enumType.hasOwnProperty(key) && (!+key && (+key !== 0))) {
                res.push(key);
            }
        }
        return res;
    }

    public static enumToSelectData(enumType): { id: any, text: string }[] {
        const enumStrArr = Utils.enumToArray(enumType);
        const res: { id: any, text: string }[] = [];
        enumStrArr.forEach((x) => {
            res.push({ id: enumType[x], text: x });
        });
        return res;
    }

    public static async enumToTranslatedSelectData(enumType, translate): Promise<{ id: any, text: string }[]> {
        const enumStrArr = Utils.enumToArray(enumType);
        return translate.translateMany(enumStrArr).then((txts) => {
            const res: { id: any, text: string }[] = [];
            enumStrArr.forEach((x, indx) => {
                res.push({ id: enumType[x], text: txts[indx] });
            });
            return res;
        });
    }

    public static enumGetNameByStringValue(enumType, value: string): string {
        for (const key in enumType) {
            if (enumType.hasOwnProperty(key) && (!+key && (+key !== 0))) {
                if (enumType[key] === value) {
                    return key;
                }
            }
        }
        return null;
    }

    public static arrayUnique(array: any[], comparer?: (a, b) => boolean): any[] {
        const arr = array.concat();
        for (let i = 0; i < arr.length; i += 1) {
            for (let j = i + 1; j < arr.length; j += 1) {
                const isDuplicate = (comparer && comparer(arr[i], arr[j])) || (!comparer && arr[i] === arr[j]);
                if (isDuplicate) {
                    arr.splice(j--, 1);
                }
            }
        }
        return arr;
    }

    public static cloneObject<T>(obj: T): T {
        if (!obj) return null;
        return JSON.parse(JSON.stringify(obj));
    }

    public static stringToNumber(str: string): number {
        if (!str) {
            return 0;
        }

        return Number(str.replace(/[^\d.-]/g, ''));
    }

    public static getArrayFromRange(start: number, end: number): number[] {
        const result = [];
        for (let index = start; index <= end; index++) {
            result.push(index);
        }

        return result;
    }

    public static generatePinCode(length = 4) {
        const arr = [];
        for (let index = 0; index < length; index++) {
            arr.push(Math.floor(Math.random() * 9.99));
        }

        return arr.join('');
    }
}
