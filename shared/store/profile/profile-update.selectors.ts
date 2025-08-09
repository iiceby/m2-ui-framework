import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../../burns-ui-framework/shared/services/common/base-singleton.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ProfileUpdateState, ProfileUpdateStateModel } from './profile-update.reducer';

@Injectable({
    providedIn: 'root'
})
export class ProfileUpdateSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([ProfileUpdateState], (state: ProfileUpdateStateModel) => state.pending);

    static readonly getUpdated = createSelector([ProfileUpdateState], (state: ProfileUpdateStateModel) => state.updated);

    static readonly getError = createSelector([ProfileUpdateState], (state: ProfileUpdateStateModel) => state.error);

    @Select(ProfileUpdateSelectors.getPending) pending$: Observable<boolean>;

    @Select(ProfileUpdateSelectors.getUpdated) updated$: Observable<boolean>;

    @Select(ProfileUpdateSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('ProfileUpdateSelectors');
    }
}
