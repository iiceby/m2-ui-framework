import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ExgCultureEnum } from '../../../shared/models/common/exg-culture.model';

import { PhoneCodesAction, PhoneCodesResetAction } from './phone-codes.actions';

@Injectable({
    providedIn: 'root'
})
export class PhoneCodesDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('PhoneCodesDispatchers');
    }

    public dispatchPhoneCodesAction(culture: ExgCultureEnum, source: 'contactsPage' | 'registrationPage') {
        switch (source) {
            case 'contactsPage':
                this.store.dispatch(new PhoneCodesAction.FromContactPage({ culture }));
                break;
            case 'registrationPage':
                this.store.dispatch(new PhoneCodesAction.FromRegistrationPage({ culture }));
                break;
        }
    }

    public dispatchPhoneCodesResetAction() {
        this.store.dispatch(new PhoneCodesResetAction());
    }
}
