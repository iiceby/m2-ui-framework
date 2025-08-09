import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../../burns-ui-framework/shared/services/common/base-singleton.service';

import { GeocodingAction, GeocodingResetAction } from './geocoding.actions';

@Injectable({
    providedIn: 'root'
})
export class GeocodingDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('GeocodingDispatchers');
    }

    public dispatchGeocodingAction(countryCode: string, term: string) {
        this.store.dispatch(new GeocodingAction({ countryCode, term }));
    }

    public dispatchGeocodingResetAction() {
        this.store.dispatch(new GeocodingResetAction());
    }
}
