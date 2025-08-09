import { Injectable } from '@angular/core';
import { device } from '@nativescript/core/platform';

import { BaseSingletonService } from './base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class PlatformTnsService extends BaseSingletonService {

    constructor() {
        super('PlatformService');
    }

    public getPlatformLanguage() {
        return device.language;
    }

    public isBrowserPlatform(): boolean {
        return false;
    }

    public isMobilePlatform(): boolean {
        return true;
    }
}
