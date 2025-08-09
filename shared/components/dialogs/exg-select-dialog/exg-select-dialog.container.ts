import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';

import { ExgDialogResultEvent } from '../../common/exg-dialog/shared/exg-dialog-result-event.model';

@Component({
    selector: 'exg-select-dialog-container',
    templateUrl: './exg-select-dialog.container.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgSelectDialogContainer implements OnChanges {

    @Input() inputs: any;

    @Output() readonly closeDialog = new EventEmitter<ExgDialogResultEvent>();

    public data: any[];
    public placeholder: string;
    public selectValueFunction: (item: any) => string | number;
    public displayValueFunction: (item: any) => string;
    public displayValueTemplate: TemplateRef<any>;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.inputs && this.inputs) {
            this.data = this.inputs['data'];
            this.placeholder = this.inputs['placeholder'];
            this.selectValueFunction = this.inputs['selectValueFunction'];
            this.displayValueFunction = this.inputs['displayValueFunction'];
            this.displayValueTemplate = this.inputs['displayValueTemplate'];
        }
    }

    public onCloseDialog($event) {
        this.closeDialog.emit($event);
    }
}
