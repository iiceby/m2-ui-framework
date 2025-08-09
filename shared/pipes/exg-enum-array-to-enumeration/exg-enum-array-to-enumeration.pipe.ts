import { Pipe, PipeTransform } from '@angular/core';
//import { ExgTranslateService } from '../../services/common/exg-translate.service';

@Pipe({
    name: 'exgEnumArrayToEnumeration'
})
export class ExgEnumArrayToEnumerationPipe implements PipeTransform {
    // constructor(private translate: ExgTranslateService) {
    // }

    transform(value: any[], currentEnum: any): any {
        return value.map(el => currentEnum[el]).join(', ');
    }
}
