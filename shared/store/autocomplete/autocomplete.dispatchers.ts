import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { AutocompleteAction, AutocompleteResetAction, AutocompleteSuccessAction } from './autocomplete.actions';

@Injectable({
    providedIn: 'root'
})
export class AutocompleteDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('AutocompleteDispatchers');
    }

    public dispatchAutocompleteAction(request: string) {
        this.store.dispatch(new AutocompleteAction(request));
    }

    public dispatchAutocompleteDataAction(data: any[]) {
        this.store.dispatch(new AutocompleteSuccessAction(data));
    }

    public dispatchAutocompleteResetAction() {
        this.store.dispatch(new AutocompleteResetAction());
    }
}
