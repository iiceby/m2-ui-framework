import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';
import { LocalStorageService } from './local-storage.service';

import { ExgBaseParamsConfig } from '../../exg-params.config';

@Injectable({
    providedIn: 'root'
})
export class DebugService extends BaseSingletonService {

    private isDebugSet = this.localStorage.getItem(ExgBaseParamsConfig.storageKeys.storageIsDebug);
    private isDebugPopErrorSet = this.localStorage.getItem(ExgBaseParamsConfig.storageKeys.storageDebugPopError);

    constructor(private localStorage: LocalStorageService) {
        super('DebugService');
    }

    public get isDebug(): boolean {
        return !!this.isDebugSet;
    }

    public get isDebugPopError(): 'dialog' | 'snackbar' | null {
        if (!this.isDebugPopErrorSet) {
            return null;
        }
        if (this.isDebugPopErrorSet === 'dialog') {
            return 'dialog';
        }
        return 'snackbar';
    }
}
