import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ExgInputMask, InputMask } from './shared/exg-textbox-mask.model';

@Component({
    selector: 'exg-textbox',
    templateUrl: './exg-textbox.component.html',
    styleUrls: ['./exg-textbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgTextBoxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgTextBoxComponent implements OnInit, OnChanges, ControlValueAccessor {

    @Input() value: string | number;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() title: string;
    @Input() required: boolean;
    @Input() autoFocus: boolean;
    @Input() maxlength: number;
    @Input() autocomplete = 'off';
    @Input() inputType: 'email' | 'text' | 'number' | 'password' = 'text';
    @Input() inputMask: InputMask;
    @Input() isMultiLine: boolean;
    @Input() multilineMinRows = 2;
    @Input() multilineMaxRows = 2;
    @Input() styleType: 'common' | 'inline' | 'empty' | 'readonly' = 'common';
    /**
     * @deprecated should not use
     */
    @Input() floatLabel: 'always' | 'auto' = 'auto';
    @Input() controlsToValidate: (FormControl | FormGroup | FormArray | AbstractControl)[];
    @Input() validate: boolean | null;
    @Input() isPassword = false;
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';
    @Input() border = false;
    @Input() enableAddButton = false;
    //@ts-ignore
    @Input() coppyButtonValue: string = null;
    //@ts-ignore
    @Input() urlButtonValue: string = null;
    @Input() min: number;
    @Input() max: number;

    @HostBinding('class.exg-textbox-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-textbox-style-inline') exgStyleTypeInline: boolean;
    @HostBinding('class.exg-textbox-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-textbox-style-readonly') exgStyleTypeReadonly: boolean;

    @Output() readonly valueChange = new EventEmitter<string>();
    @Output() readonly inputBlur = new EventEmitter<void>();
    @Output() readonly keydownEnter = new EventEmitter<void>();
    @Output() readonly addBtnClick = new EventEmitter<void>();

    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    public focused: boolean;
    public hovered: boolean;
    public mask?: any;

    //@ts-ignore
    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    public ngOnInit() {
        this.applyHostClasses();
        if (this.autoFocus) {
            this.focus();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        //@ts-ignore
        if (changes.inputType) {
            this.inputType = this.inputType || 'text';
        }
        //@ts-ignore
        if (changes.autocomplete) {
            this.autocomplete = this.autocomplete || 'off';
        }
        //@ts-ignore
        if (changes.styleType || changes.ngClass || changes.floatLabel || changes.placeholder) {
            this.applyHostClasses();
        }
        //@ts-ignore
        if (changes.inputMask) {
            this.inputMask.radixChar = this.inputMask.radixChar || (',');
            const imask = ExgInputMask.createInputMask(this.inputMask);
            this.mask = imask ? imask.maskOptions : null;
        }
        //@ts-ignore
        if (changes.inputMask || changes.inputType) {
            if (this.inputMask) {
                if (this.inputType !== 'text') {
                    this.inputType = 'text';
                    console.log('Textbox input type reset to "text" since it is conflicts with mask properties! Please, remove wrong property assignment.');
                }
            }
        }
    }

    public writeValue(value: string) {
        this.value = value === null || value === undefined ? '' : `${value}`;
        this.changeDetectorRef.markForCheck();
    }
//@ts-ignore
    public registerOnChange(fn) {
        this.propagateChange = fn;
    }
//@ts-ignore
    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }

    public onValueChange(model: string) {
        if (this.propagateChange) {
            this.propagateChange(model);
        }
        this.valueChange.emit(model);
    }

    public add(value: number) {
        let newValue = +this.value + value;
        if (newValue < this.min) {
            newValue = this.min;
        }
        if (newValue > this.max) {
            newValue = this.max;
        }

        this.writeValue(`${newValue}`);
        this.onValueChange(`${newValue}`);
    }

    public onBlur() {
        this.inputBlur.emit();
        if (this.propagateTouch) {
            this.propagateTouch();
        }
    }

    public focus() {
        setTimeout(() => this.input.nativeElement.focus(), 0);
    }

    public onKeydownEnter() {
        setTimeout(() => this.keydownEnter.emit(), 0);
    }

    public onAddBtnClick() {
        this.addBtnClick.emit();
    }

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeInline = this.styleType === 'inline';
        this.exgStyleTypeEmpty = this.styleType === 'empty';
        this.exgStyleTypeReadonly = this.styleType === 'readonly';
        this.appearance =  this.styleType === 'common' || !this.styleType ? 'outline' : 'fill';
    }
}
