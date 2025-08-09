import { Injectable, OnDestroy } from '@angular/core';

import { Page } from '@nativescript/core';

import { Subject } from 'rxjs';

@Injectable()
export abstract class ExgOnDestroy implements OnDestroy {

    public unsubscribe = new Subject();

    public init(page: Page) {
        if (page) {
            page.on('navigatingFrom', () => {
                // tslint:disable-next-line:no-lifecycle-call
                this.ngOnDestroy();
            });
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
        this.afterDestroy();
    }

    protected abstract afterDestroy();
}
