import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ToolbarAction } from '../../models/toolbar-action.enum';

import { Utils } from '../../../shared/utils/utils';

@Component({
    selector: 'exg-draw-toolbar',
    templateUrl: './exg-draw-toolbar.component.html',
    styleUrls: ['./exg-draw-toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDrawToolbarComponent implements OnChanges {

    @Input() drawState: ToolbarAction;

    @Input() undoEnabled: boolean;
    @Input() redoEnabled: boolean;

    @Output() readonly actionChanged = new EventEmitter<ToolbarAction>();
    @Output() readonly backClick = new EventEmitter();

    public tooltipActionEnum = ToolbarAction;
    public tooltipActions = Utils.enumToSelectData(ToolbarAction);

    public disabled = {
        [ToolbarAction.Undo]: false,
        [ToolbarAction.Redo]: false,
        [ToolbarAction.Point]: false,
        [ToolbarAction.Add]: false,
    };

    public tooltipsConfig: any = {
        [ToolbarAction.Add]: 'Create Outline',
        [ToolbarAction.Point]: 'Edit Outline'
    };

    public iconsConfig = {
        [ToolbarAction.Undo]: 'back-navigation',
        [ToolbarAction.Redo]: 'prev-navigation',
        [ToolbarAction.Point]: 'cursor',
        [ToolbarAction.Add]: 'add1'
    };

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.drawState) {
            switch (this.drawState) {
                case ToolbarAction.Point:
                    this.disabled[ToolbarAction.Add] = true;
                    break;
                case ToolbarAction.Add:
                    this.disabled[ToolbarAction.Point] = true;
                    break;
                default:
                    this.disabled[ToolbarAction.Undo] = true;
                    this.disabled[ToolbarAction.Redo] = true;
                    this.disabled[ToolbarAction.Add] = false;
                    this.disabled[ToolbarAction.Point] = false;
            }
        }

        if (changes.undoEnabled) {
            this.disabled[ToolbarAction.Undo] = !this.undoEnabled;
        }

        if (changes.redoEnabled) {
            this.disabled[ToolbarAction.Redo] = !this.redoEnabled;
        }
    }

    public onClickAction($event: ToolbarAction) {
        this.actionChanged.emit($event);
    }

    public onBackClick() {
        this.backClick.emit();
    }
}
