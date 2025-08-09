import { TestBed } from '@angular/core/testing';

import { ExgDecimalPipe } from './exg-decimal.pipe';

import { ExgTranslateService } from '../../services/common/exg-translate.service';

import { ExgCultureEnum } from '../../models/common/exg-culture.model';

describe('ExgDecimalPipe tests', () => {

    let translateServiceSpy: jasmine.SpyObj<ExgTranslateService>;
    const spy = jasmine.createSpyObj('ExgTranslateService', ['getCurrentLang']);

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                { provide: ExgTranslateService, useValue: spy }
            ]
        });
        translateServiceSpy = TestBed.get(ExgTranslateService);
        spy.getCurrentLang.and.returnValue(ExgCultureEnum.English);
    });

    it('Should show number in specified en-format', () => {
        spy.getCurrentLang.and.returnValue(ExgCultureEnum.English);

        const decimalPipe = new ExgDecimalPipe(translateServiceSpy);

        const num1 = decimalPipe.transform('2.718281828459045');
        expect(num1).toBe('2.718');

        const num2 = decimalPipe.transform('111222333.444555666');
        expect(num2).toBe('111,222,333.445');

        const num3 = decimalPipe.transform('3.141592', '3.5-5');
        expect(num3).toBe('003.14159');

        const num4 = decimalPipe.transform('3.14', '3.5-5');
        expect(num4).toBe('003.14000');

        const num5 = decimalPipe.transform('-3.14', '3.5-5');
        expect(num5).toBe('-003.14000');

        const num6 = decimalPipe.transform('-3.14', '3.5-5', true);
        expect(num6).toBe('(003.14000)', 'negative value should be in braces instead of minus symbol');
    });

    it('Should show number in specified ru-format', () => {
        spy.getCurrentLang.and.returnValue(ExgCultureEnum.Russian);

        const decimalPipe = new ExgDecimalPipe(translateServiceSpy);

        const num1 = decimalPipe.transform('2.718281828459045');
        expect(num1).toBe('2,718');

        let num2 = decimalPipe.transform('111222333.444555666');
        num2 = num2.replace(/\s/g, ' '); // pipe returns not space, but some other whitespace symbols
        expect(num2).toBe('111 222 333,445');

        const num3 = decimalPipe.transform('3.141592', '3.5-5');
        expect(num3).toBe('003,14159');

        const num4 = decimalPipe.transform('3.14', '3.5-5');
        expect(num4).toBe('003,14000');

        const num5 = decimalPipe.transform('-3.14', '3.5-5');
        expect(num5).toBe('-003,14000');

        const num6 = decimalPipe.transform('-3.14', '3.5-5', true);
        expect(num6).toBe('(003,14000)', 'negative value should be in braces instead of minus symbol');
    });

    it('Should show empty value as blank line', () => {
        const decimalPipe = new ExgDecimalPipe(translateServiceSpy);

        const num1 = decimalPipe.transform('');
        expect(num1).toBe('');
    });

    it('Should show zero value as zero', () => {
        const decimalPipe = new ExgDecimalPipe(translateServiceSpy);

        const num1 = decimalPipe.transform('0');
        expect(num1).toBe('0', 'string "0" should be shown as 0');

        const num2 = decimalPipe.transform(0);
        expect(num2).toBe('0', 'number (0) should be shown as 0');
    });

    it('Should show wrong value as blank line', () => {
        const decimalPipe = new ExgDecimalPipe(translateServiceSpy);

        const num1 = decimalPipe.transform('qwerty');
        expect(num1).toBe('');
    });
});
