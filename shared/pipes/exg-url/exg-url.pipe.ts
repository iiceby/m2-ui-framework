import { Pipe, PipeTransform } from '@angular/core';

//import { ExgTranslateService } from '../../services/common/exg-translate.service';

@Pipe({ name: 'exgUrl' })
export class ExgUrlPipe implements PipeTransform {
    constructor() { }

    public transform(value: string): string {
        return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
    }
}
