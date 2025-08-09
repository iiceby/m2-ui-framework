import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService extends BaseSingletonService {

    constructor() {
        super('LocalStorageService');
    }

    public getItem(key: string): string {
        //@ts-ignore
        return null;
    }

    public setItem(key: string, value: string) { }

    public removeItem(key: string) {  }
}
