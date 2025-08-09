import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';

import { Page } from '@nativescript/core';

import { MobileErrorsSelectors } from '../shared/store/ui/mobile-errors.selectors';

@Component({
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsComponent implements OnInit {

    public errors$ = this.mobileErrorsSelectors.errors$;

    constructor(private router: RouterExtensions, private mobileErrorsSelectors: MobileErrorsSelectors, private page: Page) { }

    public ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    public goToHome() {
        this.router.navigate(['/']);
    }

    public getDataString(data: any) {
        return typeof(data) === 'string' ? data : JSON.stringify(data);
    }
}
