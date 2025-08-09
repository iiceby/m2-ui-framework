import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { ErrorObject } from '../../models/common/error-object.model';

import { LoginState, LoginStateModel } from './login.reducer';

@Injectable({
    providedIn: 'root'
})
export class LoginSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([LoginState], (state: LoginStateModel) => state.pending);

    static readonly getLoggedIn = createSelector([LoginState], (state: LoginStateModel) => state.loggedIn);

    static readonly getError = createSelector([LoginState], (state: LoginStateModel) => state.error);

    @Select(LoginSelectors.getPending) pending$: Observable<boolean>;

    @Select(LoginSelectors.getLoggedIn) loggedIn$: Observable<boolean>;

    @Select(LoginSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('LoginSelectors');
    }
}
