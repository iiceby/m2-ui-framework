import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { Profile, ProfileUpdateRequest } from '../../models/business/user/profile.model';

export class ProfileUpdateAction {
    static readonly type = '[Contact Info Page] UpdateProfile';

    constructor(public payload: ProfileUpdateRequest) { }
}

export class ProfileUpdateSuccessAction {
    static readonly type = '[Profile API] UpdateProfile Success';

    constructor(public payload: Profile) { }
}

export class ProfileUpdateFailAction {
    static readonly type = '[Profile API] UpdateProfile Fail';

    constructor(public payload: ErrorObject) { }
}

export class ProfileUpdateResetAction {
    static readonly type = '[Contact Info Page] UpdateProfile Reset';
}

export class ProfileWelcomeDisplayedUpdateAction {
    static readonly type = '[Map Page] UpdateProfile_WelcomeDisplayed';

    constructor(public payload: { welcomeDisplayed: boolean }) { }
}
