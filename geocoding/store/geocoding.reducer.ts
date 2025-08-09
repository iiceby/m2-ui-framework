import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { GeoService } from '../services/geo.service';

import { GeocodingAction, GeocodingFailAction, GeocodingResetAction, GeocodingSuccessAction } from './geocoding.actions';

import { ErrorObject } from '../../../burns-ui-framework/shared/models/common/error-object.model';
import { Geocoding } from '../models/geocoding.model';

export interface GeocodingStateModel {
    pending: boolean;
    entities: Geocoding[];
    retrieved: boolean;
    error: ErrorObject;
}

@State<GeocodingStateModel>({
    name: 'geocoding',
    defaults: { pending: false, entities: [], retrieved: false, error: null }
})
@Injectable()
export class GeocodingState {
    constructor(private geocodingService: GeoService) { }

    @Action([GeocodingAction]) async geocodingGet(ctx: StateContext<GeocodingStateModel>, action: GeocodingAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        return this.geocodingService.getAddressList(action.payload.term, action.payload.countryCode)
            .then(resp => setTimeout(() => ctx.dispatch(new GeocodingSuccessAction(resp)), 0))
            .catch(err => setTimeout(() => ctx.dispatch(new GeocodingFailAction(err)), 0));
    }

    @Action(GeocodingSuccessAction) geocodingGetSuccess(ctx: StateContext<GeocodingStateModel>, action: GeocodingSuccessAction) {
        const state = ctx.getState();

        ctx.setState({ ...state, pending: false, entities: action.payload, retrieved: true, error: null });
    }

    @Action(GeocodingFailAction) geocodingGetFail(ctx: StateContext<GeocodingStateModel>, action: GeocodingFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, error: action.payload });
    }

    @Action(GeocodingResetAction) geocodingGetReset(ctx: StateContext<GeocodingStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, entities: [], retrieved: false, error: null });
    }
}
