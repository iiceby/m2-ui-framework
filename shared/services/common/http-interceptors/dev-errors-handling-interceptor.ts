import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DebugService } from '../debug.service';

import { parseApiErrors } from '../http.service';

@Injectable()
export class DevErrorsHandlingInterceptor implements HttpInterceptor {
    constructor(private debugService: DebugService) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                tap(
                    () => null,
                    (err: HttpErrorResponse) => {
                        if (this.debugService.isDebugPopError) {
                            const apiErrors = parseApiErrors(err);
                            const msg = `[DEV DEBUG ONLY] HTTP intercepted error: ${apiErrors[0] || err.message}`;
                        }
                    }
                )
            );
    }
}
