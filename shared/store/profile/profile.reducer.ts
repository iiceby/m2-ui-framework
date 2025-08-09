import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { ProfileService } from '../../services/business/profile.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { ExgCultureEnum } from '../../../shared/models/common/exg-culture.model';
import { Profile } from '../../models/business/user/profile.model';

import { ProfileUpdateSettingsSuccessAction } from './profile-update-settings.actions';
import { ProfileUpdateSuccessAction, ProfileWelcomeDisplayedUpdateAction } from './profile-update.actions';
import { ProfileFailAction, ProfileFrom404PageAction, ProfileFromAuthGuardAction, ProfileFromHeaderComponentAction, ProfileSuccessAction, UserNameUpdateAction } from './profile.actions';

export interface ProfileStateModel {
    pending: boolean;
    profile: Profile;
    error: ErrorObject;
}

@State<ProfileStateModel>({
    name: 'profile',
    defaults: { pending: false, profile: null, error: null }
})
@Injectable()
export class ProfileState {
    constructor(private profileService: ProfileService) { }

    @Action([ProfileFromAuthGuardAction, ProfileFromHeaderComponentAction, ProfileFrom404PageAction]) async profileGet(ctx: StateContext<ProfileStateModel>, action: ProfileFromAuthGuardAction | ProfileFromHeaderComponentAction | ProfileFrom404PageAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        return this.profileService.getProfile(action.payload.userUid)
            .then(resp => setTimeout(() => ctx.dispatch(new ProfileSuccessAction(resp)), 0))
            .catch(err => setTimeout(() => ctx.dispatch(new ProfileFailAction(err)), 0));
    }

    @Action([ProfileSuccessAction, ProfileUpdateSuccessAction]) profileGetSuccess(ctx: StateContext<ProfileStateModel>, action: ProfileSuccessAction | ProfileUpdateSuccessAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, profile: action.payload, error: null });
    }

    @Action(ProfileFailAction) profileGetFail(ctx: StateContext<ProfileStateModel>, action: ProfileFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, error: action.payload });
    }

    @Action(ProfileWelcomeDisplayedUpdateAction) profileWelcomeDisplayedUpdate(ctx: StateContext<ProfileStateModel>, action: ProfileWelcomeDisplayedUpdateAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, profile: { ...state.profile, welcomeDisplayed: action.payload.welcomeDisplayed } });
    }

    @Action(UserNameUpdateAction) updateUserName(ctx: StateContext<ProfileStateModel>, action: UserNameUpdateAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, profile: { ...state.profile, user: { ...state.profile.user, firstName: action.payload.firstName, lastName: action.payload.lastName } } });
    }

    @Action(ProfileUpdateSettingsSuccessAction) updateUserCulture(ctx: StateContext<ProfileStateModel>, action: ProfileUpdateSettingsSuccessAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, profile: { ...state.profile, user: { ...state.profile.user, culture: <ExgCultureEnum>action.payload.culture } } });
    }
}
