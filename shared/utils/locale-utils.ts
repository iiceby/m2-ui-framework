import { ExgCultureEnum } from '../models/common/exg-culture.model';
import { ExgCurrencyEnum } from '../models/common/exg-currency.model';

export class LocaleUtils {
    public static parseLanguage(culture: string): ExgCultureEnum {
        if (culture.indexOf('ru') > -1) return ExgCultureEnum.Russian;
        return ExgCultureEnum.English;
    }

    public static parseCurrency(currency: string): ExgCurrencyEnum {
        if (currency.indexOf('RUB') > -1) return ExgCurrencyEnum.Russian;
        if (currency.indexOf('EUR') > -1) return ExgCurrencyEnum.Euro;
        return ExgCurrencyEnum.English;
    }

    public static parseLangFormCulture(culture: ExgCultureEnum): string {
        return culture.length >= 2 ? culture.substr(0, 2) : 'ru';
    }

    public static parseLangFormCultureStronglyTyped(culture: ExgCultureEnum): 'auto' | 'ar' | 'da' | 'de' | 'en' | 'es' | 'fi' | 'fr' | 'he' | 'it' | 'ja' | 'lt' | 'lv' | 'ms' | 'nb' | 'nl' | 'no' | 'pl' | 'pt' | 'pt-BR' | 'ru' | 'sv' | 'zh' {
        return culture.length >= 2 ? <'ar' | 'da' | 'de' | 'en' | 'es' | 'fi' | 'fr' | 'he' | 'it' | 'ja' | 'lt' | 'lv' | 'ms' | 'nb' | 'nl' | 'no' | 'pl' | 'pt' | 'pt-BR' | 'ru' | 'sv' | 'zh'>culture.substr(0, 2) : 'auto';
    }

    public static parseCountryFromCulture(culture: ExgCultureEnum | any): string {
        return LocaleUtils.isCultureValid(culture) ? culture.split('-').pop().toUpperCase() : 'RU';
    }

    public static isCultureValid(culture: string): boolean {
        if (!culture) return false;

        for (const key in ExgCultureEnum) {
            if (ExgCultureEnum.hasOwnProperty(key)) {

                //@ts-ignore
                if (culture === ExgCultureEnum[key]) {
                    return true;
                }
            }
        }

        return false;
    }
}
