import { Injectable } from '@angular/core';
import { ExgCultureEnum } from '../../models/common/exg-culture.model';

import { BaseSingletonService } from './base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class PlatformService extends BaseSingletonService {

    constructor() {
        super('PlatformService');
    }

    public getPlatformLanguage(): string {
        return ExgCultureEnum.English;
    }

    public isBrowserPlatform(): boolean {
        return true; // false;
    }

    public isMobilePlatform(): boolean {
        return false;
    }
}
