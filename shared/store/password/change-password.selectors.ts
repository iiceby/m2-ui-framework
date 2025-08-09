import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ChangePasswordState, ChangePasswordStateModel } from './change-password.reducer';

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([ChangePasswordState], (state: ChangePasswordStateModel) => state.pending);

    static readonly getChanged = createSelector([ChangePasswordState], (state: ChangePasswordStateModel) => state.changed);

    static readonly getError = createSelector([ChangePasswordState], (state: ChangePasswordStateModel) => state.error);

    @Select(ChangePasswordSelectors.getPending) pending$: Observable<boolean>;

    @Select(ChangePasswordSelectors.getChanged) changed$: Observable<boolean>;

    @Select(ChangePasswordSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('ChangePasswordSelectors');
    }
}
