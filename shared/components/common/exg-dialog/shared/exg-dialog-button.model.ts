import { DialogResult } from './dialog-result.model';

export class ExgDialogButton {
    public dialogResult?: DialogResult;
    public text?: string;
    public color?: 'common' | 'primary' | 'accent' | 'warn';
    public styleType?: 'common' | 'outlined' | 'texted' | 'flat' | 'icon' | 'fab' | 'link' | 'custom';
    public data?: any;
}
