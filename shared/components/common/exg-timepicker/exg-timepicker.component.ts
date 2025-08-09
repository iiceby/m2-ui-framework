import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DateUtils } from '../../../utils/date-utils';

@Component({
    selector: 'exg-timepicker',
    templateUrl: './exg-timepicker.component.html',
    styleUrls: ['./exg-timepicker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgTimepickerComponent),
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExgTimepickerComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
    @Input() value: number; // epoch time without date format
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() placeholder: string;

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;
    @Input() border = true;
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';
    @Input() styleType: 'common' | 'empty' = 'common';
    @Input() changeLanguage: boolean;

    @Output() readonly valueChange = new EventEmitter<number>();

    @HostBinding('class.exg-timepicker-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-timepicker-style-empty') exgStyleTypeEmpty: boolean;

    @ViewChild('elemToFocus', { static: true }) elemToFocus: ElementRef<HTMLInputElement>;
    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    public internalValue: string;
    public focused: boolean;
    public hovered: boolean;
    public invalid: boolean;

    private unsubscribe = new Subject();
    //@ts-ignore
    private propagateChange: (_) => {
        /* no need */
    };

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public ngOnInit() {
        if (this.controlsToValidate) {
            merge(...this.controlsToValidate.map(c => c.valueChanges))
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(() => {
                    if (this.validate) {
                        this.setInvalidState();
                    }
                });
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        //@ts-ignore
        if (changes.value) {
            this.setInternalValue();
        }
        //@ts-ignore
        if (changes.validate) {
            this.setInvalidState();
        }
        //@ts-ignore
        if (changes.styleType || changes.ngClass || changes.placeholder) {
            this.applyHostClasses();
        }
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    public writeValue(value: number) {
        this.value = value;
        this.setInternalValue();
    }
    //@ts-ignore
    public registerOnChange(fn) {
        this.propagateChange = fn;
    }
    //@ts-ignore
    public registerOnTouched(_) {
        /* no need */
    }

    public onAccept() {
        if (!this.value && this.value !== 0) {
            this.onTimeChange('12:00');
        }
    }

    public onTimeChange(event: any) {
        if (event) {
            this.internalValue = event;
            this.value = DateUtils.convertStringTimeToEpoch(this.internalValue);
        } else {
            //@ts-ignore
            this.value = null;
        }

        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
        this.valueChange.emit(this.value);
        setTimeout(() => this.elemToFocus.nativeElement.focus(), 0); // remove focus from trigger button since it looks ugly
    }

    public click() {
        setTimeout(() => this.input.nativeElement.click(), 0);
    }

    private setInternalValue() {
        if (this.value || this.value === 0) {
            this.internalValue = DateUtils.convertEpochTimeToString(this.value);
            this.changeDetectorRef.markForCheck();
        }
    }

    private setInvalidState() {
        this.invalid = this.validate && this.controlsToValidate && this.controlsToValidate.some(c => c.invalid);
    }

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeEmpty = this.styleType === 'empty';
        this.appearance = this.styleType === 'common' || !this.styleType ? 'outline' : 'fill';
    }
}
