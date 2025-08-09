import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { ResetPasswordRequest } from '../../models/business/auth/reset-password-request.model';

export class ResetPasswordAction {
    static readonly type = '[Reset Password Page] ResetPassword';

    constructor(public payload: ResetPasswordRequest) { }
}

export class ResetPasswordSuccessAction {
    static readonly type = '[Auth API] ResetPassword Success';
}

export class ResetPasswordFailAction {
    static readonly type = '[Auth API] ResetPassword Fail';

    constructor(public payload: ErrorObject) { }
}

export class ResetPasswordResetAction {
    static readonly type = '[Reset Password Page] ResetPassword Reset';
}
