import { Injectable } from '@angular/core';

import { BaseSingletonService } from '../common/base-singleton.service';
import { LocalStorageService } from '../common/local-storage.service';

import { ExgBaseParamsConfig } from '../../exg-params.config';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class TokenService extends BaseSingletonService {
    constructor(private localStorage: LocalStorageService, private router: Router) {
        super('TokenService');
    }

    /**
     * Reset auth tokens
     */
    public resetAuthToken(redirectURL?: null | string) {
        this.setAuth(null, null);
        this.router.navigate(['/auth/login'], { queryParams: { redirectURL: redirectURL } });
    }

    /**
     * Get authentication token
     */
    public getAuthToken(): string {
        return this.localStorage.getItem(ExgBaseParamsConfig.storageKeys.storageTokenKey);
    }

    public getRefreshToken(): string {
        return this.localStorage.getItem(ExgBaseParamsConfig.storageKeys.storageRefreshTokenKey);
    }

    public setAuth(token: string | null, refreshToken: string | null) {
        if (!token) {
            this.localStorage.removeItem(ExgBaseParamsConfig.storageKeys.storageTokenKey);
            this.localStorage.removeItem(ExgBaseParamsConfig.storageKeys.storageRefreshTokenKey);
        } else {
            this.localStorage.setItem(ExgBaseParamsConfig.storageKeys.storageTokenKey, token);
            this.localStorage.setItem(ExgBaseParamsConfig.storageKeys.storageRefreshTokenKey, refreshToken ?? '');
        }
    }
}
