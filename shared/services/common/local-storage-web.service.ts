import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';
import { PlatformService } from './platform.service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageWebService extends BaseSingletonService {

    constructor(private platformService: PlatformService) {
        super('LocalStorageService');
    }

    public getItem(key: string): string | null {
        return this.platformService.isBrowserPlatform() ? localStorage.getItem(key) : null;
    }

    public setItem(key: string, value: string) {
        if (this.platformService.isBrowserPlatform()) {
            localStorage.setItem(key, value);
        }
    }

    public removeItem(key: string) {
        if (this.platformService.isBrowserPlatform()) {
            localStorage.removeItem(key);
        }
    }
}
