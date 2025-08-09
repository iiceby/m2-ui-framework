import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { RegistrationLightRequest } from '../../models/business/auth/registration-request.model';

import { RegistrationAction, RegistrationResetAction } from './registration.actions';

@Injectable({
    providedIn: 'root'
})
export class RegistrationDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('RegistrationDispatchers');
    }

    public dispatchRegistrationAction(req: RegistrationLightRequest) {
        this.store.dispatch(new RegistrationAction(req));
    }

    public dispatchRegistrationResetAction() {
        this.store.dispatch(new RegistrationResetAction());
    }
}
