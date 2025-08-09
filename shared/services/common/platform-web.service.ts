import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { BaseSingletonService } from './base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class PlatformWebService extends BaseSingletonService {

    constructor(@Inject(PLATFORM_ID) private platformId: object, @Optional() @Inject(REQUEST) private request: any) {
        super('PlatformService');
    }

    public getPlatformLanguage(): string {
        if (isPlatformBrowser(this.platformId)) {
            return navigator.language || '';
        }
        const headersLanguage: string = this.request.headers['accept-language'] || '';
        const splits = headersLanguage.split(',');
        return splits[0];
    }

    public isBrowserPlatform(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    public isMobilePlatform(): boolean {
        return false;
    }
}
