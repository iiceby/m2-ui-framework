import { ErrorObject } from '../../models/common/error-object.model';

export class LogoutAction {
    static readonly type = '[Header] Logout';
}

export class LogoutSuccessAction {
    static readonly type = '[Auth API] Logout Success';
}

export class LogoutFailAction {
    static readonly type = '[Auth API] Logout Fail';

    constructor(public payload: ErrorObject) { }
}
