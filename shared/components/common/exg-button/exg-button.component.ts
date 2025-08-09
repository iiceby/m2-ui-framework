import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'exg-button',
    templateUrl: './exg-button.component.html',
    styleUrls: ['./exg-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgButtonComponent implements OnInit, OnChanges {

    @Input() disabled: boolean;
    @Input() tabindex: number;
    @Input() id: string;
    @Input() type: 'button' | 'submit' = 'button';
    @Input() placeholder: string;
    @Input() styleType: 'common' | 'outlined' | 'texted' | 'flat' | 'icon' | 'fab' | 'link' | 'custom' = 'common';
    @Input() color: 'common' | 'primary' | 'accent' | 'warn' = 'common';
    @Input() excludePadding: boolean;

    @HostBinding('style.width') @Input() width: string;
    @HostBinding('style.height') @Input() height: string;

    @HostBinding('class.exg-button-style-common') exgStyleTypeCommon: boolean;
    @HostBinding('class.exg-button-style-outlined') exgStyleTypeOutlined: boolean;
    @HostBinding('class.exg-button-style-texted') exgStyleTypeTexted: boolean;
    @HostBinding('class.exg-button-style-flat') exgStyleTypeFlat: boolean;
    @HostBinding('class.exg-button-style-icon') exgStyleTypeIcon: boolean;
    @HostBinding('class.exg-button-style-fab') exgStyleTypeFab: boolean;
    @HostBinding('class.exg-button-style-link') exgStyleTypeLink: boolean;
    @HostBinding('class.exg-button-style-custom') exgStyleTypeCustom: boolean;
    @HostBinding('class.exg-button-disabled') exgDisabled: boolean;

    @Output() readonly btnClick = new EventEmitter();

    public ngOnInit() {
        this.applyHostClasses();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.styleType || changes.disabled) {
            this.applyHostClasses();
        }
    }

    public onClick() {
        this.btnClick.emit();
    }

    private applyHostClasses() {
        this.exgStyleTypeCommon = this.styleType === 'common' || !this.styleType;
        this.exgStyleTypeOutlined = this.styleType === 'outlined';
        this.exgStyleTypeTexted = this.styleType === 'texted';
        this.exgStyleTypeFlat = this.styleType === 'flat';
        this.exgStyleTypeIcon = this.styleType === 'icon';
        this.exgStyleTypeFab = this.styleType === 'fab';
        this.exgStyleTypeLink = this.styleType === 'link';
        this.exgStyleTypeCustom = this.styleType === 'custom';
        this.exgDisabled = this.disabled;
    }
}
