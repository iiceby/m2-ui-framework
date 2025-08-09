import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'exgCardNumber'
})
export class ExgCardNumberPipe implements PipeTransform {
    public transform(lates4Number: string): unknown {
        return `**** **** **** ${lates4Number}`;
    }
}
