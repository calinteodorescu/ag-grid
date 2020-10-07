var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { _, Autowired, Component, PostConstruct, RefSelector, } from "@ag-grid-community/core";
import { ShadowPanel } from "./shadowPanel";
import { FontPanel } from "../fontPanel";
import { initFillOpacitySlider, initFontPanelParams, initLineOpacitySlider } from "../widgetInitialiser";
var HistogramSeriesPanel = /** @class */ (function (_super) {
    __extends(HistogramSeriesPanel, _super);
    function HistogramSeriesPanel(chartController) {
        var _this = _super.call(this) || this;
        _this.activePanels = [];
        _this.chartController = chartController;
        return _this;
    }
    HistogramSeriesPanel.prototype.init = function () {
        var groupParams = {
            cssIdentifier: 'charts-format-top-level',
            direction: 'vertical'
        };
        this.setTemplate(HistogramSeriesPanel.TEMPLATE, { seriesGroup: groupParams });
        this.seriesGroup
            .setTitle(this.chartTranslator.translate("series"))
            .toggleGroupExpand(false)
            .hideEnabledCheckbox(true);
        this.initSeriesTooltips();
        this.initSeriesStrokeWidth();
        this.initOpacity();
        this.initLabelPanel();
        this.initShadowPanel();
        this.initBins();
    };
    HistogramSeriesPanel.prototype.initSeriesTooltips = function () {
        var _this = this;
        this.seriesTooltipsToggle
            .setLabel(this.chartTranslator.translate("tooltips"))
            .setLabelAlignment("left")
            .setLabelWidth("flex")
            .setInputWidth(45)
            .setValue(this.getChartProxy().getSeriesOption("tooltip.enabled") || false)
            .onValueChange(function (newValue) { return _this.getChartProxy().setSeriesOption("tooltip.enabled", newValue); });
    };
    HistogramSeriesPanel.prototype.initSeriesStrokeWidth = function () {
        var _this = this;
        this.seriesStrokeWidthSlider
            .setLabel(this.chartTranslator.translate("strokeWidth"))
            .setMaxValue(10)
            .setTextFieldWidth(45)
            .setValue(this.getChartProxy().getSeriesOption("stroke.width"))
            .onValueChange(function (newValue) { return _this.getChartProxy().setSeriesOption("stroke.width", newValue); });
    };
    HistogramSeriesPanel.prototype.initOpacity = function () {
        initLineOpacitySlider(this.seriesLineOpacitySlider, this.chartTranslator, this.getChartProxy());
        initFillOpacitySlider(this.seriesFillOpacitySlider, this.chartTranslator, this.getChartProxy());
    };
    HistogramSeriesPanel.prototype.initBins = function () {
        var _this = this;
        this.seriesBinCountSlider
            .setLabel(this.chartTranslator.translate("histogramBinCount"))
            .setMinValue(4)
            .setMaxValue(100)
            .setTextFieldWidth(45)
            .setValue(this.getChartProxy().getSeriesOption("binCount"))
            .onValueChange(function (newValue) { return _this.getChartProxy().setSeriesOption("binCount", newValue); });
    };
    HistogramSeriesPanel.prototype.initLabelPanel = function () {
        var params = initFontPanelParams(this.chartTranslator, this.getChartProxy());
        var labelPanelComp = this.createBean(new FontPanel(params));
        this.activePanels.push(labelPanelComp);
        this.seriesGroup.addItem(labelPanelComp);
    };
    HistogramSeriesPanel.prototype.initShadowPanel = function () {
        var shadowPanelComp = this.createBean(new ShadowPanel(this.chartController));
        this.seriesGroup.addItem(shadowPanelComp);
        this.activePanels.push(shadowPanelComp);
    };
    HistogramSeriesPanel.prototype.destroyActivePanels = function () {
        var _this = this;
        this.activePanels.forEach(function (panel) {
            _.removeFromParent(panel.getGui());
            _this.destroyBean(panel);
        });
    };
    HistogramSeriesPanel.prototype.getChartProxy = function () {
        return this.chartController.getChartProxy();
    };
    HistogramSeriesPanel.prototype.destroy = function () {
        this.destroyActivePanels();
        _super.prototype.destroy.call(this);
    };
    HistogramSeriesPanel.TEMPLATE = "<div>\n            <ag-group-component ref=\"seriesGroup\">\n                <ag-toggle-button ref=\"seriesTooltipsToggle\"></ag-toggle-button>\n                <ag-slider ref=\"binCountSlider\"></ag-slider>\n                <ag-slider ref=\"seriesStrokeWidthSlider\"></ag-slider>\n                <ag-slider ref=\"seriesLineOpacitySlider\"></ag-slider>\n                <ag-slider ref=\"seriesFillOpacitySlider\"></ag-slider>\n            </ag-group-component>\n        </div>";
    __decorate([
        RefSelector('seriesGroup')
    ], HistogramSeriesPanel.prototype, "seriesGroup", void 0);
    __decorate([
        RefSelector('seriesTooltipsToggle')
    ], HistogramSeriesPanel.prototype, "seriesTooltipsToggle", void 0);
    __decorate([
        RefSelector('binCountSlider')
    ], HistogramSeriesPanel.prototype, "seriesBinCountSlider", void 0);
    __decorate([
        RefSelector('seriesStrokeWidthSlider')
    ], HistogramSeriesPanel.prototype, "seriesStrokeWidthSlider", void 0);
    __decorate([
        RefSelector('seriesLineOpacitySlider')
    ], HistogramSeriesPanel.prototype, "seriesLineOpacitySlider", void 0);
    __decorate([
        RefSelector('seriesFillOpacitySlider')
    ], HistogramSeriesPanel.prototype, "seriesFillOpacitySlider", void 0);
    __decorate([
        Autowired('chartTranslator')
    ], HistogramSeriesPanel.prototype, "chartTranslator", void 0);
    __decorate([
        PostConstruct
    ], HistogramSeriesPanel.prototype, "init", null);
    return HistogramSeriesPanel;
}(Component));
export { HistogramSeriesPanel };
