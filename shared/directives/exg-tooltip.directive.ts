import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';


@Directive({
    selector: '[exgTooltip]',
    providers: [MatTooltip]
})
export class ExgTooltipDirective {
    @Input('exgTooltip') tooltipMessage: string;
    @Input() tooltipClass: string;
    @Input() tooltipPosition: 'left' | 'right' | 'above' | 'below' | 'before' | 'after' = 'above';

    constructor(private elementRef: ElementRef, private tooltip: MatTooltip) {}

    @HostListener('mouseover') mouseover() {
            this.tooltip.message = this.tooltipMessage;
            this.tooltip.tooltipClass = this.tooltipClass;
            this.tooltip.position = this.tooltipPosition;
            this.tooltip.show();
    }
    @HostListener('mouseleave') mouseleave() {
            this.tooltip.hide();
    }
}
