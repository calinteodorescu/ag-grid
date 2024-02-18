import { AbstractColDef, Component } from "@ag-grid-community/core";
import { ToolPanelFiltersCompParams } from "./filtersToolPanel";
export declare class FiltersToolPanelListPanel extends Component {
    private static TEMPLATE;
    private toolPanelColDefService;
    private columnModel;
    private initialised;
    private hasLoadedInitialState;
    private isInitialState;
    private params;
    private filterGroupComps;
    private searchFilterText;
    private suppressOnColumnsChanged;
    private onColumnsChangedPending;
    constructor();
    init(params: ToolPanelFiltersCompParams): void;
    onColumnsChanged(): void;
    syncFilterLayout(): void;
    private buildTreeFromProvidedColumnDefs;
    setFiltersLayout(colDefs: AbstractColDef[]): void;
    private recreateFilters;
    private recursivelyAddComps;
    private refreshAriaLabel;
    private recursivelyAddFilterGroupComps;
    private filtersExistInChildren;
    private shouldDisplayFilter;
    private getExpansionState;
    refresh(): void;
    setVisible(visible: boolean): void;
    expandFilterGroups(expand: boolean, groupIds?: string[]): void;
    expandFilters(expand: boolean, colIds?: string[]): void;
    private onGroupExpanded;
    private onFilterExpanded;
    private fireExpandedEvent;
    performFilterSearch(searchText: string): void;
    private searchFilters;
    private setFirstAndLastVisible;
    private refreshFilters;
    getExpandedFiltersAndGroups(): {
        expandedGroupIds: string[];
        expandedColIds: string[];
    };
    private destroyFilters;
    protected destroy(): void;
}
