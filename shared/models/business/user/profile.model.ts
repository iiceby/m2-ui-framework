import { User, UserUpdateRequest } from './user.model';

export interface Profile {
    user: User;
    userSettings?: any;
    welcomeDisplayed: boolean;
    permissions?: string[];
}

export class ProfileUpdateRequest {
    user: UserUpdateRequest;
    userSettings?: any;

    removeAvatar?: boolean;
}
