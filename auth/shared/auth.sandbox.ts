import { Injectable, OnDestroy } from '@angular/core';

import { combineLatest, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { AuthService } from '../../shared/services/business/auth.service';
import { ExgTranslateService } from '../../shared/services/common/exg-translate.service';
import { LanguageService } from '../../shared/services/common/language-service.service';
import { LoginDispatchers } from '../../shared/store/login/login.dispatchers';
import { LoginSelectors } from '../../shared/store/login/login.selectors';
import { PhoneCodesDispatchers } from '../../shared/store/phone-codes/phone-codes.dispatchers';
import { PhoneCodesSelectors } from '../../shared/store/phone-codes/phone-codes.selectors';
import { ProfileDispatchers } from '../../shared/store/profile/profile.dispatchers';
import { RegistrationDispatchers } from '../../shared/store/registration/registration.dispatchers';
import { RegistrationSelectors } from '../../shared/store/registration/registration.selectors';
import { ResetPasswordDispatchers } from '../../shared/store/password/reset-password.dispatchers';
import { ResetPasswordSelectors } from '../../shared/store/password/reset-password.selectors';

import { AuthRequest } from '../../shared/models/business/auth/auth-request.model';
import { ExgCultureEnum } from '../../shared/models/common/exg-culture.model';
import { RegistrationLightRequest } from '../../shared/models/business/auth/registration-request.model';
import { ResetPasswordRequest } from '../../shared/models/business/auth/reset-password-request.model';

import { BaseSingletonService } from '../../shared/services/common/base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class AuthSandbox extends BaseSingletonService implements OnDestroy {

    public loginPending$ = this.loginSelectors.pending$;
    public loginError$ = this.loginSelectors.error$;
    public loggedIn$ = this.loginSelectors.loggedIn$;

    public registrationPending$ = this.registrationSelectors.pending$;
    public registrationError$ = this.registrationSelectors.error$;
    public registered$ = this.registrationSelectors.registered$;

    public resetPasswordPending$ = this.resetPasswordSelectors.pending$;
    public resetPasswordError$ = this.resetPasswordSelectors.error$;
    public resetPasswordRequestSent$ = this.resetPasswordSelectors.requestSent$;

    public phoneCodesPending$ = this.phoneCodesSelectors.pending$;
    public phoneCodesError$ = this.phoneCodesSelectors.error$;
    public phoneCodes$ = this.phoneCodesSelectors.phoneCodes$;

    private unsubscribe = new Subject();

    constructor(private authService: AuthService,
                private loginDispatchers: LoginDispatchers,
                private loginSelectors: LoginSelectors,
                private registrationDispatchers: RegistrationDispatchers,
                private registrationSelectors: RegistrationSelectors,
                private resetPasswordDispatchers: ResetPasswordDispatchers,
                private resetPasswordSelectors: ResetPasswordSelectors,
                private phoneCodesDispatchers: PhoneCodesDispatchers,
                private phoneCodesSelectors: PhoneCodesSelectors,
                private profileDispatchers: ProfileDispatchers,
                private languageService: LanguageService,
                private translate: ExgTranslateService) {
        super('AuthSandbox');
    }

    public ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    public dispatchPhoneCodesGet(culture: ExgCultureEnum) {
        combineLatest([this.phoneCodes$, this.phoneCodesPending$]).pipe(first()).subscribe((res) => {
            if (!res[0] && !res[1]) {
                this.phoneCodesDispatchers.dispatchPhoneCodesAction(culture, 'contactsPage');
            }
        });
    }

    public dispatchLogin(authRequest: AuthRequest) {
        this.loginDispatchers.dispatchLoginAction(authRequest);
    }

    public dispatchLoginReset() {
        this.loginDispatchers.dispatchLoginResetAction();
    }

    public dispatchRegistration(registrationRequest: RegistrationLightRequest) {
        this.registrationDispatchers.dispatchRegistrationAction(registrationRequest);
    }

    public dispatchRegistrationReset() {
        this.registrationDispatchers.dispatchRegistrationResetAction();
    }

    public dispatchResetPassword(resetPasswordRequest: ResetPasswordRequest) {
        this.resetPasswordDispatchers.dispatchResetPasswordAction(resetPasswordRequest);
    }

    public dispatchResetPasswordReset() {
        this.resetPasswordDispatchers.dispatchResetPasswordResetAction();
    }

    public setAuthLanguage(lang: ExgCultureEnum) {
        const currLang = this.languageService.retrieveLanguage();
        if (currLang !== lang) {
            this.languageService.storeLanguage(lang);
            this.translate.apply();
        }
    }

    public dispatchProfileAction() {
        const userUid = this.authService.getUserId();
        this.profileDispatchers.dispatchProfileAction(userUid, 'authGuard');
    }
}
