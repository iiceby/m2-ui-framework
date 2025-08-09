import { ErrorObject } from '../../../burns-ui-framework/shared/models/common/error-object.model';
import { Geocoding } from '../models/geocoding.model';

export class GeocodingAction {
    static readonly type = '[Geocoding API] GetGeocoding';

    constructor(public payload: { countryCode: string, term: string }) { }
}

export class GeocodingSuccessAction {
    static readonly type = '[Geocoding API] GetGeocoding Success';

    constructor(public payload: Geocoding[]) { }
}

export class GeocodingFailAction {
    static readonly type = '[Geocoding API] GetGeocoding Fail';

    constructor(public payload: ErrorObject) { }
}

export class GeocodingResetAction {
    static readonly type = '[Geocoding API] GetGeocoding Reset';
}
