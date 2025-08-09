import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class HttpCancelService {

    private pendingHTTPRequests$ = new Subject();

    // Cancel Pending HTTP calls
    public cancelPendingRequests() {
        this.pendingHTTPRequests$.next(true);
    }

    public onCancelPendingRequests() {
        return this.pendingHTTPRequests$.asObservable();
    }
}
