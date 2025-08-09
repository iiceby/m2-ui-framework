import { waitForAsync } from '@angular/core/testing';

import { ChangePasswordSelectors } from './change-password.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ChangePasswordStateModel } from './change-password.reducer';

describe('ChangePassword selectors tests', () => {
    const error = new ErrorObject('test');

    it('should select pending ChangePasswordState', waitForAsync(() => {
        const changePasswordStateModel: ChangePasswordStateModel = { pending: true, changed: false, error: null };

        expect(ChangePasswordSelectors.getPending(changePasswordStateModel)).toBe(true);

        expect(ChangePasswordSelectors.getChanged(changePasswordStateModel)).toBe(false);

        expect(ChangePasswordSelectors.getError(changePasswordStateModel)).toBe(null);
    }));

    it('should select faulted ChangePasswordState correctly', waitForAsync(() => {
        const changePasswordStateModel: ChangePasswordStateModel = { pending: true, changed: false, error };

        expect(ChangePasswordSelectors.getPending(changePasswordStateModel)).toBe(true);

        expect(ChangePasswordSelectors.getChanged(changePasswordStateModel)).toBe(false);

        expect(ChangePasswordSelectors.getError(changePasswordStateModel)).toEqual(error);
    }));
});
