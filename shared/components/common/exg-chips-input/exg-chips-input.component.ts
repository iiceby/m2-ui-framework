import { SPACE } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatChipInputEvent } from '@angular/material/chips';


import { ExgCultureEnum } from '../../../models/common/exg-culture.model';
import { ExgInputMask, InputMask } from '../exg-textbox/shared/exg-textbox-mask.model';

/**
 * @title Chips with input
 */
@Component({
    selector: 'exg-chips-input',
    templateUrl: 'exg-chips-input.component.html',
    styleUrls: ['exg-chips-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgChipsInputComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgChipsInputComponent implements OnChanges, ControlValueAccessor {

    @Input() value: string[];
    @Input() visible = true;
    @Input() maxlength: number;
    @Input() inputMask: InputMask;
    @Input() placeholder: string;
    @Input() required: boolean;
    @Input() selectable = true;
    @Input() removable = true;
    @Input() addOnBlur = true;

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;

    @Output() readonly valueChange = new EventEmitter<any[]>();

    readonly separatorKeysCodes: number[] = [SPACE];

    public focused: boolean;
    public hovered: boolean;
    public internalValue: string[];
    public mask?: any;
    public inputValue: string;

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
        if (changes.value && this.value) {
            this.setInternalData();
        }

        if (changes.inputMask) {
            this.inputMask.radixChar = this.inputMask.radixChar ?? '.';
            const imask = ExgInputMask.createInputMask(this.inputMask);
            this.mask = imask ? imask.maskOptions : null;
        }
    }

    public writeValue(value: any[]) {
        this.value = value;
        this.setInternalData();
        this.changeDetectorRef.detectChanges();
    }

    public add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if (input) {
            input.value = '';
        }

        if ((value || '').trim()) {
            this.internalValue.push(value.trim());
            this.valueChange.emit(this.internalValue);
        }

        this.inputValue = '';

        if (this.propagateChange) {
            this.propagateChange(this.internalValue);
        }
    }

    public remove(item: any): void {
        const index = this.internalValue.indexOf(item);

        if (index >= 0) {
            this.internalValue.splice(index, 1);
            this.valueChange.emit(this.internalValue);
        }

        if (this.propagateChange) {
            this.propagateChange(this.internalValue);
        }
    }

    private setInternalData() {
        this.internalValue = [...this.value];
    }
}
