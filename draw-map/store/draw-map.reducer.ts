import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { DrawMapDrawActionAction, DrawMapReadyAction, DrawMapResetAction, DrawMapToolbarAction } from './draw-map.actions';

import { DrawAction } from '../models/draw-action.model';
import { ToolbarAction } from '../models/toolbar-action.enum';

export interface DrawMapStateModel {
    drawState: ToolbarAction;
    mapReady: boolean;
    drawAction: DrawAction;
}

@State<DrawMapStateModel>({
    name: 'DrawMap',
    defaults: { drawState: null, mapReady: false, drawAction: null }
})
@Injectable()
export class DrawMapState {

    @Action([DrawMapReadyAction]) drawMapReadyGet(ctx: StateContext<DrawMapStateModel>, _: DrawMapReadyAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, mapReady: true });
    }

    @Action([DrawMapToolbarAction]) drawStateSet(ctx: StateContext<DrawMapStateModel>, action: DrawMapToolbarAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, drawState: action.payload });
    }

    @Action([DrawMapDrawActionAction]) drawActionSet(ctx: StateContext<DrawMapStateModel>, action: DrawMapDrawActionAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, drawAction: action.payload });
    }

    @Action(DrawMapResetAction) orderGetReset(ctx: StateContext<DrawMapStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, drawState: null, mapReady: false, drawAction: null });
    }
}
