// tslint:disable:no-parameter-reassignment
export class StringUtils {
    public static encodeSqlSpecialChars(value: string): string {
        return (value || '').replace('%', '[%]').replace('_', '[_]'); // sql special chars escape
    }

    public static trim(value: string, opts?: { trimLeft: boolean, trimRight: boolean, trimMiddle: boolean }): string {
        opts = opts || { trimLeft: true, trimRight: true, trimMiddle: true };
        value = value || '';

        if (opts.trimMiddle) {
            value = value.replace(/\s\s+/g, ' ');
        }
        if (opts.trimLeft) {
            value = value.trimLeft();
        }
        if (opts.trimRight) {
            value = value.trimRight();
        }
        return value;
    }
}
