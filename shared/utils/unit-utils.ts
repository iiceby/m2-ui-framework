export class UnitUtils {

    private static readonly koef = 0.000621371;

    public static mToMiles(value: number): number {
        if (!value) {
            return value;
        }

        return value * UnitUtils.koef;
    }

    public static meterToKm(value: number): number {
        if (!value) {
            return value;
        }

        return value / 1000;
    }

    public static meterStoKMH(value: number): number {
        if (!value) {
            return value;
        }

        return value * 3.6;
    }

    public static meterStoMilesH(value: number): number {
        if (!value) {
            return value;
        }

        return value * 2.236936;
    }
}
