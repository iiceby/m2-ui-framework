// tslint:disable:no-namespace
import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { ExgCultureEnum } from '../../../shared/models/common/exg-culture.model';
import { PhoneCode } from '../../../shared/models/business/phone-code.model';

export namespace PhoneCodesAction {
    export class FromContactPage {
        static readonly type = '[Contacts Page] GetPhoneCodes';

        constructor(public payload: { culture: ExgCultureEnum }) { }
    }

    export class FromRegistrationPage {
        static readonly type = '[Registration Page] GetPhoneCodes';

        constructor(public payload: { culture: ExgCultureEnum }) { }
    }

    export type PhoneCodesActionsUnion = FromContactPage | FromRegistrationPage;
}

export class PhoneCodesSuccessAction {
    static readonly type = '[PhoneCodes API] GetPhoneCodes Success';

    constructor(public payload: PhoneCode[]) { }
}

export class PhoneCodesFailAction {
    static readonly type = '[PhoneCodes API] GetPhoneCodes Fail';

    constructor(public payload: ErrorObject) { }
}

export class PhoneCodesResetAction {
    static readonly type = '[Contacts Page] GetPhoneCodes Reset';
}
