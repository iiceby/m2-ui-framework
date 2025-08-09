import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'exgNumber' })
export class ExgDecimalPipe implements PipeTransform {
    private million = 1000000;
    private billion = 1000000000;

    constructor() {}

    public transform(value: any, digits?: string, braceNegative?: boolean, emptyDisplayValue?: string, groupMillion?: boolean, groupDigits?: string): string {
        if (!!+value || value === '0' || value === 0) {
            let val = +value;
            if (braceNegative && val < 0) {
                val *= -1;
            }

            if (groupMillion && (value >= this.million || value <= -this.million)) {
                if (value < this.billion || value > -this.billion) {
                    const millions = val / this.million;
                    //@ts-ignore
                    const millionsResult = new DecimalPipe().transform(+millions.toFixed(2), groupDigits).replace(',', '.');
                    return `${millionsResult} ${('million_short')}`;
                }

                const billions = val / this.billion;
                //@ts-ignore
                const billionsResult = new DecimalPipe().transform(+billions.toFixed(2), groupDigits).replace(',', '.');
                return `${billionsResult} ${('billion_short')}`;
            }
            //@ts-ignore
            let result = new DecimalPipe().transform(val, digits).replace(',', '.');
            if (braceNegative && +value < 0) {
                result = `(${result})`;
            }

            return result;
        }
        return emptyDisplayValue || '';
    }
}
