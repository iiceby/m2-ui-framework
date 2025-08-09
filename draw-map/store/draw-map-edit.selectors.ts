import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../shared/services/common/base-singleton.service';

import { DrawMapEditState, DrawMapEditStateModel } from './draw-map-edit.reducer';

import { EditSource } from '../models/edit-source.enum';

@Injectable({
    providedIn: 'root'
})
export class DrawMapEditSelectors extends BaseSingletonService {

    static readonly getFeature = createSelector([DrawMapEditState], (state: DrawMapEditStateModel) => state.feature);

    static readonly getChangesSource = createSelector([DrawMapEditState], (state: DrawMapEditStateModel) => state.changesSource);

    static readonly getBackEnabled = createSelector([DrawMapEditState], (state: DrawMapEditStateModel) => state.changes.length > 0);

    static readonly getReturnEnabled = createSelector([DrawMapEditState], (state: DrawMapEditStateModel) => state.returnStack.length > 0);

    static readonly getIsFeatureChanged = createSelector([DrawMapEditState], (state: DrawMapEditStateModel) => state.isFeatureChanged);

    @Select(DrawMapEditSelectors.getFeature) editedFeature$: Observable<any>;

    @Select(DrawMapEditSelectors.getChangesSource) changesSource$: Observable<EditSource>;

    @Select(DrawMapEditSelectors.getBackEnabled) undoEnabled$: Observable<boolean>;

    @Select(DrawMapEditSelectors.getReturnEnabled) redoEnabled$: Observable<boolean>;

    @Select(DrawMapEditSelectors.getIsFeatureChanged) isFeatureChanged$: Observable<boolean>;

    constructor() {
        super('DrawMapEditSelectors');
    }
}
