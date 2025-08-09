import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';

import { AuthService } from '../../../shared/services/business/auth.service';
import { PusherService } from '../../../shared/services/common/pusher.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { LoginState } from '../../../shared/store/login/login.reducer';

import { RegistrationAction, RegistrationFailAction, RegistrationResetAction, RegistrationSuccessAction } from './registration.actions';
import { User } from '../../models/business/user/user.model';

export interface RegistrationStateModel {
    pending: boolean;
    registered: User;
    error: ErrorObject;
}

@State<RegistrationStateModel>({
    name: 'registration',
    defaults: { pending: false, registered: null, error: null }
})
@Injectable()
export class RegistrationState {
    constructor(private authService: AuthService, public pusherService: PusherService) { }

    @Action(RegistrationAction) registration(ctx: StateContext<RegistrationStateModel>, action: RegistrationAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        this.authService.lightRegister(action.payload)
            .then(res => setTimeout(() => {
                ctx.dispatch(new StateResetAll(LoginState));
                ctx.dispatch(new RegistrationSuccessAction(res));
            }, 0))
            .catch(err => setTimeout(() => ctx.dispatch(new RegistrationFailAction(err)), 0));
    }

    @Action(RegistrationSuccessAction) registrationSuccess(ctx: StateContext<RegistrationStateModel>, action: RegistrationSuccessAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, registered: action.payload, error: null });
        this.pusherService.reconnect();
    }

    @Action(RegistrationFailAction) registrationFail(ctx: StateContext<RegistrationStateModel>, action: RegistrationFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, error: action.payload });
    }

    @Action(RegistrationResetAction) registrationReset(ctx: StateContext<RegistrationStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, registered: null, error: null });
    }
}
