import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DialogResult } from '../../common/exg-dialog/shared/dialog-result.model';
import { ExgDialogResultEvent } from '../../common/exg-dialog/shared/exg-dialog-result-event.model';

@Component({
    selector: 'exg-autocomplete-dialog',
    templateUrl: './exg-autocomplete-dialog.component.html',
    styleUrls: ['./exg-autocomplete-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgAutocompleteDialogComponent {
    @Input() data: any[];
    @Input() placeholder: string;

    @Output() readonly dialogClose = new EventEmitter<ExgDialogResultEvent>();
    @Output() readonly termChanged = new EventEmitter<string>();

    public mainForm: FormGroup;

    public search: FormControl;

    constructor(private formBuilder: FormBuilder) {
        this.search = this.formBuilder.control(null);
        this.mainForm = this.formBuilder.group({ search: this.search });
    }

    public onSelect(item: any) {
        this.search.patchValue(null);
        this.dialogClose.emit({ dialogResult: DialogResult.Ok, dataFromComponent: { data: item.originalValue } });
    }

    public onValueChange($event: string) {
        this.termChanged.emit($event);
    }

    public trackByItem(index: number, _) {
        return index;
    }

    public onClose() {
        this.search.patchValue(null);
        this.dialogClose.emit({ dialogResult: DialogResult.Cancel });
    }
}
