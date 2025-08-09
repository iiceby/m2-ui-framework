import { Injectable } from '@angular/core';

import { BaseSingletonService } from './base-singleton.service';

@Injectable({
    providedIn: 'root'
})
export class PrintService extends BaseSingletonService {

    constructor() {
        super('PrintService');
    }

    public printDocument(file: Blob) {
        const blobUrl = URL.createObjectURL(file);
        const oWindow = window.open(blobUrl, 'print');
        oWindow.print();
        oWindow.close();
    }
}
