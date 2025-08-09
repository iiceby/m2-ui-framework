import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { DrawMapEditBackAcation, DrawMapEditCleanAction, DrawMapEditFeatureAction, DrawMapEditFeatureChangedAction, DrawMapEditPreviourseAcation, DrawMapEditResetAction } from './draw-map-edit.actions';
import { EditSource } from '../models/edit-source.enum';

export interface DrawMapEditStateModel {
    originalFeature: any;
    feature: any;
    changes: any[];
    returnStack: any[];
    changesSource: EditSource;
    isFeatureChanged: boolean;
}

@State<DrawMapEditStateModel>({
    name: 'DrawMapEdit',
    defaults: { originalFeature: null, feature: null, changesSource: null, changes: [], returnStack: [], isFeatureChanged: false }
})
@Injectable()
export class DrawMapEditState {

    @Action([DrawMapEditFeatureAction]) featureGet(ctx: StateContext<DrawMapEditStateModel>, action: DrawMapEditFeatureAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, originalFeature: action.payload, feature: action.payload, changes: [], changesSource: EditSource.Map, returnStack: [], isFeatureChanged: false });
    }

    @Action([DrawMapEditFeatureChangedAction]) featureChangedGet(ctx: StateContext<DrawMapEditStateModel>, action: DrawMapEditFeatureChangedAction) {
        const state = ctx.getState();
        const changes = [...state.changes];

        changes.push(state.feature);

        ctx.setState({ ...state, feature: action.payload, changes, changesSource: EditSource.Map, returnStack: [], isFeatureChanged: true });
    }

    @Action([DrawMapEditBackAcation]) DrawMapEditBackGet(ctx: StateContext<DrawMapEditStateModel>, _: DrawMapEditBackAcation) {
        const state = ctx.getState();
        if (state.changes.length < 1) {
            ctx.setState({ ...state, feature: state.originalFeature, isFeatureChanged: false });
            return;
        }

        const changes = [...state.changes];
        const returnStack = [...state.returnStack];

        const lastFeature = changes.pop();
        returnStack.push(state.feature);

        ctx.setState({ ...state, changes, returnStack, changesSource: EditSource.Toolbar, feature: lastFeature, isFeatureChanged: true });
    }

    @Action([DrawMapEditPreviourseAcation]) DrawMapEditPreviourseAcationGet(ctx: StateContext<DrawMapEditStateModel>, _: DrawMapEditPreviourseAcation) {
        const state = ctx.getState();
        if (state.returnStack.length < 1) {
            return;
        }

        const changes = [...state.changes];
        const returnStack = [...state.returnStack];

        const backFeature = returnStack.pop();
        changes.push(state.feature);

        ctx.setState({ ...state, changes, returnStack, changesSource: EditSource.Toolbar, feature: backFeature, isFeatureChanged: true });
    }

    @Action(DrawMapEditCleanAction) drawMapEditClean(ctx: StateContext<DrawMapEditStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, feature: state.originalFeature, changes: [], changesSource: EditSource.UserCancel, returnStack: [], isFeatureChanged: false });
    }

    @Action(DrawMapEditResetAction) orderGetReset(ctx: StateContext<DrawMapEditStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, originalFeature: null, feature: null, changes: [], changesSource: null, returnStack: [], isFeatureChanged: false });
    }
}
