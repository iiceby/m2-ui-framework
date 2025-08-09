import { Injectable } from '@angular/core';

import { SnackBar } from '@nstudio/nativescript-snackbar';

import { BaseSingletonService } from './base-singleton.service';

import { DialogResult } from '../../components/common/exg-dialog/shared/dialog-result.model';
import { ErrorObject } from '../../models/common/error-object.model';
import { SnackbarType } from '../../components/common/exg-snackbar/snackbar-type.model';

@Injectable({
    providedIn: 'root'
})
export class SnackbarTnsService extends BaseSingletonService {

    private snackbar = new SnackBar();

    constructor() {
        super('SnackbarService');
    }

    public async showInfo(message: string, duration?: number): Promise<DialogResult> {
        return this.loadComponent(message, SnackbarType.Ok, duration || 3000);
    }

    public async showWarning(message: string, duration?: number): Promise<DialogResult> {
        return this.loadComponent(message, SnackbarType.Warning, duration || 5000);
    }

    public async showError(message: string | ErrorObject | object, duration?: number): Promise<DialogResult> {
        message = message instanceof ErrorObject ? message.toString() : `${message}`;
        return this.loadComponent(message, SnackbarType.Error, duration || 5000);
    }

    public async showDelete(message: string, duration?: number): Promise<DialogResult> {
        return this.loadComponent(message, SnackbarType.Delete, duration || 4000);
    }

    private async loadComponent(message: string, snackbarType: SnackbarType, duration: number): Promise<DialogResult> {
        let color = '#fff';
        switch (snackbarType) {
            case SnackbarType.Ok:
                color = '#13cf71';
                break;
            case SnackbarType.Warning:
                color = '#fc5922';
                break;
            case SnackbarType.Error:
                color = '#fc5922';
                break;
        }

        return this.snackbar.simple(message, color, 'rgba(90, 92, 123, 0.88)')
            .then(() => DialogResult.Ok);
    }
}
