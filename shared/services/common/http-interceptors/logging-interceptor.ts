import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { LoggerService } from '../logger.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    constructor(private logger: LoggerService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const startTime = Date.now();
        let status: string;
        return next.handle(req)
            .pipe(
                tap(
                    event => status = event instanceof HttpResponse ? 'succeed' : '',
                    (err: HttpErrorResponse) => {
                        status = 'failed';
                        console.log(`An error occurred during processing [${req.method}] (${req.urlWithParams}): ${err.message}}`, err);
                    }
                ),
                finalize(() => {
                    const elapsed = Date.now() - startTime;
                    const msg = `${req.method} "${req.urlWithParams}" ${status} in ${elapsed} ms.`;
                    console.log(msg);
                    // if (req.body) {
                    //     console.log(req.body);
                    // }
                })
            );
    }
}
