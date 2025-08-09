import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exgArrayFilter', pure: false })
export class ExgArrayFilterPipe implements PipeTransform {
    public transform(array: any[], filterFunc: (item: any, params: any) => boolean, params: any): any[] {
        return (array || []).filter((arrayItem: any) => filterFunc(arrayItem, params));
    }

}
