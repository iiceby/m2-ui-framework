import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';



import { DateUtils } from '../../utils/date-utils';

@Pipe({
    name: 'exgDate',
    pure: false
})
export class ExgDatePipe implements PipeTransform {

    constructor() { }

    public transform(value: any, pattern?: string, emptyDisplayValue?: string, locale?: string): string {
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
