import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyService } from '../../services/common/currency-service.service';


import { ExgCultureEnum } from '../../models/common/exg-culture.model';

@Pipe({ name: 'exgCurrency', pure: false })
export class ExgCurrencyPipe implements PipeTransform {

    constructor(
                private currencyService: CurrencyService) { }

    public transform(value: any, symbolDisplay?: 'code' | 'symbol', digits?: string, currencyCode?: string, descriptionOnly?: boolean): string {
        const currency = currencyCode || this.currencyService.retrieveCurrency();

        if (!!+value || value === '0' || value === 0) {
            const lang = symbolDisplay === 'symbol' ? ExgCultureEnum.Russian : ExgCultureEnum.Russian;
            const transformed = new CurrencyPipe(lang).transform(value, currency, symbolDisplay, digits);
            //@ts-ignore
            return descriptionOnly ? transformed.replace(/[0-9]/g, '') : transformed;
        }
        return '';
    }

    public async getCurrencySymbol(currencyCode?: string) {
        return (await this.transform(0, 'symbol', '1.0-0', currencyCode)).replace(/[0-9]/g, '');
    }

    public async getCurrencyName(currencyCode?: string) {
        return (await this.transform(0, 'code', '1.0-0', currencyCode)).replace(/[0-9]/g, '');
    }
}
