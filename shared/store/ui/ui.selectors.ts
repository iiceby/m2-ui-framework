import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { UiState, UiStateModel } from './ui.reducer';

@Injectable({
    providedIn: 'root'
})
export class UiSelectors extends BaseSingletonService {

    static readonly getShowSettingsHeader = createSelector([UiState], (state: UiStateModel) => state.showSettingsHeader);

    static readonly getCulture = createSelector([UiState], (state: UiStateModel) => state.culture);

    static readonly getCurrency = createSelector([UiState], (state: UiStateModel) => state.currency);

    static readonly getShowDialog = createSelector([UiState], (state: UiStateModel) => state.showDialog);

    static readonly getComponentData = createSelector([UiState], (state: UiStateModel) => state.componentData);

    static readonly getCloseData = createSelector([UiState], (state: UiStateModel) => state.closeData);

    @Select(UiSelectors.getShowSettingsHeader) showSettingsHeader$: Observable<boolean>;

    @Select(UiSelectors.getCulture) culture$: Observable<string>;

    @Select(UiSelectors.getCurrency) currency$: Observable<string>;

    @Select(UiSelectors.getShowDialog) showDialog$: Observable<boolean>;

    @Select(UiSelectors.getComponentData) componentData$: Observable<any>;
    
    @Select(UiSelectors.getCloseData) closeDialog$: Observable<any>;
    
    constructor() {
        super('UiSelectors');
    }
}
