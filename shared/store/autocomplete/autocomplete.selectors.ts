import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { AutocompleteState, AutocompleteStateModel } from './autocomplete.reducer';

@Injectable({
    providedIn: 'root'
})
export class AutocompleteSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([AutocompleteState], (state: AutocompleteStateModel) => state.term);

    static readonly getAutocomplete = createSelector([AutocompleteState], (state: AutocompleteStateModel) => state.data);

    @Select(AutocompleteSelectors.getPending) term$: Observable<string>;

    @Select(AutocompleteSelectors.getAutocomplete) data$: Observable<any[]>;

    constructor() {
        super('AutocompleteSelectors');
    }
}
