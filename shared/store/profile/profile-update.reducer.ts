import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { ProfileService } from '../../services/business/profile.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ProfileUpdateAction, ProfileUpdateFailAction, ProfileUpdateResetAction, ProfileUpdateSuccessAction, ProfileWelcomeDisplayedUpdateAction } from './profile-update.actions';
import { ProfileStateModel } from './profile.reducer';

export interface ProfileUpdateStateModel {
    pending: boolean;
    updated: boolean;
    error: ErrorObject;
}

@State<ProfileUpdateStateModel>({
    name: 'profileUpdate',
    defaults: { pending: false, updated: false, error: null }
})
@Injectable()
export class ProfileUpdateState {
    constructor(private profileService: ProfileService) { }

    @Action(ProfileUpdateAction) async profileUpdate(ctx: StateContext<ProfileUpdateStateModel>, action: ProfileUpdateAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, updated: false, error: null });

        return this.profileService.updateProfile(action.payload)
            .then(resp => setTimeout(() => ctx.dispatch(new ProfileUpdateSuccessAction(resp)), 0))
            .catch(err => setTimeout(() => ctx.dispatch(new ProfileUpdateFailAction(err)), 0));
    }

    @Action(ProfileUpdateSuccessAction) profileUpdateSuccess(ctx: StateContext<ProfileUpdateStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, updated: true, error: null });
    }

    @Action(ProfileUpdateFailAction) profileUpdateFail(ctx: StateContext<ProfileUpdateStateModel>, action: ProfileUpdateFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, updated: false, error: action.payload });
    }

    @Action(ProfileUpdateResetAction) profileUpdateReset(ctx: StateContext<ProfileUpdateStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, updated: false, error: null });
    }

    @Action(ProfileWelcomeDisplayedUpdateAction) profileWelcomeDisplayedUpdate(_: StateContext<ProfileStateModel>, action: ProfileWelcomeDisplayedUpdateAction) {
        this.profileService.setWelcomeDisplayedFlag(action.payload.welcomeDisplayed);
    }
}
