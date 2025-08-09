import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'exg-drop-menu',
    templateUrl: './exg-drop-menu.component.html',
    styleUrls: ['./exg-drop-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDropMenuComponent {
    @Input() active: boolean;
    @Input() width: string;

    @Output() readonly closeMenu = new EventEmitter();

    public onClick() {
        this.active = false;
        this.closeMenu.emit();
    }
}
