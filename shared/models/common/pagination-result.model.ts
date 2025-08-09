import { TypeGuard } from './type-guard.interface';

import { Pagination } from './pagination.model';

export interface PaginationResult<T> extends Pagination {
    data: T[];
    pagination?: {
        total: number;
        perPage: number;
        lastPage: number;
        to: number;
        from: number;
        currentPage: number;
    }
}

export class PaginationResultTypeGuard<T> implements TypeGuard {
    constructor(private innerTypeGuard) { }

    public isValid(value: PaginationResult<T>) {
        if (this.innerTypeGuard && value.data.length > 0 && !this.innerTypeGuard.isValid(value.data[0])) {
            return false;
        }

        return value.data &&
            value?.pagination?.total !== null && value?.pagination?.total !== undefined && value?.pagination?.total >= 0;
    }
}
