import { BaseModel } from '../base.model';

export interface PhoneCode extends BaseModel<string> {
    countryCode: string;
    phoneCode: string;
    name: string;
}
