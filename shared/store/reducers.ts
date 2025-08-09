import { AutocompleteState } from './autocomplete/autocomplete.reducer';
import { ChangePasswordState } from './password/change-password.reducer';
import { LoginState } from './login/login.reducer';
import { LogoutState } from './logout/logout.reducer';
import { MobileErrorsState } from './ui/mobile-errors.reducer';
import { PhoneCodesState } from './phone-codes/phone-codes.reducer';
import { ProfileUpdateState } from './profile/profile-update.reducer';
import { ProfileState } from './profile/profile.reducer';
import { RegistrationState } from './registration/registration.reducer';
import { ResetPasswordState } from './password/reset-password.reducer';
import { UiState } from './ui/ui.reducer';

export const states = [
    AutocompleteState,
    LoginState,
    LogoutState,
    ChangePasswordState,
    ResetPasswordState,
    PhoneCodesState,
    ProfileState,
    ProfileUpdateState,
    RegistrationState,
    UiState,
    MobileErrorsState
];
