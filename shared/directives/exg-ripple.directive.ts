import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

import { PlatformService } from '../services/common/platform.service';

@Component({
    selector: '[exgRipple]',
    template: '<ng-content></ng-content>',
    styles: [`
        @keyframes exgRippleAnimation {
            from {
                opacity: 0.5;
                transform: scale(0.5);
            }
            to {
                opacity: 0;
                transform: scale(3.5);
            }
        }
    `],
    host: {
        '[style.position]': '"relative"',
        '[style.overflow]': '"hidden"'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgRippleDirective implements OnInit { // technically it is Component, but used as Directive

    @Input() exgRipple: boolean | string;

    private timerId: number;
    private rippleContainer: HTMLDivElement;

    constructor(private elementRef: ElementRef, private platformService: PlatformService) { }

    @HostListener('mousedown', ['$event']) onMousedown(e: any) {
        if (this.platformService.isBrowserPlatform()) {
            this.showRipple(e);
        }
    }

    @HostListener('mouseup') onMouseup() {
        if (this.platformService.isBrowserPlatform()) {
            clearTimeout(this.timerId);
            this.timerId = <any>setTimeout(() => this.cleanUp(), 2000);
        }
    }

    public ngOnInit() {
        if (this.platformService.isBrowserPlatform()) {
            const element = this.elementRef.nativeElement;
            this.rippleContainer = document.createElement('div');

            const style = 'position: absolute; top: 0; right: 0; bottom: 0; left: 0;';
            this.rippleContainer.setAttribute('style', style);

            element.appendChild(this.rippleContainer);
        }
    }

    private showRipple(e: any) {
        const element = this.elementRef.nativeElement;
        const size = element.offsetWidth;
        const pos = element.getBoundingClientRect();
        const x = e.clientX - pos.left - (size / 2);
        const y = e.clientY - pos.top - (size / 2);
        const bg = getComputedStyle(element).backgroundColor === 'rgba(0, 0, 0, 0)' ? 'rgba(255, 255, 255, 1)' : getComputedStyle(element).backgroundColor;
        const style = `
top: ${y}px;
left: ${x}px;
height: ${size}px;
width: ${size}px;
background-color: ${bg};
filter: brightness(70%);
transform: scale(0);
border-radius: 100%;
position: absolute;
animation: exgRippleAnimation 800ms;`;

        const rippler = document.createElement('span');
        rippler.setAttribute('style', style);

        this.rippleContainer.appendChild(rippler);
    }

    private cleanUp() {
        for (let safeCounter = 0; this.rippleContainer.firstChild && safeCounter < 100; safeCounter++) {
            this.rippleContainer.removeChild(this.rippleContainer.firstChild);
        }
    }
}
