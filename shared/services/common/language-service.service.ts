import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';
import { ExgCookieService } from './exg-cookie.service';
import { LocalStorageService } from './local-storage.service';
import { PlatformService } from './platform.service';

import { ExgCultureEnum } from '../../models/common/exg-culture.model';

import { ExgBaseParamsConfig } from '../../exg-params.config';
import { LocaleUtils } from '../../utils/locale-utils';

@Injectable({
    providedIn: 'root'
})
export class LanguageService extends BaseSingletonService {

    constructor(private cookieService: ExgCookieService, private platformService: PlatformService, private localStorage: LocalStorageService) {
        super('LanguageService');
    }

    public storeLanguage(language: string) {
        // place to cookie instead of localStorage to make it accessible on server side
        this.cookieService.setCookie(ExgBaseParamsConfig.storageKeys.storageLanguage, LocaleUtils.parseLanguage(language));
        // dublicate to localStorage for working in google autocompleate module loading
        this.localStorage.setItem(ExgBaseParamsConfig.storageKeys.storageLanguage, language);
    }

    public retrieveLanguage(): ExgCultureEnum {
        const rawLang = this.cookieService.getCookie(ExgBaseParamsConfig.storageKeys.storageLanguage) || this.platformService.getPlatformLanguage();
        return LocaleUtils.parseLanguage(rawLang);
    }

    public resetLanguage() {
        this.cookieService.removeCookie(ExgBaseParamsConfig.storageKeys.storageLanguage);
    }
}
