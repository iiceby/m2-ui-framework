import { DateUtils } from './date-utils';

describe('DateUtils tests', () => {

    it('Should validate correct date strings', () => {
        let valid = DateUtils.isDateTimeValid('2017-05-30 15:45:33');
        expect(valid).toBeTruthy('valid format YYYY-MM-DD HH:mm:ss');
        valid = DateUtils.isDateTimeValid('2017-05-30T15:45:33');
        expect(valid).toBeTruthy('valid format YYYY-MM-DDTHH:mm:ss');
        valid = DateUtils.isDateTimeValid('2017-05-30');
        expect(valid).toBeTruthy('valid format YYYY-MM-DD');
        valid = DateUtils.isDateTimeValid('2017-05-30 15:45:33.664');
        expect(valid).toBeTruthy('valid format YYYY-MM-DD HH:mm:ss.SSS');
        valid = DateUtils.isDateTimeValid('2017-05-30 15:45:33.63');
        expect(valid).toBeTruthy('valid format YYYY-MM-DD HH:mm:ss.SS');
        valid = DateUtils.isDateTimeValid('2017-05-30 15:45');
        expect(valid).toBeTruthy('valid format YYYY-MM-DD HH:mm');
        valid = DateUtils.isDateTimeValid('2017-05-30T15:45');
        expect(valid).toBeTruthy('valid format YYYY-MM-DDTHH:mm');
        valid = DateUtils.isDateTimeValid('0001-01-01');
        expect(valid).toBeTruthy('strange, but valid date');
    });

    it('Should invalidate wrong date strings', () => {
        let valid = DateUtils.isDateTimeValid('08/20/2014 3:30 pm');
        expect(valid).toBeFalsy('date string must be in ISO format');
        valid = DateUtils.isDateTimeValid('August 20, 2014 3:30 PM');
        expect(valid).toBeFalsy('date string must be in ISO format');
        valid = DateUtils.isDateTimeValid('2017/05/30');
        expect(valid).toBeFalsy('date string must be in ISO format');
        valid = DateUtils.isDateTimeValid('qwerty');
        expect(valid).toBeFalsy('nonsense string');
        valid = DateUtils.isDateTimeValid('');
        expect(valid).toBeFalsy('empty string');
        valid = DateUtils.isDateTimeValid(null);
        expect(valid).toBeFalsy('null string');
        valid = DateUtils.isDateTimeValid('43265436');
        expect(valid).toBeFalsy('digits should not be validated as date');
        valid = DateUtils.isDateTimeValid('333');
        expect(valid).toBeFalsy('digits should not be validated as date');
        valid = DateUtils.isDateTimeValid('-2017-05-30');
        expect(valid).toBeFalsy('mistaken date');
    });

    it('Should correctly convert jsDate to string', () => {
        let date = DateUtils.convertDateToString(new Date(2018, 7, 12, 18, 32));
        expect(date).toBe('2018-08-12T18:32:00');
        date = DateUtils.convertDateToString(new Date('2017-05-30T23:12:44'));
        expect(date).toBe('2017-05-30T23:12:44', 'datetime should NOT be shifted to another time zone');
        date = DateUtils.convertDateToString(null);
        expect(date).toBe(null, 'null date return null');
    });

    it('Should correctly convert epoch to string', () => {
        const date = DateUtils.convertEpocToString(1527170225);
        expect(date).toBe('2018-05-24T13:57:05');
    });

    it('Should correctly convert string to epoch', () => {
        const date = DateUtils.convertStringToEpoc('2018-05-24T13:57:05');
        expect(date).toBe(1527170225);
    });

    it('Should correctly compare dates', () => {
        let conv = DateUtils.compareDates('2017-05-30T23:12:44', '2017-05-29T23:12:44', 'day');
        expect(conv).toBe(false);
        conv = DateUtils.compareDates('2017-05-25', '2017-05-29T23:12:44', 'day');
        expect(conv).toBe(true);
        conv = DateUtils.compareDates('2017-05-25', '2017-05-26', 'day');
        expect(conv).toBe(true);
        conv = DateUtils.compareDates('2017-05-14', '2017-05-14T23:12:44', 'day');
        expect(conv).toBe(false);
        conv = DateUtils.compareDates('2017-05-30T11:12:44', '2017-05-30T23:12:44', 'day');
        expect(conv).toBe(false);
        conv = DateUtils.compareDates('2017-05-30T11:12:44', '2017-05-30T23:12:44', 'hour');
        expect(conv).toBe(true);
        conv = DateUtils.compareDates('2017-05-25', '2017-05-26', 'month');
        expect(conv).toBe(false);
        conv = DateUtils.compareDates('qwerty', '2017-05-30T11:12:44', 'day');
        expect(conv).toBe(false, 'invalid date1 string');
        conv = DateUtils.compareDates('2017-05-30T11:12:44', 'qwerty', 'day');
        expect(conv).toBe(false, 'invalid date2 string');
    });

    it('Should correctly determine nearest day of week', () => {
        const date = '2017-08-15';
        let nearest = DateUtils.getNearestWeekDay(date, 7);
        expect(nearest).toBe('2017-08-20', 'should detect nearest Sunday');
        nearest = DateUtils.getNearestWeekDay(date, 1);
        expect(nearest).toBe('2017-08-21', 'should detect nearest Monday');
    });

    it('Should correctly add period', () => {
        const date = '2017-08-15 15:30:42';
        let added = DateUtils.add(date, 1, 'days');
        expect(added).toBe('2017-08-16 15:30:42');
        added = DateUtils.add(date, -3, 'minutes');
        expect(added).toBe('2017-08-15 15:27:42');
        added = DateUtils.add(date, 2, 'months');
        expect(added).toBe('2017-10-15 15:30:42');
        added = DateUtils.add(date, -1, 'seconds');
        expect(added).toBe('2017-08-15 15:30:41');
    });

    it('Should correctly convert month name to number', () => {
        let mon = DateUtils.monthToNumber('January');
        expect(mon).toBe(1, 'full month name');
        mon = DateUtils.monthToNumber('Jan');
        expect(mon).toBe(1, 'short month name');
        mon = DateUtils.monthToNumber('Jul');
        expect(mon).toBe(7);
        mon = DateUtils.monthToNumber('oCtOBer');
        expect(mon).toBe(10, 'case insensitive');
        mon = DateUtils.monthToNumber('Январь', 'ru');
        expect(mon).toBe(1, 'long month name in Russian');
        mon = DateUtils.monthToNumber('Окт', 'ru');
        expect(mon).toBe(10, 'short month name in Russian');
        mon = DateUtils.monthToNumber('иЮлЬ', 'ru');
        expect(mon).toBe(7, 'long month name in Russian, case insensitive');
    });

    it('Should correctly calc difference between dates', () => {
        let diff = DateUtils.getDateDifference('2018-05-15', '2018-05-12', 'days');
        expect(diff).toBe(3);
        diff = DateUtils.getDateDifference('2018-05-15', '2018-05-20', 'days');
        expect(diff).toBe(5, 'order does not matter');
        diff = DateUtils.getDateDifference('2018-05-15', '2018-05-20', 'months');
        expect(diff).toBe(0);
    });
});
