import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

import { AuthService } from '../services/business/auth.service';
import { LogoutDispatchers } from '../store/logout/logout.dispatchers';
import { ProfileDispatchers } from '../store/profile/profile.dispatchers';
import { ProfileSelectors } from '../store/profile/profile.selectors';

import { Profile } from '../models/business/user/profile.model';

import { RoutingConfig } from '../routing.config';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService, private logoutDispatchers: LogoutDispatchers, private profileDispatchers: ProfileDispatchers, private profileSelectors: ProfileSelectors) { }

    public canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (!this.authService.isLoggedIn()) {
            this.logoutDispatchers.dispatchFullResetAction();
            this.router.navigate([RoutingConfig.routes.auth.fullUrl], { queryParams: activatedRouteSnapshot.queryParams });
            return false;
        }

        return combineLatest([this.profileSelectors.profile$, this.profileSelectors.error$, this.profileSelectors.pending$]).pipe(
            tap((res) => {
                if (!res[0] && !res[1] && !res[2]) {
                    const userUid = this.authService.getUserId();
                    this.profileDispatchers.dispatchProfileAction(userUid, 'authGuard');
                }
            }),
            filter(res => !!res[0] || !!res[1]),
            map((res) => {
                if (res[1]) {
                    this.logoutDispatchers.dispatchFullResetAction();
                    this.router.navigate([RoutingConfig.routes.auth.fullUrl], { queryParams: activatedRouteSnapshot.queryParams });
                    return false;
                }

                if (res[0] && !this.validateProfilePermissions(res[0], activatedRouteSnapshot.data.permissions, activatedRouteSnapshot.queryParamMap)) {
                    this.router.navigate([''], { queryParams: { authorized: 'email' } });
                    return false;
                }
                return !!res[0];
            }),
            first());
    }

    private validateProfilePermissions(profile: Profile, tokens: string[] | string, queryParamMap) {
        const userUid = queryParamMap.get('userUid');
        const confirmationCode = queryParamMap.get('confirmationCode');
        if (userUid && confirmationCode) return true;

        if (!profile) return false;
        if (!tokens) return true;
        const tokens1 = typeof tokens === 'string' ? tokens.split(',') : tokens.map(t => t.trim());
        if (tokens1.length === 0) return true;
        return tokens1.some(t => profile.permissions.some(p => t === p));
    }
}
