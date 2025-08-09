import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule, NativeScriptHttpClientModule, NativeScriptRouterModule } from '@nativescript/angular';

import { ExgAutocompleteDialogComponent } from './components/dialogs/exg-autocomplete-dialog/exg-autocomplete-dialog.component';
import { ExgAutocompleteDialogContainer } from './components/dialogs/exg-autocomplete-dialog/exg-autocomplete-dialog.container';
import { ExgSelectDialogComponent } from './components/dialogs/exg-select-dialog/exg-select-dialog.component';
import { ExgSelectDialogContainer } from './components/dialogs/exg-select-dialog/exg-select-dialog.container';

import { HttpCancelService } from './services/common/http-cancel.service';
import { httpInterceptorProviders } from './services/common/http-interceptors';

import { SharedCommonModule } from './shared-common.module';

import { SettingsTokens } from './settings-tokens.config';

@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,

        SharedCommonModule
    ],
    declarations: [
        ExgAutocompleteDialogComponent,
        ExgAutocompleteDialogContainer,
        ExgSelectDialogContainer,
        ExgSelectDialogComponent
    ],
    exports: [
        SharedCommonModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {
    static forRoot(environment, version): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                HttpCancelService,
                httpInterceptorProviders,
                { provide: SettingsTokens.tokens.version, useValue: version },
                { provide: SettingsTokens.tokens.environment, useValue: environment },
            ]
        };
    }
}
