import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { PhoneCode } from '../../../shared/models/business/phone-code.model';

import { PhoneCodesState, PhoneCodesStateModel } from './phone-codes.reducer';

@Injectable({
    providedIn: 'root'
})
export class PhoneCodesSelectors extends BaseSingletonService {

    static readonly getPending = createSelector([PhoneCodesState], (state: PhoneCodesStateModel) => state.pending);

    static readonly getPhoneCodes = createSelector([PhoneCodesState], (state: PhoneCodesStateModel) => state.phoneCodes);

    static readonly getRetrieved = createSelector([PhoneCodesState], (state: PhoneCodesStateModel) => !!state.phoneCodes && !!state.phoneCodes[0]);

    static readonly getError = createSelector([PhoneCodesState], (state: PhoneCodesStateModel) => state.error);

    @Select(PhoneCodesSelectors.getPending) pending$: Observable<boolean>;

    @Select(PhoneCodesSelectors.getPhoneCodes) phoneCodes$: Observable<PhoneCode[]>;

    @Select(PhoneCodesSelectors.getRetrieved) retrieved$: Observable<boolean>;

    @Select(PhoneCodesSelectors.getError) error$: Observable<ErrorObject>;

    constructor() {
        super('PhoneCodesSelectors');
    }
}
