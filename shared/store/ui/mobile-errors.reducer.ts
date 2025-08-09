import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { MobileErrorsAction } from './mobile-errors.actions';

export interface MobileErrorsStateModel {
    listErrors: { text: string, data: any }[];
}

@State<MobileErrorsStateModel>({
    name: 'mobileErrors',
    defaults: { listErrors: [] }
})
@Injectable()
export class MobileErrorsState {

    @Action(MobileErrorsAction) order(ctx: StateContext<MobileErrorsStateModel>, action: MobileErrorsAction) {
        const state = ctx.getState();
        const listErrors = [...state.listErrors, { text: action.text, data: action.data }];
        ctx.setState({ ...state, listErrors });
    }
}
