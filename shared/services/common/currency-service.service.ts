import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';
import { ExgCookieService } from './exg-cookie.service';
import { LanguageService } from './language-service.service';

import { ExgCultureEnum } from '../../models/common/exg-culture.model';
import { ExgCurrencyEnum } from '../../models/common/exg-currency.model';
import { ExgBaseParamsConfig } from '../../exg-params.config';
import { LocaleUtils } from '../../utils/locale-utils';

@Injectable({
    providedIn: 'root',
})
export class CurrencyService extends BaseSingletonService {
    constructor(private cookieService: ExgCookieService, private languageService: LanguageService) {
        super('CurrencyService');
    }

    public storeCurrency(currency: string) {
        // place to cookie instead of localStorage to make it accessible on server side
        this.cookieService.setCookie(ExgBaseParamsConfig.storageKeys.storageCurrency, LocaleUtils.parseCurrency(currency));
    }

    public retrieveCurrency(): ExgCurrencyEnum {
        const rawLang = this.cookieService.getCookie(ExgBaseParamsConfig.storageKeys.storageCurrency);
        //@ts-ignore
        return rawLang ? LocaleUtils.parseCurrency(rawLang) : this.getPlatformCurrency();
    }

    public resetCurrency() {
        this.cookieService.removeCookie(ExgBaseParamsConfig.storageKeys.storageCurrency);
    }

    public retriveCurrencyByLang(culture: string) {
        return this.getCurrencyByLanguage(culture);
    }

    private getPlatformCurrency() {
        const culture = this.languageService.retrieveLanguage();
        return this.getCurrencyByLanguage(culture);
    }
    //@ts-ignore
    private getCurrencyByLanguage(culture: string) {
        switch (culture) {
            case ExgCultureEnum.Russian:
                return ExgCurrencyEnum.Russian;

            case ExgCultureEnum.English:
                return ExgCurrencyEnum.English;
        }
    }
}
