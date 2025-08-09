import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { HttpService } from '../services/common/http.service';
import { TokenService } from '../services/common/token.service';

import { ExgBaseParamsConfig } from '../exg-params.config';
import { UrlUtils } from '../utils/url-utils';

@Pipe({ name: 'exgSecure' })
export class ExgSecurePipe implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer, private httpService: HttpService, private tokenService: TokenService) { }

    public transform(url: string, useQueryString?: boolean): Promise<SafeUrl> {
        if (useQueryString) {
            // pass auth params in query string
            return Promise.resolve(UrlUtils.appendQueryParams(url, ExgBaseParamsConfig.auth.accessTokenParamName, this.tokenService.getAuthToken()));
        }

        if (url && url.startsWith('http')) {
            //@ts-ignore
            return this.httpService.download(url).then(val => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(<Blob>val))).catch(() => Promise.resolve(this.domSanitizer.bypassSecurityTrustUrl(null)));
        }
        return Promise.resolve(this.domSanitizer.bypassSecurityTrustUrl(url));
    }
}
