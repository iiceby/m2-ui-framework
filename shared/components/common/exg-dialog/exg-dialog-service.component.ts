import { ChangeDetectionStrategy, Component, Injector, OnDestroy } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { DialogResult } from './shared/dialog-result.model';
import { ExgDialogButton } from './shared/exg-dialog-button.model';
import { ExgDialogMode } from './shared/exg-dialog-mode.model';

@Component({
    template: `<exg-dialog [customButtons]="customButtons" [description]="description" [dialogMode]="mode" [disableClose]="true" [height]="height" [message]="message" [showDialog]="showDialog" [title]="title" [width]="width" (dialogClose)="onClose($event)"></exg-dialog>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDialogServiceComponent implements OnDestroy {

    public showDialog = true;
    public mode: ExgDialogMode;
    public message: string;
    public title: string;
    public description: string;
    public width: string;
    public height: string;
    public customButtons: ExgDialogButton[];

    public dialogResult = new ReplaySubject<DialogResult>(1);

    private proceedClose: (_: DialogResult) => { };

    constructor(private injector: Injector) {
        this.title = this.injector.get('title');
        this.message = this.injector.get('message');
        this.description = this.injector.get('description');
        this.width = this.injector.get('width');
        this.height = this.injector.get('height');
        this.customButtons = this.injector.get('customButtons') || [];
        this.mode = this.customButtons[0] ? ExgDialogMode.Custom : this.injector.get('confirm') ? ExgDialogMode.ConfirmCancel : this.injector.get('confirmDelete') ? ExgDialogMode.DeleteCancel : ExgDialogMode.Ok;

        for (let i = 0; i < this.customButtons.length; i++) {
            if (!this.customButtons[i].dialogResult) {
                this.customButtons[i].dialogResult = i === 0 ? DialogResult.Ok : i === 1 ? DialogResult.Cancel : DialogResult.Other;
            }
        }
    }

    public ngOnDestroy() {
        this.dialogResult.unsubscribe();
    }
    //@ts-ignore
    public onClose(event) {
        this.showDialog = false;
        setTimeout(() => {
            if (this.proceedClose) {
                this.proceedClose(event.dialogResult);
            }
            this.dialogResult.next(event.dialogResult);
        }, 0);
    }
    //@ts-ignore
    public registerOnClose(fn) {
        if (fn) {
            this.proceedClose = fn;
        }
    }
}
