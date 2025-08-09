import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/business/auth.service';
import { PusherService } from '../../services/common/pusher.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { LogoutAction, LogoutFailAction, LogoutSuccessAction } from './logout.actions';
import { LogoutState, LogoutStateModel } from './logout.reducer';

describe('Logout state tests', () => {
    const error = new ErrorObject('test');
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const authServiceStub = { async logout() { return Promise.resolve({}); } };
        const pusherServiceStub = { reconnect() { return; } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([LogoutState])],
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
        let resetActionDispatched = false;
        actions$.pipe(ofActionDispatched(LogoutSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(LogoutFailAction)).subscribe(() => failActionDispatched = true);
        actions$.pipe(ofActionDispatched(StateResetAll)).subscribe(() => resetActionDispatched = true);

        store.reset({ logout: { pending: false, loggedOut: true, error } });
        store.dispatch(new LogoutAction());

        store.selectOnce(state => state.logout).subscribe((slice: LogoutStateModel) => {
            expect(slice).toEqual({ pending: true, loggedOut: true, error: null }, 'error should be cleared, previous state should remain until success or fail action fired');
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
                expect(resetActionDispatched).toBe(true, 'resetAllState action should be dispatched');
            }, 2);
        });
    }));

    it('should update state with success on dispatching LogoutSuccessAction', waitForAsync(() => {
        store.reset({ logout: { pending: true, loggedOut: false, error } });
        store.dispatch(new LogoutSuccessAction());

        store.selectOnce(state => state.logout).subscribe((slice: LogoutStateModel) => {
            expect(slice).toEqual({ pending: false, loggedOut: true, error: null });
        });
    }));

    it('LogoutSuccessAction should dispatch ResetAllState action', waitForAsync(() => {
        store.reset({ login: { pending: true, loggedIn: false, error }, sliceA: { some: 123 }, sliceB: { other: 'hello' } });
        store.dispatch(new LogoutSuccessAction());
    }));

    it('should update state with error on dispatching LogoutFailAction', waitForAsync(() => {
        store.reset({ logout: { pending: true, loggedOut: true, error: null } });
        store.dispatch(new LogoutFailAction(error));

        store.selectOnce(state => state.logout).subscribe((slice: LogoutStateModel) => {
            expect(slice).toEqual({ pending: false, loggedOut: true, error }, 'pending flag should be cleared, error should be set, previous state should remain (until new success action happen)');
        });
    }));
});
