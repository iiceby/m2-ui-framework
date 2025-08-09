import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';

import { Page } from '@nativescript/core';
import { filter } from 'rxjs/operators';

import { RoutingConfig } from '../shared/routing.config';

import { MobileErrorsSelectors } from '../../shared/store/ui/mobile-errors.selectors';

@Component({
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {

    public routes = RoutingConfig.routes;

    constructor(private page: Page, private router: RouterExtensions, private mobileErrorsSelectors: MobileErrorsSelectors) { }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.mobileErrorsSelectors.errors$.pipe(filter(x => !!x && !!x[0])).subscribe(res => {
            this.router.navigate([RoutingConfig.routes.errors.fullUrl]);
        });
    }
}
