
import { GuidUtils } from '../../../utils/guid-utils';
import { MediaLight } from './media-light.model';

export class MediaEditPhoto {
    public uid: string;
    public image: string;
    public originalImage: string;

    public photo: MediaLight;
    public request: { image: string };

    public mediaOrder: number;

    constructor(photo: MediaLight, request: { image: string, original?: string }, mediaOrder: number) {
        this.photo = photo;
        this.request = request;
        this.uid = this.photo ? `${this.photo.uid}` : GuidUtils.newGuid;
        this.image = this.photo ? this.photo.mediaPreviewUrl : request.image;
        //@ts-ignore
        this.originalImage = request ? request.original : null;
        this.mediaOrder = mediaOrder;
    }
}
