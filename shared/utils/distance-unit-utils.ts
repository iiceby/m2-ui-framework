import { DistanceUnit } from '../models/business/user/distance-unit.model';

export class DistanceUnitUtils {

    /**
     * format distance from meters to unit type
     * @param value meters
     * @param unit distance unit type from usersettings
     */
    public static formatDistance(value: number, unit?: DistanceUnit) {
        if (unit === DistanceUnit.Kilometer) {
            return value / 1000;
        }

        if (unit === DistanceUnit.Mile) {
            return value / 1609;
        }

        return value;
    }

    /**
     * format speed from meters/second to unit format/hour
     * @param value meters/sectond
     * @param unit distance unit type from usersettings
     */
    public static fromatSpeed(value: number, unit?: DistanceUnit) {
        if (unit === DistanceUnit.Kilometer) {
            return value * 3.6;
        }

        if (unit === DistanceUnit.Mile) {
            return value * 2.237;
        }

        return value;
    }
}
