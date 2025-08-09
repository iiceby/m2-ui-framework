import { DialogResult } from './dialog-result.model';

export class ExgDialogResultEvent {
    public dialogResult: DialogResult;
    public text?: string;
    public dataFromComponent?: any;
}
