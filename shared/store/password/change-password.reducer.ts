import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { AuthService } from '../../../shared/services/business/auth.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ChangePasswordAction, ChangePasswordFailAction, ChangePasswordResetAction, ChangePasswordSuccessAction } from './change-password.actions';

export interface ChangePasswordStateModel {
    pending: boolean;
    changed: boolean;
    error: ErrorObject;
}

@State<ChangePasswordStateModel>({
    name: 'changePassword',
    defaults: { pending: false, changed: false, error: null }
})
@Injectable()
export class ChangePasswordState {
    constructor(private authService: AuthService) { }

    @Action(ChangePasswordAction) changePassword(ctx: StateContext<ChangePasswordStateModel>, action: ChangePasswordAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, changed: false, error: null });

        this.authService.changePassword(action.payload)
            .then(() => setTimeout(() => ctx.dispatch(new ChangePasswordSuccessAction()), 0))
            .catch(err => setTimeout(() => ctx.dispatch(new ChangePasswordFailAction(err)), 0));
    }

    @Action(ChangePasswordSuccessAction) changePasswordSuccess(ctx: StateContext<ChangePasswordStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, changed: true, error: null });
    }

    @Action(ChangePasswordFailAction) changePasswordFail(ctx: StateContext<ChangePasswordStateModel>, action: ChangePasswordFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, changed: false, error: action.payload });
    }

    @Action(ChangePasswordResetAction) changePasswordReset(ctx: StateContext<ChangePasswordStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, changed: false, error: null });
    }
}
