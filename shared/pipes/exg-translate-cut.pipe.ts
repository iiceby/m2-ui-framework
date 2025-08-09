import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exgTranslateCut' })
export class ExgTranslateCut implements PipeTransform {
    public transform(value: string, index: string): string {
        const cutIndex = +index;
        return value.split('|')[cutIndex];
    }
}
