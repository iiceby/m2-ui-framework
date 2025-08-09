import { ProfileVerificationStatus } from './profile-verification-status.enum';
import { Sex } from './sex.enum';

export class UserVerificationDetails {
    firstName: string;
    lastName: string;
    middleName: string;
    birthday?: number;
    sex?: Sex;
    countryCode: string;
    countryName?: string;
    regionCode: string;
    regionName?: string;
    placeId: string;
    placeName?: string;
    addressId?: string;
    street?: string;
    building?: string;
    appartment?: string;
    block?: string;
    verificationStatus?: ProfileVerificationStatus;
    verificationRejectReason: string;
    residenceCountryCode?: string;
    residenceCountryName?: string;
    residenceRegionCode?: string;
    residenceRegionName?: string;
    residencePlaceId?: string;
    residencePlaceName?: string;
    residenceAddressId?: string;
    residenceStreet?: string;
    residenceBuilding?: string;
    residenceBlock?: string;
    residenceAppartment?: string;
}

export class UpdateUserForVerificationRequest {
    firstName: string;
    lastName: string;
    middleName: string;
    birthday?: number;
    sex?: Sex;
    placeId: string;
    addressId?: string;
    street?: string;
    building?: string;
    appartment?: string;
    block?: string;
    verificationStatus?: ProfileVerificationStatus;
    residencePlaceId?: string;
    residenceAddressId?: string;
    residenceStreet?: string;
    residenceBuilding?: string;
    residenceBlock?: string;
    residenceAppartment?: string;
}
