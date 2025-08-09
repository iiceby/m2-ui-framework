import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';

import { PlatformService } from './platform.service';

import { Point } from '../../models/common/point.model';

import { ExgBaseParamsConfig } from '../../exg-params.config';

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService extends BaseSingletonService {

    constructor( private platformService: PlatformService) {
        super('GeoLocationService');
    }

    public async detectUserGeoLocation(): Promise<Point> {
        const fallbackLocation = { lat: 55.75, lng: 37.62 }; // Moscow (Kremlin)

        if (this.platformService.isBrowserPlatform()) {
            return new Promise<Point>((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos: GeolocationPosition) => {
                        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    },
                    (error: GeolocationPositionError) => {
                        this.logger.logWarning(`Failed to detect user geolocation: (${error.code}) ${error.message}`);
                        resolve(fallbackLocation);
                    },
                    ExgBaseParamsConfig.geoOptions);
            });
        }
        return Promise.resolve(fallbackLocation);
    }
}
