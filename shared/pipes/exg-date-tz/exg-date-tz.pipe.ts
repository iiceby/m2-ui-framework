import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


import { DateUtils } from '../../utils/date-utils';

@Pipe({
    name: 'exgDateTz',
    pure: false
})
export class ExgDateTzPipe implements PipeTransform {

    constructor() { }

    public transform(value: any, pattern?: string, emptyDisplayValue?: string, timezone?: string, locale?: string): string {
        if (timezone) {
            value = DateUtils.getEpocWithTimeZoneOffset(value, timezone);
        }
        if (+value) {
            // date as number considered epoc format
            value = DateUtils.convertEpocToString(value);
        }

        if (DateUtils.isDateTimeValid(value)) {
            const lang = locale;
            //@ts-ignore
            return new DatePipe(lang).transform(value, pattern);
        }
        return emptyDisplayValue || '';
    }
}
