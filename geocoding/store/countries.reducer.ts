import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { GeoService } from '../services/geo.service';

import { CountriesAction, CountriesFailAction, CountriesResetAction, CountriesSuccessAction } from './countries.actions';

import { Country } from '../models/country.model';
import { ErrorObject } from '../../../burns-ui-framework/shared/models/common/error-object.model';

export interface CountriesStateModel {
    entities: Country[];
    retrieved: boolean;
    allItemsLoaded: boolean;
    index: number;
    pending: boolean;
    error: ErrorObject;
}

@State<CountriesStateModel>({
    name: 'countries',
    defaults: { pending: false, entities: [], retrieved: false, error: null, allItemsLoaded: false, index: 0 }
})
@Injectable()
export class CountriesState {
    constructor(private geocodingService: GeoService) { }

    @Action([CountriesAction]) adventuresGet(ctx: StateContext<CountriesStateModel>, _: CountriesAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: true, error: null });

        return this.geocodingService.getCountries()
            .then(resp => setTimeout(() => ctx.dispatch(new CountriesSuccessAction(resp)), 0))
            .catch(err => setTimeout(() => ctx.dispatch(new CountriesFailAction(err)), 0));
    }

    @Action(CountriesSuccessAction) adventuresGetSuccess(ctx: StateContext<CountriesStateModel>, action: CountriesSuccessAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, entities: action.payload, retrieved: true, error: null });
    }

    @Action(CountriesFailAction) adventuresGetFail(ctx: StateContext<CountriesStateModel>, action: CountriesFailAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, error: action.payload });
    }

    @Action(CountriesResetAction) adventuresGetReset(ctx: StateContext<CountriesStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, pending: false, entities: [], retrieved: false, error: null, allItemsLoaded: false, index: 0 });
    }
}
