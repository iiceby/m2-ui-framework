import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { map, filter, startWith, distinctUntilChanged } from 'rxjs/operators';

import { BaseSingletonService } from '../common/base-singleton.service';
import { LocalStorageService } from '../common/local-storage.service';

import { ExgBaseParamsConfig } from '../../exg-params.config';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class TokenService extends BaseSingletonService {
    private tokenSubject = new BehaviorSubject<string | null>(this.getAuthToken());
    
    constructor(private localStorage: LocalStorageService, private router: Router) {
        super('TokenService');
        
        // Listen to storage events from other tabs/windows
        fromEvent<StorageEvent>(window, 'storage')
            .pipe(
                filter(event => event.key === ExgBaseParamsConfig.storageKeys.storageTokenKey),
                map(event => event.newValue),
                distinctUntilChanged()
            )
            .subscribe(token => {
                this.tokenSubject.next(token);
            });
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
        
        // Notify subscribers about token change
        this.tokenSubject.next(token);
    }

    /**
     * Get Observable that emits when token changes
     */
    public getTokenObservable(): Observable<string | null> {
        return this.tokenSubject.asObservable().pipe(
            distinctUntilChanged()
        );
    }

    /**
     * Get current token value synchronously
     */
    public getCurrentToken(): string | null {
        return this.tokenSubject.value;
    }
}
