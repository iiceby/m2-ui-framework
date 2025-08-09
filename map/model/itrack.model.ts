import { Point } from './point.model';

export interface ITrack {
    uid: string;
    coordinates: Point[];
    color?: string;
    width?: number;
}
