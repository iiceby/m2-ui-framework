import { Country } from '../models/country.model';
import { ErrorObject } from '../../../burns-ui-framework/shared/models/common/error-object.model';

export class CountriesAction {
    static readonly type = '[Countries Page] GetCountries';
}

export class CountriesSuccessAction {
    static readonly type = '[Countries API] GetCountries Success';

    constructor(public payload: Country[]) { }
}

export class CountriesFailAction {
    static readonly type = '[Countries API] GetCountries Fail';

    constructor(public payload: ErrorObject) { }
}

export class CountriesResetAction {
    static readonly type = '[Countries Page] GetCountries Reset';
}
