import { ExgDialogButton } from './exg-dialog-button.model';

export class DialogServiceParams {
    public message?: string;
    public title?: string;
    public description?: string;
    public width?: string;
    public height?: string;
    public customButton?: ExgDialogButton;

    public static forInfo(): DialogServiceParams {
        return {
            message: 'Information'
        };
    }

    public static forError(): DialogServiceParams {
        return {
            message: 'Error'
        };
    }

    public static forConfirmDelete(): DialogServiceParams {
        return {
            message: 'Delete',
            width: '35rem',
            description: 'Are you sure you want to delete this?'
        };
    }
}

export class DialogServiceConfirmParams extends DialogServiceParams {
    public customButtons?: ExgDialogButton[];
}
