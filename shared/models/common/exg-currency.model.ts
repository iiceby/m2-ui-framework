export enum ExgCurrencyEnum {
    English = 'USD',
    Russian = 'RUB',
    Euro = 'EUR'
}

export type ExgСurrencies = ExgCurrencyEnum.Russian | ExgCurrencyEnum.English | ExgCurrencyEnum.Euro;
