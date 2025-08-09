import { BaseModel } from '../../base.model';
import { Group } from './user-group.enum';

export interface UserGroup extends BaseModel<number> {
    name: string;
    roleNames: string[];
}

export interface UserGroupUpdateRequest {
    groups: Group[];
}
