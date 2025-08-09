import { Injectable } from '@angular/core';

import { createSelector, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { MobileErrorsState, MobileErrorsStateModel } from './mobile-errors.reducer';

@Injectable({
    providedIn: 'root'
})
export class MobileErrorsSelectors extends BaseSingletonService {

    static readonly getErrors = createSelector([MobileErrorsState], (state: MobileErrorsStateModel) => state.listErrors);

    @Select(MobileErrorsSelectors.getErrors) errors$: Observable<{ text: string, data: any }[]>;

    constructor() {
        super('MobileErrorsSelectors');
    }
}
