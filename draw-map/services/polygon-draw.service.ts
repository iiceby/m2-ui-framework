import { Injectable } from '@angular/core';

import { BaseSingletonService } from '../../shared/services/common/base-singleton.service';
import { LeafletService } from '../../map/services/leaflet.service';

import { DrawErrorType } from '../models/draw-error-type.enum';
import { DrawError } from '../models/draw-errors.model';
import { DrawFeature } from './draw-feature';

import { PolygonOverlapsUtils } from '../utils/polygon-overlaps-utils';

@Injectable({
    providedIn: 'root'
})
export class PolygonDrawService extends BaseSingletonService implements DrawFeature {

    constructor(private leafletService: LeafletService) {
        super('PolygonDrawService');
    }

    public createNew(data: any, options?: any) {
        const points = data.points.map(point => {
            return new this.leafletService.L.LatLng(point.lat, point.lng, point.alt);
        });

        return new this.leafletService.L.Polygon(points, options);
    }

    public createDrawFeature(map: any, options?: any) {
        return new this.leafletService.L.Draw.Polygon(map, options);
    }

    public getDataFromEditingLayer(layer: any) {
        return layer.editing.latlngs[0][0].map(x => ([x.lat, x.lng]));
    }

    public validateGeometry(editedFeatureData: any, editedLayerIndex: number, layersData: any[]): DrawError[] {
        const overlapsError: DrawError[] = [];

        for (let index = 0; index < layersData.length; index++) {
            if (PolygonOverlapsUtils.overlaps(editedFeatureData, layersData[index])) {
                overlapsError.push({ error: DrawErrorType.PolygonsOverlaps, layerIndex: editedLayerIndex, affectedLayerIndex: index });
            }
        }

        return overlapsError;
    }
}
