import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[exgHover]'
})
export class ExgHoverDirective {

    @Input('exgHover') brightness: number | string = 90;

    private originalColor: string;
    private realColor: string;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    @HostListener('mouseover') onMouseover() {
        this.calcBackgroundColor();
        this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', this.realColor);
        this.renderer.setStyle(this.elementRef.nativeElement, 'filter', `brightness(${this.brightness || 90}%)`);
    }

    @HostListener('mouseout') onMouseout() {
        const currentColor = this.elementRef.nativeElement.style.backgroundColor;
        if (!this.originalColor || this.originalColor === currentColor) {
            this.renderer.removeStyle(this.elementRef.nativeElement, 'background-color');
        }
        this.renderer.setStyle(this.elementRef.nativeElement, 'filter', 'brightness(100%)');
    }

    private calcBackgroundColor() {
        let elem = this.elementRef.nativeElement;
        this.originalColor = elem.style.backgroundColor;
        for (let safeCounter = 0; elem && safeCounter < 100; safeCounter++) {
            this.realColor = getComputedStyle(elem).backgroundColor;
            elem = elem.parentElement;
            if (this.realColor !== 'rgba(0, 0, 0, 0)') {
                break;
            }
        }
    }
}
