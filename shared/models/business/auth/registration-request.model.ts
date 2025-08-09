import { ExgCultureEnum } from '../../../../shared/models/common/exg-culture.model';
import { Group } from '../user/user-group.enum';

export interface RegistrationRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    culture: ExgCultureEnum;
}

export interface RegistrationLightRequest {
    firstName: string;
    lastName: string;
    email: string;
    groups: Group[];
}
