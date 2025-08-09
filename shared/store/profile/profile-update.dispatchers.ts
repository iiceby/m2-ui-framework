import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../../../burns-ui-framework/shared/services/common/base-singleton.service';

import { ProfileUpdateRequest } from '../../models/business/user/profile.model';

import { ProfileUpdateAction, ProfileUpdateResetAction, ProfileWelcomeDisplayedUpdateAction } from './profile-update.actions';

@Injectable({
    providedIn: 'root'
})
export class ProfileUpdateDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('ProfileUpdateDispatchers');
    }

    public dispatchProfileUpdateAction(req: ProfileUpdateRequest) {
        this.store.dispatch(new ProfileUpdateAction(req));
    }

    public dispatchProfileUpdateResetAction() {
        this.store.dispatch(new ProfileUpdateResetAction());
    }

    public dispatchProfileWelcomeDisplayedUpdateAction(welcomeDisplayed: boolean) {
        this.store.dispatch(new ProfileWelcomeDisplayedUpdateAction({ welcomeDisplayed }));
    }
}
