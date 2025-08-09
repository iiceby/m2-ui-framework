import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ProfileService } from '../../services/business/profile.service';

import { DistanceUnit } from '../../models/business/user/distance-unit.model';
import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { Profile } from '../../models/business/user/profile.model';

import { ProfileUpdateAction, ProfileUpdateFailAction, ProfileUpdateResetAction, ProfileUpdateSuccessAction, ProfileWelcomeDisplayedUpdateAction } from './profile-update.actions';
import { ProfileUpdateState, ProfileUpdateStateModel } from './profile-update.reducer';

describe('ProfileUpdate state tests', () => {
    const error = new ErrorObject('test');
    const profile: Profile = { user: { uid: '123', email: 'test@test.com', firstName: 'John', lastName: 'Doe', isEmailConfirmed: true, isPhoneConfirmed: true, createDate: 1, isActive: true, backgroundUrl: null, backgroundCroppedUrl: null, countryCode: null, regionCode: null, placeId: null }, userSettings: { distanceUnit: DistanceUnit.Kilometer, currency: 'RUB', notificationTypes: [] }, welcomeDisplayed: true, permissions: [] };
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const profileServiceStub = { async updateProfile() { return Promise.resolve(profile); }, setWelcomeDisplayedFlag() { return; } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([ProfileUpdateState])],
            providers: [
                { provide: ProfileService, useValue: profileServiceStub }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        actions$ = TestBed.get(Actions);
    }));

    it('should dispatch success action and update state', waitForAsync(() => {
        let successActionDispatched = false;
        let failActionDispatched = false;
        actions$.pipe(ofActionDispatched(ProfileUpdateSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(ProfileUpdateFailAction)).subscribe(() => failActionDispatched = true);

        store.reset({ profileUpdate: { pending: false, updated: true, error } });
        store.dispatch(new ProfileUpdateAction({ user: { uid: '123', firstName: 'John', lastName: 'Smith' }, userSettings: { distanceUnit: DistanceUnit.Kilometer, currency: 'RUB', notificationTypes: [] } }));

        store.selectOnce(state => state.profileUpdate).subscribe((slice: ProfileUpdateStateModel) => {
            expect(slice).toEqual({ pending: true, updated: false, error: null });
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
            }, 2);
        });
    }));

    it('should update state with success on dispatching ProfileUpdateSuccessAction', waitForAsync(() => {
        store.reset({ profileUpdate: { pending: true, updated: false, error } });
        store.dispatch(new ProfileUpdateSuccessAction(profile));

        store.selectOnce(state => state.profileUpdate).subscribe((slice: ProfileUpdateStateModel) => {
            expect(slice).toEqual({ pending: false, updated: true, error: null });
        });
    }));

    it('should update state with error on dispatching ProfileUpdateFailAction', waitForAsync(() => {
        store.reset({ profileUpdate: { pending: true, updated: true, error: null } });
        store.dispatch(new ProfileUpdateFailAction(error));

        store.selectOnce(state => state.profileUpdate).subscribe((slice: ProfileUpdateStateModel) => {
            expect(slice).toEqual({ pending: false, updated: false, error });
        });
    }));

    it('should reset state to default', waitForAsync(() => {
        store.reset({ profileUpdate: { pending: true, updated: true, error } });
        store.dispatch(new ProfileUpdateResetAction());

        store.selectOnce(state => state.profileUpdate).subscribe((slice: ProfileUpdateStateModel) => {
            expect(slice).toEqual({ pending: false, updated: false, error: null });
        });
    }));

    it('should NOT update state on ProfileWelcomeDisplayedUpdateAction', waitForAsync(() => {
        store.reset({ profileUpdate: { pending: true, updated: false, error } });
        store.dispatch(new ProfileWelcomeDisplayedUpdateAction({ welcomeDisplayed: true }));

        store.selectOnce(state => state.profileUpdate).subscribe((slice: ProfileUpdateStateModel) => {
            expect(slice).toEqual({ pending: true, updated: false, error }, 'state should remain the same because we do not have any logic now. There is only call of synchronous service inside');
        });
    }));
});
