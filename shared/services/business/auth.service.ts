import { Injectable } from '@angular/core';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';
import { HttpService } from '../../../shared/services/common/http.service';
import { LanguageService } from '../../../shared/services/common/language-service.service';
import { TokenService } from '../../../shared/services/common/token.service';

import { AuthRequest } from '../../models/business/auth/auth-request.model';
import { AuthResponse, AuthResponseTypeGuard } from '../../models/business/auth/auth-response.model';
import { ChangePasswordRequest } from '../../models/business/auth/change-password-request.model';
import { ConfirmRequest } from '../../models/business/auth/confirm-request.model';
import { ExgCultureEnum } from '../../../shared/models/common/exg-culture.model';
import { RegistrationLightRequest, RegistrationRequest } from '../../models/business/auth/registration-request.model';
import { ResetPasswordRequest } from '../../models/business/auth/reset-password-request.model';
import { User, UserTypeDataGuard } from '../../models/business/user/user.model';

import { JwtUtils } from '../../../shared/utils/jwt-utils';
import { String } from '../../../shared/utils/string';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseSingletonService {

    private settings: { service: { login: string; logout: string; register: string; registerLight: string; resetPassword: string; changePassword: string; confirmEmail: string; sendEmailConfirmation: string; confirmSms: string; sendSmsConfirmation: string; } };

    constructor(private http: HttpService, private tokenService: TokenService, private languageService: LanguageService) {
        super('AuthService');
        this.settings = {
            service: {
                login: '/identity/v1/auth/login?culture={0}',
                logout: '/identity/v1/auth/logout',
                register: '/identity/v1/users?culture={0}',
                registerLight: '/identity/v1/users?culture={0}',
                resetPassword: '/identity/v1/users/reset-password?culture={0}',
                changePassword: '/identity/v1/users/{0}/password',
                confirmEmail: '/identity/v1/users/{0}/email/confirm?culture={1}',
                sendEmailConfirmation: '/identity/v1/users/{0}/email/send-confirmation',
                confirmSms: '/identity/v1/users/{0}/phone/confirm?culture={1}',
                sendSmsConfirmation: '/identity/v1/users/{0}/phone/send-confirmation'
            }
        };
    }

    /**
     * Authenticate user
     */
    public async login(authRequest: AuthRequest): Promise<void> {
        const culture = this.languageService.retrieveLanguage();
        return this.http.post<AuthResponse>(String.format(this.settings.service.login, culture), { ...authRequest }, new AuthResponseTypeGuard())
            .then(resp => this.tokenService.setAuth(resp.accessToken, resp.refreshToken))
            .catch((err) => {
                throw err;
            });
    }

    /**
     * Proceed user registration, then do login after successful registration
     */
    public async register(registrationRequest: RegistrationRequest): Promise<void> {
        const culture = ExgCultureEnum.Russian; // TODO this.languageService.retrieveLanguage();
        return this.http.post<{ data: User }>(String.format(this.settings.service.register, culture), { ...registrationRequest, culture }, new UserTypeDataGuard())
            .then(() => this.login({ login: registrationRequest.email, password: registrationRequest.password }));
    }

    /**
     * Proceed user light registration
     */
    public async lightRegister(req: RegistrationLightRequest): Promise<User> {
        const culture = ExgCultureEnum.Russian; // TODO this.languageService.retrieveLanguage();
        return this.http.post<{ data: User }>(String.format(this.settings.service.registerLight, culture), { firstName: req.firstName, lastName: req.lastName, email: req.email, groups: req.groups, culture })
            .then(res => res.data);
    }

    /**
     * Logout user
     */
    public async logout(): Promise<void> {
        return this.http.post<boolean>(this.settings.service.logout, null)
            .then(() => this.tokenService.resetAuthToken())
            .catch(() => this.tokenService.resetAuthToken());
    }

    /**
     * Reset user password
     */
    public async resetPassword(email: ResetPasswordRequest): Promise<boolean> {
        const culture = this.languageService.retrieveLanguage();
        return this.http.put<boolean>(String.format(this.settings.service.resetPassword, culture), email);
    }

    /**
     * Change user password
     */
    public async changePassword(change: ChangePasswordRequest): Promise<boolean> {
        return this.http.put<boolean>(String.format(this.settings.service.changePassword, change.userUid), change);
    }

    /**
     * Confirm email req
     */
    public async confirmEmail(confirmRequest: ConfirmRequest): Promise<boolean> {
        const culture = this.languageService.retrieveLanguage();
        return this.http.put<boolean>(String.format(this.settings.service.confirmEmail, confirmRequest.userUid, culture), { confirmationCode: confirmRequest.confirmationCode })
            .then(() => {
                const authObj = JwtUtils.decode<{ nameid: string }>(this.tokenService.getAuthToken());
                if (authObj && confirmRequest.userUid !== authObj.nameid) {
                    this.tokenService.resetAuthToken();
                    return false;
                }
                return true;
            });
    }

    /**
     * Send email confirmation request
     */
    public async sendEmailConfirmation(userUid: string): Promise<boolean> {
        return this.http.post<boolean>(String.format(this.settings.service.sendEmailConfirmation, userUid), null);
    }

    /**
     * Confirm sms req
     */
    public async confirmSms(confirmRequest: ConfirmRequest): Promise<boolean> {
        const culture = this.languageService.retrieveLanguage();
        return this.http.put<boolean>(String.format(this.settings.service.confirmSms, confirmRequest.userUid, culture), { confirmationCode: confirmRequest.confirmationCode });
    }

    /**
     * Send sms confirmation request
     */
    public async sendSmsConfirmation(userUid: string): Promise<boolean> {
        return this.http.post<boolean>(String.format(this.settings.service.sendSmsConfirmation, userUid), null);
    }

    /**
     * Get user id (from auth token), returns 0, if not authenticated
     */
    public getUserId(): string {
        const authToken = this.tokenService.getAuthToken();
        if (!authToken) return '';
        const token = JwtUtils.decode<{ nameid: string }>(authToken);
        if (!token) return '';
        return token.nameid || '';
    }

    /**
     * Check whether user is authenticated or not
     */
    public isLoggedIn(): boolean {
        return this.getUserId() && this.getUserId().length > 0;
    }

    // do NOT use this method in app, use ProfileSelectors instead!
    public isAuthorized(tokens: string[] | string): boolean {
        if (!this.isLoggedIn()) return false;
        if (!tokens) return true;
        const tokens1 = typeof tokens === 'string' ? tokens.split(',') : tokens.map(t => t.trim());
        if (tokens1.length === 0) return true;

        const authToken = this.tokenService.getAuthToken();
        let permissions = JwtUtils.decode(authToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
        permissions = typeof permissions === 'string' ? permissions.split(',') : permissions.map(t => t.trim());

        return tokens1.some(t => permissions.some(p => t === p));
    }
}
