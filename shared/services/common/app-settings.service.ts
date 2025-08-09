import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService extends BaseSingletonService {

    constructor() {
        super('AppSettingsService');
    }

    
}
