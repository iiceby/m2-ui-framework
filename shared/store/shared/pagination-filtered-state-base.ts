import { ExgCookieService } from '../../services/common/exg-cookie.service';

import { PaginationStateBase, PaginationStateModel } from './pagination-state-base';

import { ExgBaseParamsConfig } from '../../exg-params.config';
import { String } from '../../utils/string';

export interface PaginationFilteredStateModel<T, TFilter> extends PaginationStateModel<T> {
    filter: TFilter;
}

export class PaginationFilteredStateBase extends PaginationStateBase {
    constructor(private cookie: ExgCookieService) {
        super();
    }

    public getFilter<TFilter, TFilterData>(type: new(args: any) => TFilter, storagePageSizeKey: string, args?: { pageIndex?: number, pageSize?: number, filterData?: TFilterData }): TFilter {
        const pageSize = +this.cookie.getCookie(String.format(ExgBaseParamsConfig.storageKeys.storagePageSize, storagePageSizeKey)) || ExgBaseParamsConfig.pagination.defaultPageSize;
        const filterArgs = { ...args, pageSize };
        return new type(filterArgs);
    }

    public getFilterData<TFilterData extends { pageSize?: number }>(filterData: TFilterData, storagePageSizeKey: string) : TFilterData {
        if (!filterData.pageSize) {
            const pageSize = +this.cookie.getCookie(String.format(ExgBaseParamsConfig.storageKeys.storagePageSize, storagePageSizeKey)) || ExgBaseParamsConfig.pagination.defaultPageSize;
            return { ...filterData, pageSize };
        }

        return filterData;
    }

    public storeFilterData<TFilterData extends { pageSize?: number }>(filterData: TFilterData, newFilterData: TFilterData, storagePageSizeKey: string) {
        if (filterData.pageSize !== newFilterData.pageSize) {
            this.cookie.setCookie(String.format(ExgBaseParamsConfig.storageKeys.storagePageSize, storagePageSizeKey), `${newFilterData.pageSize}`);
        }
    }
}
