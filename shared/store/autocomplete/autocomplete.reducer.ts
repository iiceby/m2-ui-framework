import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { AutocompleteAction, AutocompleteResetAction, AutocompleteSuccessAction } from './autocomplete.actions';

export interface AutocompleteStateModel {
    term: string;
    data: any[];
}

@State<AutocompleteStateModel>({
    name: 'autocomplete',
    defaults: { term: null, data: [] }
})
@Injectable()
export class AutocompleteState {
    @Action([AutocompleteAction]) autocompleteGet(ctx: StateContext<AutocompleteStateModel>, action: AutocompleteAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, term: action.payload });
    }

    @Action(AutocompleteSuccessAction) autocompleteGetSuccess(ctx: StateContext<AutocompleteStateModel>, action: AutocompleteSuccessAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, data: action.payload });
    }

    @Action(AutocompleteResetAction) autocompleteGetReset(ctx: StateContext<AutocompleteStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, term: null, data: [] });
    }
}
