import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Page } from '@nativescript/core';
import { filter, takeUntil } from 'rxjs/operators';

import { UiDispatchers } from '../../../../shared/store/ui/ui.dispatchers';
import { UiSelectors } from '../../../../shared/store/ui/ui.selectors';

import { ExgOnDestroy } from '../../abstract/exg-on-destroy.component';

import { DialogsConfig } from '../../dialogs/dialogs.enum';

@Component({
    selector: 'exg-dialog-wrapper',
    templateUrl: './exg-dialog-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDialogWrapperComponent extends ExgOnDestroy {

    public dialogsConfig = DialogsConfig;
    public componentData: any;

    constructor(private uiSelectors: UiSelectors, private uiDispatchers: UiDispatchers, private changere: ChangeDetectorRef, private page: Page) {
        super();
        this.init(this.page);
        this.uiSelectors.componentData$.pipe(takeUntil(this.unsubscribe), filter(x => !!x)).subscribe((res) => {
            setTimeout(() => {
                this.componentData = res;
                this.changere.markForCheck();
            }, 0);
        });
    }

    public onCloseDialog($event) {
        this.uiDispatchers.dispatchCloseDialog($event);
    }

    protected afterDestroy() { /** no need */ }
}
