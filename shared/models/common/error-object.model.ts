export class ErrorObject {
    constructor(public message: string, public statusCode?: number, public innerErrors?: ErrorObject[], public apiErrorCode?: number) {
        this.innerErrors = innerErrors || [];
        this.message = (message || '').trim();
        this.statusCode = statusCode || 0;

        if (!this.message) {
            // auto create error message
            this.message = this.innerErrors.map(e => e.message).filter(e => !!e).join(' / ') || 'An error has occurred.';
        }
        if (!this.statusCode) {
            // take code from first error
            this.statusCode = this.innerErrors[0] ? this.innerErrors[0].statusCode : 0;
        }
    }

    public toString = (): string => this.message;
}

export enum ErrorCodes {
    EmailConfirmCodeInvalid = 35
}
