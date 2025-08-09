import moment from 'moment';
import momentTimezone from 'moment-timezone';

export class DateUtils {

    public static get currentDate(): string { return moment().format('YYYY-MM-DD'); }

    public static get currentDateTime(): string { return moment().format('YYYY-MM-DD HH:mm:ss'); }

    public static get yesterday(): string { return moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss'); }

    public static get monthAgo(): string { return moment().add(-1, 'months').format('YYYY-MM-DD HH:mm:ss'); }

    public static get timeZone(): string { return (<any>moment).tz && (<any>moment).tz.guess() ? (<any>moment).tz.guess() : null; }

    public static get timezoneOffsetInSec(): number { return moment().tz(DateUtils.timeZone).utcOffset() * 60 * 1000 ; }

    /**
     * Check if string is correct ISO formatted datetime
     */
    public static isDateTimeValid(value: string): boolean {
        if (!value || typeof value !== 'string') return false;

        const templates = [
            'YYYY-MM-DDTHH:mm:ss',
            'YYYY-MM-DD',
            'YYYY-MM-DDTHH:mm:ss.SSS',
            'YYYY-MM-DDTHH:mm:ss.SS',
            'YYYY-MM-DDTHH:mm:ss.S',
            'YYYY-MM-DDTHH:mm',
            'YYYY-MM-DD HH:mm:ss',
            'YYYY-MM-DD HH:mm:ss.SSS',
            'YYYY-MM-DD HH:mm:ss.SS',
            'YYYY-MM-DD HH:mm:ss.S',
            'YYYY-MM-DD HH:mm'
        ];

        for (const template of templates) {
            if (moment(value || null, template, true).isValid()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Convert Date object to string without(!) regard to the timezone
     */
    public static convertDateToString(date: Date): string {
        const m = moment(date);
        //@ts-ignore
        return m && m.isValid() ? m.format('YYYY-MM-DDTHH:mm:ss') : null;
    }

    /**
     * Convert string to Date object
     */
    public static convertStringToDate(date: string): Date {
        const m = moment(date);
        //@ts-ignore
        return m && m.isValid() ? m.toDate() : null;
    }

    /**
     * Convert epoch number to ISO format date string
     */
    public static convertEpocToString(dateEpoc: number, addMilliseconds: boolean = false): string {
        if (!dateEpoc) {
            // Если передан null или undefined, возвращаем null
            //@ts-ignore
            return null;
        }
    
        // Проверяем, является ли число 10-значным (секунды), и добавляем 3 нуля (преобразуем в миллисекунды)
        if (dateEpoc.toString().length === 10) {
            dateEpoc *= 1000; // Преобразуем в миллисекунды
        }
    
        // Форматируем дату в UTC
        const formattedDate = moment(dateEpoc).utc().format('YYYY-MM-DDTHH:mm:ss');
    
        // Добавляем '.000Z', если addMilliseconds === true
        return addMilliseconds ? `${formattedDate}.000Z` : formattedDate;
    }
    
    

    /**
     * Convert ISO format date string to epoch number
     */
    public static convertStringToEpoc(dateStr: string): number {
        if (!DateUtils.isDateTimeValid(dateStr)) {
            return 0;
        }

        return moment.utc(dateStr).valueOf();
    }

     /**
     * Converts a date string in the pattern format to an epoch timestamp.
     * @param dateStr - The date string to convert.
     * @returns {number} - The epoch timestamp in seconds, preserving the exact time provided.
     */
    public static convertStringToEpochWithPattern(dateStr: string, pattern = 'DD-MM-YYYY HH:mm'): number {
        if (!dateStr || !moment(dateStr, pattern, true).isValid()) {
            return 0;
        }

       //return moment(dateStr, pattern).valueOf();
        return moment.parseZone(dateStr, pattern, true).valueOf();
    }

    /**
     * Return true if first date less than second.
     * @param date1 first date
     * @param date2 second date
     * @param unit of granularity (year month week day hour minute second)
     */
    public static compareDates(date1: string, date2?: string, unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' = 'day'): boolean {
        //@ts-ignore
        if (!DateUtils.isDateTimeValid(date1) || !DateUtils.isDateTimeValid(date2))
            return false;
        return moment(date1 || moment()).isBefore(date2 || moment(), unit);
    }

    /**
     * Return nearest day of week from specified date
     * @param date initial date
     * @param day (1 = Monday, 7 = Sunday)
     */
    public static getNearestWeekDay(date: string, day: number): string {
        const m = moment(date);
        if (m.isoWeekday() <= day) {
            return m.isoWeekday(day).format('YYYY-MM-DD');
        }
        return m.add(1, 'weeks').isoWeekday(day).format('YYYY-MM-DD');
    }

    /**
     * Add specified period and return result
     */
    public static add(date: string, num: number, period: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'): string {
        return moment(date).add(num, period).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Get start of date with period
     */
    public static startOf(date: string, period: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'): string {
        return moment(date).startOf(period).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Get start of date with period
     */
    public static endOf(date: string, period: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'): string {
        return moment(date).endOf(period).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Convert month name to number.
     * full and short month name allowed (Jan, january)
     */
    public static monthToNumber(month: string, locale?: string): number {
        if (locale) {
            moment.locale(locale);
        }
        return +moment().month(month).format('M');
    }

    /**
     * Get difference between 2 dates
     */
    public static getDateDifference(date1: string, date2: string, period: 'year' | 'months' | 'days' | 'hour' | 'minute' | 'seconds' | 'milliseconds', precise: boolean = false): number {
        if (!DateUtils.isDateTimeValid(date1)) {
            date1 = DateUtils.convertEpocToString(0);
        }
        if (!DateUtils.isDateTimeValid(date2)) {
            date2 = DateUtils.convertEpocToString(0);
        }
        return Math.abs(moment(date1).diff(date2, period, precise));
    }

    public static convertStringTimeToEpoch(time: string): number {
        return (Number(time.split(':')[0]) * 60 + Number(time.split(':')[1])) * 60 * 1000;
    }

    public static convertEpochTimeToString(epoch: number): string {
        const h = Math.floor(epoch / 1000 / 60 / 60);
        const m = Math.floor((epoch / 1000 / 60) - (h * 60));
        return `${h}:${m}`;
    }

    public static getEpocWithTimeZoneOffset(dateEpoc: number, timezone: string, subtract?: boolean): number {
        if (!dateEpoc) {
            //@ts-ignore
            return null;
        }

        const date = DateUtils.convertEpocToString(dateEpoc);
        const timezoneOffset = DateUtils.getTimeZoneOffsetForDate(date, timezone);

        return this.convertStringToEpoc(momentTimezone(dateEpoc).tz(timezone).format('YYYY-MM-DDTHH:mm:ss'));
    }

    public static getTimeZoneOffsetForDate(date: string, timezone: string): string {
        if (!DateUtils.isDateTimeValid(date) || !timezone) {
            return '';
        }

        return momentTimezone(date).tz(timezone).format('ZZ');
    }

    public static isDateInRange(date: string, startDate: string, endDate: string) : boolean {
        const compareDateMoment = moment(date);
        const startDateMoment = moment(startDate);
        const endDateMoment = moment(endDate);

        return compareDateMoment.isBetween(startDateMoment, endDateMoment, null, '[]');
    }
//@ts-ignore
    public static splitToDateTime(date: number | string, timeZone): { date: number, time: number } {
        const dateEpoch = typeof date === 'string'
            ? DateUtils.convertStringToEpoc(<string>date)
            : +date;

        const timezonedDate = DateUtils.getEpocWithTimeZoneOffset(dateEpoch, timeZone);
        const dateWithoutTime = DateUtils.convertStringToEpoc(DateUtils.startOf(DateUtils.convertEpocToString(dateEpoch), 'day'));
        const time = timezonedDate - dateWithoutTime;
        return { date: dateWithoutTime, time };
    }

    public static dateRangesOverlap(startDate1: number, endDate1: number, startDate2: number, endDate2: number) {
        return Math.max(startDate1, startDate2) <= Math.min(endDate1, endDate2);
    }

    public static formatEpocToString(dateEpoc: number, format: string): string {
        if (!dateEpoc) {
            //@ts-ignore
            return null;
        }
        return moment(dateEpoc).utc().format(format);
    }
}
