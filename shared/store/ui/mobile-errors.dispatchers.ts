import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { MobileErrorsAction } from './mobile-errors.actions';

@Injectable({
    providedIn: 'root'
})
export class MobileErrorsDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('MobileErrorsDispatchers');
    }

    public dispatchMobileErrorsAction(text: string, data: any) {
        this.store.dispatch(new MobileErrorsAction(text, data));
    }
}
