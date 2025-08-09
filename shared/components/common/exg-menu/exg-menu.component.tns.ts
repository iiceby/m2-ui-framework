import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Page } from '@nativescript/core';
import { Menu } from 'nativescript-menu';

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgMenuComponent {

    @Input() items: string[] | IMenuItem[];

    @Output() readonly menuItemClick = new EventEmitter<any>();

    @ViewChild('menu') menu: ElementRef<HTMLDivElement>;

    public menuActive: boolean;

    constructor(private page: Page) { }

    public trackByItem(index: number, item: any): string | number {
        if (item) {
            return item.uid || item.id || item.name || item.text || item || index;
        }
        return index;
    }

    public onShowMenuClick(_: any) {
        Menu.popup({
            view: this.page.getViewById('menuBtn'),
            actions: this.items
        })
        .then((action) => {
            this.menuItemClick.emit(action);
        })
        .catch(err => console.error(err));
    }
}
