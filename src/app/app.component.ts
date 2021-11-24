import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { TransferChange } from 'ng-zorro-antd/transfer';
import { NzTreeComponent } from 'ng-zorro-antd/tree';

@Component({
  selector: 'nz-demo-transfer-tree-transfer',
  template: `
    <nz-transfer
      [nzDataSource]="list"
      [nzShowSelectAll]="false"
      [nzRenderList]="[leftRenderList, leftRenderList2]"
      (nzChange)="change($event)"
      (nzSelectChange)="select($event)"
      [nzItemUnit]="' '"
      [nzItemsUnit]="' '"
      [nzTitles]="['Users', 'Assigned users']"
    >
      <ng-template #leftRenderList let-items let-onItemSelectAll="onItemSelectAll" let-onItemSelect="onItemSelect">
        <nz-tree #tree [nzData]="treeData" nzExpandAll nzBlockNode>
          <ng-template #nzTreeTemplate let-node>
            <span
              class="ant-tree-checkbox"
              [class.ant-tree-checkbox-disabled]="node.isDisabled"
              [class.ant-tree-checkbox-checked]="node.isChecked"
              (click)="checkBoxChange(node, onItemSelect)"
            >
              <span class="ant-tree-checkbox-inner"></span>
            </span>
            <span
              (click)="checkBoxChange(node, onItemSelect)"
              class="ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open"
            >
              {{ node.title }}
            </span>
          </ng-template>
        </nz-tree>
      </ng-template>

      <ng-template #rightRenderList let-items let-onItemSelectAll="onItemSelectAll" let-onItemSelect="onItemSelect">
      {{items | json}}
        <nz-tree #tree [nzData]="convertToTree(items)" nzExpandAll nzBlockNode>
          <ng-template #nzTreeTemplate let-node>
            <span
              class="ant-tree-checkbox"
              [class.ant-tree-checkbox-disabled]="node.isDisabled"
              [class.ant-tree-checkbox-checked]="node.isChecked"
              (click)="checkBoxChange(node, onItemSelect)"
            >
              <span class="ant-tree-checkbox-inner"></span>
            </span>
            <span
              (click)="checkBoxChange(node, onItemSelect)"
              class="ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open"
            >
              {{ node.title }}
            </span>
          </ng-template>
        </nz-tree>
      </ng-template>

      <ng-template #rightRenderList2 let-items let-onItemSelectAll="onItemSelectAll" let-onItemSelect="onItemSelect">
        <section *ngFor="let n of getItems(items)">
            <span
            class="ant-tree-checkbox"
            [class.ant-tree-checkbox-disabled]="n.isDisabled"
            [class.ant-tree-checkbox-checked]="n.isChecked"
            (click)="onItemSelect(n)"
          >
            <span class="ant-tree-checkbox-inner"></span>
          </span>
          <span
            (click)="checkBoxChange(n, onItemSelect)"
            class="ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open"
          >
            {{ n.title }}
          </span>
        </section>
      </ng-template>

    </nz-transfer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NzDemoTransferTreeTransferComponent {
  @ViewChild('tree', { static: true }) tree!: NzTreeComponent;
  list: NzTreeNodeOptions[] = [
    { key: '1', id: 1, parentid: 0, title: 'parent 1' },
    {
      key: '2',
      id: 2,
      parentid: 1,
      title: 'leaf 1-1',
      disabled: true,
      isLeaf: true,
    },
    { key: '3', id: 3, parentid: 1, title: 'leaf 1-2', isLeaf: true },
  ];
  treeData = this.generateTree(this.list);
  list2 = [];
  treeData2 = null;
  checkedNodeList: NzTreeNode[] = [];
  selectedIds = [];

  convertToTree(items): any {
    const updatedItems = items.map((a) => {
      const { parentid, ...o } = a;

      return { ...o };
    });

    // return this.generateTree(updatedItems);
    return this.generateTree(updatedItems);
  }

  getItems(items): any {
    return items.filter((i) => i.parentid !== 1);
  }

  private generateTree(arr: NzTreeNodeOptions[]): NzTreeNodeOptions[] {
    // console.log(arr)
    const tree: NzTreeNodeOptions[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedArr: any = {};
    let arrElem: NzTreeNodeOptions;
    let mappedElem: NzTreeNodeOptions;

    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = { ...arrElem };
      mappedArr[arrElem.id].children = [];
    }

    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        if (mappedElem.parentid) {
          if (!mappedArr[mappedElem.parentid]?.children) {
            mappedArr[mappedElem.parentid] = {
              ...mappedArr[mappedElem.parentid],
              children: [],
            };
          }
          mappedArr[mappedElem.parentid].children.push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  private generateTree2(arr: NzTreeNodeOptions[]): NzTreeNodeOptions[] {
    const tree: NzTreeNodeOptions[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedArr: any = {};
    let arrElem: NzTreeNodeOptions;
    let mappedElem: NzTreeNodeOptions;

    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = { ...arrElem };
    }

    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];

        tree.push(mappedElem);
      }
    }
    return tree;
  }

  select(e): void {
    console.log(e);
  }

  checkBoxChange(
    node: NzTreeNode,
    onItemSelect: (item: NzTreeNodeOptions) => void
  ): void {
    if (node.isDisabled) {
      return;
    }
    console.log(node.children);
    node.isChecked = !node.isChecked;
    if (node.isChecked) {
      this.checkedNodeList.push(node);
      this.list2 = [...this.list2, node];
    } else {
      const idx = this.checkedNodeList.indexOf(node);
      if (idx !== -1) {
        this.checkedNodeList.splice(idx, 1);
      }
    }

    if (node.children.length > 0) {
      node.children.forEach((n) => {
        n.isChecked = true;
        n.isDisabled = true;
      });
      this.checkedNodeList = [...this.checkedNodeList, ...node.children];
      const ids = node.children.map((n) => n.key);
      this.selectedIds = ids;
    }

    const item = this.list.find((w) => w.id === node.origin.id);
    onItemSelect(item!);
  }

  change(ret: TransferChange): void {
    const isDisabled = ret.to === 'right';
    this.list = this.list.map((n) => {
      return {
        ...n,
        direction: ret.to,
      };
    });
    this.checkedNodeList.forEach((node) => {
      node.isDisabled = isDisabled;
      node.isChecked = isDisabled;
    });
  }
}
