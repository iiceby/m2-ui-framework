// import { Injectable } from '@angular/core';

// import { map } from 'rxjs/operators';

// import { BaseSingletonService } from './base-singleton.service';
// import { LanguageService } from './language-service.service';
// import { UiDispatchers } from '../../store/ui/ui.dispatchers';

// import { ExgCultureEnum, ExgCultures } from '../../models/common/exg-culture.model';

// @Injectable({
//     providedIn: 'root'
// })
// export class ExgTranslateService extends BaseSingletonService {

//     constructor(private languageService: LanguageService, 
//         private uiDispatcher: UiDispatchers
//         ) {
//         super('ExgTranslateService');
//     }

//     public instant(message: string, params?: any): string {
//        // return this.translateService.instant(message, params);
//     }

//     public async translate(message: string, params?: any): Promise<string> {
//        // return this.translateService.get(message, params).toPromise();
//     }

//     public async translateMany(messages: string[], params?: any): Promise<string[]> {
//         //@ts-ignore
//         return this.translateService.get(messages, params).pipe(map(res => messages.map(m => res[m]))).toPromise();
//     }

//     public async use(culture: ExgCultureEnum): Promise<void> {
//         // this.uiDispatcher.dispatchLanguageChangeAction(culture);
//         // return this.translateService.currentLang === culture ? Promise.resolve() : this.translateService.use(culture).toPromise();
//     }

//     public async apply(): Promise<void> {
//         // const lang = this.languageService.retrieveLanguage();
//         // this.uiDispatcher.dispatchLanguageChangeAction(lang);
//         // return this.translateService.currentLang === lang ? Promise.resolve() : this.translateService.use(lang).toPromise();
//     }

//     public getCurrentLang() {
//         // return <ExgCultures>this.translateService.currentLang;
//     }

//     public setDefaultLang(lang: ExgCultureEnum) {
//         // this.translateService.setDefaultLang(lang);
//     }

//     public async translateForLanguage(message: string, language: ExgCultureEnum, params?: any): Promise<string> {
//         //@ts-ignore
//         // if (!language) return Promise.resolve(null);
//         // return this.translateService.getTranslation(language).pipe(map(translations => this.translateService.getParsedResult(translations, message, params))).toPromise();
//     }
// }
