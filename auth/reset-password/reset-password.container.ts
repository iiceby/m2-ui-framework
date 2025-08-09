import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExgOnDestroy } from '../../../burns-ui-framework/shared/components/abstract/exg-on-destroy.component';

import { AuthSandbox } from '../shared/auth.sandbox';

@Component({
    templateUrl: './reset-password.container.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordContainer extends ExgOnDestroy {

    public pending$ = this.authSandbox.resetPasswordPending$;
    public error$ = this.authSandbox.resetPasswordError$;
    public resetRequestSent$ = this.authSandbox.resetPasswordRequestSent$;

    constructor(private authSandbox: AuthSandbox) {
        super();
    }

    public onResetPassword(email: string) {
        this.authSandbox.dispatchResetPassword({ email });
    }

    protected afterDestroy() {
        this.authSandbox.dispatchResetPasswordReset();
    }
}
