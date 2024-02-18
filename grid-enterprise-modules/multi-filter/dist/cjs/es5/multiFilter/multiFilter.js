"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiFilter = void 0;
var core_1 = require("@ag-grid-community/core");
var MultiFilter = /** @class */ (function (_super) {
    __extends(MultiFilter, _super);
    function MultiFilter() {
        var _this = _super.call(this, /* html */ "<div class=\"ag-multi-filter ag-menu-list-compact\"></div>") || this;
        _this.filterDefs = [];
        _this.filters = [];
        _this.guiDestroyFuncs = [];
        // this could be the accordion/sub menu element depending on the display type
        _this.filterGuis = [];
        _this.activeFilterIndices = [];
        _this.lastActivatedMenuItem = null;
        _this.afterFiltersReadyFuncs = [];
        return _this;
    }
    MultiFilter.prototype.postConstruct = function () {
        var _this = this;
        this.initialiseTabGuard({
            onFocusIn: function (e) { return _this.onFocusIn(e); }
        });
    };
    MultiFilter.getFilterDefs = function (params) {
        var filters = params.filters;
        return filters && filters.length > 0 ?
            filters :
            [{ filter: 'agTextColumnFilter' }, { filter: 'agSetColumnFilter' }];
    };
    MultiFilter.prototype.init = function (params) {
        var _this = this;
        this.params = params;
        this.filterDefs = MultiFilter.getFilterDefs(params);
        var column = params.column, filterChangedCallback = params.filterChangedCallback;
        this.column = column;
        this.filterChangedCallback = filterChangedCallback;
        var filterPromises = [];
        this.filterDefs.forEach(function (filterDef, index) {
            var filterPromise = _this.createFilter(filterDef, index);
            if (filterPromise != null) {
                filterPromises.push(filterPromise);
            }
        });
        // we have to refresh the GUI here to ensure that Angular components are not rendered in odd places
        return new core_1.AgPromise(function (resolve) {
            core_1.AgPromise.all(filterPromises).then(function (filters) {
                _this.filters = filters;
                _this.refreshGui('columnMenu').then(function () {
                    resolve();
                });
            });
        }).then(function () {
            _this.afterFiltersReadyFuncs.forEach(function (f) { return f(); });
            _this.afterFiltersReadyFuncs.length = 0;
        });
    };
    MultiFilter.prototype.refreshGui = function (container) {
        var _this = this;
        if (container === this.lastOpenedInContainer) {
            return core_1.AgPromise.resolve();
        }
        this.removeAllChildrenExceptTabGuards();
        this.destroyChildren();
        return core_1.AgPromise.all(this.filters.map(function (filter, index) {
            var filterDef = _this.filterDefs[index];
            var filterTitle = _this.getFilterTitle(filter, filterDef);
            var filterGuiPromise;
            if (filterDef.display === 'subMenu' && container !== 'toolPanel') {
                // prevent sub-menu being used in tool panel
                filterGuiPromise = _this.insertFilterMenu(filter, filterTitle).then(function (menuItem) { return menuItem.getGui(); });
            }
            else if (filterDef.display === 'subMenu' || filterDef.display === 'accordion') {
                // sub-menus should appear as groups in the tool panel
                var group = _this.insertFilterGroup(filter, filterTitle);
                filterGuiPromise = core_1.AgPromise.resolve(group.getGui());
            }
            else {
                // display inline
                filterGuiPromise = core_1.AgPromise.resolve(filter.getGui());
            }
            return filterGuiPromise;
        })).then(function (filterGuis) {
            filterGuis.forEach(function (filterGui, index) {
                if (index > 0) {
                    _this.appendChild(core_1._.loadTemplate(/* html */ "<div class=\"ag-filter-separator\"></div>"));
                }
                _this.appendChild(filterGui);
            });
            _this.filterGuis = filterGuis;
            _this.lastOpenedInContainer = container;
        });
    };
    MultiFilter.prototype.getFilterTitle = function (filter, filterDef) {
        if (filterDef.title != null) {
            return filterDef.title;
        }
        return filter instanceof core_1.ProvidedFilter ? filter.getFilterTitle() : 'Filter';
    };
    MultiFilter.prototype.destroyChildren = function () {
        this.guiDestroyFuncs.forEach(function (func) { return func(); });
        this.guiDestroyFuncs.length = 0;
        this.filterGuis.length = 0;
    };
    MultiFilter.prototype.insertFilterMenu = function (filter, name) {
        var _this = this;
        var menuItem = this.createBean(new core_1.AgMenuItemComponent());
        return menuItem.init({
            menuItemDef: {
                name: name,
                subMenu: [],
                cssClasses: ['ag-multi-filter-menu-item'],
                menuItem: core_1.AgMenuItemRenderer,
                menuItemParams: {
                    cssClassPrefix: 'ag-compact-menu-option',
                    isCompact: true,
                }
            },
            level: 0,
            isAnotherSubMenuOpen: function () { return false; },
            childComponent: filter,
            contextParams: {
                column: null,
                node: null,
                value: null
            }
        }).then(function () {
            menuItem.setParentComponent(_this);
            _this.guiDestroyFuncs.push(function () { return _this.destroyBean(menuItem); });
            _this.addManagedListener(menuItem, core_1.AgMenuItemComponent.EVENT_MENU_ITEM_ACTIVATED, function (event) {
                if (_this.lastActivatedMenuItem && _this.lastActivatedMenuItem !== event.menuItem) {
                    _this.lastActivatedMenuItem.deactivate();
                }
                _this.lastActivatedMenuItem = event.menuItem;
            });
            var menuItemGui = menuItem.getGui();
            // `AgMenuList` normally handles keyboard navigation, so need to do here
            menuItem.addManagedListener(menuItemGui, 'keydown', function (e) {
                var key = e.key;
                switch (key) {
                    case core_1.KeyCode.UP:
                    case core_1.KeyCode.RIGHT:
                    case core_1.KeyCode.DOWN:
                    case core_1.KeyCode.LEFT:
                        e.preventDefault();
                        if (key === core_1.KeyCode.RIGHT) {
                            menuItem.openSubMenu(true);
                        }
                        break;
                }
            });
            menuItem.addManagedListener(menuItemGui, 'focusin', function () { return menuItem.activate(); });
            menuItem.addManagedListener(menuItemGui, 'focusout', function () {
                if (!menuItem.isSubMenuOpen() && !menuItem.isSubMenuOpening()) {
                    menuItem.deactivate();
                }
            });
            return menuItem;
        });
    };
    MultiFilter.prototype.insertFilterGroup = function (filter, title) {
        var _this = this;
        var group = this.createBean(new core_1.AgGroupComponent({
            title: title,
            cssIdentifier: 'multi-filter',
        }));
        this.guiDestroyFuncs.push(function () { return _this.destroyBean(group); });
        group.addItem(filter.getGui());
        group.toggleGroupExpand(false);
        if (filter.afterGuiAttached) {
            group.addManagedListener(group, core_1.AgGroupComponent.EVENT_EXPANDED, function () { return filter.afterGuiAttached({
                container: _this.lastOpenedInContainer,
                suppressFocus: true,
                hidePopup: _this.hidePopup
            }); });
        }
        return group;
    };
    MultiFilter.prototype.isFilterActive = function () {
        return this.filters.some(function (filter) { return filter.isFilterActive(); });
    };
    MultiFilter.prototype.getLastActiveFilterIndex = function () {
        return this.activeFilterIndices.length > 0 ? this.activeFilterIndices[this.activeFilterIndices.length - 1] : null;
    };
    MultiFilter.prototype.doesFilterPass = function (params, filterToSkip) {
        var rowPasses = true;
        this.filters.forEach(function (filter) {
            if (!rowPasses || filter === filterToSkip || !filter.isFilterActive()) {
                return;
            }
            rowPasses = filter.doesFilterPass(params);
        });
        return rowPasses;
    };
    MultiFilter.prototype.getFilterType = function () {
        return 'multi';
    };
    MultiFilter.prototype.getModelFromUi = function () {
        var model = {
            filterType: this.getFilterType(),
            filterModels: this.filters.map(function (filter) {
                var providedFilter = filter;
                if (typeof providedFilter.getModelFromUi === 'function') {
                    return providedFilter.getModelFromUi();
                }
                return null;
            })
        };
        return model;
    };
    MultiFilter.prototype.getModel = function () {
        if (!this.isFilterActive()) {
            return null;
        }
        var model = {
            filterType: this.getFilterType(),
            filterModels: this.filters.map(function (filter) {
                if (filter.isFilterActive()) {
                    return filter.getModel();
                }
                return null;
            })
        };
        return model;
    };
    MultiFilter.prototype.setModel = function (model) {
        var _this = this;
        var setFilterModel = function (filter, filterModel) {
            return new core_1.AgPromise(function (resolve) {
                var promise = filter.setModel(filterModel);
                promise ? promise.then(function () { return resolve(); }) : resolve();
            });
        };
        var promises = [];
        if (model == null) {
            promises = this.filters.map(function (filter, index) {
                var res = setFilterModel(filter, null).then(function () {
                    _this.updateActiveList(index);
                });
                return res;
            });
        }
        else {
            this.filters.forEach(function (filter, index) {
                var filterModel = model.filterModels.length > index ? model.filterModels[index] : null;
                var res = setFilterModel(filter, filterModel).then(function () {
                    _this.updateActiveList(index);
                });
                promises.push(res);
            });
        }
        return core_1.AgPromise.all(promises).then(function () { });
    };
    MultiFilter.prototype.applyModel = function (source) {
        if (source === void 0) { source = 'api'; }
        var result = false;
        this.filters.forEach(function (filter) {
            if (filter instanceof core_1.ProvidedFilter) {
                result = filter.applyModel(source) || result;
            }
        });
        return result;
    };
    MultiFilter.prototype.getChildFilterInstance = function (index) {
        return this.filters[index];
    };
    MultiFilter.prototype.afterGuiAttached = function (params) {
        var _this = this;
        var refreshPromise;
        if (params) {
            this.hidePopup = params.hidePopup;
            refreshPromise = this.refreshGui(params.container);
        }
        else {
            this.hidePopup = undefined;
            refreshPromise = core_1.AgPromise.resolve();
        }
        refreshPromise.then(function () {
            var filterDefs = _this.filterDefs;
            var hasFocused = false;
            if (filterDefs) {
                core_1._.forEachReverse(filterDefs, function (filterDef, index) {
                    var _a;
                    var isFirst = index === 0;
                    var suppressFocus = !isFirst || filterDef.display !== 'inline';
                    var afterGuiAttachedParams = __assign(__assign({}, params !== null && params !== void 0 ? params : {}), { suppressFocus: suppressFocus });
                    var filter = (_a = _this.filters) === null || _a === void 0 ? void 0 : _a[index];
                    if (filter) {
                        _this.executeFunctionIfExistsOnFilter(filter, 'afterGuiAttached', afterGuiAttachedParams);
                        if (isFirst) {
                            hasFocused = true;
                        }
                    }
                    if (isFirst && suppressFocus) {
                        // focus the first filter container instead (accordion/sub menu)
                        var filterGui = _this.filterGuis[index];
                        if (filterGui) {
                            filterGui.focus();
                            hasFocused = true;
                        }
                    }
                });
            }
            var eDocument = _this.gridOptionsService.getDocument();
            var activeEl = eDocument.activeElement;
            // if we haven't focused the first item in the filter, we might run into two scenarios:
            // 1 - we are loading the filter for the first time and the component isn't ready,
            //     which means the document will have focus.
            // 2 - The focus will be somewhere inside the component due to auto focus
            // In both cases we need to force the focus somewhere valid but outside the filter.
            if (!hasFocused && (activeEl === eDocument.body || _this.getGui().contains(activeEl))) {
                // reset focus to the top of the container, and blur
                _this.forceFocusOutOfContainer(true);
            }
        });
    };
    MultiFilter.prototype.afterGuiDetached = function () {
        this.executeFunctionIfExists('afterGuiDetached');
    };
    MultiFilter.prototype.onAnyFilterChanged = function () {
        this.executeFunctionIfExists('onAnyFilterChanged');
    };
    MultiFilter.prototype.onNewRowsLoaded = function () {
        this.executeFunctionIfExists('onNewRowsLoaded');
    };
    MultiFilter.prototype.destroy = function () {
        var _this = this;
        this.filters.forEach(function (filter) {
            filter.setModel(null);
            _this.destroyBean(filter);
        });
        this.filters.length = 0;
        this.destroyChildren();
        this.hidePopup = undefined;
        _super.prototype.destroy.call(this);
    };
    MultiFilter.prototype.executeFunctionIfExists = function (name) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        // The first filter is always the "dominant" one. By iterating in reverse order we ensure the first filter
        // always gets the last say
        core_1._.forEachReverse(this.filters, function (filter) {
            _this.executeFunctionIfExistsOnFilter(filter, name, params);
        });
    };
    MultiFilter.prototype.executeFunctionIfExistsOnFilter = function (filter, name) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var func = filter[name];
        if (typeof func === 'function') {
            func.apply(filter, params);
        }
    };
    MultiFilter.prototype.createFilter = function (filterDef, index) {
        var _this = this;
        var _a = this.params, filterModifiedCallback = _a.filterModifiedCallback, doesRowPassOtherFilter = _a.doesRowPassOtherFilter;
        var filterInstance;
        var filterParams = __assign(__assign({}, this.filterManager.createFilterParams(this.column, this.column.getColDef())), { filterModifiedCallback: filterModifiedCallback, filterChangedCallback: function (additionalEventAttributes) {
                _this.executeWhenAllFiltersReady(function () { return _this.filterChanged(index, additionalEventAttributes); });
            }, doesRowPassOtherFilter: function (node) {
                return doesRowPassOtherFilter(node) && _this.doesFilterPass({ node: node, data: node.data }, filterInstance);
            } });
        var compDetails = this.userComponentFactory.getFilterDetails(filterDef, filterParams, 'agTextColumnFilter');
        if (!compDetails) {
            return null;
        }
        var filterPromise = compDetails.newAgStackInstance();
        if (filterPromise) {
            filterPromise.then(function (filter) { return filterInstance = filter; });
        }
        return filterPromise;
    };
    MultiFilter.prototype.executeWhenAllFiltersReady = function (action) {
        if (this.filters && this.filters.length > 0) {
            action();
        }
        else {
            this.afterFiltersReadyFuncs.push(action);
        }
    };
    MultiFilter.prototype.updateActiveList = function (index) {
        var changedFilter = this.filters[index];
        core_1._.removeFromArray(this.activeFilterIndices, index);
        if (changedFilter.isFilterActive()) {
            this.activeFilterIndices.push(index);
        }
    };
    MultiFilter.prototype.filterChanged = function (index, additionalEventAttributes) {
        this.updateActiveList(index);
        this.filterChangedCallback(additionalEventAttributes);
        var changedFilter = this.filters[index];
        this.filters.forEach(function (filter) {
            if (filter === changedFilter) {
                return;
            }
            if (typeof filter.onAnyFilterChanged === 'function') {
                filter.onAnyFilterChanged();
            }
        });
    };
    MultiFilter.prototype.onFocusIn = function (e) {
        if (this.lastActivatedMenuItem != null && !this.lastActivatedMenuItem.getGui().contains(e.target)) {
            this.lastActivatedMenuItem.deactivate();
            this.lastActivatedMenuItem = null;
        }
    };
    MultiFilter.prototype.getModelAsString = function (model) {
        var _a, _b, _c, _d;
        if (!this.filters || !((_a = model === null || model === void 0 ? void 0 : model.filterModels) === null || _a === void 0 ? void 0 : _a.length)) {
            return '';
        }
        var lastActiveIndex = (_b = this.getLastActiveFilterIndex()) !== null && _b !== void 0 ? _b : 0;
        var activeFilter = this.filters[lastActiveIndex];
        return (_d = (_c = activeFilter.getModelAsString) === null || _c === void 0 ? void 0 : _c.call(activeFilter, model.filterModels[lastActiveIndex])) !== null && _d !== void 0 ? _d : '';
    };
    __decorate([
        (0, core_1.Autowired)('filterManager')
    ], MultiFilter.prototype, "filterManager", void 0);
    __decorate([
        (0, core_1.Autowired)('userComponentFactory')
    ], MultiFilter.prototype, "userComponentFactory", void 0);
    __decorate([
        core_1.PostConstruct
    ], MultiFilter.prototype, "postConstruct", null);
    return MultiFilter;
}(core_1.TabGuardComp));
exports.MultiFilter = MultiFilter;
