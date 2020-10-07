// Type definitions for @ag-grid-community/core v24.1.0
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { ColDef, ColGroupDef } from "../entities/colDef";
import { OriginalColumnGroupChild } from "../entities/originalColumnGroupChild";
import { Column } from "../entities/column";
import { BeanStub } from "../context/beanStub";
export declare class ColumnFactory extends BeanStub {
    private gridOptionsWrapper;
    private columnUtils;
    private logger;
    private setBeans;
    createColumnTree(defs: (ColDef | ColGroupDef)[] | null, primaryColumns: boolean, existingColumns?: Column[]): {
        columnTree: OriginalColumnGroupChild[];
        treeDept: number;
    };
    createForAutoGroups(autoGroupCols: Column[] | null, gridBalancedTree: OriginalColumnGroupChild[]): OriginalColumnGroupChild[];
    private createAutoGroupTreeItem;
    private findDepth;
    private balanceColumnTree;
    private findMaxDept;
    private recursivelyCreateColumns;
    private createColumnGroup;
    private createMergedColGroupDef;
    private createColumn;
    private applyColumnState;
    findExistingColumn(newColDef: ColDef, existingColsCopy: Column[]): Column;
    mergeColDefs(colDef: ColDef): ColDef;
    private assignColumnTypes;
    private checkForDeprecatedItems;
    private isColumnGroup;
}
