import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { PhoneService } from '../../services/business/phone.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { PhoneCode } from '../../../shared/models/business/phone-code.model';

import { PhoneCodesAction, PhoneCodesFailAction, PhoneCodesResetAction, PhoneCodesSuccessAction } from './phone-codes.actions';

export interface PhoneCodesStateModel {
    pending: boolean;
    phoneCodes: PhoneCode[];
    error: ErrorObject;
}

@State<PhoneCodesStateModel>({
    name: 'phoneCodes',
    defaults: { pending: false, phoneCodes: [], error: null }
})
@Injectable()
export class PhoneCodesState {
    constructor(private phoneService: PhoneService) { }

    @Action([PhoneCodesAction.FromContactPage, PhoneCodesAction.FromRegistrationPage]) phoneCodesGet(ctx: StateContext<PhoneCodesStateModel>, action: PhoneCodesAction.PhoneCodesActionsUnion) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        return this.phoneService.getPhoneCodes(action.payload.culture)
            .then(resp => setTimeout(() => ctx.dispatch(new PhoneCodesSuccessAction(resp)), 0))
            .catch(err => setTimeout(() => ctx.dispatch(new PhoneCodesFailAction(err)), 0));
    }

    @Action(PhoneCodesSuccessAction) phoneCodesGetSuccess(ctx: StateContext<PhoneCodesStateModel>, action: PhoneCodesSuccessAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, phoneCodes: action.payload, error: null });
    }

    @Action(PhoneCodesFailAction) phoneCodesGetFail(ctx: StateContext<PhoneCodesStateModel>, action: PhoneCodesFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, error: action.payload });
    }

    @Action(PhoneCodesResetAction) phoneCodesGetReset(ctx: StateContext<PhoneCodesStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, phoneCodes: [], error: null });
    }
}
