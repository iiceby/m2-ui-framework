import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[exgDisabled]'
})
export class ExgDisabledDirective implements OnChanges {

    @Input('exgDisabled') disabled: boolean;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    public ngOnChanges(_: SimpleChanges) {
        this.setState();
    }

    private setState() {
        const elem = this.el.nativeElement;
        if (this.disabled) {
            if (elem.classList && elem.classList.contains('exg-disabled')) return;
            this.renderer.addClass(elem, 'exg-disabled');
            elem.disabled = true;
        } else {
            if (!elem.classList || !elem.classList.contains('exg-disabled')) return;
            this.renderer.removeClass(elem, 'exg-disabled');
            elem.disabled = false;
        }
    }
}
