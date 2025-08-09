import { waitForAsync } from '@angular/core/testing';

import { ProfileSelectors } from './profile.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { Profile } from '../../models/business/user/profile.model';

import { ProfileStateModel } from './profile.reducer';

describe('Profile selectors tests', () => {
    const error = new ErrorObject('test');
    const profile = <Profile>{};

    it('should select pending profileState', waitForAsync(() => {
        const profileState: ProfileStateModel = { pending: true, profile, error: null };

        expect(ProfileSelectors.getPending(profileState)).toBe(true);

        expect(ProfileSelectors.getProfile(profileState)).toBe(profile);

        expect(ProfileSelectors.getRetrieved(profileState)).toBe(true);

        expect(ProfileSelectors.getError(profileState)).toBe(null);
    }));

    it('should select faulted profileState correctly', waitForAsync(() => {
        const profileState: ProfileStateModel = { pending: true, profile: null, error };

        expect(ProfileSelectors.getPending(profileState)).toBe(true);

        expect(ProfileSelectors.getProfile(profileState)).toBe(null);

        expect(ProfileSelectors.getRetrieved(profileState)).toBe(false);

        expect(ProfileSelectors.getError(profileState)).toEqual(error);
    }));
});
