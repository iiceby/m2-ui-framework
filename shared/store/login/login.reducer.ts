import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';

import { AuthService } from '../../services/business/auth.service';
import { PusherService } from '../../services/common/pusher.service';

import { ErrorObject } from '../../models/common/error-object.model';

import { LoginAction, LoginFailAction, LoginResetAction, LoginSuccessAction } from './login.actions';

export interface LoginStateModel {
    pending: boolean;
    loggedIn: boolean;
    error: ErrorObject;
}

@State<LoginStateModel>({
    name: 'login',
    defaults: { pending: false, loggedIn: false, error: null }
})
@Injectable()
export class LoginState {
    constructor(private authService: AuthService, public pusherService: PusherService) { }

    @Action(LoginAction) login(ctx: StateContext<LoginStateModel>, action: LoginAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        this.authService.login(action.payload)
            .then(() => setTimeout(() => {
                ctx.dispatch(new StateResetAll(LoginState));
                ctx.dispatch(new LoginSuccessAction());
            }, 0))
            .catch(err => setTimeout(() => ctx.dispatch(new LoginFailAction(err)), 0));
    }

    @Action(LoginSuccessAction) loginSuccess(ctx: StateContext<LoginStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, loggedIn: true, error: null });
        this.pusherService.reconnect();
    }

    @Action(LoginFailAction) loginFail(ctx: StateContext<LoginStateModel>, action: LoginFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, error: action.payload });
    }

    @Action(LoginResetAction) loginReset(ctx: StateContext<LoginStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, loggedIn: false, error: null });
    }
}
