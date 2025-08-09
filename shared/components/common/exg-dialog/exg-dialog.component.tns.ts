import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { UiDispatchers } from '../../../store/ui/ui.dispatchers';
import { UiSelectors } from '../../../store/ui/ui.selectors';

import { ExgDialogButton } from './shared/exg-dialog-button.model';
import { ExgDialogMode } from './shared/exg-dialog-mode.model';
import { ExgDialogResultEvent } from './shared/exg-dialog-result-event.model';

@Component({
    selector: 'exg-dialog',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDialogComponent implements OnChanges, OnDestroy {

    @Input() showDialog: boolean;
    @Input() title: string;
    @Input() message: string;
    @Input() description: string;
    @Input() width: string;
    @Input() height: string;
    @Input() disableClose: boolean;
    @Input() dialogMode: ExgDialogMode;
    @Input() allowScrollUnderDialog: boolean;
    @Input() hideBackdrop: boolean;
    @Input() dialogPosition: { top?: string; bottom?: string; left?: string; right?: string; };
    @Input() customButtons: ExgDialogButton[];
    @Input() componentData: { component: any, key?: any, inputs: any };
    @Input() mobileFullScreen: boolean;
    @Input() hideBackground: boolean;

    @Output() readonly dialogClose = new EventEmitter<ExgDialogResultEvent>();

    private unsubscribe$ = new Subject();

    constructor(private uiSelectors: UiSelectors, private uiDispatchers: UiDispatchers) {
        this.uiSelectors.closeDialog$.pipe(takeUntil(this.unsubscribe$), filter(x => !!x)).subscribe((x) => {
            this.dialogClose.emit(x);
            this.uiDispatchers.dispatchDialogReset();
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.showDialog) {
            if (!!this.showDialog && !!this.componentData && (!!this.componentData.component || !!this.componentData.key)) {
                this.uiDispatchers.dispatchOpenDialog(this.showDialog, this.componentData);
            }
        }
    }

    public ngOnDestroy() {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }
}
