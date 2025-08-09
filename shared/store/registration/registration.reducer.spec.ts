import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/business/auth.service';
import { PusherService } from '../../services/common/pusher.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { ExgCultureEnum } from '../../models/common/exg-culture.model';

import { RegistrationAction, RegistrationFailAction, RegistrationResetAction, RegistrationSuccessAction } from './registration.actions';
import { RegistrationState, RegistrationStateModel } from './registration.reducer';

describe('Registration state tests', () => {
    const error = new ErrorObject('test');
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const authServiceStub = { async register() { return Promise.resolve({}); } };
        const pusherServiceStub = { reconnect() { return; } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([RegistrationState])],
            providers: [
                { provide: AuthService, useValue: authServiceStub },
                { provide: PusherService, useValue: pusherServiceStub }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        actions$ = TestBed.get(Actions);
    }));

    it('should dispatch success action and update state', waitForAsync(() => {
        let successActionDispatched = false;
        let failActionDispatched = false;
        actions$.pipe(ofActionDispatched(RegistrationSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(RegistrationFailAction)).subscribe(() => failActionDispatched = true);

        store.reset({ registration: { pending: false, registered: true, error } });
        store.dispatch(new RegistrationAction({ email: 'test@email.com', firstName: 'John', lastName: 'Doe', culture: ExgCultureEnum.English, password: '123' }));

        store.selectOnce(state => state.registration).subscribe((slice: RegistrationStateModel) => {
            expect(slice).toEqual({ pending: true, registered: true, error: null }, 'error should be cleared, previous state should remain until success or fail action fired');
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
            }, 2);
        });
    }));

    it('should update state with success on dispatching RegistrationSuccessAction', waitForAsync(() => {
        store.reset({ registration: { pending: true, registered: false, error } });
        store.dispatch(new RegistrationSuccessAction());

        store.selectOnce(state => state.registration).subscribe((slice: RegistrationStateModel) => {
            expect(slice).toEqual({ pending: false, registered: true, error: null });
        });
    }));

    it('should update state with error on dispatching RegistrationFailAction', waitForAsync(() => {
        store.reset({ registration: { pending: true, registered: true, error: null } });
        store.dispatch(new RegistrationFailAction(error));

        store.selectOnce(state => state.registration).subscribe((slice: RegistrationStateModel) => {
            expect(slice).toEqual({ pending: false, registered: true, error }, 'pending flag should be cleared, error should be set, previous state should remain (until new success action happen)');
        });
    }));

    it('should reset state to default', waitForAsync(() => {
        store.reset({ registration: { pending: true, registered: true, error } });
        store.dispatch(new RegistrationResetAction());

        store.selectOnce(state => state.registration).subscribe((slice: RegistrationStateModel) => {
            expect(slice).toEqual({ pending: false, registered: false, error: null });
        });
    }));
});
