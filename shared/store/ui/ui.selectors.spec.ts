import { waitForAsync } from '@angular/core/testing';

import { UiSelectors } from './ui.selectors';

import { UiStateModel } from './ui.reducer';

describe('UI selectors tests', () => {
    it('should select pending UiState', waitForAsync(() => {
        const storageState: UiStateModel = { showSettingsHeader: true, culture: 'ru-RU', currency: 'RUB' };

        expect(UiSelectors.getShowSettingsHeader(storageState)).toBe(true);
    }));
});
