import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { BaseSingletonService } from '../../services/common/base-singleton.service';
import { CurrencyService } from '../../services/common/currency-service.service';
import { ExgTranslateService } from '../../services/common/exg-translate.service';
import { LanguageService } from '../../services/common/language-service.service';
import { LocalStorageService } from '../../services/common/local-storage.service';
import { BaseUsersService } from '../../services/business/users.service';

import { Profile, ProfileUpdateRequest } from '../../../shared/models/business/user/profile.model';
import { User } from '../../../shared/models/business/user/user.model';

import { ExgBaseParamsConfig } from '../../exg-params.config';

@Injectable({
    providedIn: 'root'
})
export class ProfileService extends BaseSingletonService {

    constructor(private languageService: LanguageService, private currencyService: CurrencyService, private localStorage: LocalStorageService, private translate: ExgTranslateService, private authService: AuthService, private usersService: BaseUsersService) {
        super('ProfileService');
    }

    /**
     * Retrieve user profile
     */
    public async getProfile(userUid: string): Promise<Profile> {
        const welcomeDisplayed = this.getWelcomeDisplayedFlag();
        return this.usersService.getUser(userUid).then(res => ({ user: res, welcomeDisplayed }));
    }

    /**
     * Update user profile
     */
    public async updateProfile(updateRequest: ProfileUpdateRequest): Promise<Profile> {
        const removeAvatar: Promise<boolean> = updateRequest.removeAvatar ? this.usersService.deleteUserAvatar(updateRequest.user.uid) : Promise.resolve(true);
        const welcomeDisplayed = this.getWelcomeDisplayedFlag();

        return removeAvatar.then(() => Promise.all([
            this.usersService.updateUser(updateRequest.user.uid, updateRequest.user)
        ]).then((res: [User]) => {
            this.setLanguage(res[0]);
            return { user: res[0], welcomeDisplayed };
        }));
    }

    public getWelcomeDisplayedFlag(): boolean {
        const key = `${ExgBaseParamsConfig.storageKeys.storageWelcomeDisplayed}_${this.authService.getUserId()}`;
        return (+this.localStorage.getItem(key) || 0) > 0;
    }

    public setWelcomeDisplayedFlag(value: boolean) {
        const key = `${ExgBaseParamsConfig.storageKeys.storageWelcomeDisplayed}_${this.authService.getUserId()}`;
        this.localStorage.setItem(key, value ? '1' : '0');
    }

    private setLanguage(user: User) {
        if (user.culture) {
            this.languageService.storeLanguage(user.culture);
            this.translate.apply();
        }
    }

    private setCurrency(settings: { currency: string; }) {
        if (settings.currency) {
            this.currencyService.storeCurrency(settings.currency);
        }
    }
}
