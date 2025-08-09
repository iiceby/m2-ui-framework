import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exgArrayMath' })
export class ExgArrayMathPipe implements PipeTransform {
    public transform(array: any[], select: 'min' | 'max' | 'summ' | 'filter', selectorFunc?: (item: any) => any): any {
        const internalArray = selectorFunc ? array.map(arr => (selectorFunc(arr))) : array;

        switch (select) {
            case 'min':
                return Math.min(...internalArray);
            case 'max':
                return Math.max(...internalArray);
            case 'filter':
                //@ts-ignore
                return array.reduce((min, item) => selectorFunc(item) < selectorFunc(min) ? item : min, array[0]);
            default:
                return internalArray.reduce((a, b) => a + b, 0);
        }
    }

}
