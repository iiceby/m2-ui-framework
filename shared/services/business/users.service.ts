import { Injectable } from '@angular/core';

import { BaseSingletonService } from '../../../shared/services/common/base-singleton.service';
import { HttpService } from '../../../shared/services/common/http.service';

import { UserGroup } from '../../models/business/user/user-group.model';
import { User, UserTypeDataGuard, UserUpdateRequest } from '../../models/business/user/user.model';

import { String } from '../../../shared/utils/string';

@Injectable({
    providedIn: 'root'
})
export class BaseUsersService extends BaseSingletonService {

    private settings: {
        service: {
            getUser: string;
            getUserGroups: string;
            updateUser: string;
            deleteUserAvatar: string;
        }
    };

    constructor(private http: HttpService) {
        super('BaseUsersService');
        this.settings = {
            service: {
                getUser: '/identity/v1/users/{0}',
                getUserGroups: '/identity/v1/groups?userUid={0}',
                updateUser: '/identity/v1/users/{0}',
                deleteUserAvatar: '/identity/v1/users/{0}/avatar'
            }
        };
    }

    /**
     * Get user data
     */
    public async getUser(userUid: string): Promise<User> {
        return this.http.get<{ data: User }>(String.format(this.settings.service.getUser, userUid), new UserTypeDataGuard())
            .then(res => res.data);
    }

    /**
     * Get user roles/permissions
     */
    public async getUserGroups(userUid: string): Promise<{ list: UserGroup[] }> {
        return this.http.get<{ list: UserGroup[] }>(String.format(this.settings.service.getUserGroups, userUid));
    }

    /**
     * Update user req
     */
    public async updateUser(uid: string, req: UserUpdateRequest): Promise<User> {
        return this.http.put<{ data: User }>(String.format(this.settings.service.updateUser, uid), req)
            .then(x => x.data);
    }

    /**
     * Delete user's avatar
     */
    public async deleteUserAvatar(userUid: string): Promise<boolean> {
        return this.http.delete(String.format(this.settings.service.deleteUserAvatar, userUid));
    }
}
