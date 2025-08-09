import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/business/auth.service';

import { ErrorObject } from '../../../shared/models/common/error-object.model';

import { ChangePasswordAction, ChangePasswordFailAction, ChangePasswordResetAction, ChangePasswordSuccessAction } from './change-password.actions';
import { ChangePasswordState, ChangePasswordStateModel } from './change-password.reducer';

describe('ChangePassword state tests', () => {
    const error = new ErrorObject('test');
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const authServiceStub = { async changePassword() { return Promise.resolve({}); } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([ChangePasswordState])],
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
        actions$.pipe(ofActionDispatched(ChangePasswordSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(ChangePasswordFailAction)).subscribe(() => failActionDispatched = true);

        store.reset({ changePassword: { pending: false, changed: true, error } });
        store.dispatch(new ChangePasswordAction({ userUid: '1', oldPassword: 'test1', newPassword: 'newPass' }));

        store.selectOnce(state => state.changePassword).subscribe((slice: ChangePasswordStateModel) => {
            expect(slice).toEqual({ pending: true, changed: false, error: null }, 'error should be cleared, "changed" flag should be reset, pending should be be set true');
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
            }, 2);
        });
    }));

    it('should update state with success on dispatching ChangePasswordSuccessAction', waitForAsync(() => {
        store.reset({ changePassword: { pending: true, changed: false, error } });
        store.dispatch(new ChangePasswordSuccessAction());

        store.selectOnce(state => state.changePassword).subscribe((slice: ChangePasswordStateModel) => {
            expect(slice).toEqual({ pending: false, changed: true, error: null });
        });
    }));

    it('should update state with error on dispatching ChangePasswordFailAction', waitForAsync(() => {
        store.reset({ changePassword: { pending: true, changed: true, error: null } });
        store.dispatch(new ChangePasswordFailAction(error));

        store.selectOnce(state => state.changePassword).subscribe((slice: ChangePasswordStateModel) => {
            expect(slice).toEqual({ pending: false, changed: false, error }, 'pending flag should be cleared, error should be set, "changed" flag should be reset');
        });
    }));

    it('should reset state to default', waitForAsync(() => {
        store.reset({ changePassword: { pending: true, changed: true, error } });
        store.dispatch(new ChangePasswordResetAction());

        store.selectOnce(state => state.changePassword).subscribe((slice: ChangePasswordStateModel) => {
            expect(slice).toEqual({ pending: false, changed: false, error: null });
        });
    }));
});
