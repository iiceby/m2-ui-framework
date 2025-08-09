export interface ChangePasswordRequest {
    userUid: string;
    newPassword: string;
    oldPassword: string;
}
