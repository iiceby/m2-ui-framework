import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class ExgOnDestroy implements OnDestroy {

    public unsubscribe = new Subject<boolean>();

    /** No need in Browser or SSR; tns only */
    public init(_page: any) { /** no need */ }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    protected abstract afterDestroy();
}
