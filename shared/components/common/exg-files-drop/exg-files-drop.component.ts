import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

export enum FileType {
    All = 0,
    Images = 1
}

@Component({
    selector: 'exg-files-drop',
    templateUrl: './exg-files-drop.component.html',
    styleUrls: ['./exg-files-drop.component.scss']
})
export class ExgFilesDropComponent implements OnChanges, OnInit {

    @Input() fileType: FileType = FileType.All;

    @Output() readonly uploadedFiles = new EventEmitter<any[]>();

    public assept = '';
    public mimeTypes: string[] = [];
    private anyFileType = false;

    ngOnInit() {
        this.setAcceptTypes(this.fileType);
    }

    ngOnChanges(changes: SimpleChanges): void {
            //@ts-ignore
        if (changes.fileType && this.fileType) {
            this.setAcceptTypes(this.fileType);
        }
    }

    public async uploadFileByInput(event: EventTarget) {
            //@ts-ignore
        this.uploadFile((<HTMLInputElement>event).files);
    }

    public async uploadFile(event: FileList) {
        const files = [];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            if (this.anyFileType || this.mimeTypes.some(type => type === element.type)) {
                files.push(element);
            }
        }

        this.uploadedFiles.emit(files);
    }

    private setAcceptTypes(fileType: FileType) {
        if (fileType === FileType.All) {
            this.anyFileType = true;
            return;
        }

        this.anyFileType = false;
        const types = { accepts: '*', mimeTypes: [] };
        this.assept = types.accepts;
        this.mimeTypes = types.mimeTypes;
    }
}
