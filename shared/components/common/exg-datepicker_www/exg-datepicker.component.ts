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
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



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
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    @Input() styleType: 'common' | 'empty' | 'readonly' = 'common';

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;
    @Input() changeLanguage: boolean;
    @Input() disableIcon: boolean = false;
    @Input() iconColor: 'primary' | 'accent' | 'warn' | string | undefined = 'primary';

    @Output() readonly valueChange = new EventEmitter<number>();

    @ViewChild('elemToFocus', { static: true }) elemToFocus: ElementRef<HTMLInputElement>;

    @HostBinding('class.exg-datepicker-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-datepicker-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-datepicker-style-readonly') exgStyleTypeReadonly: boolean;

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

    public onDateChange(event: MatDatepickerInputEvent<Date>) {
        //@ts-ignore
        this.internalValue = DateUtils.convertDateToString(event.value);
        this.value = DateUtils.convertStringToEpoc(this.internalValue);
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
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
        this.appearance = this.styleType === 'common' || !this.styleType ? 'outline' : 'fill';
    }
}
