import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ExgSeoService } from '../../shared/services/common/exg-seo.service';

@Injectable({
    providedIn: 'root'
})
export class RegistrationResolver implements Resolve<boolean> {
    constructor(private seoService: ExgSeoService) { }

    public resolve(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): Observable<boolean> | boolean {
        // we don't need to return real data (it will be retrieved from store), just need to ensure it is loaded before navigation is finished

        this.seoService.set('Eva System Registration', 'Eva System Registration');
        return true;
    }
}
