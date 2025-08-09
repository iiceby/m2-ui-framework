import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { BaseSingletonService } from './base-singleton.service';
import { ExgTranslateService } from './exg-translate.service';
import { LanguageService } from './language-service.service';
import { PlatformService } from './platform.service';

@Injectable({
    providedIn: 'root'
})
export class ExgSeoService extends BaseSingletonService {

    constructor(private meta: Meta,
                private title: Title,
                private translate: ExgTranslateService,
                private languageService: LanguageService,
                private platformService: PlatformService) {
        super('ExgSeoService');
    }

    public set(title: string, description?: string, image?: string) {
        if (!this.platformService.isMobilePlatform()) {
            const culture = this.languageService.retrieveLanguage();
            this.translate.translateForLanguage(title || 'Eva System', culture).then(titleTranslated => this.title.setTitle(titleTranslated));

            if (title) {
                this.translate.translateForLanguage(title, culture).then(content => this.meta.updateTag({ property: 'og:title', content }));
            } else {
                this.meta.removeTag('property="og:title"');
            }

            if (description) {
                this.translate.translateForLanguage(description, culture).then((content) => {
                    this.meta.updateTag({ property: 'og:description', content });
                    this.meta.updateTag({ name: 'description', content });
                });
            } else {
                this.meta.removeTag('property="og:description"');
            }

            if (image) {
                this.meta.updateTag({ property: 'og:image', content: image });
            } else {
                this.meta.removeTag('property="og:image"');
            }
        }
    }
}
