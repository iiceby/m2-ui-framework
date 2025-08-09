import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { SnackbarType } from './snackbar-type.model';

@Component({
    templateUrl: './exg-snackbar-service.component.html',
    styleUrls: ['./exg-snackbar-service.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgSnackbarServiceComponent {

    public message: string;
    public class: string;
    public iconName: string;

    constructor(@Inject(MAT_SNACK_BAR_DATA) private matDialogData: any) {
        this.message = `${this.matDialogData.message}`;
        this.class = `snackbar-text-style-${SnackbarType[this.matDialogData.snackbarType]}`;
        this.iconName = this.getIconNameByType(this.matDialogData.snackbarType);
    }

    private getIconNameByType(iconType: SnackbarType): string {
        switch (iconType) {
            case SnackbarType.Ok:
                return 'complete';
            case SnackbarType.Warning:
                return 'warning';
            case SnackbarType.Error:
                return 'inforound';
            case SnackbarType.Delete:
                return 'remove';
            default:
                //@ts-ignore
                return null;
        }
    }
}
