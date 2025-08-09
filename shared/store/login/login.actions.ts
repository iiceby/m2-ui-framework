import { AuthRequest } from '../../models/business/auth/auth-request.model';
import { ErrorObject } from '../../models/common/error-object.model';

export class LoginAction {
    static readonly type = '[Login Page] Login';

    constructor(public payload: AuthRequest) { }
}

export class LoginSuccessAction {
    static readonly type = '[Auth API] Login Success';
}

export class LoginFailAction {
    static readonly type = '[Auth API] Login Fail';

    constructor(public payload: ErrorObject) { }
}

export class LoginResetAction {
    static readonly type = '[Login Page] Login Reset';
}
