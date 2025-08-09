import { waitForAsync } from '@angular/core/testing';

import { PhoneCodesSelectors } from './phone-codes.selectors';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { PhoneCodesStateModel } from './phone-codes.reducer';

describe('PhoneCodes selectors tests', () => {
    const error = new ErrorObject('test');
    const phoneCodes = [
        { id: '+8', countryCode: '+8', phoneCode: '+7', name: 'Russia' },
        { id: '+66', countryCode: '+66', phoneCode: '+684', name: 'USA' }
    ];

    it('should select pending PhoneCodesState', waitForAsync(() => {
        const phoneCodesState: PhoneCodesStateModel = { pending: true, phoneCodes, error: null };

        expect(PhoneCodesSelectors.getPending(phoneCodesState)).toBe(true);

        expect(PhoneCodesSelectors.getPhoneCodes(phoneCodesState)).toBe(phoneCodes);

        expect(PhoneCodesSelectors.getRetrieved(phoneCodesState)).toBeTruthy();

        expect(PhoneCodesSelectors.getError(phoneCodesState)).toBe(null);
    }));

    it('should select faulted PhoneCodesState correctly', waitForAsync(() => {
        const phoneCodesState: PhoneCodesStateModel = { pending: true, phoneCodes: null, error };

        expect(PhoneCodesSelectors.getPending(phoneCodesState)).toBe(true);

        expect(PhoneCodesSelectors.getPhoneCodes(phoneCodesState)).toBe(null);

        expect(PhoneCodesSelectors.getRetrieved(phoneCodesState)).toBeFalsy();

        expect(PhoneCodesSelectors.getError(phoneCodesState)).toEqual(error);
    }));
});
