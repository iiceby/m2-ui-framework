import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ResetPasswordRequest } from '../../models/business/auth/reset-password-request.model';

import { ResetPasswordAction, ResetPasswordResetAction } from './reset-password.actions';

@Injectable({
    providedIn: 'root'
})
export class ResetPasswordDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('ResetPasswordDispatchers');
    }

    public dispatchResetPasswordAction(req: ResetPasswordRequest) {
        this.store.dispatch(new ResetPasswordAction(req));
    }

    public dispatchResetPasswordResetAction() {
        this.store.dispatch(new ResetPasswordResetAction());
    }
}
