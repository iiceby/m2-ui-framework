import { Injectable } from '@angular/core';

import { BaseSingletonService } from '../../shared/services/common/base-singleton.service';
import { PolygonDrawService } from './polygon-draw.service';

import { DrawFeature } from './draw-feature';
import { FeatureType } from '../models/feature-type.enum';

@Injectable({
    providedIn: 'root'
})
export class DrawFeatureService extends BaseSingletonService {
    strategies: Record<FeatureType, DrawFeature> = {
        [FeatureType.Polygon]: this.polygonDrawService
    };

    constructor(private polygonDrawService: PolygonDrawService) {
        super('DrawFeatureService');
    }

    public createFeature(type: FeatureType, data: any, options?: any) {
        return this.strategies[type].createNew(data, options);
    }

    public createDrawFeature(type: FeatureType, map, options?: any) {
        return this.strategies[type].createDrawFeature(map, options);
    }

    public getEditedData(type: FeatureType, layer: any) {
        return this.strategies[type].getDataFromEditingLayer(layer);
    }

    public validate(type: FeatureType, featureData: any, editedLayerIndex: number, layersData: any[]) {
        return this.strategies[type].validateGeometry(featureData, editedLayerIndex, layersData);
    }
}
