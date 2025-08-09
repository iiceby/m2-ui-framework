import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'exgRideTime' })
export class ExgRideTime implements PipeTransform {
    constructor() { }

    public async transform(value: any): Promise<string> {
        let day, hour, minute, seconds = value;
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;

        // const days = day > 0 ? await this.translate.translate('{{value}}d', { value: day }) : '';
        // const hours = hour > 0 ? await this.translate.translate('{{value}}h', { value: hour }) : '';
        // const minutes = minute > 0 ? await this.translate.translate('{{value}}m', { value: minute }) : '';
        // return `${days} ${hours} ${minutes}`;
        return '';
    }
}
