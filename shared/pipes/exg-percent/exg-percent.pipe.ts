import { PercentPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

//import { ExgTranslateService } from '../../services/common/exg-translate.service';

@Pipe({ name: 'exgPercent' })
export class ExgPercentPipe implements PipeTransform {
    constructor() { }

    public transform(value: any, digits?: string): string {
        if (!!+value || value === '0' || value === 0) {
            //@ts-ignore
            return new PercentPipe().transform(+value / 100, digits || '1.2-2');
        }
        return '';
    }
}
