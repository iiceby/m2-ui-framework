import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../../burns-ui-framework/shared/services/common/base-singleton.service';

import { CountriesAction, CountriesResetAction } from './countries.actions';

@Injectable({
    providedIn: 'root'
})
export class CountriesDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('CountriesDispatchers');
    }

    public dispatchCountriesAction() {
        this.store.dispatch(new CountriesAction());
    }

    public dispatchCountriesResetAction() {
        this.store.dispatch(new CountriesResetAction());
    }
}
