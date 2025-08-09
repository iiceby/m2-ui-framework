import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { DialogResult } from '../../common/exg-dialog/shared/dialog-result.model';
import { ExgDialogResultEvent } from '../../common/exg-dialog/shared/exg-dialog-result-event.model';

@Component({
    selector: 'exg-select-dialog',
    templateUrl: './exg-select-dialog.component.html',
    styleUrls: ['./exg-select-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgSelectDialogComponent {
    @Input() data: any[];
    @Input() placeholder: string;
    @Input() selectValueFunction: (item: any) => string | number;
    @Input() displayValueFunction: (item: any) => string;
    @Input() displayValueTemplate: TemplateRef<any>;

    @Output() readonly dialogClose = new EventEmitter<ExgDialogResultEvent>();

    public onSelect(item: any) {
        this.dialogClose.emit({ dialogResult: DialogResult.Ok, dataFromComponent: { data: item.originalValue } });
    }

    public trackByItem(index: number, _) {
        return index;
    }
}
