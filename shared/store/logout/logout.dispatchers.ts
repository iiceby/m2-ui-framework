import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { LogoutAction } from './logout.actions';

@Injectable({
    providedIn: 'root'
})
export class LogoutDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('LogoutDispatchers');
    }

    public dispatchLogoutAction() {
        this.store.dispatch(new LogoutAction());
    }

    public dispatchFullResetAction() {
        this.store.dispatch(new StateResetAll());
    }
}
