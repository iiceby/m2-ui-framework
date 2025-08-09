import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { filter, takeUntil } from 'rxjs/operators';

import { ExgOnDestroy } from '../../../burns-ui-framework/shared/components/abstract/exg-on-destroy.component';

import { AuthSandbox } from '../../auth/shared/auth.sandbox';

import { AuthRequest } from '../../shared/models/business/auth/auth-request.model';
import { ExgCultureEnum } from '../../../burns-ui-framework/shared/models/common/exg-culture.model';

import { RoutingConfig } from '../../shared/routing.config';

@Component({
    selector: 'app-login-container',
    templateUrl: './login.container.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginContainer extends ExgOnDestroy {
    public pending$ = this.authSandbox.loginPending$;
    public loggedIn$ = this.authSandbox.loggedIn$;
    public error$ = this.authSandbox.loginError$;

    constructor(private router: Router, private authSandbox: AuthSandbox) {
        super();
        this.authSandbox.loggedIn$.pipe(filter(x => !!x), takeUntil(this.unsubscribe)).subscribe(() => {
            this.router.navigate([RoutingConfig.routes.home.fullUrl]);
            this.authSandbox.dispatchProfileAction();
        });
    }

    public onLogin(event: AuthRequest) {
        this.authSandbox.dispatchLogin(event);
    }

    public onLanguageSelect(language: ExgCultureEnum) {
        this.authSandbox.setAuthLanguage(language);
    }

    protected afterDestroy() {
        this.authSandbox.dispatchLoginReset();
    }
}
