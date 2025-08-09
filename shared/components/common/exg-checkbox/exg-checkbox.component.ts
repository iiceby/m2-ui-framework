import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'exg-checkbox',
    templateUrl: './exg-checkbox.component.html',
    styleUrls: ['./exg-checkbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgCheckBoxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgCheckBoxComponent implements ControlValueAccessor {

    @Input() value: boolean;
    @Input() readonly: boolean;
    @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
    @Input() slideMode: boolean;
    @Input() tapMode: boolean;
    @Input() textReverse: boolean;
    @Input() indeterminate: boolean;

    @Output() readonly valueChange = new EventEmitter<boolean>();

    private propagateChange: (_) => void;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    public writeValue(value: boolean) {
        this.value = value || false;
        this.changeDetectorRef.detectChanges();

    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() { /* no need */ }

    public onChange(model: MatCheckboxChange | MatSlideToggleChange) {
        this.value = model.checked;
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
        this.valueChange.emit(this.value);
    }
}
