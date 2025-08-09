import { NestedTreeControl } from '@angular/cdk/tree';
import { Location } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface TreeNode {
    name: string;
    route: string;
    icon?: string;
    disableArrow?: boolean;
    children?: TreeNode[];
}

@Component({
    selector: 'exg-routing-tree',
    templateUrl: './exg-routing-tree.component.html',
    styleUrls: ['./exg-routing-tree.component.scss'],
})
export class ExgRoutingTree implements OnChanges {
    @Input() treeNodes: TreeNode[];

    public treeControl = new NestedTreeControl<TreeNode>(node => node.children);
    public dataSource = new MatTreeNestedDataSource<TreeNode>();

    constructor(private location: Location) { }

    hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

    exactMatch = (node: TreeNode) => node.route === this.location.prepareExternalUrl(this.location.path());

    ngOnChanges(changes: SimpleChanges): void {
            //@ts-ignore
        if (changes.treeNodes && this.treeNodes) {
            this.dataSource.data = this.treeNodes;
            const currentLocation = this.location.prepareExternalUrl(this.location.path());
                //@ts-ignore
            this.treeControl.expand(this.getNode(this.treeNodes, currentLocation));
        }
    }

    //@ts-ignore
    private getNode(nodes: TreeNode[], urlToFind: string) {
        if (!nodes || nodes.length < 1) {
            return null;
        }

        const nodeIndex = nodes.findIndex(n => n.route === urlToFind);
        if (nodeIndex > -1) {
            return nodes[nodeIndex];
        }

        for (const n of nodes) {
                //@ts-ignore
            const node = this.getNode(n.children, urlToFind);
            if (node != null) {
                return n;
            }
        }
    }
}
