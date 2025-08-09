import { CompareUtils } from './compare-utils';
import { PhoneUtils } from './phone-utils';

describe('LocaleUtils tests', () => {
    const usPhoneCode = { countryCode: 'US', phoneCode: '+1', name: 'USA', id: null };
    const ruPhoneCode = { countryCode: 'RU', phoneCode: '+7', name: 'Russia', id: null };
    const gbPhoneCode = { countryCode: 'GB', phoneCode: '+44', name: 'UK', id: null };
    const byPhoneCode = { countryCode: 'BY', phoneCode: '+375', name: 'Беларусь', id: null };

    const phoneCodes = [
        usPhoneCode,
        ruPhoneCode,
        gbPhoneCode,
        byPhoneCode
    ];

    it('Should correctly parse phone code', () => {
        const code1 = PhoneUtils.getCodeByPhone('+375255049425', phoneCodes);
        let isEqual = CompareUtils.isObjectsEqual(code1, byPhoneCode, true);
        expect(isEqual).toBeTruthy('objects are equal strictly');

        const code2 = PhoneUtils.getCodeByPhone('+79508269494', phoneCodes);
        isEqual = CompareUtils.isObjectsEqual(code2, ruPhoneCode, true);
        expect(isEqual).toBeTruthy('objects are equal strictly');
    });

    it('Should correctly parse phone code and phone', () => {
        const code1 = PhoneUtils.splitNumber('+375255049425', phoneCodes);
        let isEqual = CompareUtils.isObjectsEqual(code1, { code: byPhoneCode, phone: '255049425' }, true);
        expect(isEqual).toBeTruthy('objects are equal strictly');

        const code2 = PhoneUtils.getCodeByPhone('+79508269494', phoneCodes);
        isEqual = CompareUtils.isObjectsEqual(code2, { code: ruPhoneCode, phone: '9508269494' }, true);
        expect(isEqual).toBeTruthy('objects are equal strictly');
    });
});
