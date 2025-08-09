import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { AutocompleteDispatchers } from '../../../store/autocomplete/autocomplete.dispatchers';
import { AutocompleteSelectors } from '../../../store/autocomplete/autocomplete.selectors';
import { DialogsConfig } from '../../dialogs/dialogs.enum';

import { ExgDialogMode } from '../exg-dialog/shared/exg-dialog-mode.model';

@Component({
    selector: 'exg-autocomplete',
    templateUrl: './exg-autocomplete.component.html',
    styleUrls: ['./exg-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgAutocompleteComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgAutocompleteComponent implements OnChanges, ControlValueAccessor {

    @Input() value: any;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() title: string;
    @Input() required: boolean;
    @Input() maxlength: number;
    @Input() iconName: string;
    @Input() border = false;
    @Input() styleType: 'common' | 'readonly' = 'common';
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';

    @Input() data: any[] = [];
    @Input() idKey = 'id';
    @Input() displayKey = 'name';

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;

    @Input() displayValueFunction: (item: any) => string;
    @Input() displayValueTemplate: TemplateRef<any>;
    @Input() selectedDisplayFunction: (item: any | any[]) => string;

    @Output() readonly selectionChange = new EventEmitter<any>();
    @Output() readonly valueChange = new EventEmitter<string>();

    public internalData: { originalValue: any, displayValue: string }[];
    public internalValue: string;

    public focused: boolean;
    public hovered: boolean;

    public dialogMode = ExgDialogMode;
    public componentData = {};
    public showDialog: boolean;

    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private autocompleteDispatchers: AutocompleteDispatchers,
                private autocompleteSelectors: AutocompleteSelectors) {
        this.autocompleteSelectors.term$.pipe(filter(() => this.showDialog), filter(x => !!x)).subscribe((res) => {
            this.valueChange.emit(res);
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            this.prepareInternalData();
            const inputs = {
                placeholder: this.placeholder
            };

            this.autocompleteDispatchers.dispatchAutocompleteDataAction(this.internalData);
            this.componentData = { component: {}, key: DialogsConfig.ExgAutocomplete, inputs };
        }
        if (changes.value) {
            this.setInternalValue();
        }
    }

    public get selectedDisplayValue(): string {
        if (this.selectedDisplayFunction) {
            return this.selectedDisplayFunction(this.value);
        }
        if (!this.value) {
            return '';
        }
        if (Array.isArray(this.value)) {
            if (this.value.length > 0) {
                return this.getDisplayValue(this.value[0]);
            }
            return '';
        }
        return this.getDisplayValue(this.value);
    }

    public openDialog() {
        this.focused = true;
        this.showDialog = true;
    }

    public trackByItem(index: number, _) {
        return index;
    }

    public onDialogClose($event) {
        this.showDialog = false;
        if ($event.dataFromComponent && $event.dataFromComponent.data) {
            this.onSelectionChange($event.dataFromComponent.data);
            this.writeValue($event.dataFromComponent.data);
        }
        this.autocompleteDispatchers.dispatchAutocompleteResetAction();
    }

    public writeValue(value: any) {
        this.value = value;
        this.setInternalValue();
        this.changeDetectorRef.detectChanges();
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }

    public onValueChange(model: string) {
        this.internalValue = model;

        if (!this.internalValue) {
            this.value = null;
            if (this.propagateChange) {
                this.propagateChange(null);
            }
            this.selectionChange.emit(null);
            this.valueChange.emit(null);
        }

        if (this.internalValue) {
            this.valueChange.emit(this.internalValue);
        }
    }

    public onSelectionChange(value: any) {
        this.value = value;
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
        this.selectionChange.emit(value);
    }

    public onBlur() {
        if (this.propagateTouch) {
            this.propagateTouch();
        }
    }

    public getDisplayValue(value: any): string {
        if (this.displayValueFunction) {
            return this.displayValueFunction(value);
        }
        return value.text || value.name || value;
    }

    private prepareInternalData() {
        if (!this.data || !this.data[0]) {
            this.internalData = null;
            return;
        }
        this.internalData = this.data.map(value => ({ originalValue: value, displayValue: this.getDisplayValue(value) }));
    }

    private setInternalValue() {
        this.internalValue = this.value ? this.getDisplayValue(this.value) : null;
    }
}
