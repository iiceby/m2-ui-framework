import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DialogService } from '../../../services/common/dialog.service';

import { ICropperConfig } from '../../../models/common/cropper-config.model';
import { DialogResult } from '../exg-dialog/shared/dialog-result.model';
import { ExgDialogMode } from '../exg-dialog/shared/exg-dialog-mode.model';
import { ExgDialogResultEvent } from '../exg-dialog/shared/exg-dialog-result-event.model';
import { ExgImgCropperComponent } from '../exg-img-cropper/exg-img-cropper.component';

import { ImageUtils } from '../../../utils/image-utils';

@Component({
    selector: 'exg-image-editor',
    templateUrl: './exg-image-editor.component.html',
    styleUrls: ['./exg-image-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgImageEditorComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgImageEditorComponent implements ControlValueAccessor {
    @Input() image: string;
    @Input() cropperConfig: ICropperConfig;
    @Input() placeholder: string;
    @Input() iconName = 'add_photo';
    @Input() iconWidth = '2.2rem';
    @Input() iconHeight = '2.2rem';
    @Input() showError: boolean;
    @HostBinding('class.allow_remove') @Input() allowRemove = true;
    @HostBinding('style.width') @Input() width: string;
    @HostBinding('style.height') @Input() height: string;
    @HostBinding('class.round') @Input() isRound: boolean;

    @Output() readonly imageChange = new EventEmitter<{ cropped: string, original: string }>();
    @Output() readonly imageRemove = new EventEmitter();

    @ViewChild('fileInput', { static: true }) fileInput: ElementRef<HTMLInputElement>;

    public dialogMode = ExgDialogMode;
    public componentData: { component: any, inputs: any };
    public showDialog: boolean;
    //@ts-ignore
    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef, private dialogService: DialogService) { }

    public writeValue(value: string) {
        this.image = value;
        this.changeDetectorRef.markForCheck();
    }
    //@ts-ignore
    public registerOnChange(fn) {
        this.propagateChange = fn;
    }
    //@ts-ignore
    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }

    public reset() {
            //@ts-ignore
        this.image = null;
    }

    public onImageRemove() {
            //@ts-ignore
        this.image = null;
        this.imageRemove.emit();
        if (this.propagateTouch) {
            this.propagateTouch();
        }
        if (this.propagateChange) {
            this.propagateChange(null);
        }
    }
    //@ts-ignore
    public async onImageChange(event) {
        try {
            const imageData = await ImageUtils.readImageFromFileAsDataUrl(event.target.files[0]);
            this.componentData = { component: ExgImgCropperComponent, inputs: { imageData, cropperConfig: this.cropperConfig } };
            this.showDialog = true;
        } catch (err) {
                //@ts-ignore
            this.dialogService.showError(err);
        }
        this.changeDetectorRef.markForCheck();
    }

    public onDialogClose(event: ExgDialogResultEvent) {
        this.showDialog = false;
        if (this.propagateTouch) {
            this.propagateTouch();
        }
        if (event.dialogResult === DialogResult.Ok) {
            if (this.propagateChange) {
                this.propagateChange(event.dataFromComponent.cropped);
            }
            this.image = event.dataFromComponent.cropped;
            this.imageChange.emit(event.dataFromComponent);
        }
    }
}
