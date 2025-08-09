import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import { ExgDialogResultEvent } from '../../components/common/exg-dialog/shared/exg-dialog-result-event.model';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { CloseDialogAction, CurrencyChangeAction, DialogResetAction, LangCurrencyChange, LanguageChangeAction, OpenDialogAction, ShowHeaderForSettingsAction } from './ui.actions';

@Injectable({
    providedIn: 'root'
})
export class UiDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('UiDispatchers');
    }

    public dispatchShowAddTransportAction(show: boolean) {
        this.store.dispatch(new ShowHeaderForSettingsAction({ show }));
    }

    public dispatchLanguageChangeAction(culture: string) {
        this.store.dispatch(new LanguageChangeAction({ culture }));
    }

    public dispatchCurrencyChangeAction(currency: string) {
        this.store.dispatch(new CurrencyChangeAction({ currency }));
    }

    public dispatchLanguageAndCurrencyChangeAction(culture: string, currency: string) {
        this.store.dispatch(new LangCurrencyChange({ culture, currency }));
    }

    public dispatchOpenDialog(showDialog: boolean, componentData: any) {
        this.store.dispatch(new OpenDialogAction({ showDialog, componentData }));
    }

    public dispatchCloseDialog(dialogData: ExgDialogResultEvent) {
        this.store.dispatch(new CloseDialogAction(dialogData));
    }

    public dispatchDialogReset() {
        this.store.dispatch(new DialogResetAction());
    }
}
