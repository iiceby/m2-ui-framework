import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../burns-ui-framework/shared/services/common/base-singleton.service';

import { ErrorObject } from '../../../burns-ui-framework/shared/models/common/error-object.model';
import { Geocoding } from '../models/geocoding.model';

import { GeocodingState, GeocodingStateModel } from './geocoding.reducer';

@Injectable({
    providedIn: 'root'
})
export class GeocodingSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([GeocodingState], (state: GeocodingStateModel) => state.pending);

    static readonly getPlaces = createSelector([GeocodingState], (state: GeocodingStateModel) => state.entities);

    static readonly getRetrieved = createSelector([GeocodingState], (state: GeocodingStateModel) => state.retrieved);

    static readonly getError = createSelector([GeocodingState], (state: GeocodingStateModel) => state.error);

    @Select(GeocodingSelectors.getPending) pending$: Observable<boolean>;

    @Select(GeocodingSelectors.getPlaces) places$: Observable<Geocoding[]>;

    @Select(GeocodingSelectors.getRetrieved) retrieved$: Observable<boolean>;

    @Select(GeocodingSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('GeocodingSelectors');
    }
}
