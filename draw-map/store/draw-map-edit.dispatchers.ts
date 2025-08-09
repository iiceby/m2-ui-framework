import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { DrawMapEditBackAcation, DrawMapEditCleanAction, DrawMapEditFeatureAction, DrawMapEditFeatureChangedAction, DrawMapEditPreviourseAcation, DrawMapEditResetAction } from './draw-map-edit.actions';

import { BaseSingletonService } from '../../shared/services/common/base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class DrawMapEditDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('DrawMapEditDispatchers');
    }

    public dispatchDrawMapEditFeatureAction(feature: any) {
        this.store.dispatch(new DrawMapEditFeatureAction(feature));
    }

    public dispatchDrawMapEditFeatureChangedAction(feature: any) {
        this.store.dispatch(new DrawMapEditFeatureChangedAction(feature));
    }

    public dispatchDrawMapEditBackAction() {
        this.store.dispatch(new DrawMapEditBackAcation());
    }

    public dispatchDrawMapEditPreviourseAction() {
        this.store.dispatch(new DrawMapEditPreviourseAcation());
    }

    public dispatchDrawMapEditResetAction() {
        this.store.dispatch(new DrawMapEditResetAction());
    }

    public dispatchDrawMapEditCleanAction() {
        this.store.dispatch(new DrawMapEditCleanAction());
    }
}
