import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TokenService } from '../token.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.tokenService.getAuthToken();

        let headers = new HttpHeaders();
        if (authToken) {
            headers = headers.set('Authorization', `Bearer ${authToken}`);
        }

        headers = req.headers.has('Accept')
            ? headers.set('Accept', 'application/json')
            : headers.set('Content-Type', 'application/json');

        const newReq = req.clone({ headers });
        return next.handle(newReq);
    }
}
