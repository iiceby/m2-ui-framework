import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { ErrorObject } from '../../models/common/error-object.model';

import { LogoutState, LogoutStateModel } from './logout.reducer';

@Injectable({
    providedIn: 'root'
})
export class LogoutSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([LogoutState], (state: LogoutStateModel) => state.pending);

    static readonly getLoggedOut = createSelector([LogoutState], (state: LogoutStateModel) => state.loggedOut);

    static readonly getError = createSelector([LogoutState], (state: LogoutStateModel) => state.error);

    @Select(LogoutSelectors.getPending) pending$: Observable<boolean>;

    @Select(LogoutSelectors.getLoggedOut) loggedOut$: Observable<boolean>;

    @Select(LogoutSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('LogoutSelectors');
    }
}
