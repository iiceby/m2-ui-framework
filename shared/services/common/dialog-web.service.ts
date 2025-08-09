import { ComponentFactoryResolver, ComponentRef, Injectable, Injector, ViewContainerRef } from '@angular/core';

import { ExgDialogServiceComponent } from '../../components/common/exg-dialog/exg-dialog-service.component';

import { BaseSingletonService } from './base-singleton.service';


import { DialogResult } from '../../components/common/exg-dialog/shared/dialog-result.model';
import { DialogServiceConfirmParams, DialogServiceParams } from '../../components/common/exg-dialog/shared/dialog-service-params.model';
import { ExgDialogButton } from '../../components/common/exg-dialog/shared/exg-dialog-button.model';

@Injectable({
    providedIn: 'root'
})
export class DialogWebService extends BaseSingletonService {

    private componentContainer: ViewContainerRef;
    private currentComponent: ComponentRef<ExgDialogServiceComponent>;
    private componentsQueue: ComponentRef<ExgDialogServiceComponent>[] = [];

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        super('DialogService');
    }

    public init(componentContainer: ViewContainerRef) {
        if (this.componentContainer) {
            console.error('DialogService has been already initialized!');
            return;
        }
        this.componentContainer = componentContainer;
    }

    public async showInfo(message?: string | DialogServiceParams): Promise<DialogResult> {
        const params = this.getDialogParams(message, 'info');
        return this.loadComponent(params.title === undefined ? 'Information' : params.title, params.message, params.description, params.width, params.height, params.customButton);
    }

    public async showWarning(message?: string | DialogServiceParams): Promise<DialogResult> {
        const params = this.getDialogParams(message, 'warning');
        return this.loadComponent(params.title === undefined ? 'Warning' : params.title, params.message, params.description, params.width, params.height, params.customButton);
    }

    public async showError(message?: string | DialogServiceParams): Promise<DialogResult> {
        const params = this.getDialogParams(message, 'error');
        return this.loadComponent(params.title === undefined ? 'Error' : params.title, params.message, params.description, params.width, params.height, params.customButton);
    }

    public async showConfirm(message?: string | DialogServiceConfirmParams): Promise<DialogResult> {
        const params = <DialogServiceConfirmParams>this.getDialogParams(message, 'confirm');
        return this.loadComponent(params.title === undefined ? 'The confirmation' : params.title, params.message, params.description, params.width, params.height, <ExgDialogButton>null, true, false, params.customButtons);
    }

    public async showConfirmDelete(message?: string | DialogServiceConfirmParams): Promise<DialogResult> {
        const params = <DialogServiceConfirmParams>this.getDialogParams(message, 'confirmDelete');
        return this.loadComponent(params.title === undefined ? 'Confirm delete' : params.title, params.message, params.description, params.width, params.height, <ExgDialogButton>null, false, true, params.customButtons);
    }

    private async loadComponent(title: string, message: string, description: string, width: string, height: string, customButton: ExgDialogButton = null, isConfirm = false, isConfirmDelete = false, customButtons: ExgDialogButton[] = null): Promise<DialogResult> {
        const inputs: { provide: string, useValue: any }[] = [];
        inputs.push({ provide: 'title', useValue: title });
        inputs.push({ provide: 'message', useValue: message });
        inputs.push({ provide: 'description', useValue: description });
        inputs.push({ provide: 'width', useValue: width });
        inputs.push({ provide: 'height', useValue: height });
        inputs.push({ provide: 'confirm', useValue: isConfirm });
        inputs.push({ provide: 'confirmDelete', useValue: isConfirmDelete });
        inputs.push({ provide: 'customButtons', useValue: isConfirm ? customButtons : customButton ? [customButton] : [] });

        const injector = Injector.create({ providers: inputs, parent: this.componentContainer.parentInjector });

        const factory = this.componentFactoryResolver.resolveComponentFactory(ExgDialogServiceComponent);

        const component = factory.create(injector);
        component.instance.dialogResult.subscribe(() => this.nextComponent());

        if (this.currentComponent) {
            this.componentsQueue.push(component);
        } else {
            this.currentComponent = component;
            this.showComponent();
        }

        return new Promise<DialogResult>((resolve, reject) => {
            component.instance.dialogResult.subscribe(dialogResult => resolve(dialogResult), err => reject(err));
        });
    }

    private nextComponent() {
        if (this.currentComponent) {
            this.currentComponent.destroy();
            this.currentComponent = null;
        }

        const component = this.componentsQueue.shift();
        if (!component)
            return;

        this.currentComponent = component;
        this.showComponent();
    }

    private showComponent() {
        this.componentContainer.insert(this.currentComponent.hostView);
    }

    private getDialogParams(message: string | DialogServiceParams, mode?: 'info' | 'warning' | 'error' | 'confirm' | 'confirmDelete'): DialogServiceParams {
        let params = <DialogServiceParams>message;
        if (typeof message === 'string') {
            params = new DialogServiceParams();
            params.message = message;
        }

        if (mode === 'info') {
            return { ...DialogServiceParams.forInfo(), ...params };
        }
        if (mode === 'error') {
            return { ...DialogServiceParams.forError(), ...params };
        }
        if (mode === 'confirmDelete') {
            return { ...DialogServiceParams.forConfirmDelete(), ...params };
        }

        return { ...params };
    }
}
