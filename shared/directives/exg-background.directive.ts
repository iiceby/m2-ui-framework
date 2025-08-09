import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[exgBackground]'
})
export class ExgBackgroundDirective implements OnChanges {

    @Input('exgBackground') url: boolean;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    public ngOnChanges(_: SimpleChanges) {
        this.setState();
    }

    private setState() {
        const elem = this.el.nativeElement;
        this.renderer.setStyle(elem, 'background-image', `url(${this.url})`);
    }
}
