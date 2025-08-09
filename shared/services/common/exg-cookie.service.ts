import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie';

import { BaseSingletonService } from './base-singleton.service';

import { DateUtils } from '../../utils/date-utils';

@Injectable({
    providedIn: 'root'
})
export class ExgCookieService extends BaseSingletonService {

    constructor(private cookieService: CookieService) {
        super('ExgCookieService');
    }

    public getCookie(key: string): string {
        //@ts-ignore
        return this.cookieService.get(key);
    }

    public getObject<T>(key: string): T {
        const data = this.cookieService.get(key);
        if (!data) {
            //@ts-ignore
            return null;
        }

        return <T>JSON.parse(data);
    }

    public setCookie(key: string, data: string) {
        this.cookieService.put(key, data, { expires: DateUtils.convertStringToDate(DateUtils.add(DateUtils.currentDate, 1, 'years')) });
    }

    public setObject(key: string, data: any) {
        this.cookieService.put(key, JSON.stringify(data), { expires: DateUtils.convertStringToDate(DateUtils.add(DateUtils.currentDate, 1, 'years')) });
    }

    public removeCookie(key: string) {
        this.cookieService.remove(key);
    }

    public clear() {
        this.cookieService.removeAll();
    }

    public getAll(): object {
        return this.cookieService.getAll();
    }

    public removeAll() {
        this.cookieService.removeAll();
    }
}
