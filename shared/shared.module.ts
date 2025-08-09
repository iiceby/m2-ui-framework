import { ModuleWithProviders, NgModule } from '@angular/core';

import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from '@eklipse/perfect-scrollbar';

import { SharedCommonModule } from './shared-common.module';
import { ISharedSettingsConfig } from './shared-settings.config';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SettingsTokens } from './settings-tokens.config';
import { HttpCancelService } from './services/common/http-cancel.service';
import { httpInterceptorProviders } from './services/common/http-interceptors';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        SharedCommonModule
    ],
    exports: [
        SharedCommonModule,
    ],
})
export class SharedBurnsUIModule {
    static forRoot(settings: ISharedSettingsConfig): ModuleWithProviders<SharedBurnsUIModule> {
        return {
            ngModule: SharedBurnsUIModule,
             providers: [
                HttpCancelService,
                httpInterceptorProviders,
                { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
                 { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
                 { provide: SettingsTokens.tokens.version, useValue: settings.version },
                 { provide: SettingsTokens.tokens.environment, useValue: settings.environment },
             ]
        };
    }
}
