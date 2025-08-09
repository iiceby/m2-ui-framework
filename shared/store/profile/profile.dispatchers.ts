import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { BaseSingletonService } from '../../services/common/base-singleton.service';

import { ProfileFrom404PageAction, ProfileFromAuthGuardAction, ProfileFromHeaderComponentAction, UserNameUpdateAction } from './profile.actions';

@Injectable({
    providedIn: 'root'
})
export class ProfileDispatchers extends BaseSingletonService {

    constructor(private store: Store) {
        super('ProfileDispatchers');
    }

    public dispatchProfileAction(userUid: string, source: 'authGuard' | 'headerComponent' | '404Page') {
        switch (source) {
            case 'authGuard':
                this.store.dispatch(new ProfileFromAuthGuardAction({ userUid }));
                break;
            case 'headerComponent':
                this.store.dispatch(new ProfileFromHeaderComponentAction({ userUid }));
                break;
            case '404Page':
                this.store.dispatch(new ProfileFrom404PageAction({ userUid }));
                break;
        }
    }

    public dispatchUserNameUpdateAction(firstName: string, lastName: string) {
        this.store.dispatch(new UserNameUpdateAction({ firstName, lastName }));
    }
}
