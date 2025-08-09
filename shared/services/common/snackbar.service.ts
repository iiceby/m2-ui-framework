import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { BaseSingletonService } from './base-singleton.service';

import { DialogResult } from '../../components/common/exg-dialog/shared/dialog-result.model';
import { ErrorObject } from '../../models/common/error-object.model';
import { SnackbarType } from 'burns-ui-framework/shared/components/common/exg-snackbar/snackbar-type.model';
import { ExgSnackbarServiceComponent } from 'burns-ui-framework/shared/components/common/exg-snackbar/exg-snackbar-service.component';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService extends BaseSingletonService {
    constructor(public snackBar: MatSnackBar) {
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
        const data: MatSnackBarConfig = { data: { message, snackbarType }, duration, verticalPosition: 'top', horizontalPosition: 'right', panelClass: [`exg-snackbar-${SnackbarType[snackbarType]}`, 'exg-snackbar'] };
        const snackRef = this.snackBar.openFromComponent(ExgSnackbarServiceComponent, data);
        return snackRef.afterDismissed().toPromise().then(() => DialogResult.Ok);
    }
}
