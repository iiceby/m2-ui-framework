import { AccessoryTreeTypeItemEnum } from "src/app/modules/main/components/accessory-tree/accessory-tree-type-item.enum";

export interface TreeNode {
    id: any;
    name: any;
    checked?: boolean;
    data: any;
    type: AccessoryTreeTypeItemEnum;
    showChilds?: boolean;
    childrens?: TreeNode[];
    indeterminate?: boolean;
}