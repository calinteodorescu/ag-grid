// Type definitions for @ag-grid-community/core v31.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { RowBounds, RowModelType } from "../interfaces/iRowModel";
import { BeanStub } from "../context/beanStub";
import { RowNode } from "../entities/rowNode";
import { RowPosition } from "../entities/rowPositionUtils";
export declare class PaginationProxy extends BeanStub {
    private rowModel;
    private active;
    private paginateChildRows;
    private pageSizeAutoCalculated?;
    private pageSizeFromPageSizeSelector?;
    private pageSizeFromInitialState?;
    private pageSizeFromGridOptions?;
    private defaultPageSize;
    private totalPages;
    private currentPage;
    private topDisplayedRowIndex;
    private bottomDisplayedRowIndex;
    private pixelOffset;
    private topRowBounds;
    private bottomRowBounds;
    private masterRowCount;
    private postConstruct;
    ensureRowHeightsValid(startPixel: number, endPixel: number, startLimitIndex: number, endLimitIndex: number): boolean;
    private isPaginateChildRows;
    private onModelUpdated;
    private onPaginationGridOptionChanged;
    private onPageSizeGridOptionChanged;
    goToPage(page: number): void;
    getPixelOffset(): number;
    getRow(index: number): RowNode | undefined;
    getRowNode(id: string): RowNode | undefined;
    getRowIndexAtPixel(pixel: number): number;
    getCurrentPageHeight(): number;
    getCurrentPagePixelRange(): {
        pageFirstPixel: number;
        pageLastPixel: number;
    };
    isRowPresent(rowNode: RowNode): boolean;
    isEmpty(): boolean;
    isRowsToRender(): boolean;
    forEachNode(callback: (rowNode: RowNode, index: number) => void): void;
    forEachNodeOnPage(callback: (rowNode: RowNode) => void): void;
    getType(): RowModelType;
    getRowBounds(index: number): RowBounds;
    getPageFirstRow(): number;
    getPageLastRow(): number;
    getRowCount(): number;
    getPageForIndex(index: number): number;
    goToPageWithIndex(index: any): void;
    isRowInPage(row: RowPosition): boolean;
    isLastPageFound(): boolean;
    getCurrentPage(): number;
    goToNextPage(): void;
    goToPreviousPage(): void;
    goToFirstPage(): void;
    goToLastPage(): void;
    getPageSize(): number;
    getTotalPages(): number;
    /** This is only for state setting before data has been loaded */
    setPage(page: number): void;
    private get pageSize();
    unsetAutoCalculatedPageSize(): void;
    setPageSize(size: number, source: 'autoCalculated' | 'pageSizeSelector' | 'initialState' | 'gridOptions'): void;
    private calculatePages;
    private setPixelOffset;
    private setZeroRows;
    private adjustCurrentPageIfInvalid;
    private calculatePagesMasterRowsOnly;
    getMasterRowCount(): number;
    private calculatePagesAllRows;
    private calculatedPagesNotActive;
}
