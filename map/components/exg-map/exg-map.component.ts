import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { LeafletService } from '../../services/leaflet.service';
import { PlatformService } from '../../../../burns-ui-framework/shared/services/common/platform.service';

import { IMarker } from '../../model/imarker.model';
import { ITrack } from '../../model/itrack.model';
import { Point } from '../../model/point.model';

import { MarkerFactory } from './helpers/marker-factory';

@Component({
    selector: 'exg-map',
    templateUrl: './exg-map.component.html',
    styleUrls: ['./exg-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgMapComponent implements OnChanges {
    @Input() tracks: ITrack[];
    @Input() markers: IMarker[];
    @Input() defaultCenter: Point = null;
    @Input() fitMapBoundsAlways: boolean;
    @Input() scrollWheelZoom: boolean = null;

    @Output() readonly markerClick = new EventEmitter<IMarker>();
    @Output() readonly clickMap = new EventEmitter<{ lng: number, lat: number }>();

    public markersLayer: any;
    public tracksLayer: any;
    public isBrowser = this.platformService.isBrowserPlatform();

    public options: any = {};

    private map: any;
    private mapAlreadyFit: boolean;
    private mapInitalized: boolean;

    constructor(private leafletService: LeafletService, private markerFactory: MarkerFactory, private platformService: PlatformService) {
        this.initMap();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.markers && this.markers && this.isBrowser) {
            this.markersLayer.clearLayers();
            for (const m of this.markers) {
                this.markersLayer.addLayer(this.createMarker(m));
            }
            this.fitMapToBounds();
        }

        if (changes.tracks && this.tracks && this.isBrowser) {
            this.tracksLayer.clearLayers();
            for (const m of this.tracks) {
                this.tracksLayer.addLayer(this.markerFactory.createLine(m));
            }
            this.fitMapToBounds();
        }

        if (changes.defaultCenter && this.defaultCenter && this.map && !this.mapAlreadyFit && this.isBrowser) {
            this.map.panTo(this.defaultCenter);
        }
    }

    public onMapReady(map: any) {
        this.map = map;
        this.map.on('click', (e) => this.clickMap.emit(e.latlng));
        this.initMap();
        this.leafletService.L.control.zoom({ position: 'bottomright' }).addTo(map);
        if (this.scrollWheelZoom) {
            this.map.scrollWheelZoom.enable();
        } else {
            this.map.scrollWheelZoom.disable();
        }
        this.fitMapToBounds();
    }

    public panTo(point: Point) {
        if (point) {
            if (!this.map.getBounds().contains(point))
                this.map.panTo(point);
        }
    }

    private createMarker(data: IMarker) {
        const marker = this.markerFactory.createMarker(data, 'icon');
        marker.on('click', () => this.markerClick.emit(data));
        return marker;
    }

    private fitMapToBounds() {
        if ((!this.mapAlreadyFit || this.fitMapBoundsAlways) && this.map && (this.tracks && this.tracks[0] || this.markers && this.markers[0])) {
            const tracksCoordinates = this.tracks ? [].concat(...this.tracks.map(track => track.coordinates)) : [];
            const markersCoordinate = this.markers || [];
            const coordinates = [...markersCoordinate, ...tracksCoordinates];
            const bounds = this.leafletService.L.latLngBounds(coordinates);
            if (this.mapAlreadyFit) {
                this.map.fitBounds(bounds, { padding: [5, 5], duration: 1.5, maxZoom: this.map.getZoom() });
            } else {
                this.map.flyToBounds(bounds, { padding: [5, 5], duration: 1.5 });
            }
            this.mapAlreadyFit = true;
        }
    }

    private initMap() {
        if (this.isBrowser && !this.mapInitalized) {
            this.mapInitalized = true;
            this.markersLayer = this.leafletService.L.markerClusterGroup(this.getMarkerLayerOptions());
            this.tracksLayer = this.leafletService.L.featureGroup();
            this.options = {
                layers: [
                    this.leafletService.L.tileLayer('//{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] })
                ],
                zoom: 13,
                minZoom: 3,
                maxZoom: 18,
                attributionControl: false,
                zoomControl: false,
                center: this.defaultCenter ? [this.defaultCenter.lat, this.defaultCenter.lng] : [55.75, 37.62],
                scrollWheelZoom: this.scrollWheelZoom
            };
        }
    }

    private getMarkerLayerOptions(): any {
        const self = this;
        return {
            showCoverageOnHover: false,
            maxClusterRadius: 50,
            spiderLegPolylineOptions: { weight: 1, color: '#f68724', opacity: 0.5 },
            iconCreateFunction(cluster) {
                return self.leafletService.L.divIcon({
                    html: `<div style="background-color: #fff; min-width: 100%; min-height: 100%; border: 3px solid #181818; border-radius: 30px; justify-content: center; align-items: center; display: flex; font-size: 20px; font-weight: 500;">+${cluster.getChildCount()}</div>`,
                    className: 'markerGroup',
                    iconSize: [60, 60],
                    iconAnchor: [30, 30]
                });
            }
        };
    }
}
