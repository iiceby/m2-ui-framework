import { Injectable, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { BaseSingletonService } from './base-singleton.service';;

@Injectable()
export class PusherFullService extends BaseSingletonService implements OnDestroy {

    constructor() {
        super('PusherService');
    }

    public initHubs(hubs: { hubName: string, withAuth: boolean }[]) {}

    public subscribeToHub<T>(hubData: { hub: string, method: string }): Subject<T> {
        return new Subject();
    }

    public reconnect() {
    }
}
