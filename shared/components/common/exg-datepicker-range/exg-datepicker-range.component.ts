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
import { DateAdapter } from '@angular/material/core';

import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DateUtils } from '../../../utils/date-utils';

@Component({
    selector: 'exg-datepicker-range',
    templateUrl: './exg-datepicker-range.component.html',
    styleUrls: ['./exg-datepicker-range.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgDatepickerRangeComponent),
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExgDatepickerRangeComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
    @Input() value: { begin: number; end: number }; // epoch date format
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() placeholder: string;
    @Input() minDate: number;
    @Input() maxDate: number;

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;
    @Input() border = true;
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';
    @Input() styleType: 'common' | 'empty' | 'readonly' = 'common';
    @Input() changeLanguage: string;

    @Output() readonly valueChange = new EventEmitter<{ begin: number; end: number }>();

    @ViewChild('elemToFocus', { static: true }) elemToFocus: ElementRef<HTMLInputElement>;

    @HostBinding('class.exg-datepicker-range-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-datepicker-range-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-datepicker-range-style-readonly') exgStyleTypeReadonly: boolean;
    //@ts-ignore
    public internalValue: { begin: string; end: string } = { begin: null, end: null };
    public internalMinDate: Date;
    public internalMaxDate: Date;
    public focused: boolean;
    public hovered: boolean;
    public invalid: boolean;

    private unsubscribe = new Subject();
    //@ts-ignore
    private propagateChange: (_) => {
        /* no need */
    };

    constructor(private adapter: DateAdapter<any>, private changeDetectorRef: ChangeDetectorRef) {
       
    }

    public ngOnInit() {
        this.applyHostClasses();

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
        if (changes.minDate || changes.maxDate) {
            const min = DateUtils.convertEpocToString(this.minDate);
            const max = DateUtils.convertEpocToString(this.maxDate);
            //@ts-ignore
            this.internalMinDate = min ? new Date(min) : null;
            //@ts-ignore
            this.internalMaxDate = max ? new Date(max) : null;
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

    public writeValue(value: { begin: number; end: number }) {
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
    //@ts-ignore
    public onStartChanges($event) {
        if ($event.value) {
            const internalBegin = DateUtils.convertDateToString($event.value);
            this.internalValue = { begin: internalBegin, end: this.internalValue.end };
            const valueEpocBegin = DateUtils.convertStringToEpoc(internalBegin);
            //@ts-ignore
            this.value = { begin: valueEpocBegin, end: this.value ? this.value.end : null };
        } else {
            //@ts-ignore
            this.value = { begin: null, end: this.value ? this.value.end : null };
        }

        if (!this.value.begin && !this.value.end) {
            if (this.propagateChange) {
                this.propagateChange(this.value);
            }

            setTimeout(() => this.elemToFocus.nativeElement.focus(), 0); // remove focus from trigger button since it looks ugly
            this.valueChange.emit(this.value);
        }
    }
    //@ts-ignore
    public onEndChanges($event) {
        if ($event.value) {
            const internalEnd = DateUtils.convertDateToString($event.value);
            this.internalValue = { begin: this.internalValue.begin, end: internalEnd };
            const valueEpocEnd = DateUtils.convertStringToEpoc(internalEnd);
            //@ts-ignore
            this.value = { begin: this.value ? this.value.begin : null, end: valueEpocEnd };
        } else {
            //@ts-ignore
            this.value = { begin: this.value ? this.value.begin : null, end: null };
        }

        if ($event.value || (!this.value.begin && !this.value.end)) {
            if (this.propagateChange) {
                this.propagateChange(this.value);
            }

            setTimeout(() => this.elemToFocus.nativeElement.focus(), 0); // remove focus from trigger button since it looks ugly
            this.valueChange.emit(this.value);
        }
    }

    private setInternalValue() {
        if (this.value) {
            const internalBegin = DateUtils.convertEpocToString(this.value.begin);
            const internalEnd = DateUtils.convertEpocToString(this.value.end);
            this.internalValue = { begin: internalBegin, end: internalEnd };
            this.changeDetectorRef.markForCheck();
        }
    }

    private setInvalidState() {
        this.invalid = this.validate && this.controlsToValidate && this.controlsToValidate.some(c => c.invalid);
    }

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeEmpty = this.styleType === 'empty';
        this.exgStyleTypeReadonly = this.styleType === 'readonly';
        this.appearance = this.styleType === 'common' || !this.styleType ? 'outline' : 'fill';
    }
}
