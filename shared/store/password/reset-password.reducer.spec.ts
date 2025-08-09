import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/business/auth.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ResetPasswordAction, ResetPasswordFailAction, ResetPasswordResetAction, ResetPasswordSuccessAction } from './reset-password.actions';
import { ResetPasswordState, ResetPasswordStateModel } from './reset-password.reducer';

describe('ResetPassword state tests', () => {
    const error = new ErrorObject('test');
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const authServiceStub = { async resetPassword() { return Promise.resolve({}); } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([ResetPasswordState])],
            providers: [
                { provide: AuthService, useValue: authServiceStub }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        actions$ = TestBed.get(Actions);
    }));

    it('should dispatch success action and update state', waitForAsync(() => {
        let successActionDispatched = false;
        let failActionDispatched = false;
        actions$.pipe(ofActionDispatched(ResetPasswordSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(ResetPasswordFailAction)).subscribe(() => failActionDispatched = true);

        store.reset({ resetPassword: { pending: false, requestSent: true, error } });
        store.dispatch(new ResetPasswordAction({ email: 'test@email.com' }));

        store.selectOnce(state => state.resetPassword).subscribe((slice: ResetPasswordStateModel) => {
            expect(slice).toEqual({ pending: true, requestSent: true, error: null }, 'error should be cleared, previous state should remain until success or fail action fired');
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
            }, 2);
        });
    }));

    it('should update state with success on dispatching ResetPasswordSuccessAction', waitForAsync(() => {
        store.reset({ resetPassword: { pending: true, requestSent: false, error } });
        store.dispatch(new ResetPasswordSuccessAction());

        store.selectOnce(state => state.resetPassword).subscribe((slice: ResetPasswordStateModel) => {
            expect(slice).toEqual({ pending: false, requestSent: true, error: null });
        });
    }));

    it('should update state with error on dispatching ResetPasswordFailAction', waitForAsync(() => {
        store.reset({ resetPassword: { pending: true, requestSent: true, error: null } });
        store.dispatch(new ResetPasswordFailAction(error));

        store.selectOnce(state => state.resetPassword).subscribe((slice: ResetPasswordStateModel) => {
            expect(slice).toEqual({ pending: false, requestSent: true, error }, 'pending flag should be cleared, error should be set, previous state should remain (until new success action happen)');
        });
    }));

    it('should reset state to default', waitForAsync(() => {
        store.reset({ resetPassword: { pending: true, requestSent: true, error } });
        store.dispatch(new ResetPasswordResetAction());

        store.selectOnce(state => state.resetPassword).subscribe((slice: ResetPasswordStateModel) => {
            expect(slice).toEqual({ pending: false, requestSent: false, error: null });
        });
    }));
});
