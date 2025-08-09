import { Injectable } from '@angular/core';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';
import { HttpService } from '../../../shared/services/common/http.service';

import { ExgCultureEnum } from '../../../shared/models/common/exg-culture.model';
import { PhoneCode } from '../../../shared/models/business/phone-code.model';

import { String } from '../../../shared/utils/string';

@Injectable({
    providedIn: 'root'
})
export class PhoneService extends BaseSingletonService {

    private settings: { service: { getCountryPhoneCode: string; } };

    constructor(private http: HttpService) {
        super('PhoneService');
        this.settings = {
            service: {
                getCountryPhoneCode: '/identity/v1/countryphonecodes?culture={0}'
            }
        };
    }

    /**
     * Get country phone codes
     */
    public async getPhoneCodes(culture: ExgCultureEnum): Promise<PhoneCode[]> {
        return this.http.get<{ list: PhoneCode[] }>(String.format(this.settings.service.getCountryPhoneCode, culture))
            .then((resp) => {
                resp.list.forEach(c => c.id = c.phoneCode);
                return resp.list;
            });
    }
}
