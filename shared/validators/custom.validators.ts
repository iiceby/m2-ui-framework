import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DateUtils } from '../utils/date-utils';

export class CustomValidators {
    //@ts-ignore
    public static shouldBePassword(control: FormControl) {
        let re = /^[а-яё\w]+$/ig.test(control.value);
        if (!re) {
            return (re || control.value === '' || control.value === null) ? null : { isItPassword: true };
        }

        re = (/^\d+$/ig.test(control.value)); // if only digits send false
        if (re) {
            return { isItPasswordOnlyDigits: true };
        }

        re = /^[а-яёa-я]+$/ig.test(control.value);  // if only letters send false
        if (re) {
            return { isItPasswordOnlyLetters: true };
        }
    }

    public static minPasswordLength(control: FormControl) {
        return control.value && control.value.length >= 6 ? null : { minPasswordLength: true };
    }

    public static shouldBeEmail(control: FormControl) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (re.test(control.value) || control.value === '' || control.value == null) ? null : { isItEmail: true };
    }

    public static shouldBePhone(control: FormControl) {
        const re = /^\(?([0-9]{0,4})\)?([- ]?([0-9]+))+(\,\,([0-9]+))?$/g;
        return (re.test(control.value) || control.value === '' || control.value == null) ? null : { isItPhone: true };
    }

    public static shouldBeInteger(control: FormControl) {
        return Number.isInteger(Number(control.value)) ? null : { isItInteger: true };
    }

    public static shouldBeFullName(control: FormControl) {
        if (typeof control.value === 'string') {
            return (control.value.trim().split(/\s+/).length > 1) ? null : { badFullName: true };
        }
        return null;
    }

    static shouldBeEqualPasswords(control: FormGroup) {
        const password = control.controls.newPassword.value;
        const confirmPassword = control.controls.confirmPassword.value;
        return password === confirmPassword ? null : { passwordEqualConfirm: true };
    }

    static shouldBeEqualEmails(control: FormGroup) {
        const email = control.controls.email.value;
        const confirmEmail = control.controls.confirmEmail.value;
        return email === confirmEmail || !confirmEmail ? null : { emailEqualConfirm: true };
    }

    static shouldBeUniqueEmails(group: any, control?: FormControl) {
        const emails = [...group.controls.map(grp => (<string>(grp.value.email || '')).toLowerCase()), (control && control.value ? <string>control.value : '').toLowerCase()];
        return emails.length === emails.filter((value, index, self) => self.indexOf(value) === index).length ? null : { emailUniqueConfirm: true };
    }

    static shouldBeUniqueLangs(group: any) {
        const langs = group.controls.map(grp => (<string>(grp.value && grp.value.code ? grp.value.code.code : null) || '').toLowerCase());
        return langs.length === langs.filter((value, index, self) => self.indexOf(value) === index).length ? null : { langsUniqueConfirm: true };
    }

    static shouldBeUniquePhones(group: any) {
        const langs = group.controls.map(grp => (<string>(grp.value ? grp.value.phoneCode + grp.value.phone : null) || '').toLowerCase());
        return langs.length === langs.filter((value, index, self) => self.indexOf(value) === index).length ? null : { phonesUniqueConfirm: true };
    }

    static shouldBeMaxCount(maxCount: number) {
        return (group: FormGroup) => {
            const adultCount = +group.controls.adultCount.value;
            const childCount = +group.controls.childCount.value;
            const babyCount = +group.controls.babyCount.value;
            return adultCount + childCount + babyCount <= maxCount ? null : { membersMaxCountConfirm: { count: maxCount } };
        };
    }

    static shouldBePlaceAddress(control: FormControl) {
        return control.value && control.value.id ? null : { placeAddress: true };
    }

    static shouldBeRegionAddress(control: FormControl) {
        return control.value && control.value.id ? null : { regionAddress: true };
    }

    static shouldBeContainLeastOneLetter(control: FormControl) {
        const lettersExists = /[A-Za-zа-яё]/ig.test(control.value);
        return lettersExists ? null : { leastOneLetter: true };
    }

    static shouldBeUrl(control: FormControl) {
        return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g.test(control.value) ? null : { isItUrl: true };
    }

    static customTextValidator(pattern: RegExp, errorText: string) {
        return (control: FormControl) => {
            const value = control.value?.title ||  control.value?.name || control.value?.text || control.value;
            const testResult = pattern.test(value);
            pattern.exec(value);
            return testResult ? null : { textValidator: { text: errorText } };
        };
    }

    static shouldNotOverlappingDates(array: FormArray) {
        array.controls.map((group, index) => {
            const overlapDate = array.controls.filter((_, index2) => index2 !== index).some(group2 =>
                DateUtils.dateRangesOverlap(group.value.dateFrom, group.value.dateTo, group2.value.dateFrom, group2.value.dateTo)
            );
            if (overlapDate) {
                (<FormGroup>group).controls.dateFrom.setErrors({ overlapDates: true }, { emitEvent: true });
                (<FormGroup>group).controls.dateTo.setErrors({ overlapDates: true }, { emitEvent: true });
            } else {
                (<FormGroup>group).controls.dateFrom.setErrors(null);
                (<FormGroup>group).controls.dateTo.setErrors(null);
            }
        });

        return null;
    }
}
