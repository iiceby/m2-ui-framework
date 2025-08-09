import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BaseSingletonService } from '../common/base-singleton.service';
import { TokenService } from '../common/token.service';

import { AuthResponse } from '../../models/common/auth-response.model';
import { SettingsTokens } from '../../settings-tokens.config';

import { UrlUtils } from '../../utils/url-utils';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthRefreshService extends BaseSingletonService {

    private settings: { service: { refresh: string; } };

    constructor(@Inject(SettingsTokens.tokens.environment) private environment: any, private http: HttpClient, private tokenService: TokenService, private router: Router) {
        super('AuthRefreshService');
        this.settings = {
            service: {
                refresh: '/auth/refresh'
            }
        };
    }

    /**
     * Refresh auth token
     */
    public refresh(): Observable<boolean> {
        const apiUrl = UrlUtils.encodeUrl(this.environment.apiUrl + this.settings.service.refresh);
        const accessToken = this.tokenService.getAuthToken();
        const refreshToken = this.tokenService.getRefreshToken();
        const apiKey = this.environment.apiKey;
        const data = { accessToken, refreshToken, apiKey };
        return this.http.post<{data: AuthResponse, success: boolean}>(apiUrl, data, { observe: 'response' }).pipe(
            //@ts-ignore
            map(resp => resp.body),
            tap((resp: {data: AuthResponse, success: boolean}) => {
                this.tokenService.setAuth(resp.data?.accessToken, resp.data?.refreshToken);
            }),
            map(() => true),
            catchError((err) => {
                this.tokenService.resetAuthToken();
                this.router.navigate(['/auth/login']);
                throw err;
            })
        );
    }
}
