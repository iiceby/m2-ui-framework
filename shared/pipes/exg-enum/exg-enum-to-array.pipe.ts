import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'exgEnumToArray'
})
export class ExgEnumToArrayPipe implements PipeTransform {
    transform(data: {}, isNumber?: boolean) {
        const keys = Object.keys(data);
        if (!keys || !keys.length) {
            //@ts-ignore
            return ;
        }
        return isNumber ? keys.slice(0, keys.length / 2).map(val => +val) : keys.slice(keys.length / 2);
    }
}
