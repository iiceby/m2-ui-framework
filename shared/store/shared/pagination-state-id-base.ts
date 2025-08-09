import { PaginationFilter } from '../../models/filters/pagination-filter.model';
import { PaginationRequest } from '../../models/common/pagination-request.model';
import { PaginationResult } from '../../models/common/pagination-result.model';

import { Utils } from '../../utils/utils';

export interface PaginationStateByIdModel<T> {
    ids: number[];
    entities: { [id: number]: T };
    retrieved: boolean;
    allItemsLoaded: boolean;
    index: number;
}

export class PaginationByIdStateBase {
    public applyFilterPagination<T>(paginationRequest: PaginationRequest, state: PaginationStateByIdModel<T>, filter: PaginationFilter): boolean {
        switch (paginationRequest) {
            case PaginationRequest.ReloadFullList:
                filter.pageIndex = 0;
                filter.pageSize = 9999;
                break;
            case PaginationRequest.ReloadCurrentList:
                filter.pageIndex = 0;
                filter.pageSize = Math.max(state.ids.length, filter.pageSize);
                break;
            case PaginationRequest.LoadMore:
                if (state.retrieved) {
                    if (state.allItemsLoaded) {
                        return false;
                    }
                    filter.pageIndex = state.index + 1;
                }
                break;
        }
        return true;
    }

    public handlePaginationResults<T extends { id: number }>(state: PaginationStateByIdModel<T>, paginationResult: PaginationResult<T>, paginationRequest: PaginationRequest, originalPageSize: number): { ids: number[], entities: { [id: number]: T }, allItemsLoaded: boolean, total: number, index: number } {
        let ids: number[];
        let entities: { [id: number]: T };
        if (paginationRequest !== PaginationRequest.LoadMore) {
            // ... overwrite result
            ids = paginationResult.list.map(p => p.id);
            entities = paginationResult.list.reduce((items: { [id: number]: T }, item: T) => ({ ...items, [item.id]: item }), {});
        } else {
            // ... merge result
            const newIds = paginationResult.list.map(p => p.id);
            ids = Utils.arrayUnique(state.ids.concat(newIds));
            const entitiesList = ids.map(id => state.entities[id] || paginationResult.list.find(ent => ent.id === id));
            entities = entitiesList.reduce((items: { [id: string]: T }, item: T) => ({ ...items, [item.id]: item }), {});
        }

        let index = state.index;
        if (paginationRequest === PaginationRequest.LoadMore) {
            index = state.index + 1;
        } else {
            if (ids.length > originalPageSize) {
                index = Math.floor(ids.length / originalPageSize) - 1;
            }
        }

        const allItemsLoaded = paginationResult.total === ids.length || !paginationResult.list[0] || ((index + 1) * paginationResult.pageSize > paginationResult.total);

        return { ids, entities, total: paginationResult.total, allItemsLoaded, index };
    }
}
