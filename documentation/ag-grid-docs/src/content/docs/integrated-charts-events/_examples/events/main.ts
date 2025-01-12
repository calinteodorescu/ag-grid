import { ClientSideRowModelModule } from 'ag-grid-community';
import type {
    ChartCreatedEvent,
    ChartDestroyedEvent,
    ChartOptionsChangedEvent,
    ChartRangeSelectionChangedEvent,
    GridApi,
    GridOptions,
} from 'ag-grid-community';
import { createGrid } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import { GridChartsModule } from 'ag-grid-enterprise';
import { MenuModule } from 'ag-grid-enterprise';
import { RowGroupingModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([ClientSideRowModelModule, GridChartsModule, MenuModule, RowGroupingModule]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
    columnDefs: [
        { field: 'Month', width: 150, chartDataType: 'category' },
        { field: 'Sunshine (hours)', chartDataType: 'series' },
        { field: 'Rainfall (mm)', chartDataType: 'series' },
    ],
    defaultColDef: {
        flex: 1,
    },
    cellSelection: true,
    popupParent: document.body,
    enableCharts: true,
    onChartCreated: onChartCreated,
    onChartRangeSelectionChanged: onChartRangeSelectionChanged,
    onChartOptionsChanged: onChartOptionsChanged,
    onChartDestroyed: onChartDestroyed,
};

function onChartCreated(event: ChartCreatedEvent) {
    console.log('Created chart with ID ' + event.chartId, event);
}

function onChartRangeSelectionChanged(event: ChartRangeSelectionChangedEvent) {
    console.log('Changed range selection of chart with ID ' + event.chartId, event);
}

function onChartOptionsChanged(event: ChartOptionsChangedEvent) {
    console.log('Changed options of chart with ID ' + event.chartId, event);
}

function onChartDestroyed(event: ChartDestroyedEvent) {
    console.log('Destroyed chart with ID ' + event.chartId, event);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/weather-se-england.json')
        .then((response) => response.json())
        .then(function (data) {
            gridApi!.setGridOption('rowData', data);
        });
});
