import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { enterAnimation } from './exg-menu.animation';

export interface IMenuItem {
    icon?: string;
    name?: string;
    title?: string;
    uid?: string;
    id?: string;
    color?: 'common' | 'primary' | 'accent' | 'warn';
}

@Component({
    selector: 'exg-menu',
    templateUrl: './exg-menu.component.html',
    styleUrls: ['./exg-menu.component.scss'],
    animations: enterAnimation,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgMenuComponent {

    @Input() items: IMenuItem[];

    @Output() readonly menuItemClick = new EventEmitter<any>();

    @ViewChild('menu') menu: ElementRef<HTMLDivElement>;


    public trackByItem(index: number, item: any): number {
        if (item) {
            return item.uid || item.id || item.name || item.title || item || index;
        }
        return index;
    }

    public onItemClick(item: any) {
        this.menuItemClick.emit(item);
    }
}
