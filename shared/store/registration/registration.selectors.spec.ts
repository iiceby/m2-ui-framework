import { waitForAsync } from '@angular/core/testing';

import { RegistrationSelectors } from './registration.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { RegistrationStateModel } from './registration.reducer';

describe('Registration selectors tests', () => {
    const error = new ErrorObject('test');

    it('should select pending registrationState', waitForAsync(() => {
        const resetPasswordState: RegistrationStateModel = { pending: true, registered: false, error: null };

        expect(RegistrationSelectors.getPending(resetPasswordState)).toBe(true);

        expect(RegistrationSelectors.getRegistered(resetPasswordState)).toBe(false);

        expect(RegistrationSelectors.getError(resetPasswordState)).toBe(null);
    }));

    it('should select faulted registrationState correctly', waitForAsync(() => {
        const resetPasswordState: RegistrationStateModel = { pending: true, registered: false, error };

        expect(RegistrationSelectors.getPending(resetPasswordState)).toBe(true);

        expect(RegistrationSelectors.getRegistered(resetPasswordState)).toBe(false);

        expect(RegistrationSelectors.getError(resetPasswordState)).toEqual(error);
    }));
});
