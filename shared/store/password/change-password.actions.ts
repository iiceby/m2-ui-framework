import { ChangePasswordRequest } from '../../models/business/auth/change-password-request.model';
import { ErrorObject } from '../../../shared/models/common/error-object.model';

export class ChangePasswordAction {
    static readonly type = '[Security Page] ChangePassword';

    constructor(public payload: ChangePasswordRequest) { }
}

export class ChangePasswordSuccessAction {
    static readonly type = '[Auth API] ChangePassword Success';
}

export class ChangePasswordFailAction {
    static readonly type = '[Auth API] ChangePassword Fail';

    constructor(public payload: ErrorObject) { }
}

export class ChangePasswordResetAction {
    static readonly type = '[Security Page] ChangePassword Reset';
}
