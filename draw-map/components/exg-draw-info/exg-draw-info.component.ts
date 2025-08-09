import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'exg-draw-info',
    templateUrl: './exg-draw-info.component.html',
    styleUrls: ['./exg-draw-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDrawInfoComponent {
    @Input() text: string;
}
