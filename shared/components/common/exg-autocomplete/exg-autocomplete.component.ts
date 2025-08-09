import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';

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
export class ExgAutocompleteComponent implements OnInit, OnChanges, ControlValueAccessor {

    @Input() value: any;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() title: string;
    @Input() autoFocus: boolean;
    @Input() required: boolean;
    @Input() maxlength: number;
    @Input() iconName: string;
    @Input() iconColor: 'primary' | 'accent' | 'warn' = 'primary';
    @Input() styleType: 'common' | 'inline' | 'empty' | 'readonly' = 'common';
    @Input() border = false;
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';
    /// panle width only px
    @Input() panelWidth: number;

    @Input() allowNull: boolean;
    @Input() emptyDisplayValue = '-';

    @Input() data: any[];
    @Input() idKey = 'id';
    @Input() displayKey = 'name';

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;

    @Input() displayValueFunction: (item: any) => string;
    @Input() displayValueTemplate: TemplateRef<any>;
    @Input() selectedDisplayFunction: (item: any | any[]) => string;

    @HostBinding('class.exg-autocomplete-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-autocomplete-style-inline') exgStyleTypeInline: boolean;
    @HostBinding('class.exg-autocomplete-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-autocomplete-style-readonly') exgStyleTypeReadonly: boolean;

    @Output() readonly selectionChange = new EventEmitter<any>();
    @Output() readonly valueChange = new EventEmitter<string>();
    @Output() readonly inputBlur = new EventEmitter<void>();

    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    public internalData: { originalValue: any, displayValue: string }[];
    public internalValue: string;

    public focused: boolean;
    public hovered: boolean;

    public panelWidthInternal: any = null;

    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public ngOnInit() {
        this.applyHostClasses();
        if (this.autoFocus) {
            this.focus();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.styleType || changes.ngClass) {
            this.applyHostClasses();
        }
        if (changes.data) {
            this.prepareInternalData();
        }
        if (changes.value) {
            this.setInternalValue();
        }

        if (changes.panelWidth && this.panelWidth) {
            this.panelWidthInternal = this.panelWidth > window?.innerWidth ? null : this.panelWidth;
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

    public trackByItem(index: number, value: any) {
        return value.originalValue?.uid || value.originalValue?.id || index;
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

    public focus() {
        setTimeout(() => this.input.nativeElement.focus(), 0);
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

    public onSelectionChange($event: MatOptionSelectionChange, value: any) {
        if (!$event.source.selected) {
            return;
        }

        this.value = value;
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
        this.selectionChange.emit(value);
    }

    public onBlur() {
        this.inputBlur.emit();
        if (this.propagateTouch) {
            this.propagateTouch();
        }
    }

    private getDisplayValue(value: any): string {
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

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeInline = this.styleType === 'inline';
        this.exgStyleTypeEmpty = this.styleType === 'empty';
        this.exgStyleTypeReadonly = this.styleType === 'readonly';
        this.appearance =  this.styleType === 'common' || !this.styleType ? 'outline' : 'fill';
    }

    private setInternalValue() {
        this.internalValue = this.value ? this.getDisplayValue(this.value) : null;
    }
}
