import { PaginationFilter } from '../../models/filters/pagination-filter.model';
import { PaginationRequest } from '../../models/common/pagination-request.model';
import { PaginationResult } from '../../models/common/pagination-result.model';

import { Utils } from '../../utils/utils';

export interface PaginationStateModel<T> {
    ids: string[];
    entities: { [id: string]: T };
    retrieved: boolean;
    allItemsLoaded: boolean;
    index: number;
}

export class PaginationStateBase {
    public applyFilterPagination<T>(paginationRequest: PaginationRequest, state: PaginationStateModel<T>, filter: PaginationFilter): boolean {
        switch (paginationRequest) {
            case PaginationRequest.ReloadFullList:
                filter.pageIndex = 0;
                filter.pageSize = 9999;
                break;
            case PaginationRequest.ReloadCurrentList:
                filter.pageIndex = 0;
                filter.pageSize = Math.max(state.ids.length, filter.pageSize as any);
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

    public handlePaginationResults<T extends { id: string }>(state: PaginationStateModel<T>, paginationResult: PaginationResult<T>, paginationRequest: PaginationRequest, originalPageSize: number | any): { ids: string[], entities: { [id: string]: T }, allItemsLoaded: boolean, total: number, index: number } {
        let ids: string[];
        let entities: { [id: string]: T };
        if (paginationRequest !== PaginationRequest.LoadMore) {
            // ... overwrite result
            ids = paginationResult.data.map(p => p.id || p.id);
            entities = paginationResult.data.reduce((items: { [id: string]: T }, item: T) => ({ ...items, [item.id]: item }), {});
        } else {
            // ... merge result
            const newIds = paginationResult.data.map(p => p.id);
            ids = Utils.arrayUnique(state.ids.concat(newIds));
            const entitiesList = ids.map(id => state.entities[id] || paginationResult.data.find(ent => ent.id === id));
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
        paginationResult = {
            ...paginationResult,
            ...paginationResult?.pagination
        }
        delete paginationResult?.pagination;
        
        const allItemsLoaded = paginationResult.total === ids.length || !paginationResult.data[0] || ((index + 1) * paginationResult.pageSize > paginationResult.total);
        return { ids, entities, total: paginationResult.total, allItemsLoaded, index };
    }

    public handlePaginationResultUids<T extends { uid: string }>(state: PaginationStateModel<T>, paginationResult: PaginationResult<T>, paginationRequest: PaginationRequest, originalPageSize: number | any): { uids: string[], entities: { [uid: string]: T }, allItemsLoaded: boolean, total: number, index: number } {
        let uids: string[];
        let entities: { [id: string]: T };
        if (paginationRequest !== PaginationRequest.LoadMore) {
            // ... overwrite result
            uids = paginationResult.data.map(p => p.uid);
            entities = paginationResult.data.reduce((items: { [id: string]: T }, item: T) => ({ ...items, [item.uid]: item }), {});
        } else {
            // ... merge result
            const newIds = paginationResult.data.map(p => p.uid);
            uids = Utils.arrayUnique(state.ids.concat(newIds));
            const entitiesList = uids.map(uid => state.entities[uid] || paginationResult.data.find(ent => ent.uid === uid));
            entities = entitiesList.reduce((items: { [id: string]: T }, item: T) => ({ ...items, [item.uid]: item }), {});

        }

        let index = state.index;
        if (paginationRequest === PaginationRequest.LoadMore) {
            index = state.index + 1;
        } else {
            if (uids.length > originalPageSize) {
                index = Math.floor(uids.length / originalPageSize) - 1;
            }
        }
        paginationResult = {
            ...paginationResult,
            ...paginationResult?.pagination
        }
        delete paginationResult?.pagination;
        
        const allItemsLoaded = paginationResult.total === uids.length || !paginationResult.data[0] || ((index + 1) * paginationResult.pageSize > paginationResult.total);
        return { uids, entities, total: paginationResult.total, allItemsLoaded, index };
    }
}
