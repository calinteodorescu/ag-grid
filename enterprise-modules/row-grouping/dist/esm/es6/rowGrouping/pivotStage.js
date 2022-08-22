var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired, Bean, BeanStub, _ } from "@ag-grid-community/core";
let PivotStage = class PivotStage extends BeanStub {
    constructor() {
        super(...arguments);
        this.uniqueValues = {};
    }
    execute(params) {
        const rootNode = params.rowNode;
        const changedPath = params.changedPath;
        if (this.columnModel.isPivotActive()) {
            this.executePivotOn(rootNode, changedPath);
        }
        else {
            this.executePivotOff(changedPath);
        }
    }
    executePivotOff(changedPath) {
        this.aggregationColumnsHashLastTime = null;
        this.uniqueValues = {};
        if (this.columnModel.isSecondaryColumnsPresent()) {
            this.columnModel.setSecondaryColumns(null, "rowModelUpdated");
            if (changedPath) {
                changedPath.setInactive();
            }
        }
    }
    executePivotOn(rootNode, changedPath) {
        const uniqueValues = this.bucketUpRowNodes(rootNode);
        const uniqueValuesChanged = this.setUniqueValues(uniqueValues);
        const aggregationColumns = this.columnModel.getValueColumns();
        const aggregationColumnsHash = aggregationColumns.map((column) => `${column.getId()}-${column.getColDef().headerName}`).join('#');
        const aggregationFuncsHash = aggregationColumns.map((column) => column.getAggFunc().toString()).join('#');
        const aggregationColumnsChanged = this.aggregationColumnsHashLastTime !== aggregationColumnsHash;
        const aggregationFuncsChanged = this.aggregationFuncsHashLastTime !== aggregationFuncsHash;
        this.aggregationColumnsHashLastTime = aggregationColumnsHash;
        this.aggregationFuncsHashLastTime = aggregationFuncsHash;
        const groupColumnsHash = this.columnModel.getRowGroupColumns().map((column) => column.getId()).join('#');
        const groupColumnsChanged = groupColumnsHash !== this.groupColumnsHashLastTime;
        this.groupColumnsHashLastTime = groupColumnsHash;
        if (uniqueValuesChanged || aggregationColumnsChanged || groupColumnsChanged || aggregationFuncsChanged) {
            const { pivotColumnGroupDefs, pivotColumnDefs } = this.pivotColDefService.createPivotColumnDefs(this.uniqueValues);
            this.pivotColumnDefs = pivotColumnDefs;
            this.columnModel.setSecondaryColumns(pivotColumnGroupDefs, "rowModelUpdated");
            // because the secondary columns have changed, then the aggregation needs to visit the whole
            // tree again, so we make the changedPath not active, to force aggregation to visit all paths.
            if (changedPath) {
                changedPath.setInactive();
            }
        }
    }
    setUniqueValues(newValues) {
        const json1 = JSON.stringify(newValues);
        const json2 = JSON.stringify(this.uniqueValues);
        const uniqueValuesChanged = json1 !== json2;
        // we only continue the below if the unique values are different, as otherwise
        // the result will be the same as the last time we did it
        if (uniqueValuesChanged) {
            this.uniqueValues = newValues;
            return true;
        }
        else {
            return false;
        }
    }
    // returns true if values were different
    bucketUpRowNodes(rootNode) {
        // accessed from inside inner function
        const uniqueValues = {};
        // finds all leaf groups and calls mapRowNode with it
        const recursivelySearchForLeafNodes = (rowNode) => {
            if (rowNode.leafGroup) {
                this.bucketRowNode(rowNode, uniqueValues);
            }
            else {
                rowNode.childrenAfterFilter.forEach(child => {
                    recursivelySearchForLeafNodes(child);
                });
            }
        };
        recursivelySearchForLeafNodes(rootNode);
        return uniqueValues;
    }
    bucketRowNode(rowNode, uniqueValues) {
        const pivotColumns = this.columnModel.getPivotColumns();
        if (pivotColumns.length === 0) {
            rowNode.childrenMapped = null;
        }
        else {
            rowNode.childrenMapped = this.bucketChildren(rowNode.childrenAfterFilter, pivotColumns, 0, uniqueValues);
        }
        if (rowNode.sibling) {
            rowNode.sibling.childrenMapped = rowNode.childrenMapped;
        }
    }
    bucketChildren(children, pivotColumns, pivotIndex, uniqueValues) {
        const mappedChildren = {};
        const pivotColumn = pivotColumns[pivotIndex];
        // map the children out based on the pivot column
        children.forEach((child) => {
            let key = this.valueService.getKeyForNode(pivotColumn, child);
            if (_.missing(key)) {
                key = '';
            }
            if (!uniqueValues[key]) {
                uniqueValues[key] = {};
            }
            if (!mappedChildren[key]) {
                mappedChildren[key] = [];
            }
            mappedChildren[key].push(child);
        });
        // if it's the last pivot column, return as is, otherwise go one level further in the map
        if (pivotIndex === pivotColumns.length - 1) {
            return mappedChildren;
        }
        else {
            const result = {};
            _.iterateObject(mappedChildren, (key, value) => {
                result[key] = this.bucketChildren(value, pivotColumns, pivotIndex + 1, uniqueValues[key]);
            });
            return result;
        }
    }
    getPivotColumnDefs() {
        return this.pivotColumnDefs;
    }
};
__decorate([
    Autowired('valueService')
], PivotStage.prototype, "valueService", void 0);
__decorate([
    Autowired('columnModel')
], PivotStage.prototype, "columnModel", void 0);
__decorate([
    Autowired('pivotColDefService')
], PivotStage.prototype, "pivotColDefService", void 0);
PivotStage = __decorate([
    Bean('pivotStage')
], PivotStage);
export { PivotStage };
