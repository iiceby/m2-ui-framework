// tslint:disable:no-console
import { Inject, Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';
import { DebugService } from './debug.service';

import { SettingsTokens } from '../../settings-tokens.config';

@Injectable({
    providedIn: 'root'
})
export class LoggerService { // extends BaseSingletonService

    // constructor(@Inject(SettingsTokens.tokens.environment) private environment: any, private debugService: DebugService) {
    //     super('LoggerService');
    // }

    public logError(message: any): void {
        console.error(message);
    }

    public logWarning(message: any): void {
        console.warn(message);
    }

    public logDebug(message: any, logData?: any): void {
        // if (this.environment.production && !this.debugService.isDebug) {
        //     return;
        // }

        console.log(message);
        if (logData) {
            console.log(logData);
        }
    }
}
