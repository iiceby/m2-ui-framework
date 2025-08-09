export class String {

    public static empty = '';

    public static isNullOrWhiteSpace(value: string): boolean {
        try {
            if (value == null || value === undefined) {
                return false;
            }
            return (`${value}`).replace(/\s/g, '').length < 1;
        } catch (e) {
            return false;
        }
    }

    public static format(value, ...args): string {
        try {
            return value.replace(/{(\d+(:.*)?)}/g, (match, i) => {
                const s = match.split(':');
                if (s.length > 1) {
                    i = i[0];
                    match = s[1].replace('}', '');
                }

                const arg = String.formatPattern(match, args[i]);
                return arg !== undefined && arg != null ? arg : String.empty;
            });
        } catch (e) {
            return String.empty;
        }
    }

    private static formatPattern(match, arg): string {
        switch (match) {
            case 'L':
                arg = arg.toLowerCase();
                break;
            case 'U':
                arg = arg.toUpperCase();
                break;
            default:
                break;
        }

        return arg;
    }
}
