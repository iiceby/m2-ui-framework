import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, Injector, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject, Subscription } from 'rxjs';

import { DialogResult } from './shared/dialog-result.model';
import { ExgDialogButton } from './shared/exg-dialog-button.model';
import { ExgDialogMode } from './shared/exg-dialog-mode.model';
import { ExgDialogResultEvent } from './shared/exg-dialog-result-event.model';

const disableDialogTitle = true; // inform dialogs don't use titles in current design

@Component({
    templateUrl: './exg-base-dialog.component.html',
    styleUrls: ['./exg-base-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgBaseDialogComponent implements OnInit, OnDestroy {

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true }) dynamicComponentContainer: ViewContainerRef;

    public buttons: ExgDialogButton[];
    public title: string;
    public message: string;
    public description: string;
    public dialogMode: ExgDialogMode;
    public customButtons: ExgDialogButton[];
    public width: string;

    private componentData: { component: any, key?: any, inputs: any };
    private currentComponent: any;

    private dialogClose: Subject<ExgDialogResultEvent>;
    private backdropSubscription: Subscription;
    private keydownSubscription: Subscription;
    //@ts-ignore
    constructor(private changeDetectorRef: ChangeDetectorRef, private componentFactoryResolver: ComponentFactoryResolver, @Inject(MAT_DIALOG_DATA) private matDialogData, private matDialogRef: MatDialogRef<ExgBaseDialogComponent>) {
        this.title = disableDialogTitle ? null : matDialogData.title;
        this.message = matDialogData.message;
        this.description = matDialogData.description;
        this.dialogMode = matDialogData.dialogMode || ExgDialogMode.NoButtons;
        this.customButtons = matDialogData.customButtons || [];
        this.componentData = matDialogData.componentData;
        this.dialogClose = matDialogData.onDialogClose;
        this.width = matDialogData.width || '40rem';

        this.backdropSubscription = this.matDialogRef.backdropClick().subscribe(() => {
            if (!this.matDialogData.disableClose) {
                this.onClick({ dialogResult: DialogResult.Cancel, text: DialogResult[DialogResult.Cancel] });
            }
        });

        this.keydownSubscription = this.matDialogRef.keydownEvents().subscribe((evt) => {
            if (evt.key === 'Escape') {
                if (!this.matDialogData.disableClose) {
                    this.onClick({ dialogResult: DialogResult.Cancel, text: DialogResult[DialogResult.Cancel] });
                }
            }
        });
    }

    public getTranslationButtonText(title: any) {
        const buttonsText: any = {
            Ok: "Ok",
            Cancel: "Отмена",
            Yes: "Да",
            No: "Нет",
            Close: "Закрыть",
            Save : "Сохранить",
            Delete: "Удалить",
            Confirm : "Подтвердить",
            Other : "Другое"
    }

        return buttonsText[title] ?? '';
    }

    public ngOnInit() {
        this.renderComponent(this.componentData);

        switch (this.dialogMode) {
            case ExgDialogMode.Ok:
                this.buttons = [{ dialogResult: DialogResult.Ok, text: this.getTranslationButtonText(DialogResult[DialogResult.Ok]), color: 'primary', styleType: 'common' }];
                break;
            case ExgDialogMode.OkCancel:
                this.buttons = [
                    { dialogResult: DialogResult.Ok, text: this.getTranslationButtonText(DialogResult[DialogResult.Ok]), color: 'primary', styleType: 'common' },
                    { dialogResult: DialogResult.Cancel, text: this.getTranslationButtonText(DialogResult[DialogResult.Cancel]), color: 'primary', styleType: 'outlined' }
                ];
                break;
            case ExgDialogMode.SaveCancel:
                this.buttons = [
                    { dialogResult: DialogResult.Save, text: this.getTranslationButtonText(DialogResult[DialogResult.Save]), color: 'primary', styleType: 'common' },
                    { dialogResult: DialogResult.Cancel, text: this.getTranslationButtonText(DialogResult[DialogResult.Cancel]), color: 'primary', styleType: 'outlined' }
                ];
                break;
            case ExgDialogMode.YesNo:
                this.buttons = [
                    { dialogResult: DialogResult.Yes, text: this.getTranslationButtonText(DialogResult[DialogResult.Yes]), color: 'primary', styleType: 'common' },
                    { dialogResult: DialogResult.No, text: this.getTranslationButtonText(DialogResult[DialogResult.No]), color: 'primary', styleType: 'outlined' }
                ];
                break;
            case ExgDialogMode.YesNoCancel:
                this.buttons = [
                    { dialogResult: DialogResult.Yes, text: this.getTranslationButtonText(DialogResult[DialogResult.Yes]), color: 'primary', styleType: 'common' },
                    { dialogResult: DialogResult.No, text: this.getTranslationButtonText(DialogResult[DialogResult.No]), color: 'primary', styleType: 'outlined' },
                    { dialogResult: DialogResult.Cancel, text: this.getTranslationButtonText(DialogResult[DialogResult.Cancel]), color: 'primary', styleType: 'outlined' }
                ];
                break;
            case ExgDialogMode.DeleteCancel:
                this.buttons = [
                    { dialogResult: DialogResult.Cancel, text: this.getTranslationButtonText(DialogResult[DialogResult.Cancel]), color: 'primary', styleType: 'outlined' },
                    { dialogResult: DialogResult.Delete, text: this.getTranslationButtonText(DialogResult[DialogResult.Delete]), color: 'warn', styleType: 'common' }
                ];
                break;
            case ExgDialogMode.ConfirmCancel:
                this.buttons = [
                    { dialogResult: DialogResult.Cancel, text:  this.getTranslationButtonText(DialogResult[DialogResult.Cancel]), color: 'primary', styleType: 'outlined' },
                    { dialogResult: DialogResult.Confirm, text:  this.getTranslationButtonText(DialogResult[DialogResult.Confirm]), color: 'primary', styleType: 'common' }
                ];
                break;
            case ExgDialogMode.Custom:
                this.buttons = [...this.customButtons];
                break;
            default:
                break;
        }
        this.changeDetectorRef.detectChanges();
    }

    public ngOnDestroy() {
        this.backdropSubscription.unsubscribe();
        this.keydownSubscription.unsubscribe();
    }

    public onClick(event?: ExgDialogButton): void {
        if (!event) {
            event = { dialogResult: DialogResult.Close, text: DialogResult[DialogResult.Close] };
        }

        let dataFromComponent = null;
        if (this.currentComponent && this.currentComponent.instance.exgDialogClose) {
            dataFromComponent = this.currentComponent.instance.exgDialogClose(event);
        }

        if (dataFromComponent instanceof Promise) {
                //@ts-ignore
            dataFromComponent.then(data => this.dialogClose.next({ dialogResult: event.dialogResult, text: event.text, dataFromComponent: data }));
        } else {
                //@ts-ignore
            this.dialogClose.next({ dialogResult: event.dialogResult, text: event.text, dataFromComponent });
        }
    }
    //@ts-ignore
    public trackByButton(index: number, _) {
        return index;
    }

    private renderComponent(data: { component: any, inputs: any }) {
        if (!data) {
            return;
        }

        const inputProviders = Object.keys(data.inputs).map(inputName => ({ provide: inputName, useValue: data.inputs[inputName] }));

        const injector = Injector.create({ providers: inputProviders });
        const factory = this.componentFactoryResolver.resolveComponentFactory(data.component);

        const component = factory.create(injector);
        this.dynamicComponentContainer.insert(component.hostView);

        if (this.currentComponent) {
            this.currentComponent.destroy();
        }
        this.currentComponent = component;

        if (this.currentComponent.instance.registerOnDialogClose) {
            const self = this;
            this.currentComponent.instance.registerOnDialogClose((event: ExgDialogResultEvent) => {
                self.dialogClose.next({ dialogResult: event.dialogResult, text: event.text, dataFromComponent: event.dataFromComponent });
            });
        }
    }
}
