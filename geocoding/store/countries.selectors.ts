import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../burns-ui-framework/shared/services/common/base-singleton.service';

import { Country } from '../models/country.model';
import { ErrorObject } from '../../../burns-ui-framework/shared/models/common/error-object.model';

import { CountriesState, CountriesStateModel } from './countries.reducer';

@Injectable({
    providedIn: 'root'
})
export class CountriesSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([CountriesState], (state: CountriesStateModel) => state.pending);

    static readonly getCountries = createSelector([CountriesState], (state: CountriesStateModel) => state.entities);

    static readonly getRetrieved = createSelector([CountriesState], (state: CountriesStateModel) => state.retrieved);

    static readonly getError = createSelector([CountriesState], (state: CountriesStateModel) => state.error);

    static readonly getAllCountriesLoaded = createSelector([CountriesState], (state: CountriesStateModel) => state.allItemsLoaded);

    @Select(CountriesSelectors.getPending) pending$: Observable<boolean>;

    @Select(CountriesSelectors.getCountries) countries$: Observable<Country[]>;

    @Select(CountriesSelectors.getRetrieved) retrieved$: Observable<boolean>;

    @Select(CountriesSelectors.getError) error$: Observable<ErrorObject>;

    @Select(CountriesSelectors.getAllCountriesLoaded) allCountriesLoaded$: Observable<boolean>;

    constructor() {
        super('CountriesSelectors');
    }
}
