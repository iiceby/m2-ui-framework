import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ChangePasswordRequest } from '../../models/business/auth/change-password-request.model';

import { ChangePasswordAction, ChangePasswordResetAction } from './change-password.actions';

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('ChangePasswordDispatchers');
    }

    public dispatchChangePasswordAction(req: ChangePasswordRequest) {
        this.store.dispatch(new ChangePasswordAction(req));
    }

    public dispatchChangePasswordResetAction() {
        this.store.dispatch(new ChangePasswordResetAction());
    }
}
