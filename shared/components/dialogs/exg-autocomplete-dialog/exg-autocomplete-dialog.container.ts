import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { AutocompleteDispatchers } from '../../../store/autocomplete/autocomplete.dispatchers';
import { AutocompleteSelectors } from '../../../store/autocomplete/autocomplete.selectors';

import { ExgDialogResultEvent } from '../../common/exg-dialog/shared/exg-dialog-result-event.model';

@Component({
    selector: 'exg-autocomplete-dialog-container',
    templateUrl: './exg-autocomplete-dialog.container.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgAutocompleteDialogContainer implements OnChanges {

    @Input() inputs: any;

    @Output() readonly closeDialog = new EventEmitter<ExgDialogResultEvent>();

    public data$ = this.autocompleteSelectors.data$;
    public placeholder: string;

    constructor(private autocompleteDispatchers: AutocompleteDispatchers,
                private autocompleteSelectors: AutocompleteSelectors) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.inputs && this.inputs) {
            this.placeholder = this.inputs['placeholder'];
        }
    }

    public onCloseDialog($event) {
        this.closeDialog.emit($event);
    }

    public onTermChanged($event: string) {
        this.autocompleteDispatchers.dispatchAutocompleteAction($event);
    }
}
