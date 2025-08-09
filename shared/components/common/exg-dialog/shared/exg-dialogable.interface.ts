import { ExgDialogButton } from './exg-dialog-button.model';
import { ExgDialogResultEvent } from './exg-dialog-result-event.model';

/**
 * Interface, that should be implemented by components rendered inside dialog
 */
export interface IExgDialogable {
    /**
     * This method will be called on dialog standard button click.
     */
    exgDialogClose(event: ExgDialogButton): any;

    /**
     * Register function, that can be called inside component to initiate dialog close event.
     */
    registerOnDialogClose(fn: (_: ExgDialogResultEvent) => void): void;
}
