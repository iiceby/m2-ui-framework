import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { BaseSingletonService } from './base-singleton.service';


@Injectable()
export class PusherService extends BaseSingletonService {
    constructor(private logger: LoggerService) {
        super('PusherService');
    }

    public subscribeToHub<T>(hubData: { hub: string, method: string }): Subject<T> {
        console.log(`[server side] stub method call (${hubData.hub},${hubData.method}). No real hub subscription.`);
        return new Subject();
    }

    public reconnect() { return; }
}
