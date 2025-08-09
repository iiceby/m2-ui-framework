import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseSingletonService } from '../services/common/base-singleton.service';

import { RouterStateParams } from './custom-router-state-serializer';

@Injectable({
    providedIn: 'root'
})
export class AppSelectors extends BaseSingletonService {

    constructor(private store$: Store) {
        super('AppSelectors');
    }

    public getRoute(): Observable<RouterStateParams> {
        return this.store$.select(state => state.router).pipe(filter(x => !!x && !!x.state), map((res: { state: RouterStateParams }) => res.state));
    }
}
