import { Pipe, PipeTransform } from '@angular/core';
import { ExgCultureEnum } from '../../models/common/exg-culture.model';
import { LanguageService } from '../../services/common/language-service.service';

@Pipe({ name: 'exgWordForms', pure: false })
export class ExgWordFormsPipe implements PipeTransform {

    constructor(private languageService: LanguageService) { }

    public transform(value: string, numeral = 0): string {
        const culture = this.languageService.retrieveLanguage();
        const formId = this.getFromForLang(culture, numeral);
        return `${value}_form${formId}`;
    }

    private getFromForLang(culture: ExgCultureEnum, numeral: number): number {
        switch (culture) {
            case ExgCultureEnum.English:
                return this.getEnglishForm(numeral);
            case ExgCultureEnum.Russian:
                return this.getRussianForm(numeral);
            default:
                //@ts-ignore
                return null;
        }
    }

    private getEnglishForm(numeral: number): number {
        const numeralString = `0${numeral}`;
        if (numeralString.slice(-1) === '1' && numeralString.substr(-2, 1) === '0') {
            return 1;
        }

        return 2;
    }

    private getRussianForm(numeral: number): number {
        const n = Math.abs(numeral) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) { return 3; }
        if (n1 > 1 && n1 < 5) { return 2; }
        if (n1 === 1) { return 1; }
        return 3;
    }
}
