import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconsComponent implements OnDestroy {

    public icons$: Observable<string[]>;

    private unsubscribe = new Subject();

    constructor(private http: HttpClient) {
        this.icons$ = this.http.get('/assets/icons/icons.svg', { responseType: 'text' }).pipe(
            map((data) => {
                const result: string[] = [];
                const regex = /<svg id="(.*?)".*?<\/svg>/g;
                let matches = regex.exec(data);
                while (matches != null) {
                    if (matches[1]) {
                        result.push(matches[1]);
                    }
                    matches = regex.exec(data);
                }
                return result;
            }),
            takeUntil(this.unsubscribe));
    }

    public ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    public trackByIcon(_, item: string) {
        return item;
    }
}
