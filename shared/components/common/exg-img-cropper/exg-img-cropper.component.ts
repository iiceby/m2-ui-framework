import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Injector } from '@angular/core';

import { OutputFormat } from 'ngx-image-cropper';

import { IExgDialogable } from '../exg-dialog/shared/exg-dialogable.interface';

import { DialogService } from '../../../services/common/dialog.service';
//import { ExgTranslateService } from '../../../services/common/exg-translate.service';

import { ICropperConfig } from '../../../models/common/cropper-config.model';
import { DialogResult } from '../exg-dialog/shared/dialog-result.model';
import { ExgDialogButton } from '../exg-dialog/shared/exg-dialog-button.model';
import { ExgDialogResultEvent } from '../exg-dialog/shared/exg-dialog-result-event.model';

import { ExgBaseParamsConfig } from '../../../exg-params.config';
import { ImageUtils } from '../../../utils/image-utils';

@Component({
    templateUrl: './exg-img-cropper.component.html',
    styleUrls: ['./exg-img-cropper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgImgCropperComponent implements AfterViewInit, IExgDialogable {

    public readonly canvasSize = 300;

    public imageDisplayMaxHeight = 1000;
    public width: number;
    public height: number;
    public title: string;
    public subtitle: string;
    public resizeToWidth: number;
    public resizeToHeight: number;
    public keepAspectRatio: boolean;
    public aspectRatio: number;
    public imageData: string;
    public croppedImage: string;
    public allowUpScale: boolean;
    public format: OutputFormat = 'jpeg';

    private proceedClose: (_: ExgDialogResultEvent) => void;

    constructor(private changeDetectorRef: ChangeDetectorRef, private injector: Injector, private dialogService: DialogService) {
        this.imageData = this.injector.get('imageData');
        const cropperConfig = <ICropperConfig>this.injector.get('cropperConfig');

        ImageUtils.getImageSize(this.imageData).then((size) => {
            this.title = cropperConfig.title;
            this.subtitle = cropperConfig.subtitle;
            this.resizeToWidth = cropperConfig.imageSize;
            this.resizeToHeight = cropperConfig.imageHeight;
            this.keepAspectRatio = cropperConfig.keepAspectRatio;
            this.aspectRatio = cropperConfig.aspectRatio;
            this.allowUpScale = cropperConfig.allowUpScale;
            if (!this.aspectRatio) {
                this.aspectRatio = size.width / size.height;
            }
            const maxSize = Math.max(size.width, size.height);
            const scale = maxSize / this.canvasSize;
            this.width = size.width / scale;
            this.height = size.height / scale;
            this.format = cropperConfig.format || this.format;
        });
    }

    public ngAfterViewInit() {
        this.calcMaxHeight(window?.innerHeight);
    }

    @HostListener('window:resize', ['$event'])
        //@ts-ignore
    public onResize(event) {
        this.calcMaxHeight(event.target.innerHeight);
    }

    public exgDialogClose(event: ExgDialogButton): string {
            //@ts-ignore
        return event.dialogResult === DialogResult.Ok ? this.croppedImage : null;
    }

    public registerOnDialogClose(fn: (_: ExgDialogResultEvent) => void): void {
        this.proceedClose = fn;
    }
    //@ts-ignore
    public onImageCropped(event) {
        if (this.calculateImageSize(event.base64) > ExgBaseParamsConfig.photosUpload.imagesSizeLimitBytes) {
            this.dialogService.showError('Supported image formats are JPG and PNG. Max. file size is 10 MB.');
            this.proceedClose({ dialogResult: DialogResult.Cancel, text: '' });
        } else {
            this.croppedImage = event.base64;
            this.changeDetectorRef.detectChanges();
        }
    }

    public onLoadImageFailed() {
        this.dialogService.showError('Failed to load image');
    }

    public onSaveClick() {
        this.proceedClose({ dialogResult: DialogResult.Ok, text: '', dataFromComponent: { cropped: this.croppedImage, original: this.imageData } });
    }

    public onCloseClick() {
        this.proceedClose({ dialogResult: DialogResult.Cancel, text: '' });
    }

    private calcMaxHeight(height: number) {
        this.imageDisplayMaxHeight = height - 160;
        if (this.imageDisplayMaxHeight < 100) {
            this.imageDisplayMaxHeight = 100;
        }
    }

    private calculateImageSize(imgBase64String: string): number {
        let padding = 0;
        if (imgBase64String.endsWith('==')) {
            padding = 2;
        } else if (imgBase64String.endsWith('=')) {
            padding = 1;
        }

        const base64StringLength = imgBase64String.length;
        return (base64StringLength / 4) * 3 - padding;
    }
}
