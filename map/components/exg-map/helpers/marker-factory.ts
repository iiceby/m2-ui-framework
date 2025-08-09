import { Injectable } from '@angular/core';

import { LeafletService } from '../../../services/leaflet.service';

import { IMarker } from '../../../model/imarker.model';
import { ITrack } from '../../../model/itrack.model';

@Injectable({
    providedIn: 'root'
})
export class MarkerFactory {

    constructor(private leafletService: LeafletService) { }

    public createMarker(data: IMarker, type: 'simple' | 'icon'): any {
        let markerOpts: any;
        switch (type) {
            case 'icon':
                markerOpts = this.createVehicleMarkerOptions(<IMarker & { sequenceNumber: number }>data);
                break;
            case 'simple':
            default:
                markerOpts = this.createSimpleMarkerOptions(data);
                break;
        }
        return new this.leafletService.L.Marker(new this.leafletService.L.LatLng(data.lat, data.lng), markerOpts);
    }

    public createLine(track: ITrack): any {
        return new this.leafletService.L.Polyline(track.coordinates.map(ccord => new this.leafletService.L.LatLng(ccord.lat, ccord.lng)), { color: track.color, weight: track.width });
    }

    private createSimpleMarkerOptions(data: IMarker): any {
        const icon = this.leafletService.L.divIcon({
            html: `<div class="exg-map-marker">&nbsp;</div>`,
            className: ''
        });
        return { icon, title: data.title, interactive: true };
    }

    private createVehicleMarkerOptions(data: IMarker & { sequenceNumber: number }): any {
        const icon = this.leafletService.L.divIcon({
            html: `<div class="exg-map-marker ${data.icon}-exg-map-marker">&nbsp;</div>`
        });
        return { icon, title: data.title, interactive: true };
    }
}
