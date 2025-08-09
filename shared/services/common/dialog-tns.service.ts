import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { AlertOptions, ConfirmOptions, Dialogs } from '@nativescript/core'

import { BaseSingletonService } from './base-singleton.service';


import { DialogResult } from '../../components/common/exg-dialog/shared/dialog-result.model';
import { DialogServiceConfirmParams, DialogServiceParams } from '../../components/common/exg-dialog/shared/dialog-service-params.model';

@Injectable({
    providedIn: 'root'
})
export class DialogTnsService extends BaseSingletonService {

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private loggerService: LoggerService) {
        super('DialogService');
    }

    public init(componentContainer: ViewContainerRef) { /** no need */}

    public async showInfo(message?: string | DialogServiceParams): Promise<DialogResult> {
        const params = this.getDialogParams(message, 'info');
        return Dialogs.alert(params).then(() => DialogResult.Cancel);
    }

    public async showWarning(message?: string | DialogServiceParams): Promise<DialogResult> {
        const params = this.getDialogParams(message, 'warning');
        return Dialogs.alert(params).then(() => DialogResult.Cancel);
    }

    public async showError(message?: string | DialogServiceParams): Promise<DialogResult> {
        const params = this.getDialogParams(message, 'error');
        return Dialogs.alert(params).then(() => DialogResult.Cancel);
    }

    public async showConfirm(message?: string | DialogServiceConfirmParams): Promise<DialogResult> {
        const params = <DialogServiceConfirmParams>this.getDialogParams(message, 'confirm');
        return Dialogs.confirm(params).then(action => action ? DialogResult.Confirm : DialogResult.Cancel);
    }

    public async showConfirmDelete(message?: string | DialogServiceConfirmParams): Promise<DialogResult> {
        const params = <DialogServiceConfirmParams>this.getDialogParams(message, 'confirmDelete');
        return Dialogs.confirm(params).then(action => action ? DialogResult.Delete : DialogResult.Cancel);
    }

    private getDialogParams(message: string | DialogServiceParams, mode?: 'info' | 'warning' | 'error' | 'confirm' | 'confirmDelete'): DialogServiceParams {
        let params = <DialogServiceParams>message;
        if (typeof message === 'string') {
            params = new DialogServiceParams();
            params.message = message;
        }

        if (mode === 'info' || mode === 'warning' || mode === 'error') {
            const newParms = { ...DialogServiceParams.forInfo(), ...params };
            return <AlertOptions>{ title: newParms.title, message: newParms.message, okButtonText: 'Ok' }
        }

        if (mode === 'confirmDelete' || mode === 'confirm') {
            const newParms = { ...DialogServiceParams.forConfirmDelete(), ...params };
            return <ConfirmOptions>{ title: newParms.title, message: newParms.description || newParms.message, okButtonText: 'Confirm', cancelButtonText: 'Cancel' };
        }

        return { ...params };
    }
}
