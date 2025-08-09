import { DrawError } from '../models/draw-errors.model';

export interface DrawFeature {
    createNew(data: any, options?: any);

    createDrawFeature(map: any, options?: any);

    getDataFromEditingLayer(layer: any);

    validateGeometry(editedFeatureData: any, editedLayerIndex: number, layersData: any[]): DrawError[];
}
