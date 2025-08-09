import { GuidUtils } from '../../../../burns-ui-framework/shared/utils/guid-utils';

export class UserEditPhoto {
    public image: string;
    public allowRemove: boolean;

    public uid: string;
    public photo: string;
    public request: { image: string };

    constructor(photo: string, request: { image: string }) {
        this.photo = photo;
        this.request = request;
        this.image = this.photo || request.image;
        this.allowRemove = !this.photo;
        this.uid = GuidUtils.newGuid;
    }
}
