import { Injectable } from '@angular/core';
import { Event, Router, RoutesRecognized } from '@angular/router';

import { filter, pairwise } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RouterExtService {
    private previousUrl: string;
    private currentUrl: string;

    private _store: { url: string, query: any }[] = [];
    private storeSize = 5;
    private backStoreState = false;

    constructor(private router: Router) {
        this.currentUrl = this.router.url;

        this.router.events.pipe(
            filter((evt: Event) => evt instanceof RoutesRecognized),
            pairwise<RoutesRecognized>())
            .subscribe((events: RoutesRecognized[]) => {
                this.push(events[0].urlAfterRedirects);
                this.previousUrl = this.trimRoute(events[0].urlAfterRedirects);
                this.currentUrl = this.trimRoute(events[1].urlAfterRedirects);
            });
    }

    public init() {
        // used to trigger service on app initialization
    }

    public getPreviousUrl() {
        return this.previousUrl;
    }

    public getCurrentUrl() {
        return this.currentUrl;
    }

    public pop(): { url: string, query: any } {
        if (this._store.length > 0) {
            this.backStoreState = true;
        }

        return this._store.length > 0 ? this._store.pop() : null;
    }

    private trimRoute(route: string) {
        const trimmed = route.split('?');
        return trimmed[0];
    }

    private push(route: string) {
        if (this.backStoreState) {
            this.backStoreState = false;
            return;
        }

        const trimmed = route.split('?');
        const query = {};

        if (trimmed.length > 1) {
            trimmed[1].split('&').filter(param => param.split('=').length > 1).forEach(param => query[param.split('=')[0]] = param.split('=')[1]);
        }

        if (this._store.length > this.storeSize) {
            this._store.shift();
        }

        this._store.push({ url: trimmed[0], query });
    }
}
