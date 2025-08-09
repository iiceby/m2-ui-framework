import { Injectable } from '@angular/core';

import { BaseSingletonService } from '../../../burns-ui-framework/shared/services/common/base-singleton.service';
import { HttpService } from '../../../burns-ui-framework/shared/services/common/http.service';
import { LanguageService } from '../../../burns-ui-framework/shared/services/common/language-service.service';

import { City } from '../models/city.model';
import { Country } from '../models/country.model';
import { Geocoding } from '../models/geocoding.model';

import { String } from '../../../burns-ui-framework/shared/utils/string';

@Injectable({
    providedIn: 'root'
})
export class GeoService extends BaseSingletonService {

    private settings: {
        service: {
            getCountries: string;
            getCityList: string;
            getAddressList: string;
        }
    };

    constructor(private http: HttpService, private languageService: LanguageService) {
        super('GeoService');
        this.settings = {
            service: {
                getCountries: '/geocoding/v1/mapbox/all-countries?culture={0}',
                getCityList: '/geocoding-aggregation/v1/geocoding/cities?term={0}',
                getAddressList: '/geocoding-aggregation/v1/geocoding/{0}/addresses?term={1}&culture={2}'
            }
        };
    }

    public async getCountries(): Promise<Country[]> {
        const culture = this.languageService.retrieveLanguage();
        return this.http.get<{ list: Country[] }>(String.format(this.settings.service.getCountries, culture))
            .then(res => res.list);
    }

    public async getCityList(): Promise<City[]> {
        return this.http.get<{ list: City[] }>(String.format(this.settings.service.getCityList))
            .then(res => res.list);
    }

    public async getAddressList(term: string, countryCode: string): Promise<Geocoding[]> {
        const culture = this.languageService.retrieveLanguage();
        return this.http.get<{ list: Geocoding[] }>(String.format(this.settings.service.getAddressList, countryCode, term, culture))
            .then(res => res.list);
    }
}
