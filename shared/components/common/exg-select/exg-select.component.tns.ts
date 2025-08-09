import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DialogsConfig } from '../../dialogs/dialogs.enum';
import { ExgDialogMode } from '../exg-dialog/shared/exg-dialog-mode.model';

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
export class ExgSelectComponent implements ControlValueAccessor, OnChanges {

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
    @Input() rowHeight = '48';
    @Input() isLinePicker: boolean;

    @Input() controlsToValidate: (FormControl | FormGroup | FormArray)[];
    @Input() validate: boolean;

    @Input() selectValueFunction: (item: any) => string | number;
    @Input() displayValueFunction: (item: any) => string;
    @Input() displayValueTemplate: TemplateRef<any>;

    @Output() readonly valueChange = new EventEmitter<any | any[]>();

    public internalData: { originalValue: any, displayValue: string }[];
    public focused: boolean;
    public hovered: boolean;

    public dialogMode = ExgDialogMode;
    public componentData = {};
    public showDialog: boolean;

    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    public get selectedDisplayValue(): string {
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

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            this.prepareInternalData();
            const inputs = {
                data: this.internalData,
                placeholder: this.placeholder,
                selectValueFunction: this.selectValueFunction,
                displayValueFunction: this.displayValueFunction,
                displayValueTemplate: this.displayValueTemplate
            };

            this.componentData = { component: {}, key: DialogsConfig.ExgSelect, inputs };
        }
    }

    public openDialog() {
        this.focused = true;
        this.showDialog = true;
    }

    public onDialogClose($event) {
        this.showDialog = false;
        this.onSelectionChange($event.dataFromComponent.data);
        this.writeValue($event.dataFromComponent.data);
    }

    public onOpenedChange(opened: boolean) {
        if (!opened) {
            if (this.propagateTouch) {
                this.propagateTouch();
            }
        }
    }

    public onSelectionChange(event: any) {
        if (this.propagateChange) {
            this.propagateChange(event);
        }

        this.valueChange.emit(event);
    }

    public writeValue(value: any | any[]) {
        this.value = value;
        this.changeDetectorRef.detectChanges();
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }

    public compareFn = (a, b): boolean => {
        if (!a || !b) return false;
        if (this.selectValueFunction) {
            return this.selectValueFunction(a) === this.selectValueFunction(b);
        }
        if (a.id === undefined && b.id === undefined) {
            return a === b;
        }
        return a.id === b.id || a === b;
    }

    public getDisplayValue(value: any): string {
        if (!value) return;

        if (this.displayValueFunction) {
            return this.displayValueFunction(value);
        }

        return value.text || value.name || value;
    }

    private prepareInternalData() {
        if (!this.data || this.isEmpty(this.data[0])) {
            this.internalData = null;
            return;
        }
        this.internalData = this.data.map(value => ({ originalValue: value, displayValue: this.getDisplayValue(value) }));
    }

    private isEmpty(value: string | number): boolean {
        return value === null || value === undefined;
    }
}
