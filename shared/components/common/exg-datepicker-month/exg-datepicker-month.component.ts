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
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import { Moment } from 'moment';
import moment from 'moment';

import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { DateUtils } from '../../../utils/date-utils';

export const MY_FORMATS = {
    parse: {
        dateInput: 'MMMM YYYY',
    },
    display: {
        dateInput: 'MMMM YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'exg-datepicker-month',
    templateUrl: './exg-datepicker-month.component.html',
    styleUrls: ['./exg-datepicker-month.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgDatepickerMonthComponent),
            multi: true,
        },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExgDatepickerMonthComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
    @Input() value: number; // epoch date format
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() allowClear: boolean;
    @Input() minDate: number;
    @Input() maxDate: number;
    @Input() required: boolean;
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';
    @Input() styleType: 'common' | 'empty' | 'readonly' = 'common';

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;
    @Input() changeLanguage: boolean;

    @Output() readonly valueChange = new EventEmitter<number>();

    @ViewChild('elemToFocus', { static: true }) elemToFocus: ElementRef<HTMLInputElement>;

    @HostBinding('class.exg-datepicker-month-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-datepicker-month-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-datepicker-month-style-readonly') exgStyleTypeReadonly: boolean;

    public internalValue: string;
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
      //  this.adapter.setLocale(this.translate.getCurrentLang());
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
        if (changes.changeLanguage) {
           // this.adapter.setLocale(this.translate.getCurrentLang());
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

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = moment(this.value!);
        const yearMonth = moment(normalizedMonthAndYear);
        ctrlValue.month(yearMonth.month());
        ctrlValue.year(yearMonth.year());
        this.writeValue(moment.utc(ctrlValue).valueOf());
        datepicker.close();
        this.valueChange.emit(this.value);
    }

    private setInternalValue() {
        this.internalValue = DateUtils.convertEpocToString(this.value);
        this.changeDetectorRef.markForCheck();
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
