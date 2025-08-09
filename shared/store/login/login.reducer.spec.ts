import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/business/auth.service';
import { PusherService } from '../../services/common/pusher.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { LoginAction, LoginFailAction, LoginResetAction, LoginSuccessAction } from './login.actions';
import { LoginState, LoginStateModel } from './login.reducer';

describe('Login state tests', () => {
    const error = new ErrorObject('test');
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const authServiceStub = { async login() { return Promise.resolve({}); } };
        const pusherServiceStub = { reconnect() { return; } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([LoginState])],
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
        actions$.pipe(ofActionDispatched(LoginSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(LoginFailAction)).subscribe(() => failActionDispatched = true);
        actions$.pipe(ofActionDispatched(StateResetAll)).subscribe(() => resetActionDispatched = true);

        store.reset({ login: { pending: false, loggedIn: true, error } });
        store.dispatch(new LoginAction({ login: 'qwe', password: '111' }));

        store.selectOnce(state => state.login).subscribe((slice: LoginStateModel) => {
            expect(slice).toEqual({ pending: true, loggedIn: true, error: null }, 'error should be cleared, previous state should remain until success or fail action fired');
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
                expect(resetActionDispatched).toBe(true, 'resetAllState action should be dispatched');
            }, 2);
        });
    }));

    it('should update state with success on dispatching LoginSuccessAction', waitForAsync(() => {
        store.reset({ login: { pending: true, loggedIn: false, error } });
        store.dispatch(new LoginSuccessAction());

        store.selectOnce(state => state.login).subscribe((slice: LoginStateModel) => {
            expect(slice).toEqual({ pending: false, loggedIn: true, error: null });
        });
    }));

    it('LoginSuccessAction should dispatch ResetAllState action', waitForAsync(() => {
        store.reset({ login: { pending: true, loggedIn: false, error }, sliceA: { some: 123 }, sliceB: { other: 'hello' } });
        store.dispatch(new LoginSuccessAction());
    }));

    it('should update state with error on dispatching LoginFailAction', waitForAsync(() => {
        store.reset({ login: { pending: true, loggedIn: true, error: null } });
        store.dispatch(new LoginFailAction(error));

        store.selectOnce(state => state.login).subscribe((slice: LoginStateModel) => {
            expect(slice).toEqual({ pending: false, loggedIn: true, error }, 'pending flag should be cleared, error should be set, previous state should remain (until new success action happen)');
        });
    }));

    it('should reset state to default', waitForAsync(() => {
        store.reset({ login: { pending: true, loggedIn: true, error } });
        store.dispatch(new LoginResetAction());

        store.selectOnce(state => state.login).subscribe((slice: LoginStateModel) => {
            expect(slice).toEqual({ pending: false, loggedIn: false, error: null });
        });
    }));
});
