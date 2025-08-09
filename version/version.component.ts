import { ChangeDetectionStrategy, Component, Inject, isDevMode } from '@angular/core';

import { DebugService } from '../shared/services/common/debug.service';

import { LanguageService } from '../shared/services/common/language-service.service';

import { RoutingConfig } from '../shared/routing.config';
import { SettingsTokens } from '../shared/settings-tokens.config';

@Component({
    templateUrl: './version.component.html',
    styleUrls: ['./version.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionComponent {
    public routes = RoutingConfig.routes;

    public version = this.appVersion.version;
    public envName = this.environment.envName;
    public apiUrl = this.environment.apiUrl;
    public production = this.environment.production;
    public hmr = this.environment.hmr;
    public angularDevMode = isDevMode();
    public lastUpdateDate = this.appVersion.lastUpdateDate;

    public isDebug = this.debugService.isDebug;
    public isDebugPopError = this.debugService.isDebugPopError;
    public appLanguage = this.languageService.retrieveLanguage();

    constructor(@Inject(SettingsTokens.tokens.version) private appVersion: any,
                @Inject(SettingsTokens.tokens.environment) private environment: any,
                private debugService: DebugService,
                private languageService: LanguageService) {
    }
}
