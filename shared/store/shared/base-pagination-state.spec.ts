import { PaginationFilter } from '../../models/filters/pagination-filter.model';
import { PaginationRequest } from '../../models/common/pagination-request.model';

import { PaginationStateBase } from './pagination-state-base';

import { GuidUtils } from '../../utils/guid-utils';

describe('BasePaginationState tests', () => {
    it('Should correctly apply ReloadFullList pagination', () => {
        const filter = new PaginationFilter(2, 20);
        const state = { uids: [GuidUtils.newGuid, GuidUtils.newGuid, GuidUtils.newGuid, GuidUtils.newGuid, GuidUtils.newGuid, GuidUtils.newGuid], entities: {}, retrieved: false, allItemsLoaded: false, index: 0 };
        new PaginationStateBase().applyFilterPagination(PaginationRequest.ReloadFullList, state, filter);

        expect(filter.pageIndex).toBe(0, 'should apply paging to reload full list (0...9999)');
        expect(filter.pageSize).toBe(9999, 'should apply paging to reload full list (0...9999)');
    });

    it('Should correctly apply ReloadCurrentList pagination', () => {
        let filter = new PaginationFilter(2, 20);
        const state = { uids: [], entities: {}, retrieved: false, allItemsLoaded: false, index: 0 };
        for (let i = 0; i < 60; i++) {
            state.uids.push(GuidUtils.newGuid);
        }
        new PaginationStateBase().applyFilterPagination(PaginationRequest.ReloadCurrentList, state, filter);
        expect(filter.pageIndex).toBe(0, 'should apply paging to reload current list (0...currentPageLastItem)');
        expect(filter.pageSize).toBe(60, 'should apply paging to reload current list (0...currentPageLastItem)');

        filter = new PaginationFilter(0, 20);
        state.uids = [GuidUtils.newGuid, GuidUtils.newGuid, GuidUtils.newGuid, GuidUtils.newGuid, GuidUtils.newGuid];
        new PaginationStateBase().applyFilterPagination(PaginationRequest.ReloadCurrentList, state, filter);
        expect(filter.pageIndex).toBe(0, 'should apply paging to reload current list (0...pageSize)');
        expect(filter.pageSize).toBe(20, 'should apply paging to reload current list (0...pageSize)');
    });

    it('Should correctly apply LoadMore pagination', () => {
        let filter = new PaginationFilter(0, 20);
        const state = { uids: [], entities: {}, retrieved: true, allItemsLoaded: true, index: 0 };
        for (let i = 0; i < 50; i++) {
            state.uids.push(GuidUtils.newGuid);
        }
        new PaginationStateBase().applyFilterPagination(PaginationRequest.LoadMore, state, filter);
        expect(filter.pageIndex).toBe(0, 'filter should remain the same, all items loaded, nothing to load more');
        expect(filter.pageSize).toBe(20, 'filter should remain the same, all items loaded, nothing to load more');

        filter = new PaginationFilter(0, 20);
        state.retrieved = false;
        new PaginationStateBase().applyFilterPagination(PaginationRequest.LoadMore, state, filter);
        expect(filter.pageIndex).toBe(0, 'filter should remain the same, items not retrieved, nothing to paginate');
        expect(filter.pageSize).toBe(20, 'filter should remain the same, items not retrieved, nothing to paginate');

        filter = new PaginationFilter(0, 20);
        state.allItemsLoaded = false;
        new PaginationStateBase().applyFilterPagination(PaginationRequest.LoadMore, state, filter);
        expect(filter.pageIndex).toBe(0, 'filter should remain the same, items not retrieved, nothing to paginate');
        expect(filter.pageSize).toBe(20, 'filter should remain the same, items not retrieved, nothing to paginate');

        filter = new PaginationFilter(0, 20);
        state.retrieved = true;
        state.allItemsLoaded = false;
        new PaginationStateBase().applyFilterPagination(PaginationRequest.LoadMore, state, filter);
        expect(filter.pageIndex).toBe(1, 'pageIndex should be moved to next page');
        expect(filter.pageSize).toBe(20);
    });

    it('Should correctly apply pagination results (overwrite)', () => {
        const initialList = [{ uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }];
        const initialItemsIds = initialList.map(x => x.uid);
        const initialEntities = initialList.reduce((items: { [uid: string]: { uid: string } }, item: { uid: string }) => ({ ...items, [item.uid]: item }), {});
        const newList = [{ uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }];
        const newItemsIds = newList.map(x => x.uid);
        const newEntities = newList.reduce((items: { [uid: string]: { uid: string } }, item: { uid: string }) => ({ ...items, [item.uid]: item }), {});

        const paginationResult = {
            list: newList,
            total: 50,
            pageIndex: 1,
            pageSize: 3
        };

        const state = { uids: initialItemsIds, entities: initialEntities, retrieved: false, allItemsLoaded: false, index: 0 };

        const { uids, entities, allItemsLoaded, index } = new PaginationStateBase().handlePaginationResults(state, paginationResult, PaginationRequest.ReloadCurrentList, 3);
        expect(uids).toEqual(newItemsIds);
        expect(entities).toEqual(newEntities);
        expect(allItemsLoaded).toBe(false);
        expect(index).toBe(0);
    });

    it('Should correctly apply pagination results (overwrite, retrieved list more then pagesize)', () => {
        const initialList = [{ uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }];
        const initialItemsIds = initialList.map(x => x.uid);
        const initialEntities = initialList.reduce((items: { [uid: string]: { uid: string } }, item: { uid: string }) => ({ ...items, [item.uid]: item }), {});
        const newList = [{ uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }];
        const newItemsIds = newList.map(x => x.uid);
        const newEntities = newList.reduce((items: { [uid: string]: { uid: string } }, item: { uid: string }) => ({ ...items, [item.uid]: item }), {});

        const paginationResult = {
            list: newList,
            total: 50,
            pageIndex: 1,
            pageSize: 3
        };

        const state = { uids: initialItemsIds, entities: initialEntities, retrieved: false, allItemsLoaded: false, index: 0 };

        const { uids, entities, allItemsLoaded, index } = new PaginationStateBase().handlePaginationResults(state, paginationResult, PaginationRequest.ReloadCurrentList, 3);
        expect(uids).toEqual(newItemsIds);
        expect(entities).toEqual(newEntities);
        expect(allItemsLoaded).toBe(false);
        expect(index).toBe(1);
    });

    it('Should correctly apply pagination results (merge)', () => {
        const initialList = [{ uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }];
        const initialItemsIds = initialList.map(x => x.uid);
        const initialEntities = initialList.reduce((items: { [uid: string]: { uid: string } }, item: { uid: string }) => ({ ...items, [item.uid]: item }), {});
        const newList = [{ uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }, { uid: GuidUtils.newGuid }];
        const newItemsIds = newList.map(x => x.uid);
        const newEntities = newList.reduce((items: { [uid: string]: { uid: string } }, item: { uid: string }) => ({ ...items, [item.uid]: item }), {});

        const paginationResult = {
            list: newList,
            total: 6,
            pageIndex: 1,
            pageSize: 3
        };

        const state = { uids: initialItemsIds, entities: initialEntities, retrieved: true, allItemsLoaded: false, index: 0 };

        const { uids, entities, allItemsLoaded, index } = new PaginationStateBase().handlePaginationResults(state, paginationResult, PaginationRequest.LoadMore, 3);
        expect(uids).toEqual(initialItemsIds.concat(newItemsIds));
        expect(entities).toEqual({ ...initialEntities, ...newEntities });
        expect(allItemsLoaded).toBe(true);
        expect(index).toBe(1);
    });
});
