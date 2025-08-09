import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TreeNode } from './tree-node.model';

@Component({
    selector: 'exg-tree',
    templateUrl: './exg-tree.component.html',
    styleUrls: ['./exg-tree.component.scss'],
})
export class ExgTree implements OnChanges {

    @Input() public value: string[] = [];
    @Output() readonly valueChange = new EventEmitter<string[]>();
    @Output() readonly clickItem = new EventEmitter();
    @Input() public data: TreeNode[];
    @Input() showCheckboxes = false;
    @Input() showContextMenu = false;

    public currentItemId: any = null;

    ngOnChanges(changes: SimpleChanges): void {
        //@ts-ignore
        if(changes.data && this.data || changes.value && this.value){
            this.updateCheckedState();
        }
    }

    public setAll(node: TreeNode, completed: boolean): void {
        this.setChildrenCheckedState(node, completed);
        this.updateParentTreeNodeState(node);
        this.emitSelectedUids();
    }

    public findParentTreeNode(nodes: TreeNode[], childToFind: TreeNode): TreeNode | null {
        for (const node of nodes || []) {
            if (node.childrens?.some(child => child.id === childToFind.id)) {
                return node;
            }
            //@ts-ignore
            const foundInChildren = this.findParentTreeNode(node.childrens, childToFind);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
        return null;
    }

    private setChildrenCheckedState(node: TreeNode, completed: boolean): void {
        node.checked = completed;
        node.indeterminate = false;
        node.childrens?.forEach(cTreeNode => {
            this.setChildrenCheckedState(cTreeNode, completed);
        });
    }

    private updateParentTreeNodeState(node: TreeNode): void {
        const parentTreeNode = this.findParentTreeNode(this.data, node);
        if (parentTreeNode && parentTreeNode.childrens) {
            const allChecked = parentTreeNode.childrens.every(c => c.checked);
            const allUnchecked = parentTreeNode.childrens.every(c => !c.checked);
            const someChecked = parentTreeNode.childrens.some(c => c.checked);
            const someIndeterminate = parentTreeNode.childrens.some(c => c.indeterminate);
            const everyIndeterminate = parentTreeNode.childrens.every(c => c.indeterminate);
            parentTreeNode.checked = allChecked;
            parentTreeNode.indeterminate = !allChecked && !allUnchecked && (someChecked || someIndeterminate) || everyIndeterminate;
    
            if (parentTreeNode.id) {
                this.updateParentTreeNodeState(parentTreeNode);
            }
        }
    }

    private updateCheckedState(): void {
        if (this.data && this.value) {
            this.data.forEach((node) => {
                node.showChilds = true;
                this.updateTreeNodeCheckedState(node, this.value.includes(node.id));
            });
            this.data.forEach(node => {
                if (node.childrens) {
                    this.updateParentTreeNodeState(node);
                }
            });
        }
    }
    
    private updateTreeNodeCheckedState(node: TreeNode, isSelected: boolean): void {
        if (!node.childrens) {
            node.indeterminate = false;
        }
        node.checked = isSelected;
        if (node.childrens) {
            node.childrens.forEach(child => {
                const childIsSelected = this.value.includes(child.id);
                this.updateTreeNodeCheckedState(child, childIsSelected);
            });
        }
        node.indeterminate = node.childrens?.some(child => child.indeterminate || (child.checked && !isSelected)) ?? false;
        this.updateParentTreeNodeState(node);
    }

    private getSelectedUids(nodes: TreeNode[]): string[] {
        let value: string[] = [];
        nodes.forEach(node => {
            if (node.checked) {
                value.push(node.id);
            }
            if (node.childrens) {
                value = value.concat(this.getSelectedUids(node.childrens));
            }
        });
        return value;
    }

    private emitSelectedUids(): void {
        const value = this.getSelectedUids(this.data);
        this.valueChange.emit(value);
    }

    public menuItems = [
        { id: YeTopMenuEnum.Download, title: 'Смотреть пакеты', color: 'primary' },
        { id: YeTopMenuEnum.Print, title: 'Аналитика', color: 'primary'},
        { id: YeTopMenuEnum.Send, title: 'Аварии', color: 'primary'},
        { id: YeTopMenuEnum.Delete, title: 'Прочее', color: 'warn'},
    ] as any;

    onMenuItemClick(node: any){
        this.currentItemId = node.id;
        this.clickItem.emit(node);
    }
}

export enum YeTopMenuEnum {
    Download = 'download',
    Print = 'print',
    Send = 'send',
    Delete = 'delete'
}
