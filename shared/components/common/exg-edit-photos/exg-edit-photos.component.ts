import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ExgImageEditorComponent } from '../exg-image-editor/exg-image-editor.component';

import { ICropperConfig } from '../../../models/common/cropper-config.model';
import { MediaEditPhoto } from '../../../models/business/media/media-edit-photo.model';

@Component({
    selector: 'exg-edit-photos',
    templateUrl: './exg-edit-photos.component.html',
    styleUrls: ['./exg-edit-photos.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgEditPhotosComponent {

    @Input() photos: MediaEditPhoto[];
    @Input() cropperConfig: ICropperConfig;
    @Input() validate: boolean;

    @Output() readonly photoAdd = new EventEmitter<MediaEditPhoto>();
    @Output() readonly photoRemove = new EventEmitter<string>();

    @ViewChild('imageEditor', { static: true }) imageEditor: ExgImageEditorComponent;
    //@ts-ignore
    public trackByPhoto(_, item: MediaEditPhoto) {
        return item.uid;
    }

    public onImageAdd(image: { cropped: string, original: string }) {
        const mediaOrder = Math.max(0, ...this.photos.map(x => x.mediaOrder));
            //@ts-ignore
        this.photoAdd.emit(new MediaEditPhoto(null, { image: image.cropped, original: image.original }, mediaOrder + 1));
        this.imageEditor.reset();
    }

    public onImageRemove(photo: MediaEditPhoto) {
        this.photoRemove.emit(photo.uid);
    }
}
