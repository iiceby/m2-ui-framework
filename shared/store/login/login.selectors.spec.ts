import { waitForAsync } from '@angular/core/testing';

import { LoginSelectors } from './login.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { LoginStateModel } from './login.reducer';

describe('Login selectors tests', () => {
    const error = new ErrorObject('test');

    it('should select pending loginState', waitForAsync(() => {
        const loginState: LoginStateModel = { pending: true, loggedIn: false, error: null };

        expect(LoginSelectors.getPending(loginState)).toBe(true);

        expect(LoginSelectors.getLoggedIn(loginState)).toBe(false);

        expect(LoginSelectors.getError(loginState)).toBe(null);
    }));

    it('should select faulted loginState correctly', waitForAsync(() => {
        const loginState: LoginStateModel = { pending: true, loggedIn: false, error };

        expect(LoginSelectors.getPending(loginState)).toBe(true);

        expect(LoginSelectors.getLoggedIn(loginState)).toBe(false);

        expect(LoginSelectors.getError(loginState)).toEqual(error);
    }));
});
