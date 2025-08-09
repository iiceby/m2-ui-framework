import { TypeGuard } from '../../../../shared/models/common/type-guard.interface';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export class AuthResponseTypeGuard implements TypeGuard {
    public isValid(value: AuthResponse) {
        return !!value.accessToken &&
            typeof value.accessToken === 'string' &&
            value.accessToken.length > 200;
    }
}
