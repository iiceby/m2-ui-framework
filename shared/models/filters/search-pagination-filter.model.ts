import { PaginationFilter } from './pagination-filter.model';

import { StringUtils } from '../../utils/string-utils';

export class SearchPaginationFilter extends PaginationFilter {
    private value: string;

    public get term(): string { return this.value; }

    public set term(value: string) { this.value = encodeURIComponent(StringUtils.encodeSqlSpecialChars(value)); }

    constructor(pageIndex?: number, pageSize?: number, term?: string) {
        super(pageIndex, pageSize);
        this.term = term;
    }
}
