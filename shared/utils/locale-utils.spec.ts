import { ExgCultureEnum } from '../models/common/exg-culture.model';

import { LocaleUtils } from './locale-utils';

describe('LocaleUtils tests', () => {

    it('Should correctly parse language', () => {
        const ru1 = LocaleUtils.parseLanguage('ru');
        expect(ru1).toBe(ExgCultureEnum.Russian, 'ru locale');

        const ru2 = LocaleUtils.parseLanguage('ru-RU');
        expect(ru2).toBe(ExgCultureEnum.Russian, 'ru-RU locale');

        const ru3 = LocaleUtils.parseLanguage('russian');
        expect(ru3).toBe(ExgCultureEnum.Russian, 'text that should be treated as ru locale');

        const en1 = LocaleUtils.parseLanguage('en');
        expect(en1).toBe(ExgCultureEnum.English);

        const en2 = LocaleUtils.parseLanguage('en-US');
        expect(en2).toBe(ExgCultureEnum.English);

        const en3 = LocaleUtils.parseLanguage('123245');
        expect(en3).toBe(ExgCultureEnum.English, 'incorrect locale should be parse as default EN locale');

        const en4 = LocaleUtils.parseLanguage('qwerty');
        expect(en4).toBe(ExgCultureEnum.English, 'incorrect locale should be parse as default EN locale');
    });

    it('Should correctly check culture validity', () => {
        let res = LocaleUtils.isCultureValid('ru-RU');
        expect(res).toBeTruthy();

        res = LocaleUtils.isCultureValid('en-US');
        expect(res).toBeTruthy();

        res = LocaleUtils.isCultureValid('ru-RU2');
        expect(res).toBeFalsy();

        res = LocaleUtils.isCultureValid('1ru-RU');
        expect(res).toBeFalsy();

        res = LocaleUtils.isCultureValid(' ru-RU');
        expect(res).toBeFalsy();

        res = LocaleUtils.isCultureValid('ru-RU ');
        expect(res).toBeFalsy();
    });
});
