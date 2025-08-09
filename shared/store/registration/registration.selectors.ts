import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { User } from '../../models/business/user/user.model';

import { RegistrationState, RegistrationStateModel } from './registration.reducer';

@Injectable({
    providedIn: 'root'
})
export class RegistrationSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([RegistrationState], (state: RegistrationStateModel) => state.pending);

    static readonly getRegistered = createSelector([RegistrationState], (state: RegistrationStateModel) => state.registered);

    static readonly getError = createSelector([RegistrationState], (state: RegistrationStateModel) => state.error);

    @Select(RegistrationSelectors.getPending) pending$: Observable<boolean>;

    @Select(RegistrationSelectors.getRegistered) registered$: Observable<User>;

    @Select(RegistrationSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('RegistrationSelectors');
    }
}
