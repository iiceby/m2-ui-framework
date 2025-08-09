import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PhoneService } from '../../services/business/phone.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { ExgCultureEnum } from '../../models/common/exg-culture.model';

import { PhoneCodesAction, PhoneCodesFailAction, PhoneCodesResetAction, PhoneCodesSuccessAction } from './phone-codes.actions';
import { PhoneCodesState, PhoneCodesStateModel } from './phone-codes.reducer';

describe('PhoneCodes state tests', () => {
    const error = new ErrorObject('test');
    const phoneCodes = [
        { id: '+8', countryCode: 'RU', phoneCode: '+7', name: 'Russia' },
        { id: '+66', countryCode: 'USA', phoneCode: '+684', name: 'USA' }
    ];
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const phoneCodesServiceStub = { getPhoneCodes() { return Promise.resolve(phoneCodes); } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([PhoneCodesState])],
            providers: [
                { provide: PhoneService, useValue: phoneCodesServiceStub }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        actions$ = TestBed.get(Actions);
    }));

    it('should dispatch success action and update state', waitForAsync(() => {
        let successActionDispatched = false;
        let failActionDispatched = false;
        actions$.pipe(ofActionDispatched(PhoneCodesSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(PhoneCodesFailAction)).subscribe(() => failActionDispatched = true);

        store.reset({ phoneCodes: { pending: false, phoneCodes: null, error } });
        store.dispatch(new PhoneCodesAction.FromContactPage({ culture: ExgCultureEnum.English }));

        store.selectOnce(state => state.phoneCodes).subscribe((slice: PhoneCodesStateModel) => {
            expect(slice).toEqual({ pending: true, phoneCodes: null, error: null }, 'error should be cleared, previous state should remain until success or fail action fired');
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
            }, 2);
        });
    }));

    it('should update state with success on dispatching PhoneCodesSuccessAction', waitForAsync(() => {
        store.reset({ phoneCodes: { pending: true, phoneCodes: null, error } });
        store.dispatch(new PhoneCodesSuccessAction(phoneCodes));

        store.selectOnce(state => state.phoneCodes).subscribe((slice: PhoneCodesStateModel) => {
            expect(slice).toEqual({ pending: false, phoneCodes, error: null });
        });
    }));

    it('should update state with error on dispatching PhoneCodesFailAction', waitForAsync(() => {
        store.reset({ phoneCodes: { pending: true, phoneCodes, error: null } });
        store.dispatch(new PhoneCodesFailAction(error));

        store.selectOnce(state => state.phoneCodes).subscribe((slice: PhoneCodesStateModel) => {
            expect(slice).toEqual({ pending: false, phoneCodes, error }, 'pending flag should be cleared, error should be set, previous state should remain (until new success action happen)');
        });
    }));

    it('should reset state to default', waitForAsync(() => {
        store.reset({ phoneCodes: { pending: true, phoneCodes, error } });
        store.dispatch(new PhoneCodesResetAction());

        store.selectOnce(state => state.phoneCodes).subscribe((slice: PhoneCodesStateModel) => {
            expect(slice).toEqual({ pending: false, phoneCodes: null, error: null });
        });
    }));
});
