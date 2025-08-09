import { Injectable } from '@angular/core';

import { getString, hasKey, remove, setString } from '@nativescript/core/application-settings';

import { BaseSingletonService } from './base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageTnsService extends BaseSingletonService {

    constructor() {
        super('LocalStorageService');
    }

    public getItem(key: string): string {
        return hasKey(key)
            ? getString(key)
            : null;
    }

    public setItem(key: string, value: string) {
        setString(key, value);
    }

    public removeItem(key: string) {
        remove(key);
    }
}
