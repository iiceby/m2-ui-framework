import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { AuthRequest } from '../../models/business/auth/auth-request.model';

import { LoginAction, LoginResetAction } from './login.actions';

@Injectable({
    providedIn: 'root'
})
export class LoginDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('LoginDispatchers');
    }

    public dispatchLoginAction(authRequest: AuthRequest) {
        this.store.dispatch(new LoginAction(authRequest));
    }

    public dispatchLoginResetAction() {
        this.store.dispatch(new LoginResetAction());
    }
}
