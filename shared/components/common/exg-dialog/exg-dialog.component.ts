import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { Subject, Subscription } from 'rxjs';

import { ExgBaseDialogComponent } from './exg-base-dialog.component';

import { ExgDialogButton } from './shared/exg-dialog-button.model';
import { ExgDialogMode } from './shared/exg-dialog-mode.model';
import { ExgDialogResultEvent } from './shared/exg-dialog-result-event.model';

@Component({
    selector: 'exg-dialog',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDialogComponent implements OnInit, OnChanges, OnDestroy {

    @Input() showDialog: boolean;
    @Input() title: string;
    @Input() message: string;
    @Input() description: string;
    @Input() width: string;
    @Input() height: string;
    @Input() disableClose: boolean;
    @Input() dialogMode: ExgDialogMode;
    @Input() allowScrollUnderDialog: boolean;
    @Input() hideBackdrop: boolean;
    @Input() dialogPosition: { top?: string; bottom?: string; left?: string; right?: string; };
    @Input() customButtons: ExgDialogButton[];
    @Input() componentData: { component: any, key?: any, inputs: any };
    @Input() mobileFullScreen: boolean;
    @Input() hideBackground: boolean;

    @Output() readonly dialogClose = new EventEmitter<ExgDialogResultEvent>();

    private dialogRef: MatDialogRef<any>;
    private dialogConfig = new MatDialogConfig();
    private onDialogClose = new Subject<ExgDialogResultEvent>();
    private subscription: Subscription;

    constructor(private matDialog: MatDialog, private overlay: Overlay) {
        this.subscription = this.onDialogClose.subscribe(data => this.dialogClose.emit(data));
    }

    public ngOnInit() {
        this.dialogConfig.disableClose = false;
        this.dialogConfig.autoFocus = false;
            //@ts-ignore
        this.dialogConfig.panelClass = [
            this.mobileFullScreen ? 'exg-fullscreen-dialog-container' : 'exg-dialog-container',
            this.hideBackground ? 'exg-dialog-hide-background' : null
        ].filter(x => !!x);
    }

    public ngOnChanges(changes: SimpleChanges) {
            //@ts-ignore
        if (changes.showDialog) {
            setTimeout(() => this.toggleDialog(), 0);
        }
    }

    public ngOnDestroy() {
        if (this.dialogRef) {
            this.dialogRef.close('...');
                //@ts-ignore
            this.dialogRef = null;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private toggleDialog() {
        if (this.showDialog) {
            if (this.dialogRef) {
                this.dialogRef.close();
            }

            this.dialogConfig.width = this.width;
            this.dialogConfig.height = this.height;
            this.dialogConfig.disableClose = this.disableClose;
            this.dialogConfig.hasBackdrop = true;
            this.dialogConfig.backdropClass = !!this.hideBackdrop ? 'temp-class-backdrop' : '';
            this.dialogConfig.position = this.dialogPosition;
                //@ts-ignore
            this.dialogConfig.scrollStrategy = this.allowScrollUnderDialog ? this.overlay.scrollStrategies.noop() : null;

            this.dialogConfig.data = {
                componentData: this.componentData,
                title: this.title,
                message: this.message,
                description: this.description,
                dialogMode: this.dialogMode,
                customButtons: this.customButtons,
                width: this.width,
                disableClose: this.disableClose,
                onDialogClose: this.onDialogClose
            };

            this.dialogRef = this.matDialog.open(<any>ExgBaseDialogComponent, this.dialogConfig);
        } else {
            if (this.dialogRef) {
                this.dialogRef.close('...');
                    //@ts-ignore
                this.dialogRef = null;
            }
        }
    }
}
