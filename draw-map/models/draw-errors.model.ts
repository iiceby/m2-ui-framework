import { DrawErrorType } from './draw-error-type.enum';

export class DrawError {
    public error: DrawErrorType;
    public layerIndex: number;
    public affectedLayerIndex: number;
}
