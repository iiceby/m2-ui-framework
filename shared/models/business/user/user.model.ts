import { ExgCultureEnum } from '../../../../shared/models/common/exg-culture.model';
import { TypeGuard } from '../../../../shared/models/common/type-guard.interface';

import { ProfileVerificationStatus } from './profile-verification-status.enum';
import { Sex } from './sex.enum';
import { Group } from './user-group.enum';

interface UserBase {
    firstName: string;
    lastName: string;
    middleName?: string;
    birthday?: number;
    sex?: Sex;
    culture?: ExgCultureEnum;
    timeZoneId?: string;
    messenger?: string;
    description?: string;
    phone?: string;
    countryCode?: string;
    placeId?: string;
    isFillingCompleteds?: boolean;
    verificationStatus?: ProfileVerificationStatus;
}

export interface UserUpdateRequest extends UserBase {
    uid?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthday?: number;
    sex?: Sex;
    description?: string;
    avatarImg?: string;
    avatarCroppedImg?: string;
    phone?: string;
    timeZoneId?: string;
}

export interface User extends UserBase {
    uid: string;
    publicCode?: string;
    email: string;
    avatarUrl?: string;
    avatarCroppedUrl?: string;
    isEmailConfirmed: boolean;
    isPhoneConfirmed: boolean;
    backgroundUrl: string;
    backgroundCroppedUrl: string;
    groups?: Group[];
    createDate: number;
    updateDate?: number;
    timeZoneId?: string;
    jobPosition?: string;
    internalNumber?: string;
    isFired?: boolean;
    pinCode?: string;
}

export class UserUpdateEmail {
    email: string;
    password: string;
}

export class UserUpdateSettings {
    culture?: ExgCultureEnum;
    jobPosition?: string;
    internalNumber?: string;
    isFired?: boolean;
}

export class UserGroupsUpdateRequest {
    groups: Group[];
}

export class UserPincodeUpdateRequest {
    pinCode: string;
}

export class UserTypeGuard implements TypeGuard {
    public isValid(value: User) {
        return typeof value.uid === 'string';
    }
}

export class UserTypeDataGuard implements TypeGuard {
    public isValid(value: { data: User }) {
        return value.data && typeof value.data.uid === 'string';
    }
}

export class UserListItem {
    public uid: string;
    public userUid: string;
    public firstName: string;
    public lastName: string;
    public fullName: string;
    public email: string;
    public phone: string;
    public isFired: boolean;
    public createDate: number;
    public updateDate: number;
}
