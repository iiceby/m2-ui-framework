import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'exg-icon',
    templateUrl: './exg-icon.component.html',
    styleUrls: ['./exg-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgIconComponent implements OnChanges {

    @Input() iconName: string;
    @Input() color: 'primary' | 'accent' | 'warn' | string | undefined;
    @Input() prefix: boolean;
    @Input() suffix: boolean;
    @Input() alt: string;

    @HostBinding('style.width') @Input() width: string;
    @HostBinding('style.height') @Input() height: string;

    @HostBinding('class.prefix') exgStylePrefix: boolean;
    @HostBinding('class.suffix') exgStyleSuffix: boolean;
    @HostBinding('class.primary') exgColorPrimary: boolean;
    @HostBinding('class.accent') exgColorAccent: boolean;
    @HostBinding('class.warn') exgColorWarn: boolean;

    public ngOnChanges(_: SimpleChanges) {
        this.applyHostClasses();
    }

    public getResourseByIconName() {
        return `~/assets/images/${this.iconName}${this.color ? '_' : ''}${this.color || ''}.png`;
    }

    private applyHostClasses() {
        this.exgStylePrefix = this.prefix;
        this.exgStyleSuffix = this.suffix;
        this.exgColorPrimary = this.color === 'primary';
        this.exgColorAccent = this.color === 'accent';
        this.exgColorWarn = this.color === 'warn';
    }
}
