import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[exgFileDrop]',
})
export class ExgFileDropDirective {
    @Output() readonly fileDropped = new EventEmitter<any>();
    //@ts-ignore
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    //@ts-ignore
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    //@ts-ignore
    @HostListener('drop', ['$event']) public ondrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const files = evt.dataTransfer.files;

        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}
