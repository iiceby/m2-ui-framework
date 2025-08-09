import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { DrawMapDrawActionAction, DrawMapReadyAction, DrawMapResetAction, DrawMapToolbarAction } from './draw-map.actions';

import { BaseSingletonService } from '../../shared/services/common/base-singleton.service';

import { DrawAction } from '../models/draw-action.model';
import { ToolbarAction } from '../models/toolbar-action.enum';

@Injectable({
    providedIn: 'root'
})
export class DrawMapDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('DrawMapDispatchers');
    }

    public dispatchDrawMapReadyAction() {
        this.store.dispatch(new DrawMapReadyAction());
    }

    public dispatchDrawMapTooltipAction(request: ToolbarAction) {
        this.store.dispatch(new DrawMapToolbarAction(request));
    }

    public dispatchDrawMapDrawActionAction(request: DrawAction) {
        this.store.dispatch(new DrawMapDrawActionAction(request));
    }

    public dispatchDrawMapResetAction() {
        this.store.dispatch(new DrawMapResetAction());
    }
}
