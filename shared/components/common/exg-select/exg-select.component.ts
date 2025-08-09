import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'exg-select',
    templateUrl: './exg-select.component.html',
    styleUrls: ['./exg-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => ExgSelectComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgSelectComponent implements OnInit, ControlValueAccessor, OnChanges {

    @Input() data: any[];
    @Input() value: any | any[];
    @HostBinding('style.width') @Input() width: string;
    @Input() multiple: boolean;
    @Input() placeholder: string;
    @Input() required: boolean;
    @Input() disabled: boolean;
    @Input() readonly: boolean; // synonym for 'disabled' (use it to avoid browser warning when using in reactive forms)
    @Input() allowNull: boolean;
    @Input() emptyDisplayValue = '-';
    @Input() rowHeight = '4.8rem';
    @Input() isLinePicker: boolean;
    /**
     * @deprecated should not use
     */
    @Input() appearance: 'fill' | 'outline' = 'fill';
    @Input() styleType: 'common' | 'empty' | 'readonly' = 'common';

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean | null;

    @Input() selectValueFunction: (item: any) => string | number;
    @Input() displayValueFunction: (item: any) => string;
    @Input() displayValueTemplate: TemplateRef<any>;
    @Input() selectedDisplayFunction: (item: any | any[]) => string;
    @Input() selectedDisplayTemplate: TemplateRef<any>;
    @Input() panelWidth = 'auto';

    @Output() readonly valueChange = new EventEmitter<any | any[]>();

    @HostBinding('class.exg-select-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-select-style-empty') exgStyleTypeEmpty: boolean;
    @HostBinding('class.exg-select-style-readonly') exgStyleTypeReadonly: boolean;

    public internalData: { originalValue: any, displayValue: string }[];
    public focused: boolean;
    public hovered: boolean;

    //@ts-ignore
    private propagateChange: (_) => void;
    private propagateTouch: () => void;

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

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    public ngOnInit() {
        this.applyHostClasses();
    }

    public ngOnChanges(changes: SimpleChanges) {
        //@ts-ignore
        if (changes.data) {
            this.prepareInternalData();
        }
//@ts-ignore
        if (changes.styleType || changes.ngClass || changes.placeholder) {
            this.applyHostClasses();
        }
    }

    public onOpenedChange(opened: boolean) {
        if (!opened) {
            if (this.propagateTouch) {
                this.propagateTouch();
            }
        }
    }

    public onSelectionChange(event: MatSelectChange) {
        if (this.propagateChange) {
            this.propagateChange(event.value);
        }
        this.valueChange.emit(event.value);
    }

    public writeValue(value: any | any[]) {
        this.value = value;
        this.changeDetectorRef.detectChanges();
    }

    //@ts-ignore
    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    //@ts-ignore
    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }
    //@ts-ignore
    public compareFn = (a, b): boolean => {
        if (!a || !b) return false;
        if (this.selectValueFunction) {
            return this.selectValueFunction(a) === this.selectValueFunction(b);
        }

        if ((a.id === undefined && b.id === undefined) && (a.uid === undefined && b.uid === undefined)) {
            return a === b;
        }

        return (a.id !== undefined && b.id !== undefined && a.id === b.id) || (a.uid !== undefined && b.uid !== undefined && a.uid === b.uid) || a === b;
    }

    //@ts-ignore
    public trackByItem(index: number, _) {
        return index;
    }

    private prepareInternalData() {
        if (!this.data || this.isEmpty(this.data[0])) {
            //@ts-ignore
            this.internalData = null;
            return;
        }
        this.internalData = this.data.map(value => ({ originalValue: value, displayValue: this.getDisplayValue(value) }));
    }

    private getDisplayValue(value: any): string {
        if (this.displayValueFunction) {
            return this.displayValueFunction(value);
        }
        return value.text || value.name || value;
    }

    private isEmpty(value: string | number): boolean {
        return value === null || value === undefined;
    }

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeEmpty = this.styleType === 'empty';
        this.exgStyleTypeReadonly = this.styleType === 'readonly';
        this.appearance =  this.styleType === 'common' || !this.styleType ? 'outline' : 'fill';
    }
}
