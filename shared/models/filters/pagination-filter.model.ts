import { ExgBaseParamsConfig } from '../../exg-params.config';

export class PaginationFilter {
    constructor(public pageIndex: number, public pageSize?: number) {
        this.pageSize = this.pageSize || ExgBaseParamsConfig.pagination.defaultPageSize;
        this.pageIndex = this.pageIndex || 0;
    }
}
