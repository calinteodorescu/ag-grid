import {
    _,
    AgChartThemeOverrides,
    AgDialog,
    Autowired,
    CellRange,
    ChartCreated,
    ChartDestroyed,
    ChartModel,
    ChartOptions,
    ChartType,
    ColumnApi,
    ColumnController,
    Component,
    Environment,
    Events,
    GridApi,
    IAggFunc,
    PopupService,
    PostConstruct,
    ProcessChartOptionsParams,
    RefSelector
} from "@ag-grid-community/core";
import { ChartMenu } from "./menu/chartMenu";
import { TitleEdit } from "./titleEdit";
import { ChartController } from "./chartController";
import { ChartDataModel, ChartModelParams } from "./chartDataModel";
import { BarChartProxy } from "./chartProxies/cartesian/barChartProxy";
import { AreaChartProxy } from "./chartProxies/cartesian/areaChartProxy";
import { ChartProxy, ChartProxyParams, UpdateChartParams } from "./chartProxies/chartProxy";
import { LineChartProxy } from "./chartProxies/cartesian/lineChartProxy";
import { PieChartProxy } from "./chartProxies/polar/pieChartProxy";
import { DoughnutChartProxy } from "./chartProxies/polar/doughnutChartProxy";
import { ScatterChartProxy } from "./chartProxies/cartesian/scatterChartProxy";
import { HistogramChartProxy } from "./chartProxies/cartesian/histogramChartProxy";
import { ChartTranslator } from "./chartTranslator";
import { ChartCrossFilter } from "./chartCrossFilter";
import { CrossFilteringContext } from "../chartService";

export interface GridChartParams {
    pivotChart: boolean;
    cellRange: CellRange;
    chartType: ChartType;
    chartThemeName?: string;
    insideDialog: boolean;
    suppressChartRanges: boolean;
    aggFunc?: string | IAggFunc;
    chartThemeOverrides?: AgChartThemeOverrides;
    unlinkChart?: boolean;
    processChartOptions?: (params: ProcessChartOptionsParams) => ChartOptions<any>;
    crossFiltering: boolean;
    crossFilteringContext: CrossFilteringContext;
}

export class GridChartComp extends Component {
    private static TEMPLATE = /* html */
        `<div class="ag-chart" tabindex="-1">
            <div ref="eChartContainer" tabindex="-1" class="ag-chart-components-wrapper">
                <div ref="eChart" class="ag-chart-canvas-wrapper"></div>
                <div ref="eEmpty" class="ag-chart-empty-text ag-unselectable"></div>
            </div>
            <div ref="eTitleEditContainer"></div>
            <div ref="eMenuContainer" class="ag-chart-docked-container"></div>
        </div>`;

    @RefSelector('eChart') private readonly eChart: HTMLElement;
    @RefSelector('eChartContainer') private readonly eChartContainer: HTMLElement;
    @RefSelector('eMenuContainer') private readonly eMenuContainer: HTMLElement;
    @RefSelector('eEmpty') private readonly eEmpty: HTMLElement;
    @RefSelector('eTitleEditContainer') private readonly eTitleEditContainer: HTMLDivElement;

    @Autowired('environment') private readonly environment: Environment;
    @Autowired('chartTranslator') private readonly chartTranslator: ChartTranslator;
    @Autowired('columnController') private readonly columnController: ColumnController;

    @Autowired('gridApi') private readonly gridApi: GridApi;
    @Autowired('columnApi') private readonly columnApi: ColumnApi;
    @Autowired('popupService') private readonly popupService: PopupService;

    private chartMenu: ChartMenu;
    private titleEdit: TitleEdit;
    private chartDialog: AgDialog;

    private model: ChartDataModel;
    private chartController: ChartController;

    private chartProxy: ChartProxy<any, any>;
    private chartType: ChartType;
    private chartThemeName?: string;

    constructor(private readonly params: GridChartParams) {
        super(GridChartComp.TEMPLATE);
    }

    @PostConstruct
    public init(): void {
        const availableChartThemes = this.gridOptionsWrapper.getChartThemes();

        if (availableChartThemes.length < 1) {
            throw new Error('Cannot create chart: no chart themes are available to be used.');
        }

        let { chartThemeName } = this.params;

        if (!_.includes(availableChartThemes, chartThemeName)) {
            chartThemeName = availableChartThemes[0];
        }

        const modelParams: ChartModelParams = {
            pivotChart: this.params.pivotChart,
            chartType: this.params.chartType,
            chartThemeName: chartThemeName!,
            aggFunc: this.params.aggFunc,
            cellRange: this.params.cellRange,
            suppressChartRanges: this.params.suppressChartRanges,
            unlinkChart: this.params.unlinkChart,
            crossFiltering: this.params.crossFiltering,
        };

        const isRtl = this.gridOptionsWrapper.isEnableRtl();

        _.addCssClass(this.getGui(), isRtl ? 'ag-rtl' : 'ag-ltr');

        this.model = this.createBean(new ChartDataModel(modelParams));
        this.chartController = this.createManagedBean(new ChartController(this.model));

        this.validateCustomThemes();

        // create chart before dialog to ensure dialog is correct size
        this.createChart();

        if (this.params.insideDialog) {
            this.addDialog();
        }

        this.addMenu();
        this.addTitleEditComp();

        this.addManagedListener(this.getGui(), 'focusin', this.setActiveChartCellRange.bind(this));
        this.addManagedListener(this.chartController, ChartController.EVENT_CHART_UPDATED, this.refresh.bind(this));

        if (this.chartMenu) {
            // chart menu may not exist, i.e. cross filtering
            this.addManagedListener(this.chartMenu, ChartMenu.EVENT_DOWNLOAD_CHART, this.downloadChart.bind(this));
        }

        this.refresh();
        this.raiseChartCreatedEvent();
    }

    private validateCustomThemes() {
        const suppliedThemes = this.gridOptionsWrapper.getChartThemes();
        const customChartThemes = this.gridOptionsWrapper.getCustomChartThemes();
        if (customChartThemes) {
            _.getAllKeysInObjects([customChartThemes]).forEach(customThemeName => {
                if (!_.includes(suppliedThemes, customThemeName)) {
                    console.warn("ag-Grid: a custom chart theme with the name '" + customThemeName + "' has been " +
                        "supplied but not added to the 'chartThemes' list");
                }
            });
        }
    }

    private createChart(): void {
        let width, height;

        // if chart already exists, destroy it and remove it from DOM
        if (this.chartProxy) {
            const chart = this.chartProxy.getChart();

            if (chart) {
                // preserve existing width/height
                width = chart.width;
                height = chart.height;
            }

            this.chartProxy.destroy();
        }

        const processChartOptionsFunc = this.params.processChartOptions || this.gridOptionsWrapper.getProcessChartOptionsFunc();
        const customChartThemes = this.gridOptionsWrapper.getCustomChartThemes();

        const chartType = this.model.getChartType();
        const isGrouping = this.model.isGrouping();

        const crossFilter = this.createManagedBean(new ChartCrossFilter());
        const crossFilterCallback = (event: any, reset: boolean) => {

            // TODO - cross filtering WIP

            const ctx = this.params.crossFilteringContext;

            ctx.lastSelectedChartId = this.model.getChartId();
            const category = event.datum && event.datum[event.xKey];
            if (!event.reset && category) {
                if (event.event.metaKey || event.event.ctrlKey) {

                    if (!ctx.lastSelectedChartId || !ctx.lastSelectedCategoryIds || ctx.lastSelectedCategoryIds.length == 0) {
                        ctx.lastSelectedCategoryIds = [];
                    }

                    if (_.includes(ctx.lastSelectedCategoryIds, category.id)) {
                        ctx.lastSelectedCategoryIds = ctx.lastSelectedCategoryIds.filter((id: any) => id !== category.id);
                    } else {
                        ctx.lastSelectedCategoryIds.push(category.id);
                    }

                } else {
                    ctx.lastSelectedCategoryIds = [category.id];
                }
            } else {
                ctx.lastSelectedCategoryIds = [];
            }

            crossFilter.filter(event, reset);
        }

        const chartProxyParams: ChartProxyParams = {
            chartId: this.model.getChartId(),
            chartType,
            chartThemeName: this.model.getChartThemeName(),
            processChartOptions: processChartOptionsFunc!,
            getChartThemeName: this.getChartThemeName.bind(this),
            getChartThemes: this.getChartThemes.bind(this),
            customChartThemes: customChartThemes,
            getGridOptionsChartThemeOverrides: this.getGridOptionsChartThemeOverrides.bind(this),
            apiChartThemeOverrides: this.params.chartThemeOverrides,
            allowPaletteOverride: !this.params.chartThemeName,
            isDarkTheme: this.environment.isThemeDark.bind(this.environment),
            crossFiltering: this.params.crossFiltering,
            crossFilterCallback,
            parentElement: this.eChart,
            width,
            height,
            grouping: isGrouping,
            document: this.gridOptionsWrapper.getDocument(),
            eventService: this.eventService,
            gridApi: this.gridApi,
            columnApi: this.columnApi,
        };

        // set local state used to detect when chart changes
        this.chartType = chartType;
        this.chartThemeName = this.model.getChartThemeName();
        this.chartProxy = GridChartComp.createChartProxy(chartProxyParams);
        this.titleEdit && this.titleEdit.setChartProxy(this.chartProxy);

        const canvas = this.eChart.querySelector('canvas');

        if (canvas) {
            _.addCssClass(canvas, 'ag-charts-canvas');
        }

        this.chartController.setChartProxy(this.chartProxy);
    }

    private getChartThemeName(): string {
        return this.chartController.getThemeName();
    }

    private getChartThemes(): string[] {
        return this.chartController.getThemes();
    }

    private getGridOptionsChartThemeOverrides(): AgChartThemeOverrides | undefined {
        return this.gridOptionsWrapper.getChartThemeOverrides();
    }

    private static createChartProxy(chartProxyParams: ChartProxyParams): ChartProxy<any, any> {
        switch (chartProxyParams.chartType) {
            case ChartType.GroupedColumn:
            case ChartType.StackedColumn:
            case ChartType.NormalizedColumn:
            case ChartType.GroupedBar:
            case ChartType.StackedBar:
            case ChartType.NormalizedBar:
                return new BarChartProxy(chartProxyParams);
            case ChartType.Pie:
                return new PieChartProxy(chartProxyParams);
            case ChartType.Doughnut:
                return new DoughnutChartProxy(chartProxyParams);
            case ChartType.Area:
            case ChartType.StackedArea:
            case ChartType.NormalizedArea:
                return new AreaChartProxy(chartProxyParams);
            case ChartType.Line:
                return new LineChartProxy(chartProxyParams);
            case ChartType.Scatter:
            case ChartType.Bubble:
                return new ScatterChartProxy(chartProxyParams);
            case ChartType.Histogram:
                return new HistogramChartProxy(chartProxyParams);
        }
    }

    private addDialog(): void {
        const title = this.chartTranslator.translate(this.params.pivotChart ? 'pivotChartTitle' : 'rangeChartTitle');

        const { width, height } = this.getBestDialogSize();

        this.chartDialog = new AgDialog({
            resizable: true,
            movable: true,
            maximizable: true,
            title,
            width,
            height,
            component: this,
            centered: true,
            closable: true
        });

        this.getContext().createBean(this.chartDialog);

        this.chartDialog.addEventListener(AgDialog.EVENT_DESTROYED, () => this.destroy());
    }

    private getBestDialogSize(): { width: number, height: number; } {
        const popupParent = this.popupService.getPopupParent();
        const maxWidth = _.getAbsoluteWidth(popupParent) * 0.75;
        const maxHeight = _.getAbsoluteHeight(popupParent) * 0.75;
        const ratio = 0.553;
        let { width, height } = this.chartProxy.getChartOptions();

        if (width && height) {
            return { width, height };
        }

        const chart = this.chartProxy.getChart();

        width = this.params.insideDialog ? 850 : chart.width;
        height = this.params.insideDialog ? 470 : chart.height;

        if (width > maxWidth || height > maxHeight) {
            width = Math.min(width, maxWidth);
            height = Math.round(width * ratio);

            if (height > maxHeight) {
                height = maxHeight;
                width = Math.min(width, Math.round(height / ratio));
            }
        }

        return { width, height };
    }

    private addMenu(): void {
        if (!this.params.crossFiltering) {
            this.chartMenu = this.createBean(new ChartMenu(this.eChartContainer, this.eMenuContainer, this.chartController));
            this.eChartContainer.appendChild(this.chartMenu.getGui());
        }
    }

    private addTitleEditComp(): void {
        this.titleEdit = this.createBean(new TitleEdit(this.chartMenu));
        this.eTitleEditContainer.appendChild(this.titleEdit.getGui());

        if (this.chartProxy) {
            this.titleEdit.setChartProxy(this.chartProxy);
        }
    }

    private refresh(): void {
        if (this.shouldRecreateChart()) {
            this.createChart();
        }

        this.updateChart();
    }

    private shouldRecreateChart(): boolean {
        return this.chartType !== this.model.getChartType() || this.chartThemeName !== this.model.getChartThemeName();
    }

    public getCurrentChartType(): ChartType {
        return this.chartType;
    }

    public getChartModel(): ChartModel {
        return this.chartController.getChartModel();
    }

    public updateChart(): void {
        const { model, chartProxy } = this;

        const selectedCols = model.getSelectedValueColState();
        const fields = selectedCols.map(c => ({ colId: c.colId, displayName: c.displayName }));

        // TODO cross filtering
        if (this.params.crossFiltering) {
            fields.forEach(field => {
                const crossFilteringField = {...field};
                if (this.chartType !== ChartType.Line) {
                    crossFilteringField.colId = field.colId + '-filtered-out';
                    fields.push(crossFilteringField);
                }
            });
        }

        const data = model.getData();
        const chartEmpty = this.handleEmptyChart(data, fields);

        if (chartEmpty) {
            return;
        }

        const selectedDimension = model.getSelectedDimension();

        const chartUpdateParams: UpdateChartParams = {
            data,
            grouping: model.isGrouping(),
            category: {
                id: selectedDimension.colId,
                name: selectedDimension.displayName!,
                chartDataType: this.getChartDataType(selectedDimension.colId)
            },
            fields,
            chartId: this.model.getChartId(),
            crossFilteringContext: this.params.crossFilteringContext,
        };

        chartProxy.update(chartUpdateParams);
        this.titleEdit.setChartProxy(this.chartProxy);

        if (this.params.crossFiltering) {
            this.params.crossFilteringContext.lastSelectedChartId = '';
        }
    }

    private getChartDataType(colId: string): string | undefined {
        const column = this.columnController.getPrimaryColumn(colId);
        return column ? column.getColDef().chartDataType : undefined;
    }

    private handleEmptyChart(data: any[], fields: any[]): boolean {
        const container = this.chartProxy.getChart().container;
        const pivotModeDisabled = this.model.isPivotChart() && !this.model.isPivotMode();
        let minFieldsRequired = 1;

        if (this.chartController.isActiveXYChart()) {
            minFieldsRequired = this.model.getChartType() === ChartType.Bubble ? 3 : 2;
        }

        const isEmptyChart = fields.length < minFieldsRequired || data.length === 0;

        if (container) {
            const isEmpty = pivotModeDisabled || isEmptyChart;
            _.setDisplayed(this.eChart, !isEmpty);
            _.setDisplayed(this.eEmpty, isEmpty);
        }

        if (pivotModeDisabled) {
            this.eEmpty.innerText = this.chartTranslator.translate('pivotChartRequiresPivotMode');
            return true;
        }

        if (isEmptyChart) {
            this.eEmpty.innerText = this.chartTranslator.translate('noDataToChart');
            return true;
        }

        return false;
    }

    private downloadChart(): void {
        this.chartProxy.downloadChart();
    }

    public getUnderlyingChart(): any {
        return this.chartProxy.getChart();
    }

    public refreshCanvasSize(): void {
        if (!this.params.insideDialog) {
            return;
        }

        const { chartProxy, eChart } = this;
        if (this.chartMenu.isVisible()) {
            // we don't want the menu showing to affect the chart options
            const chart = this.chartProxy.getChart();

            chart.height = _.getInnerHeight(eChart);
            chart.width = _.getInnerWidth(eChart);
        } else {
            chartProxy.setChartOption('width', _.getInnerWidth(eChart));
            chartProxy.setChartOption('height', _.getInnerHeight(eChart));
        }
    }

    private setActiveChartCellRange(focusEvent: FocusEvent): void {
        if (this.getGui().contains(focusEvent.relatedTarget as HTMLElement)) {
            return;
        }

        this.chartController.setChartRange(true);
        (this.gridApi as any).focusController.clearFocusedCell();
    }

    private raiseChartCreatedEvent(): void {
        const chartModel = this.chartController.getChartModel();
        const event: ChartCreated = Object.freeze({
            type: Events.EVENT_CHART_CREATED,
            chartId: chartModel.chartId,
            chartModel,
            api: this.gridApi,
            columnApi: this.columnApi,
        });

        this.eventService.dispatchEvent(event);
    }

    private raiseChartDestroyedEvent(): void {
        const event: ChartDestroyed = Object.freeze({
            type: Events.EVENT_CHART_DESTROYED,
            chartId: this.model.getChartId(),
            api: this.gridApi,
            columnApi: this.columnApi,
        });

        this.eventService.dispatchEvent(event);
    }

    protected destroy(): void {
        super.destroy();

        if (this.chartProxy) {
            this.chartProxy.destroy();
        }

        this.destroyBean(this.chartMenu);

        // don't want to invoke destroy() on the Dialog (prevents destroy loop)
        if (this.chartDialog && this.chartDialog.isAlive()) {
            this.destroyBean(this.chartDialog);
        }

        // if the user is providing containers for the charts, we need to clean up, otherwise the old chart
        // data will still be visible although the chart is no longer bound to the grid
        const eGui = this.getGui();
        _.clearElement(eGui);
        // remove from parent, so if user provided container, we detach from the provided dom element
        _.removeFromParent(eGui);

        this.raiseChartDestroyedEvent();
    }
}
