// tslint:disable:no-template-call-expression
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

@Component({
    selector: 'exg-radio-button',
    templateUrl: 'exg-radio-button.component.html',
    styleUrls: ['exg-radio-button.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgRadioButtonComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExgRadioButtonComponent implements ControlValueAccessor {
    @Input() value: any;
    @Input() groupValue: any;
    @Input() name: string;
    @Input() placeholder: string;
    @Input() required: boolean;
    @Input() displayValueFunction: (item: any) => string;
    @Input() direction: 'row' | 'column' = 'row';

    @Output() readonly valueChange = new EventEmitter<any>();
    //@ts-ignore
    private propagateChange: (_) => void;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }
    //@ts-ignore
    public trackByButton(index: number, _) {
        return index;
    }

    public onSelectionChange(event: MatRadioChange) {
        if (this.propagateChange) {
            this.propagateChange(event.value);
        }

        this.valueChange.emit(event.value);
    }
    //@ts-ignore
    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public writeValue(value: any) {
        this.value = value;
        this.changeDetectorRef.markForCheck();
    }

    public registerOnTouched() { /* no need */ }

        //@ts-ignore
    public compareFn(a, b): boolean {
        if (!a || !b) return false;
        if (a.id === undefined && b.id === undefined) {
            return a === b;
        }
        return a.id === b.id || a === b;
    }
}
