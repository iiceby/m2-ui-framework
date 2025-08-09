import { MediaType } from './media-type.enum';

export class Media {
    public uid: string;
    public itemUid: string;
    public mediaType: MediaType;
    public mediaUrl: string;
    public mediaPreviewUrl: string;
    public mediaOrder: number;
    public createDate: number;
}
