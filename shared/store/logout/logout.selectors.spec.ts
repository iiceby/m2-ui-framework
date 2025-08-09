import { waitForAsync } from '@angular/core/testing';

import { LogoutSelectors } from './logout.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { LogoutStateModel } from './logout.reducer';

describe('Logout selectors tests', () => {
    const error = new ErrorObject('test');

    it('should select pending logoutState', waitForAsync(() => {
        const logoutState: LogoutStateModel = { pending: true, loggedOut: false, error: null };

        expect(LogoutSelectors.getPending(logoutState)).toBe(true);

        expect(LogoutSelectors.getLoggedOut(logoutState)).toBe(false);

        expect(LogoutSelectors.getError(logoutState)).toBe(null);
    }));

    it('should select faulted logoutState correctly', waitForAsync(() => {
        const logoutState: LogoutStateModel = { pending: true, loggedOut: false, error };

        expect(LogoutSelectors.getPending(logoutState)).toBe(true);

        expect(LogoutSelectors.getLoggedOut(logoutState)).toBe(false);

        expect(LogoutSelectors.getError(logoutState)).toEqual(error);
    }));
});
