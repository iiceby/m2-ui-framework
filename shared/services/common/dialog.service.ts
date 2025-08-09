import { Injectable, ViewContainerRef } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';

import { DialogResult } from '../../components/common/exg-dialog/shared/dialog-result.model';
import { DialogServiceConfirmParams, DialogServiceParams } from '../../components/common/exg-dialog/shared/dialog-service-params.model';

@Injectable({
    providedIn: 'root'
})
export class DialogService extends BaseSingletonService {

    constructor() {
        super('DialogService');
    }

    public init(componentContainer: ViewContainerRef) { }

    public async showInfo(message?: string | DialogServiceParams): Promise<DialogResult | any> {
        return Promise.resolve(null);
    }

    public async showWarning(message?: string | DialogServiceParams): Promise<DialogResult | any> {
        return Promise.resolve(null);
    }

    public async showError(message?: string | DialogServiceParams): Promise<DialogResult | any> {
        return Promise.resolve(null);
    }

    public async showConfirm(message?: string | DialogServiceConfirmParams): Promise<DialogResult | any> {
        return Promise.resolve(null);
    }

    public async showConfirmDelete(message?: string | DialogServiceConfirmParams): Promise<DialogResult | any> {
        return Promise.resolve(null);
    }
}
