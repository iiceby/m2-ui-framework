import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[exgDisableCopyPaste]'
})
export class DisableCopyPasteDirective {
    @HostListener('paste', ['$event']) blockPaste(e: any) {
        e.preventDefault();
    }

    @HostListener('copy', ['$event']) blockCopy(e: any) {
        e.preventDefault();
    }

    @HostListener('cut', ['$event']) blockCut(e: any) {
        e.preventDefault();
    }

    @HostListener('drop', ['$event']) blockDrop(e: any) {
        e.preventDefault();
    }
}
