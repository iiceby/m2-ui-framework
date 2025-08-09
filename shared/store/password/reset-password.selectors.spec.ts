import { waitForAsync } from '@angular/core/testing';

import { ResetPasswordSelectors } from './reset-password.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ResetPasswordStateModel } from './reset-password.reducer';

describe('ResetPassword selectors tests', () => {
    const error = new ErrorObject('test');

    it('should select pending resetPasswordState', waitForAsync(() => {
        const resetPasswordState: ResetPasswordStateModel = { pending: true, requestSent: false, error: null };

        expect(ResetPasswordSelectors.getPending(resetPasswordState)).toBe(true);

        expect(ResetPasswordSelectors.getRequestSent(resetPasswordState)).toBe(false);

        expect(ResetPasswordSelectors.getError(resetPasswordState)).toBe(null);
    }));

    it('should select faulted resetPasswordState correctly', waitForAsync(() => {
        const resetPasswordState: ResetPasswordStateModel = { pending: true, requestSent: false, error };

        expect(ResetPasswordSelectors.getPending(resetPasswordState)).toBe(true);

        expect(ResetPasswordSelectors.getRequestSent(resetPasswordState)).toBe(false);

        expect(ResetPasswordSelectors.getError(resetPasswordState)).toEqual(error);
    }));
});
