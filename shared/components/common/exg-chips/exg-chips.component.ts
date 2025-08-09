import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';


/**
 * @title Chips list
 */
@Component({
    selector: 'exg-chips',
    templateUrl: 'exg-chips.component.html',
    styleUrls: ['exg-chips.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgChipsComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgChipsComponent implements OnChanges, ControlValueAccessor {

    @Input() data: any[];
    @Input() value: any | any[];
    @Input() multiple: boolean;
    @Input() disabled: boolean;
    @Input() allowNull: boolean;
    @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
    @Input() displayValueTemplate: TemplateRef<any>;

    @Input() displayValueFunction: (item: any) => string;
    @Input() selectValueFunction: (item: any) => string | number;
    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;

    @Output() readonly valueChange = new EventEmitter<any[]>();

    public focused: boolean;
    public hovered: boolean;
    public internalData: { selectValue: any, originalValue: any, displayValue: string }[];
    public internalValue: string | number;

    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public trackByChips(_, item: string): string {
        return item;
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }

    ngOnChanges(changes: SimpleChanges): void {
        //@ts-ignore
        if (changes.data) {
            this.prepareInternalData();
        }
        //@ts-ignore
        if (changes.value) {
            this.setInternalValue();
        }
    }

    public onValueChange(model: MatChipListboxChange) {
        if (model.value === undefined && !this.allowNull) {
            return;
        }

        this.internalValue = model.value;

        if (model.value === undefined) {
            this.value = null;
            if (this.propagateChange) {
                this.propagateChange(null);
            }
            //@ts-ignore
            this.valueChange.emit(null);
        }
    }

    public onSelectionChange($event: MatChipSelectionChange, value: any) {
        if (!$event.source.selected) {
            if (!this.allowNull) {
                $event.source.select();
            }

            return;
        }

        const isNeedToEmitValueChange = this.value !== value;
        this.value = value;
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }

        if (isNeedToEmitValueChange) {
            this.valueChange.emit(value);
        }
    }

    public writeValue(value: any) {
        this.value = value;
        this.setInternalValue();
        this.changeDetectorRef.detectChanges();
    }

    public trackByItem(index: number, value: any) {
        return value.originalValue?.uid || value.originalValue?.id || index;
    }

    private getDisplayValue(value: any): string {
        if (this.displayValueFunction) {
            return this.displayValueFunction(value);
        }
        return value.text || value.name || value;
    }

    private getSelectValue(value: any): string | number {
        if (this.selectValueFunction) {
            return this.selectValueFunction(value);
        }
        return value.id !== undefined
            ? value.id
            :  value.uid !== undefined
                ? value.uid
                : value;
    }

    private prepareInternalData() {
        if (!this.data || !this.data[0]) {
            //@ts-ignore
            this.internalData = null;
            return;
        }

        this.internalData = this.data.map(value => ({ selectValue: this.getSelectValue(value), originalValue: value, displayValue: this.getDisplayValue(value) }));
    }

    private setInternalValue() {
        //@ts-ignore
        this.internalValue = this.value ? this.getSelectValue(this.value) : null;
    }
}
