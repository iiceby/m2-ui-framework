import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';

import { AuthService } from '../../services/business/auth.service';
import { PusherService } from '../../services/common/pusher.service';

import { ErrorObject } from '../../models/common/error-object.model';

import { LogoutAction, LogoutFailAction, LogoutSuccessAction } from './logout.actions';

export interface LogoutStateModel {
    pending: boolean;
    loggedOut: boolean;
    error: ErrorObject;
}

@State<LogoutStateModel>({
    name: 'logout',
    defaults: { pending: false, loggedOut: false, error: null }
})
@Injectable()
export class LogoutState {
    constructor(private authService: AuthService, public pusherService: PusherService) { }

    @Action(LogoutAction) logout(ctx: StateContext<LogoutStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        this.authService.logout()
            .then(() => setTimeout(() => {
                ctx.dispatch(new StateResetAll(LogoutState));
                ctx.dispatch(new LogoutSuccessAction());
            }, 0))
            .catch(err => setTimeout(() => ctx.dispatch(new LogoutFailAction(err)), 0));
    }

    @Action(LogoutSuccessAction) logoutSuccess(ctx: StateContext<LogoutStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, loggedOut: true, error: null });
        this.pusherService.reconnect();
    }

    @Action(LogoutFailAction) logoutFail(ctx: StateContext<LogoutStateModel>, action: LogoutFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, loggedOut: true, error: action.payload });
    }
}
