import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'exgOrderId'
})
export class ExgOrderIdPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return value ? (value + '').replace(/(\d{3})/g, '$1 ') : '';
    }
}
