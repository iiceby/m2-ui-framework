import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, forwardRef, HostBinding, Input, NO_ERRORS_SCHEMA, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputMask } from './shared/exg-textbox-mask.model';

@Component({
    standalone: true,
    selector: 'exg-textbox',
    templateUrl: './exg-textbox.component.tns.html',
    styleUrls: ['./exg-textbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgTextBoxComponent),
            multi: true
        }
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgTextBoxComponent implements OnInit, OnChanges, ControlValueAccessor {

    @Input() value: string;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() title: string;
    @Input() required: boolean;
    @Input() autoFocus: boolean;
    @Input() maxlength: number;
    @Input() autocomplete = 'off';
    @Input() inputType: 'datetime' | 'phone' | 'number' | 'url' | 'email' = null;
    @Input() inputMask: InputMask;
    @Input() isMultiLine: boolean;
    @Input() multilineMinRows = 2;
    @Input() multilineMaxRows = 2;
    @Input() styleType: 'common' | 'bordered' | 'empty' = 'common';
    @Input() floatLabel: 'always' | 'auto' = 'auto';
    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;
    @Input() isPassword = false;
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';
    @Input() border = false;
    @Input() autocapitalizationType: 'none' | 'words' | 'sentences' | 'allcharacters' = 'none';

    @HostBinding('class.exg-textbox-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-textbox-style-bordered') exgStyleTypeBordered: boolean;
    @HostBinding('class.exg-textbox-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-textbox-noPlaceholder') exgNoPlaceholder: boolean;
    @HostBinding('class.exg-textbox-neverFloatLabel') exgNeverFloatLabel: boolean;

    @Output() readonly valueChange = new EventEmitter<string>();
    @Output() readonly inputBlur = new EventEmitter<void>();
    @Output() readonly keydownEnter = new EventEmitter<void>();

    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    public focused: boolean;
    public hovered: boolean;

    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    public ngOnInit() {
        this.applyHostClasses();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.styleType || changes.ngClass || changes.floatLabel || changes.placeholder) {
            this.applyHostClasses();
        }
    }

    public writeValue(value: string) {
        this.value = value === null || value === undefined ? '' : `${value}`;
        this.changeDetectorRef.markForCheck();
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }

    public onValueChange(model: string) {
        if (this.propagateChange) {
            this.propagateChange(model);
        }
        this.valueChange.emit(model);
    }

    public onBlur() {
        this.inputBlur.emit();
        this.focused=false;
        if (this.propagateTouch) {
            this.propagateTouch();
        }
    }

    public onKeydownEnter() {
        setTimeout(() => this.keydownEnter.emit(), 0);
    }

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeBordered = this.styleType === 'bordered';
        this.exgStyleTypeEmpty = this.styleType === 'empty';

        this.exgNoPlaceholder = !this.placeholder;
        this.exgNeverFloatLabel = this.floatLabel === 'auto';
    }
}
