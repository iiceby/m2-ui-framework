import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
// import { ProfileUpdateSettingsSuccessAction } from '../profile/profile-update-settings.actions';
// import { ProfileUpdateSuccessAction } from '../profile/profile-update.actions';
// import { ProfileSuccessAction } from '../profile/profile.actions';

import { CloseDialogAction, CurrencyChangeAction, DialogResetAction, LangCurrencyChange, LanguageChangeAction, OpenDialogAction, ShowHeaderForSettingsAction } from './ui.actions';

export interface UiStateModel {
    showSettingsHeader: boolean;
    culture: string;
    currency: string;
    showDialog: boolean;
    componentData: any;
    closeData: any;
}

@State<UiStateModel>({
    name: 'ui',
    defaults: {
        showSettingsHeader: false,
        culture: '',
        currency: '',
        showDialog: false,
        componentData: null,
        closeData: null
    }
})
@Injectable()
export class UiState {
    @Action([ShowHeaderForSettingsAction]) storageGet(ctx: StateContext<UiStateModel>, action: ShowHeaderForSettingsAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, showSettingsHeader: action.payload.show });
    }

    @Action([LanguageChangeAction]) storageSetLang(ctx: StateContext<UiStateModel>, action: LanguageChangeAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, culture: action.payload.culture });
    }

    @Action([CurrencyChangeAction]) storageSetCurrency(ctx: StateContext<UiStateModel>, action: CurrencyChangeAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, currency: action.payload.currency });
    }

    @Action([LangCurrencyChange]) storageSetLangCurrency(ctx: StateContext<UiStateModel>, action: LangCurrencyChange) {
        const state = ctx.getState();
        ctx.setState({ ...state, currency: action.payload.currency, culture: action.payload.culture });
    }

    // @Action([ProfileUpdateSettingsSuccessAction]) storageSetCulture(ctx: StateContext<UiStateModel>, action: ProfileUpdateSettingsSuccessAction) {
    //     const state = ctx.getState();
    //     ctx.setState({ ...state, culture: action.payload.culture });
    // }

    // @Action([ProfileSuccessAction, ProfileUpdateSuccessAction]) profileGetSuccess(ctx: StateContext<UiStateModel>, action: ProfileSuccessAction | ProfileUpdateSuccessAction) {
    //     const state = ctx.getState();
    //     ctx.setState({ ...state, culture: action.payload.user.culture });
    // }

    @Action([OpenDialogAction]) openDialogAction(ctx: StateContext<UiStateModel>, action: OpenDialogAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, componentData: action.payload.componentData, showDialog: action.payload.showDialog, closeData: null });
    }

    @Action([CloseDialogAction]) closeDialogAction(ctx: StateContext<UiStateModel>, action: CloseDialogAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, closeData: action.payload, showDialog: false });
    }

    @Action([DialogResetAction]) dialogResetAction(ctx: StateContext<UiStateModel>, _: DialogResetAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, closeData: null, showDialog: false, componentData: null });
    }
}
