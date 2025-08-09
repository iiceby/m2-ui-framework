import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exgArrayAny' })
export class ExgArrayAnyPipe implements PipeTransform {
    public transform(array: any[], item: any, selectorFunc?: (item: any) => any): boolean {
        return selectorFunc
            ? array?.some(entry => selectorFunc(entry) === selectorFunc(item))
            : array?.some(entry => entry === item);
    }

}
