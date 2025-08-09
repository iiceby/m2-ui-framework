import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { RegistrationLightRequest } from '../../models/business/auth/registration-request.model';
import { User } from '../../models/business/user/user.model';

export class RegistrationAction {
    static readonly type = '[Registration Page] Registration';

    constructor(public payload: RegistrationLightRequest) { }
}

export class RegistrationSuccessAction {
    static readonly type = '[Auth API] Registration Success';

    constructor(public payload: User) { }
}

export class RegistrationFailAction {
    static readonly type = '[Auth API] Registration Fail';

    constructor(public payload: ErrorObject) { }
}

export class RegistrationResetAction {
    static readonly type = '[Registration Page] Registration Reset';
}
