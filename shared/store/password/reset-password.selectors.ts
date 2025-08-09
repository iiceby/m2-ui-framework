import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ResetPasswordState, ResetPasswordStateModel } from './reset-password.reducer';

@Injectable({
    providedIn: 'root'
})
export class ResetPasswordSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([ResetPasswordState], (state: ResetPasswordStateModel) => state.pending);

    static readonly getRequestSent = createSelector([ResetPasswordState], (state: ResetPasswordStateModel) => state.requestSent);

    static readonly getError = createSelector([ResetPasswordState], (state: ResetPasswordStateModel) => state.error);

    @Select(ResetPasswordSelectors.getPending) pending$: Observable<boolean>;

    @Select(ResetPasswordSelectors.getRequestSent) requestSent$: Observable<boolean>;

    @Select(ResetPasswordSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('ResetPasswordSelectors');
    }
}
