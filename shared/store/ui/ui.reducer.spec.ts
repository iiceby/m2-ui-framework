import { TestBed, waitForAsync } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { CurrencyChangeAction, LanguageChangeAction, ShowHeaderForSettingsAction } from './ui.actions';
import { UiState, UiStateModel } from './ui.reducer';

describe('UI state tests', () => {
    let store: Store;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([UiState])],
            providers: []
        }).compileComponents();

        store = TestBed.get(Store);
    }));

    it('should update state on dispatching ShowAddTransportFromHeaderAction', waitForAsync(() => {
        store.reset({ ui: { showSettingsHeader: false, culture: '', currency: '' } });
        store.dispatch(new ShowHeaderForSettingsAction({ show: true }));
        store.dispatch(new LanguageChangeAction({ culture: 'en-US' }));
        store.dispatch(new CurrencyChangeAction({ currency: 'RUB' }));

        store.selectOnce(state => state.ui).subscribe((slice: UiStateModel) => {
            expect(slice).toEqual({ showSettingsHeader: true, culture: 'en-US', currency: 'RUB' });
        });
    }));
});
