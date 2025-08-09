import { waitForAsync } from '@angular/core/testing';

import { ProfileUpdateSelectors } from './profile-update.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ProfileUpdateStateModel } from './profile-update.reducer';

describe('ProfileUpdate selectors tests', () => {
    const error = new ErrorObject('test');

    it('should select pending profileUpdateState', waitForAsync(() => {
        const profileUpdateState: ProfileUpdateStateModel = { pending: true, updated: false, error: null };

        expect(ProfileUpdateSelectors.getPending(profileUpdateState)).toBe(true);

        expect(ProfileUpdateSelectors.getUpdated(profileUpdateState)).toBe(false);

        expect(ProfileUpdateSelectors.getError(profileUpdateState)).toBe(null);
    }));

    it('should select faulted profileUpdateState correctly', waitForAsync(() => {
        const profileUpdateState: ProfileUpdateStateModel = { pending: true, updated: false, error };

        expect(ProfileUpdateSelectors.getPending(profileUpdateState)).toBe(true);

        expect(ProfileUpdateSelectors.getUpdated(profileUpdateState)).toBe(false);

        expect(ProfileUpdateSelectors.getError(profileUpdateState)).toEqual(error);
    }));
});
