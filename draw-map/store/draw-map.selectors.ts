import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../shared/services/common/base-singleton.service';

import { DrawMapState, DrawMapStateModel } from './draw-map.reducer';

import { DrawAction } from '../models/draw-action.model';
import { ToolbarAction } from '../models/toolbar-action.enum';

@Injectable({
    providedIn: 'root'
})
export class DrawMapSelectors extends BaseSingletonService {

    static readonly getAction = createSelector([DrawMapState], (state: DrawMapStateModel) => state.drawState);

    static readonly getMapReady = createSelector([DrawMapState], (state: DrawMapStateModel) => state.mapReady);

    static readonly getDrawAction = createSelector([DrawMapState], (state: DrawMapStateModel) => state.drawAction);

    @Select(DrawMapSelectors.getAction) drawState$: Observable<ToolbarAction>;

    @Select(DrawMapSelectors.getMapReady) mapReady$: Observable<boolean>;

    @Select(DrawMapSelectors.getDrawAction) drawAction$: Observable<DrawAction>;

    constructor() {
        super('DrawMapSelectors');
    }
}
