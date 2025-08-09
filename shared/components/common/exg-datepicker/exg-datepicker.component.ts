import { getLocaleFirstDayOfWeek } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Subject } from 'rxjs';

import { DateUtils } from '../../../utils/date-utils';

@Component({
    selector: 'exg-datepicker',
    templateUrl: './exg-datepicker.component.html',
    styleUrls: ['./exg-datepicker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgDatepickerComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDatepickerComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

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
    @Input() styleType: 'common' | 'empty' | 'readonly' | 'flat' = 'common';

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;
    @Input() changeLanguage: boolean;
    @Input() disableIcon: boolean = false;
    @Input() iconColor: 'primary' | 'accent' | 'warn' | string | undefined = 'primary';
    @Input() defaultValue: number;

    @Output() readonly valueChange = new EventEmitter<number>();

    @ViewChild('elemToFocus', { static: true }) elemToFocus: ElementRef<HTMLInputElement>;

    @HostBinding('class.exg-datepicker-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-datepicker-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-datepicker-style-readonly') exgStyleTypeReadonly: boolean;
    @HostBinding('class.exg-datepicker-style-stroked') exgStyleTypeStroked: boolean;
    @HostBinding('class.exg-datepicker-style-flat') exgStyleTypeFlat: boolean;

    public internalValue: string;
    public internalMinDate: Date;
    public internalMaxDate: Date;
    public focused: boolean;
    public hovered: boolean;
    public invalid: boolean;

    public flatStyling: boolean;

    private unsubscribe = new Subject();
    private propagateChange: (_) => { /* no need */ };

    constructor(private adapter: DateAdapter<any>, private changeDetectorRef: ChangeDetectorRef) {
     
    }

    public ngOnInit() {
        this.applyHostClasses();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.setInternalValue();
        }

        if (changes.defaultValue || changes.value) {
            this.applyStyleFlat();
        }

        if (changes.minDate || changes.maxDate) {
            const min = DateUtils.convertEpocToString(this.minDate);
            const max = DateUtils.convertEpocToString(this.maxDate);
            this.internalMinDate = min ? new Date(min) : null;
            this.internalMaxDate = max ? new Date(max) : null;
        }

        // if (changes.changeLanguage) {
        //     this.adapter.setLocale(this.translate.getCurrentLang());
        //     this.adapter.getFirstDayOfWeek = () => { return getLocaleFirstDayOfWeek(this.translate.getCurrentLang()); };
        // }

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

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched(_) { /* no need */ }

    public onDateChange(event: MatDatepickerInputEvent<Date>) {
        this.onDateChanged(event.value);
    }

    public onCleanDate() {
        this.onDateChanged(DateUtils.convertStringToDate(DateUtils.convertEpocToString(this.defaultValue)));
    }

    private onDateChanged(value: Date) {
        this.internalValue = DateUtils.convertDateToString(value);
        this.value = DateUtils.convertStringToEpoc(this.internalValue);
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }

        this.applyStyleFlat();
        this.valueChange.emit(this.value);
        setTimeout(() => this.elemToFocus.nativeElement.focus(), 0); // remove focus from trigger button since it looks ugly
    }

    private setInternalValue() {
        this.internalValue = DateUtils.convertEpocToString(this.value);
        this.changeDetectorRef.markForCheck();
    }

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeEmpty = this.styleType === 'empty';
        this.exgStyleTypeReadonly = this.styleType === 'readonly';
        this.exgStyleTypeStroked = this.styleType === 'flat';
        this.flatStyling = this.styleType === 'flat';
        this.appearance =  this.styleType === 'common' || this.styleType === 'flat' || !this.styleType ? 'outline' : 'fill';
    }

    private applyStyleFlat() {
        this.exgStyleTypeFlat = this.exgStyleTypeStroked ? this.defaultValue !== this.value : null;
    }
}
