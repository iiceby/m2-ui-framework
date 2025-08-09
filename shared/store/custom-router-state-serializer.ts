import { Injectable } from '@angular/core';
import { Params, RouterStateSnapshot } from '@angular/router';

import { RouterStateSerializer } from '@ngxs/router-plugin';

export interface RouterStateParams {
    url: string;
    params: Params;
    queryParams: Params;
    data: any;
    outlet: string;
}

@Injectable()
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateParams> {
    serialize(routerState: RouterStateSnapshot): RouterStateParams {
        const { url, root: { queryParams } } = routerState;

        let { root: route } = routerState;
        while (route.firstChild) {
            route = route.firstChild;
        }

        const { params, data, outlet } = route;

        // Only return an object including the URL, params and query params instead of the entire snapshot
        return { url, params, queryParams, data, outlet };
    }
}
