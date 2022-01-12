import { ColDef, GridOptions } from '@ag-grid-community/core'
import { NumberFloatingFilterComponent, CustomParams } from "./numberFloatingFilterComponent_typescript";

const columnDefs: ColDef[] = [
  { field: 'athlete', filter: false },
  {
    field: 'gold',
    filterComp: 'agNumberColumnFilter',
    suppressMenu: true,
    floatingFilterComp: NumberFloatingFilterComponent,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
      color: 'red',
    } as CustomParams,
  },
  {
    field: 'silver',
    filterComp: 'agNumberColumnFilter',
    suppressMenu: true,
    floatingFilterComp: NumberFloatingFilterComponent,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
      color: 'blue',
    } as CustomParams,
  },
  {
    field: 'bronze',
    filterComp: 'agNumberColumnFilter',
    suppressMenu: true,
    floatingFilterComp: NumberFloatingFilterComponent,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
      color: 'green',
    } as CustomParams,
  },
  {
    field: 'total',
    filterComp: 'agNumberColumnFilter',
    suppressMenu: true,
    floatingFilterComp: NumberFloatingFilterComponent,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
      color: 'orange',
    } as CustomParams,
  },
]

const gridOptions: GridOptions = {
  defaultColDef: {
    editable: true,
    sortable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
    resizable: true,
  },
  columnDefs: columnDefs,
  rowData: null,
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new agGrid.Grid(gridDiv, gridOptions)

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then(data => {
      gridOptions.api!.setRowData(data)
    })
})
