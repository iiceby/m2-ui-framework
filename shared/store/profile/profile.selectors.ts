import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { Profile } from '../../models/business/user/profile.model';

import { ProfileState, ProfileStateModel } from './profile.reducer';

@Injectable({
    providedIn: 'root'
})
export class ProfileSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([ProfileState], (state: ProfileStateModel) => state.pending);

    static readonly getProfile = createSelector([ProfileState], (state: ProfileStateModel) => state.profile);

    static readonly getRetrieved = createSelector([ProfileState], (state: ProfileStateModel) => !!state.profile);

    static readonly getError = createSelector([ProfileState], (state: ProfileStateModel) => state.error);

    @Select(ProfileSelectors.getPending) pending$: Observable<boolean>;

    @Select(ProfileSelectors.getProfile) profile$: Observable<Profile>;

    @Select(ProfileSelectors.getRetrieved) retrieved$: Observable<boolean>;

    @Select(ProfileSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('ProfileSelectors');
    }
}
