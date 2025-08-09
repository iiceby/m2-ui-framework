import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage.service';

import { ExgBaseParamsConfig } from '../../../exg-params.config';
import { SettingsTokens } from '../../../settings-tokens.config';

@Injectable()
export class DevDelayInterceptor implements HttpInterceptor {

    private debugDelay = +this.localStorage.getItem(ExgBaseParamsConfig.storageKeys.storageDebugHttpDelay) || 0;

    constructor(@Inject(SettingsTokens.tokens.environment) private environment: any, private localStorage: LocalStorageService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const apiUrl = req.url.startsWith(this.environment.apiUrl);

        if (apiUrl && this.debugDelay) {
            return next.handle(req).pipe(delay(this.debugDelay));
        }
        return next.handle(req);
    }
}
