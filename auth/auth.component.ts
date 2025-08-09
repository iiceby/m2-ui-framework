import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { RoutingConfig } from '../shared/routing.config';

import { SettingsTokens } from '../shared/settings-tokens.config';
import { IAuthSettings } from '../shared/shared-settings.config';

@Component({
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {

    public routes = RoutingConfig.routes;

    public settings: IAuthSettings = this.injector.get(SettingsTokens.tokens.authSettings);

    constructor(private injector: Injector) { /** */ }
}
