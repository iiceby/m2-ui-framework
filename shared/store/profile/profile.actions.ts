import { ErrorObject } from '../../models/common/error-object.model';
import { Profile } from '../../models/business/user/profile.model';

export class ProfileFromAuthGuardAction {
    static readonly type = '[Auth Guard] GetProfile';

    constructor(public payload: { userUid: string }) { }
}

export class ProfileFromHeaderComponentAction {
    static readonly type = '[Header Component] GetProfile';

    constructor(public payload: { userUid: string }) { }
}

export class ProfileFrom404PageAction {
    static readonly type = '[Header Component] GetProfile';

    constructor(public payload: { userUid: string }) { }
}

export class ProfileSuccessAction {
    static readonly type = '[Profile API] GetProfile Success';

    constructor(public payload: Profile) { }
}

export class ProfileFailAction {
    static readonly type = '[Profile API] GetProfile Fail';

    constructor(public payload: ErrorObject) { }
}

export class UserNameUpdateAction {
    static readonly type = '[Header Component] UpdateUserName';

    constructor(public payload: { firstName: string, lastName: string }) { }
}
