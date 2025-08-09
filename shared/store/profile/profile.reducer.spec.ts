import { TestBed, waitForAsync } from '@angular/core/testing';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ProfileService } from '../../services/business/profile.service';

import { DistanceUnit } from '../../models/business/user/distance-unit.model';
import { ErrorObject } from '../../../shared/models/common/error-object.model';
import { Profile } from '../../models/business/user/profile.model';

import { ProfileWelcomeDisplayedUpdateAction } from './profile-update.actions';
import { ProfileFailAction, ProfileFromAuthGuardAction, ProfileSuccessAction, UserNameUpdateAction } from './profile.actions';
import { ProfileState, ProfileStateModel } from './profile.reducer';

describe('Profile state tests', () => {
    const error = new ErrorObject('test');
    const profile: Profile = { user: { uid: '123', email: 'test@test.com', firstName: 'John', lastName: 'Doe', isEmailConfirmed: true, isPhoneConfirmed: true, createDate: 1, backgroundUrl: null, backgroundCroppedUrl: null, countryCode: null, regionCode: null, placeId: null, isActive: true }, userSettings: { distanceUnit: DistanceUnit.Kilometer, primaryVehicleType: VehicleType.Atv, currency: 'RUB', notificationTypes: [] }, welcomeDisplayed: true, permissions: [] };
    let store: Store;
    let actions$: Observable<any>;

    beforeEach(waitForAsync(() => {
        const profileServiceStub = { async getProfile() { return Promise.resolve(profile); } };

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([ProfileState])],
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
        actions$.pipe(ofActionDispatched(ProfileSuccessAction)).subscribe(() => successActionDispatched = true);
        actions$.pipe(ofActionDispatched(ProfileFailAction)).subscribe(() => failActionDispatched = true);

        store.reset({ profile: { pending: false, profile: null, error } });
        store.dispatch(new ProfileFromAuthGuardAction({ userUid: '123' }));

        store.selectOnce(state => state.profile).subscribe((slice: ProfileStateModel) => {
            expect(slice).toEqual({ pending: true, profile: null, error: null }, 'error should be cleared, previous state should remain until success or fail action fired');
            setTimeout(() => {
                expect(successActionDispatched).toBe(true);
                expect(failActionDispatched).toBe(false);
            }, 2);
        });
    }));

    it('should update state with success on dispatching ProfileSuccessAction', waitForAsync(() => {
        store.reset({ profile: { pending: true, profile: null, error } });
        store.dispatch(new ProfileSuccessAction(profile));

        store.selectOnce(state => state.profile).subscribe((slice: ProfileStateModel) => {
            expect(slice).toEqual({ pending: false, profile, error: null });
        });
    }));

    it('should update state with error on dispatching ProfileFailAction', waitForAsync(() => {
        store.reset({ profile: { pending: true, profile, error: null } });
        store.dispatch(new ProfileFailAction(error));

        store.selectOnce(state => state.profile).subscribe((slice: ProfileStateModel) => {
            expect(slice).toEqual({ pending: false, profile, error }, 'pending flag should be cleared, error should be set, previous state should remain (until new success action happen)');
        });
    }));

    it('should update state on ProfileWelcomeDisplayedUpdateAction', waitForAsync(() => {
        store.reset({ profile: { pending: true, profile, error } });
        store.dispatch(new ProfileWelcomeDisplayedUpdateAction({ welcomeDisplayed: true }));

        const expectedProfile = { ...profile, welcomeDisplayed: true };

        store.selectOnce(state => state.profile).subscribe((slice: ProfileStateModel) => {
            expect(slice).toEqual({ pending: true, profile: expectedProfile, error }, 'welcomeDisplayed should become true, rest of state should remain the same');
        });
    }));

    it('should update state with on dispatching UserNameUpdateAction', waitForAsync(() => {
        store.reset({ profile: { pending: false, profile, error: null } });
        store.dispatch(new UserNameUpdateAction({ firstName: 'John New', lastName: 'Doe New' }));

        const expectedState = { ...profile };
        expectedState.user.firstName = 'John New';
        expectedState.user.lastName = 'Doe New';
        store.selectOnce(state => state.profile).subscribe((slice: ProfileStateModel) => {
            expect(slice).toEqual({ pending: false, profile: expectedState, error: null });
        });
    }));
});
