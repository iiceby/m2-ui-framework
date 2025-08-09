import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { AuthService } from '../../../shared/services/business/auth.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ResetPasswordAction, ResetPasswordFailAction, ResetPasswordResetAction, ResetPasswordSuccessAction } from './reset-password.actions';

export interface ResetPasswordStateModel {
    pending: boolean;
    requestSent: boolean;
    error: ErrorObject;
}

@State<ResetPasswordStateModel>({
    name: 'resetPassword',
    defaults: { pending: false, requestSent: false, error: null }
})
@Injectable()
export class ResetPasswordState {
    constructor(private authService: AuthService) { }

    @Action(ResetPasswordAction) resetPassword(ctx: StateContext<ResetPasswordStateModel>, action: ResetPasswordAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        this.authService.resetPassword(action.payload)
            .then(() => setTimeout(() => ctx.dispatch(new ResetPasswordSuccessAction()), 0))
            .catch(err => setTimeout(() => ctx.dispatch(new ResetPasswordFailAction(err)), 0));
    }

    @Action(ResetPasswordSuccessAction) resetPasswordSuccess(ctx: StateContext<ResetPasswordStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, requestSent: true, error: null });
    }

    @Action(ResetPasswordFailAction) resetPasswordFail(ctx: StateContext<ResetPasswordStateModel>, action: ResetPasswordFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, error: action.payload });
    }

    @Action(ResetPasswordResetAction) resetPasswordReset(ctx: StateContext<ResetPasswordStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, requestSent: false, error: null });
    }
}
