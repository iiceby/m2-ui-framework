import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exgTimespan' })
export class ExgTimespanPipe implements PipeTransform {

    public transform(value: any, short?: boolean, emptyDisplayValue?: string): string {

        const secTotal = parseInt(value, 10);

        if (!secTotal) {
            return emptyDisplayValue || '';
        }

        const hours = Math.floor(secTotal / 3600);
        const minutes = Math.floor((secTotal - (hours * 3600)) / 60);
        const seconds = (secTotal - (hours * 3600) - (minutes * 60));

        const strHours = (hours < 10) ? (`0${hours}`) : `${hours}`;
        const strMinutes = (minutes < 10) ? `0${minutes}` : `${minutes}`;
        const strSeconds = (seconds < 10) ? `0${seconds}` : `${seconds}`;

        const timeParts = [];
        if (strHours.length > 0) {
            timeParts.push(strHours);
        }

        if (strMinutes.length > 0) {
            timeParts.push(strMinutes);
        }

        if (strSeconds.length > 0) {
            timeParts.push(strSeconds);
        }

        return timeParts.join(':');
    }

}
