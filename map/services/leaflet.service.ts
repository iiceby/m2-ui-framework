import { Injectable } from '@angular/core';

import { PlatformService } from '../../shared/services/common/platform.service';

@Injectable({
    providedIn: 'root'
})
export class LeafletService {

    public L = null;

    constructor(private platformService: PlatformService) {
        if (this.platformService.isBrowserPlatform()) {
            this.L = require('leaflet');
            require('leaflet.markercluster');
        }
    }
}
