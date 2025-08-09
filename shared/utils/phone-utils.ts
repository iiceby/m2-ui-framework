import { PhoneCode } from '../../shared/models/business/phone-code.model';

export class PhoneUtils {
    public static getCodeByPhone(phone: string, phoneCodes: PhoneCode[]): PhoneCode {
        const splited = PhoneUtils.splitNumber(phone, phoneCodes);
        return splited.code || null;
    }

    public static splitNumber(phone: string, phoneCodes: PhoneCode[]): { code: PhoneCode, phone: string } {
        const suitablePhoneCode = phoneCodes.filter(codes => phone.startsWith(codes.phoneCode));
        const longedCode = suitablePhoneCode.length > 0 ? suitablePhoneCode.reduce(PhoneUtils.maxLengthCode) : null;
        if (!longedCode) {
            return { code: null, phone: null };
        }

        const phoneWithoutCode = phone.replace(longedCode.phoneCode, '');

        if (!phoneWithoutCode) {
            return { code: longedCode, phone: null };
        }

        return { code: longedCode, phone: phoneWithoutCode };
    }

    private static maxLengthCode(a: PhoneCode, b: PhoneCode): PhoneCode {
        return a.phoneCode.length > b.phoneCode.length ? a : b;
    }
}
