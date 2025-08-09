import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../shared/shared.module';

import { ExgAddressAutocompleteComponent } from './components/exg-address-autocomplete/exg-address-autocomplete.component';
import { ExgCountryAutocompleteComponent } from './components/exg-country-autocomplete/exg-country-autocomplete.component';

import { CountriesState } from './store/countries.reducer';
import { GeocodingState } from './store/geocoding.reducer';


@NgModule({
    imports: [
        SharedModule,
        NgxsModule.forFeature([
            CountriesState,
            GeocodingState,
        ])
    ],
    declarations: [
        ExgAddressAutocompleteComponent,
        ExgCountryAutocompleteComponent
    ],
    exports: [
        ExgAddressAutocompleteComponent,
        ExgCountryAutocompleteComponent
    ]
})
export class GeocodingModule {
}
