/**
          * ag-charts-community - Advanced Charting / Charts supporting Javascript / Typescript / React / Angular / Vue * @version v6.1.1
          * @link https://www.ag-grid.com/
          * @license MIT
          */
// For small data structs like a bounding box, objects are superior to arrays
// in terms of performance (by 3-4% in Chrome 71, Safari 12 and by 20% in Firefox 64).
// They are also self descriptive and harder to abuse.
// For example, one has to do:
// `ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);`
// rather than become enticed by the much slower:
// `ctx.strokeRect(...bbox);`
// https://jsperf.com/array-vs-object-create-access
var BBox = /** @class */ (function () {
    function BBox(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    BBox.prototype.clone = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    BBox.prototype.isValid = function () {
        return isFinite(this.x) && isFinite(this.y) && isFinite(this.width) && isFinite(this.height);
    };
    BBox.prototype.dilate = function (value) {
        this.x -= value;
        this.y -= value;
        this.width += value * 2;
        this.height += value * 2;
    };
    BBox.prototype.containsPoint = function (x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    };
    BBox.prototype.render = function (ctx, params) {
        if (params === void 0) { params = BBox.noParams; }
        ctx.save();
        if (params.resetTransform) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        ctx.strokeStyle = params.strokeStyle || 'cyan';
        ctx.lineWidth = params.lineWidth || 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (params.label) {
            ctx.fillStyle = params.fillStyle || 'black';
            ctx.textBaseline = 'bottom';
            ctx.fillText(params.label, this.x, this.y);
        }
        ctx.restore();
    };
    BBox.noParams = {};
    return BBox;
}());

var __read$w = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * As of Jan 8, 2019, Firefox still doesn't implement
 * `getTransform(): DOMMatrix;`
 * `setTransform(transform?: DOMMatrix2DInit)`
 * in the `CanvasRenderingContext2D`.
 * Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=928150
 * IE11 and Edge 44 also don't have the support.
 * Thus this class, to keep track of the current transform and
 * combine transformations.
 * Standards:
 * https://html.spec.whatwg.org/dev/canvas.html
 * https://www.w3.org/TR/geometry-1/
 */
var Matrix = /** @class */ (function () {
    function Matrix(elements) {
        if (elements === void 0) { elements = [1, 0, 0, 1, 0, 0]; }
        this.elements = elements;
    }
    Matrix.prototype.setElements = function (elements) {
        var e = this.elements;
        // `this.elements = elements.slice()` is 4-5 times slower
        // (in Chrome 71 and FF 64) than manually copying elements,
        // since slicing allocates new memory.
        // The performance of passing parameters individually
        // vs as an array is about the same in both browsers, so we
        // go with a single (array of elements) parameter, because
        // `setElements(elements)` and `setElements([a, b, c, d, e, f])`
        // calls give us roughly the same performance, versus
        // `setElements(...elements)` and `setElements(a, b, c, d, e, f)`,
        // where the spread operator causes a 20-30x performance drop
        // (30x when compiled to ES5's `.apply(this, elements)`
        //  20x when used natively).
        e[0] = elements[0];
        e[1] = elements[1];
        e[2] = elements[2];
        e[3] = elements[3];
        e[4] = elements[4];
        e[5] = elements[5];
        return this;
    };
    Matrix.prototype.setIdentityElements = function () {
        var e = this.elements;
        e[0] = 1;
        e[1] = 0;
        e[2] = 0;
        e[3] = 1;
        e[4] = 0;
        e[5] = 0;
        return this;
    };
    Object.defineProperty(Matrix.prototype, "identity", {
        get: function () {
            var e = this.elements;
            return e[0] === 1 && e[1] === 0 && e[2] === 0 && e[3] === 1 && e[4] === 0 && e[5] === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "a", {
        get: function () {
            return this.elements[0];
        },
        set: function (value) {
            this.elements[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "b", {
        get: function () {
            return this.elements[1];
        },
        set: function (value) {
            this.elements[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "c", {
        get: function () {
            return this.elements[2];
        },
        set: function (value) {
            this.elements[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "d", {
        get: function () {
            return this.elements[3];
        },
        set: function (value) {
            this.elements[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "e", {
        get: function () {
            return this.elements[4];
        },
        set: function (value) {
            this.elements[4] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "f", {
        get: function () {
            return this.elements[5];
        },
        set: function (value) {
            this.elements[5] = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Performs the AxB matrix multiplication and saves the result
     * to `C`, if given, or to `A` otherwise.
     */
    Matrix.prototype.AxB = function (A, B, C) {
        var a = A[0] * B[0] + A[2] * B[1], b = A[1] * B[0] + A[3] * B[1], c = A[0] * B[2] + A[2] * B[3], d = A[1] * B[2] + A[3] * B[3], e = A[0] * B[4] + A[2] * B[5] + A[4], f = A[1] * B[4] + A[3] * B[5] + A[5];
        C = C || A;
        C[0] = a;
        C[1] = b;
        C[2] = c;
        C[3] = d;
        C[4] = e;
        C[5] = f;
    };
    /**
     * The `other` matrix gets post-multiplied to the current matrix.
     * Returns the current matrix.
     * @param other
     */
    Matrix.prototype.multiplySelf = function (other) {
        this.AxB(this.elements, other.elements);
        return this;
    };
    /**
     * The `other` matrix gets post-multiplied to the current matrix.
     * Returns a new matrix.
     * @param other
     */
    Matrix.prototype.multiply = function (other) {
        var elements = new Array(6);
        this.AxB(this.elements, other.elements, elements);
        return new Matrix(elements);
    };
    Matrix.prototype.preMultiplySelf = function (other) {
        this.AxB(other.elements, this.elements, this.elements);
        return this;
    };
    /**
     * Returns the inverse of this matrix as a new matrix.
     */
    Matrix.prototype.inverse = function () {
        var _a = __read$w(this.elements, 6), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
        var rD = 1 / (a * d - b * c); // reciprocal of determinant
        a *= rD;
        b *= rD;
        c *= rD;
        d *= rD;
        return new Matrix([d, -b, -c, a, c * f - d * e, b * e - a * f]);
    };
    /**
     * Save the inverse of this matrix to the given matrix.
     */
    Matrix.prototype.inverseTo = function (other) {
        var _a = __read$w(this.elements, 6), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
        var rD = 1 / (a * d - b * c); // reciprocal of determinant
        a *= rD;
        b *= rD;
        c *= rD;
        d *= rD;
        other.setElements([d, -b, -c, a, c * f - d * e, b * e - a * f]);
        return this;
    };
    Matrix.prototype.invertSelf = function () {
        var el = this.elements;
        var a = el[0], b = el[1], c = el[2], d = el[3], e = el[4], f = el[5];
        var rD = 1 / (a * d - b * c); // reciprocal of determinant
        a *= rD;
        b *= rD;
        c *= rD;
        d *= rD;
        el[0] = d;
        el[1] = -b;
        el[2] = -c;
        el[3] = a;
        el[4] = c * f - d * e;
        el[5] = b * e - a * f;
        return this;
    };
    Matrix.prototype.clone = function () {
        return new Matrix(this.elements.slice());
    };
    Matrix.prototype.transformPoint = function (x, y) {
        var e = this.elements;
        return {
            x: x * e[0] + y * e[2] + e[4],
            y: x * e[1] + y * e[3] + e[5],
        };
    };
    Matrix.prototype.transformBBox = function (bbox, radius, target) {
        if (radius === void 0) { radius = 0; }
        var elements = this.elements;
        var xx = elements[0];
        var xy = elements[1];
        var yx = elements[2];
        var yy = elements[3];
        var h_w = bbox.width * 0.5;
        var h_h = bbox.height * 0.5;
        var cx = bbox.x + h_w;
        var cy = bbox.y + h_h;
        var w, h;
        if (radius) {
            h_w -= radius;
            h_h -= radius;
            var sx = Math.sqrt(xx * xx + yx * yx);
            var sy = Math.sqrt(xy * xy + yy * yy);
            w = Math.abs(h_w * xx) + Math.abs(h_h * yx) + Math.abs(sx * radius);
            h = Math.abs(h_w * xy) + Math.abs(h_h * yy) + Math.abs(sy * radius);
        }
        else {
            w = Math.abs(h_w * xx) + Math.abs(h_h * yx);
            h = Math.abs(h_w * xy) + Math.abs(h_h * yy);
        }
        if (!target) {
            target = new BBox(0, 0, 0, 0);
        }
        target.x = cx * xx + cy * yx + elements[4] - w;
        target.y = cx * xy + cy * yy + elements[5] - h;
        target.width = w + w;
        target.height = h + h;
        return target;
    };
    Matrix.prototype.toContext = function (ctx) {
        // It's fair to say that matrix multiplications are not cheap.
        // However, updating path definitions on every frame isn't either, so
        // it may be cheaper to just translate paths. It's also fair to
        // say, that most paths will have to be re-rendered anyway, say
        // rectangle paths in a bar chart, where an animation would happen when
        // the data set changes and existing bars are morphed into new ones.
        // Or a pie chart, where old sectors are also morphed into new ones.
        // Same for the line chart. The only plausible case where translating
        // existing paths would be enough, is the scatter chart, where marker
        // icons, typically circles, stay the same size. But if circle radii
        // are bound to some data points, even circle paths would have to be
        // updated. And thus it makes sense to optimize for fewer matrix
        // transforms, where transform matrices of paths are mostly identity
        // matrices and `x`/`y`, `centerX`/`centerY` and similar properties
        // are used to define a path at specific coordinates. And only groups
        // are used to collectively apply a transform to a set of nodes.
        // If the matrix is mostly identity (95% of the time),
        // the `if (this.isIdentity)` check can make this call 3-4 times
        // faster on average: https://jsperf.com/matrix-check-first-vs-always-set
        if (this.identity) {
            return;
        }
        var e = this.elements;
        ctx.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
    };
    Matrix.flyweight = function (elements) {
        if (elements) {
            if (elements instanceof Matrix) {
                Matrix.matrix.setElements(elements.elements);
            }
            else {
                Matrix.matrix.setElements(elements);
            }
        }
        else {
            Matrix.matrix.setIdentityElements();
        }
        return Matrix.matrix;
    };
    Matrix.matrix = new Matrix();
    return Matrix;
}());

var ID_MAP = {};
function createId(instance) {
    var _a;
    var constructor = instance.constructor;
    var className = constructor.hasOwnProperty('className') ? constructor.className : constructor.name;
    if (!className) {
        throw new Error("The " + constructor + " is missing the 'className' property.");
    }
    var nextId = (_a = ID_MAP[className], (_a !== null && _a !== void 0 ? _a : 0)) + 1;
    ID_MAP[className] = nextId;
    return className + '-' + nextId;
}

function windowValue(name) {
    var _a;
    /**
     * Redeclaration of window that is safe for use with Gatsby server-side (webpack) compilation.
     */
    var WINDOW = typeof window === 'undefined' ? undefined : window;
    return (_a = WINDOW) === null || _a === void 0 ? void 0 : _a[name];
}

var RedrawType;
(function (RedrawType) {
    RedrawType[RedrawType["NONE"] = 0] = "NONE";
    // Canvas doesn't need clearing, an incremental re-rerender is sufficient.
    RedrawType[RedrawType["TRIVIAL"] = 1] = "TRIVIAL";
    // Group needs clearing, a semi-incremental re-render is sufficient.
    RedrawType[RedrawType["MINOR"] = 2] = "MINOR";
    // Canvas needs to be cleared for these redraw types.
    RedrawType[RedrawType["MAJOR"] = 3] = "MAJOR";
})(RedrawType || (RedrawType = {}));
/** @returns true if eval() is disabled in the current execution context. */
function evalAvailable() {
    try {
        eval('');
        return true;
    }
    catch (e) {
        return false;
    }
}
var EVAL_USEABLE = evalAvailable();
function SceneChangeDetection(opts) {
    var _a = opts || {}, _b = _a.redraw, redraw = _b === void 0 ? RedrawType.TRIVIAL : _b, _c = _a.type, type = _c === void 0 ? 'normal' : _c, changeCb = _a.changeCb, convertor = _a.convertor, _d = _a.checkDirtyOnAssignment, checkDirtyOnAssignment = _d === void 0 ? false : _d;
    var debug = windowValue('agChartsSceneChangeDetectionDebug') != null;
    return function (target, key) {
        // `target` is either a constructor (static member) or prototype (instance member)
        var privateKey = "__" + key;
        if (target[key]) {
            return;
        }
        if (EVAL_USEABLE) {
            // Optimised code-path.
            // Remove all conditional logic from runtime - generate a setter with the exact necessary
            // steps, as these setters are called a LOT during update cycles.
            var setterJs = "\n                " + (debug ? 'var setCount = 0;' : '') + "\n                function set_" + key + "(value) {\n                    const oldValue = this." + privateKey + ";\n                    " + (convertor ? 'value = convertor(value);' : '') + "\n                    if (value !== oldValue) {\n                        this." + privateKey + " = value;\n                        " + (debug
                ? "console.log({ t: this, property: '" + key + "', oldValue, value, stack: new Error().stack });"
                : '') + "\n                        " + (type === 'normal' ? "this.markDirty(this, " + redraw + ");" : '') + "\n                        " + (type === 'transform' ? "this.markDirtyTransform(" + redraw + ");" : '') + "\n                        " + (type === 'path'
                ? "if (!this._dirtyPath) { this._dirtyPath = true; this.markDirty(this, " + redraw + "); }"
                : '') + "\n                        " + (type === 'font'
                ? "if (!this._dirtyFont) { this._dirtyFont = true; this.markDirty(this, " + redraw + "); }"
                : '') + "\n                        " + (changeCb ? 'changeCb(this);' : '') + "\n                    }\n                    " + (checkDirtyOnAssignment
                ? "if (value != null && value._dirty > " + RedrawType.NONE + ") { this.markDirty(value, value._dirty); }"
                : '') + "\n                };\n                set_" + key + ";\n            ";
            var getterJs = "\n                function get_" + key + "() {\n                    return this." + privateKey + ";\n                };\n                get_" + key + ";\n            ";
            Object.defineProperty(target, key, {
                set: eval(setterJs),
                get: eval(getterJs),
                enumerable: true,
                configurable: false,
            });
        }
        else {
            // Unoptimised but 'safe' code-path, for environments with CSP headers and no 'unsafe-eval'.
            // We deliberately do not support debug branches found in the optimised path above, since
            // for large data-set series performance deteriorates with every extra branch here.
            var setter = function (value) {
                var oldValue = this[privateKey];
                value = convertor ? convertor(value) : value;
                if (value !== oldValue) {
                    this[privateKey] = value;
                    if (type === 'normal')
                        this.markDirty(this, redraw);
                    if (type === 'transform')
                        this.markDirtyTransform(redraw);
                    if (type === 'path' && !this._dirtyPath) {
                        this._dirtyPath = true;
                        this.markDirty(this, redraw);
                    }
                    if (type === 'font' && !this._dirtyFont) {
                        this._dirtyFont = true;
                        this.markDirty(this, redraw);
                    }
                    if (changeCb)
                        changeCb(this);
                }
                if (checkDirtyOnAssignment && value != null && value._dirty > RedrawType.NONE)
                    this.markDirty(value, value._dirty);
            };
            var getter = function () {
                return this[privateKey];
            };
            Object.defineProperty(target, key, {
                set: setter,
                get: getter,
                enumerable: true,
                configurable: false,
            });
        }
    };
}
var ChangeDetectable = /** @class */ (function () {
    function ChangeDetectable() {
        this._dirty = RedrawType.MAJOR;
    }
    ChangeDetectable.prototype.markDirty = function (_source, type) {
        if (type === void 0) { type = RedrawType.TRIVIAL; }
        if (this._dirty > type) {
            return;
        }
        this._dirty = type;
    };
    ChangeDetectable.prototype.markClean = function (_opts) {
        this._dirty = RedrawType.NONE;
    };
    ChangeDetectable.prototype.isDirty = function () {
        return this._dirty > RedrawType.NONE;
    };
    return ChangeDetectable;
}());

var __extends$_ = (undefined && undefined.__extends) || (function () {
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
var __decorate$i = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values$n = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$v = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var PointerEvents;
(function (PointerEvents) {
    PointerEvents[PointerEvents["All"] = 0] = "All";
    PointerEvents[PointerEvents["None"] = 1] = "None";
})(PointerEvents || (PointerEvents = {}));
var zIndexChangedCallback = function (o) {
    if (o.parent) {
        o.parent.dirtyZIndex = true;
    }
    o.zIndexChanged();
};
/**
 * Abstract scene graph node.
 * Each node can have zero or one parent and belong to zero or one scene.
 */
var Node = /** @class */ (function (_super) {
    __extends$_(Node, _super);
    function Node() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Unique number to allow creation order to be easily determined. */
        _this.serialNumber = Node._nextSerialNumber++;
        /**
         * Unique node ID in the form `ClassName-NaturalNumber`.
         */
        _this.id = createId(_this);
        /**
         * Some number to identify this node, typically within a `Group` node.
         * Usually this will be some enum value used as a selector.
         */
        _this.tag = NaN;
        /**
         * To simplify the type system (especially in Selections) we don't have the `Parent` node
         * (one that has children). Instead, we mimic HTML DOM, where any node can have children.
         * But we still need to distinguish regular leaf nodes from container leafs somehow.
         */
        _this.isContainerNode = false;
        _this._children = [];
        // Used to check for duplicate nodes.
        _this.childSet = {}; // new Set<Node>()
        // These matrices may need to have package level visibility
        // for performance optimization purposes.
        _this.matrix = new Matrix();
        _this.inverseMatrix = new Matrix();
        _this._dirtyTransform = false;
        _this.scalingX = 1;
        _this.scalingY = 1;
        /**
         * The center of scaling.
         * The default value of `null` means the scaling center will be
         * determined automatically, as the center of the bounding box
         * of a node.
         */
        _this.scalingCenterX = null;
        _this.scalingCenterY = null;
        _this.rotationCenterX = null;
        _this.rotationCenterY = null;
        /**
         * Rotation angle in radians.
         * The value is set as is. No normalization to the [-180, 180) or [0, 360)
         * interval is performed.
         */
        _this.rotation = 0;
        _this.translationX = 0;
        _this.translationY = 0;
        _this.visible = true;
        _this.dirtyZIndex = false;
        _this.zIndex = 0;
        /** Discriminators for render order within a zIndex. */
        _this.zIndexSubOrder = undefined;
        _this.pointerEvents = PointerEvents.All;
        return _this;
    }
    /**
     * This is meaningfully faster than `instanceof` and should be the preferred way
     * of checking inside loops.
     * @param node
     */
    Node.isNode = function (node) {
        return node ? node.matrix !== undefined : false;
    };
    Node.prototype._setScene = function (value) {
        var e_1, _a;
        var _b;
        this._scene = value;
        this._debug = (_b = value) === null || _b === void 0 ? void 0 : _b.debug;
        try {
            for (var _c = __values$n(this.children), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                child._setScene(value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Object.defineProperty(Node.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.countChildren = function (depth) {
        if (depth === void 0) { depth = Node.MAX_SAFE_INTEGER; }
        if (depth <= 0) {
            return 0;
        }
        var children = this.children;
        var n = children.length;
        var size = n;
        for (var i = 0; i < n; i++) {
            size += children[i].countChildren(depth - 1);
        }
        return size;
    };
    /**
     * Appends one or more new node instances to this parent.
     * If one needs to:
     * - move a child to the end of the list of children
     * - move a child from one parent to another (including parents in other scenes)
     * one should use the {@link insertBefore} method instead.
     * @param nodes A node or nodes to append.
     */
    Node.prototype.append = function (nodes) {
        var e_2, _a;
        // Passing a single parameter to an open-ended version of `append`
        // would be 30-35% slower than this.
        if (Node.isNode(nodes)) {
            nodes = [nodes];
        }
        try {
            for (var nodes_1 = __values$n(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                if (node.parent) {
                    throw new Error(node + " already belongs to another parent: " + node.parent + ".");
                }
                if (node.scene) {
                    throw new Error(node + " already belongs to a scene: " + node.scene + ".");
                }
                if (this.childSet[node.id]) {
                    // Cast to `any` to avoid `Property 'name' does not exist on type 'Function'`.
                    throw new Error("Duplicate " + node.constructor.name + " node: " + node);
                }
                this._children.push(node);
                this.childSet[node.id] = true;
                node._parent = this;
                node._setScene(this.scene);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.dirtyZIndex = true;
        this.markDirty(this, RedrawType.MAJOR);
    };
    Node.prototype.appendChild = function (node) {
        this.append(node);
        return node;
    };
    Node.prototype.removeChild = function (node) {
        if (node.parent === this) {
            var i = this.children.indexOf(node);
            if (i >= 0) {
                this._children.splice(i, 1);
                delete this.childSet[node.id];
                node._parent = undefined;
                node._setScene();
                this.dirtyZIndex = true;
                this.markDirty(node, RedrawType.MAJOR);
                return node;
            }
        }
        throw new Error("The node to be removed is not a child of this node.");
    };
    /**
     * Inserts the node `node` before the existing child node `nextNode`.
     * If `nextNode` is null, insert `node` at the end of the list of children.
     * If the `node` belongs to another parent, it is first removed.
     * Returns the `node`.
     * @param node
     * @param nextNode
     */
    Node.prototype.insertBefore = function (node, nextNode) {
        var parent = node.parent;
        if (node.parent) {
            node.parent.removeChild(node);
        }
        if (nextNode && nextNode.parent === this) {
            var i = this.children.indexOf(nextNode);
            if (i >= 0) {
                this._children.splice(i, 0, node);
                this.childSet[node.id] = true;
                node._parent = this;
                node._setScene(this.scene);
            }
            else {
                throw new Error(nextNode + " has " + parent + " as the parent, " + "but is not in its list of children.");
            }
            this.dirtyZIndex = true;
            this.markDirty(node, RedrawType.MAJOR);
        }
        else {
            this.append(node);
        }
        return node;
    };
    Object.defineProperty(Node.prototype, "nextSibling", {
        get: function () {
            var parent = this.parent;
            if (parent) {
                var children = parent.children;
                var index = children.indexOf(this);
                if (index >= 0 && index <= children.length - 1) {
                    return children[index + 1];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.transformPoint = function (x, y) {
        var matrix = Matrix.flyweight(this.matrix);
        var parent = this.parent;
        while (parent) {
            matrix.preMultiplySelf(parent.matrix);
            parent = parent.parent;
        }
        return matrix.invertSelf().transformPoint(x, y);
    };
    Node.prototype.inverseTransformPoint = function (x, y) {
        var matrix = Matrix.flyweight(this.matrix);
        var parent = this.parent;
        while (parent) {
            matrix.preMultiplySelf(parent.matrix);
            parent = parent.parent;
        }
        return matrix.transformPoint(x, y);
    };
    Node.prototype.markDirtyTransform = function () {
        this._dirtyTransform = true;
        this.markDirty(this, RedrawType.MAJOR);
    };
    Object.defineProperty(Node.prototype, "rotationDeg", {
        get: function () {
            return (this.rotation / Math.PI) * 180;
        },
        /**
         * For performance reasons the rotation angle's internal representation
         * is in radians. Therefore, don't expect to get the same number you set.
         * Even with integer angles about a quarter of them from 0 to 359 cannot
         * be converted to radians and back without precision loss.
         * For example:
         *
         *     node.rotationDeg = 11;
         *     console.log(node.rotationDeg); // 10.999999999999998
         *
         * @param value Rotation angle in degrees.
         */
        set: function (value) {
            this.rotation = (value / 180) * Math.PI;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.containsPoint = function (_x, _y) {
        return false;
    };
    /**
     * Hit testing method.
     * Recursively checks if the given point is inside this node or any of its children.
     * Returns the first matching node or `undefined`.
     * Nodes that render later (show on top) are hit tested first.
     */
    Node.prototype.pickNode = function (x, y) {
        var _a;
        if (!this.visible || this.pointerEvents === PointerEvents.None || !this.containsPoint(x, y)) {
            return;
        }
        var children = this.children;
        if (children.length > 1000) {
            // Try to optimise which children to interrogate; BBox calculation is an approximation
            // for more complex shapes, so discarding items based on this will save a lot of
            // processing when the point is nowhere near the child.
            for (var i = children.length - 1; i >= 0; i--) {
                var hit = ((_a = children[i].computeBBox()) === null || _a === void 0 ? void 0 : _a.containsPoint(x, y)) ? children[i].pickNode(x, y) : undefined;
                if (hit) {
                    return hit;
                }
            }
        }
        else if (children.length) {
            // Nodes added later should be hit-tested first,
            // as they are rendered on top of the previously added nodes.
            for (var i = children.length - 1; i >= 0; i--) {
                var hit = children[i].pickNode(x, y);
                if (hit) {
                    return hit;
                }
            }
        }
        else if (!this.isContainerNode) {
            // a leaf node, but not a container leaf
            return this;
        }
    };
    Node.prototype.computeBBox = function () {
        return;
    };
    Node.prototype.computeTransformedBBox = function () {
        var bbox = this.computeBBox();
        if (!bbox) {
            return undefined;
        }
        this.computeTransformMatrix();
        var matrix = Matrix.flyweight(this.matrix);
        var parent = this.parent;
        while (parent) {
            parent.computeTransformMatrix();
            matrix.preMultiplySelf(parent.matrix);
            parent = parent.parent;
        }
        matrix.transformBBox(bbox, 0, bbox);
        return bbox;
    };
    Node.prototype.computeBBoxCenter = function () {
        var bbox = this.computeBBox && this.computeBBox();
        if (bbox) {
            return [bbox.x + bbox.width * 0.5, bbox.y + bbox.height * 0.5];
        }
        return [0, 0];
    };
    Node.prototype.computeTransformMatrix = function () {
        if (!this._dirtyTransform) {
            return;
        }
        // Assume that centers of scaling and rotation are at the origin.
        var _a = __read$v([0, 0], 2), bbcx = _a[0], bbcy = _a[1];
        var sx = this.scalingX;
        var sy = this.scalingY;
        var scx;
        var scy;
        if (sx === 1 && sy === 1) {
            scx = 0;
            scy = 0;
        }
        else {
            scx = this.scalingCenterX === null ? bbcx : this.scalingCenterX;
            scy = this.scalingCenterY === null ? bbcy : this.scalingCenterY;
        }
        var r = this.rotation;
        var cos = Math.cos(r);
        var sin = Math.sin(r);
        var rcx;
        var rcy;
        if (r === 0) {
            rcx = 0;
            rcy = 0;
        }
        else {
            rcx = this.rotationCenterX === null ? bbcx : this.rotationCenterX;
            rcy = this.rotationCenterY === null ? bbcy : this.rotationCenterY;
        }
        var tx = this.translationX;
        var ty = this.translationY;
        // The transform matrix `M` is a result of the following transformations:
        // 1) translate the center of scaling to the origin
        // 2) scale
        // 3) translate back
        // 4) translate the center of rotation to the origin
        // 5) rotate
        // 6) translate back
        // 7) translate
        //         (7)          (6)             (5)             (4)           (3)           (2)           (1)
        //     | 1 0 tx |   | 1 0 rcx |   | cos -sin 0 |   | 1 0 -rcx |   | 1 0 scx |   | sx 0 0 |   | 1 0 -scx |
        // M = | 0 1 ty | * | 0 1 rcy | * | sin  cos 0 | * | 0 1 -rcy | * | 0 1 scy | * | 0 sy 0 | * | 0 1 -scy |
        //     | 0 0  1 |   | 0 0  1  |   |  0    0  1 |   | 0 0  1   |   | 0 0  1  |   | 0  0 0 |   | 0 0  1   |
        // Translation after steps 1-4 above:
        var tx4 = scx * (1 - sx) - rcx;
        var ty4 = scy * (1 - sy) - rcy;
        this._dirtyTransform = false;
        this.matrix
            .setElements([
            cos * sx,
            sin * sx,
            -sin * sy,
            cos * sy,
            cos * tx4 - sin * ty4 + rcx + tx,
            sin * tx4 + cos * ty4 + rcy + ty,
        ])
            .inverseTo(this.inverseMatrix);
    };
    Node.prototype.render = function (renderCtx) {
        var stats = renderCtx.stats;
        this._dirty = RedrawType.NONE;
        if (stats)
            stats.nodesRendered++;
    };
    Node.prototype.clearBBox = function (ctx) {
        var bbox = this.computeBBox();
        if (bbox == null) {
            return;
        }
        var x = bbox.x, y = bbox.y, width = bbox.width, height = bbox.height;
        var topLeft = this.transformPoint(x, y);
        var bottomRight = this.transformPoint(x + width, y + height);
        ctx.clearRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    };
    Node.prototype.markDirty = function (_source, type, parentType) {
        if (type === void 0) { type = RedrawType.TRIVIAL; }
        if (parentType === void 0) { parentType = type; }
        if (this._dirty > type) {
            return;
        }
        if (this._dirty === type && type === parentType) {
            return;
        }
        this._dirty = type;
        if (this.parent) {
            this.parent.markDirty(this, parentType);
        }
        else if (this.scene) {
            this.scene.markDirty();
        }
    };
    Object.defineProperty(Node.prototype, "dirty", {
        get: function () {
            return this._dirty;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.markClean = function (opts) {
        var e_3, _a;
        var _b = opts || {}, _c = _b.force, force = _c === void 0 ? false : _c, _d = _b.recursive, recursive = _d === void 0 ? true : _d;
        if (this._dirty === RedrawType.NONE && !force) {
            return;
        }
        this._dirty = RedrawType.NONE;
        if (recursive) {
            try {
                for (var _e = __values$n(this.children), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var child = _f.value;
                    child.markClean();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    Node.prototype.visibilityChanged = function () {
        // Override point for sub-classes to react to visibility changes.
    };
    Object.defineProperty(Node.prototype, "nodeCount", {
        get: function () {
            var e_4, _a;
            var count = 1;
            var dirtyCount = this._dirty >= RedrawType.NONE || this._dirtyTransform ? 1 : 0;
            var visibleCount = this.visible ? 1 : 0;
            try {
                for (var _b = __values$n(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    var _d = child.nodeCount, childCount = _d.count, childVisibleCount = _d.visibleCount, childDirtyCount = _d.dirtyCount;
                    count += childCount;
                    visibleCount += childVisibleCount;
                    dirtyCount += childDirtyCount;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return { count: count, visibleCount: visibleCount, dirtyCount: dirtyCount };
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.zIndexChanged = function () {
        // Override point for sub-classes.
    };
    Node._nextSerialNumber = 0;
    Node.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1; // Number.MAX_SAFE_INTEGER
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "scalingX", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "scalingY", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "scalingCenterX", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "scalingCenterY", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "rotationCenterX", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "rotationCenterY", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "rotation", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "translationX", void 0);
    __decorate$i([
        SceneChangeDetection({ type: 'transform' })
    ], Node.prototype, "translationY", void 0);
    __decorate$i([
        SceneChangeDetection({ redraw: RedrawType.MAJOR, changeCb: function (o) { return o.visibilityChanged(); } })
    ], Node.prototype, "visible", void 0);
    __decorate$i([
        SceneChangeDetection({
            redraw: RedrawType.TRIVIAL,
            changeCb: zIndexChangedCallback,
        })
    ], Node.prototype, "zIndex", void 0);
    __decorate$i([
        SceneChangeDetection({
            redraw: RedrawType.TRIVIAL,
            changeCb: zIndexChangedCallback,
        })
    ], Node.prototype, "zIndexSubOrder", void 0);
    return Node;
}(ChangeDetectable));

/**
 * Creates a new object with a `parent` as its prototype
 * and copies properties from the `child` into it.
 * @param parent
 * @param child
 */
function chainObjects(parent, child) {
    var obj = Object.create(parent);
    for (var prop in child) {
        if (child.hasOwnProperty(prop)) {
            obj[prop] = child[prop];
        }
    }
    return obj;
}
function getValue(object, path, defaultValue) {
    var parts = Array.isArray(path) ? path : path.split('.');
    var value = object;
    try {
        parts.forEach(function (part) {
            value = value[part];
        });
    }
    catch (e) {
        if (arguments.length === 3) {
            value = defaultValue;
        }
        else {
            throw e;
        }
    }
    return value;
}
function emptyTarget(value) {
    return Array.isArray(value) ? [] : {};
}
function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value)
        ? deepMerge(emptyTarget(value), value, options)
        : value;
}
function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function (element) {
        return cloneUnlessOtherwiseSpecified(element, options);
    });
}
function getMergeFunction(key, options) {
    if (!options.customMerge) {
        return deepMerge;
    }
    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : deepMerge;
}
function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols
        ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
            return target.propertyIsEnumerable(symbol);
        })
        : [];
}
function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
}
function propertyIsOnObject(object, property) {
    try {
        return property in object;
    }
    catch (_) {
        return false;
    }
}
// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
    return (propertyIsOnObject(target, key) && // Properties are safe to merge if they don't exist in the target yet,
        !(Object.hasOwnProperty.call(target, key) && // unsafe if they exist up the prototype chain,
            Object.propertyIsEnumerable.call(target, key))); // and also unsafe if they're nonenumerable.
}
function mergeObject(target, source, options) {
    var destination = {};
    if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function (key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
    }
    getKeys(source).forEach(function (key) {
        if (propertyIsUnsafe(target, key)) {
            return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        }
        else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
    });
    return destination;
}
function defaultIsMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
}
function isNonNullObject(value) {
    return !!value && typeof value === 'object';
}
function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]';
}
function deepMerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject;
    // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
    }
    else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
    }
    else {
        return mergeObject(target, source, options);
    }
}
function isObject(value) {
    return typeof value === 'object' && !Array.isArray(value);
}

var __extends$Z = (undefined && undefined.__extends) || (function () {
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
var __decorate$h = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Shape = /** @class */ (function (_super) {
    __extends$Z(Shape, _super);
    function Shape() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastInstanceId = 0;
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.fill = Shape.defaultStyles.fill;
        /**
         * Note that `strokeStyle = null` means invisible stroke,
         * while `lineWidth = 0` means no stroke, and sometimes this can mean different things.
         * For example, a rect shape with an invisible stroke may not align to the pixel grid
         * properly because the stroke affects the rules of alignment, and arc shapes forming
         * a pie chart will have a gap between them if they have an invisible stroke, whereas
         * there would be not gap if there was no stroke at all.
         * The preferred way of making the stroke invisible is setting the `lineWidth` to zero,
         * unless specific looks that is achieved by having an invisible stroke is desired.
         */
        _this.stroke = Shape.defaultStyles.stroke;
        _this.strokeWidth = Shape.defaultStyles.strokeWidth;
        _this.lineDash = Shape.defaultStyles.lineDash;
        _this.lineDashOffset = Shape.defaultStyles.lineDashOffset;
        _this.lineCap = Shape.defaultStyles.lineCap;
        _this.lineJoin = Shape.defaultStyles.lineJoin;
        _this.opacity = Shape.defaultStyles.opacity;
        _this.fillShadow = Shape.defaultStyles.fillShadow;
        return _this;
    }
    /**
     * Creates a light-weight instance of the given shape (that serves as a template).
     * The created instance only stores the properites set on the instance itself
     * and the rest of the properties come via the prototype chain from the template.
     * This can greatly reduce memory usage in cases where one has many simular shapes,
     * for example, circles of different size, position and color. The exact memory usage
     * reduction will depend on the size of the template and the number of own properties
     * set on its lightweight instances, but will typically be around an order of magnitude
     * or more.
     *
     * Note: template shapes are not supposed to be part of the scene graph (they should not
     * have a parent).
     *
     * @param template
     */
    Shape.createInstance = function (template) {
        var shape = Object.create(template);
        shape._setParent(undefined);
        shape.id = template.id + '-Instance-' + String(++template.lastInstanceId);
        return shape;
    };
    /**
     * Restores the default styles introduced by this subclass.
     */
    Shape.prototype.restoreOwnStyles = function () {
        var styles = this.constructor.defaultStyles;
        var keys = Object.getOwnPropertyNames(styles);
        // getOwnPropertyNames is about 2.5 times faster than
        // for..in with the hasOwnProperty check and in this
        // case, where most properties are inherited, can be
        // more then an order of magnitude faster.
        for (var i = 0, n = keys.length; i < n; i++) {
            var key = keys[i];
            this[key] = styles[key];
        }
    };
    Shape.prototype.restoreAllStyles = function () {
        var styles = this.constructor.defaultStyles;
        for (var property in styles) {
            this[property] = styles[property];
        }
    };
    /**
     * Restores the base class default styles that have been overridden by this subclass.
     */
    Shape.prototype.restoreOverriddenStyles = function () {
        var styles = this.constructor.defaultStyles;
        var protoStyles = Object.getPrototypeOf(styles);
        for (var property in styles) {
            if (styles.hasOwnProperty(property) && protoStyles.hasOwnProperty(property)) {
                this[property] = styles[property];
            }
        }
    };
    /**
     * Returns a device-pixel aligned coordinate (or length if length is supplied).
     *
     * NOTE: Not suitable for strokes, since the stroke needs to be offset to the middle
     * of a device pixel.
     */
    Shape.prototype.align = function (start, length) {
        var _a, _b, _c;
        var pixelRatio = (_c = (_b = (_a = this.scene) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.pixelRatio, (_c !== null && _c !== void 0 ? _c : 1));
        var alignedStart = Math.round(start * pixelRatio) / pixelRatio;
        if (length == undefined) {
            return alignedStart;
        }
        // Account for the rounding of alignedStart by increasing length to compensate before
        // alignment.
        return Math.round((length + start) * pixelRatio) / pixelRatio - alignedStart;
    };
    Shape.prototype.fillStroke = function (ctx) {
        if (!this.scene) {
            return;
        }
        var pixelRatio = this.scene.canvas.pixelRatio || 1;
        var globalAlpha = ctx.globalAlpha;
        if (this.fill) {
            ctx.fillStyle = this.fill;
            ctx.globalAlpha = globalAlpha * this.opacity * this.fillOpacity;
            // The canvas context scaling (depends on the device's pixel ratio)
            // has no effect on shadows, so we have to account for the pixel ratio
            // manually here.
            var fillShadow = this.fillShadow;
            if (fillShadow && fillShadow.enabled) {
                ctx.shadowColor = fillShadow.color;
                ctx.shadowOffsetX = fillShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = fillShadow.yOffset * pixelRatio;
                ctx.shadowBlur = fillShadow.blur * pixelRatio;
            }
            ctx.fill();
        }
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        if (this.stroke && this.strokeWidth) {
            ctx.strokeStyle = this.stroke;
            ctx.globalAlpha = globalAlpha * this.opacity * this.strokeOpacity;
            ctx.lineWidth = this.strokeWidth;
            if (this.lineDash) {
                ctx.setLineDash(this.lineDash);
            }
            if (this.lineDashOffset) {
                ctx.lineDashOffset = this.lineDashOffset;
            }
            if (this.lineCap) {
                ctx.lineCap = this.lineCap;
            }
            if (this.lineJoin) {
                ctx.lineJoin = this.lineJoin;
            }
            ctx.stroke();
        }
    };
    Shape.prototype.containsPoint = function (x, y) {
        return this.isPointInPath(x, y);
    };
    /**
     * Defaults for style properties. Note that properties that affect the position
     * and shape of the node are not considered style properties, for example:
     * `x`, `y`, `width`, `height`, `radius`, `rotation`, etc.
     * Can be used to reset to the original styling after some custom styling
     * has been applied (using the `restoreOwnStyles` and `restoreAllStyles` methods).
     * These static defaults are meant to be inherited by subclasses.
     */
    Shape.defaultStyles = chainObjects({}, {
        fill: 'black',
        stroke: undefined,
        strokeWidth: 0,
        lineDash: undefined,
        lineDashOffset: 0,
        lineCap: undefined,
        lineJoin: undefined,
        opacity: 1,
        fillShadow: undefined,
    });
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "fillOpacity", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "strokeOpacity", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "fill", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "stroke", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "strokeWidth", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "lineDash", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "lineDashOffset", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "lineCap", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR })
    ], Shape.prototype, "lineJoin", void 0);
    __decorate$h([
        SceneChangeDetection({
            redraw: RedrawType.MINOR,
            convertor: function (v) { return Math.min(1, Math.max(0, v)); },
        })
    ], Shape.prototype, "opacity", void 0);
    __decorate$h([
        SceneChangeDetection({ redraw: RedrawType.MINOR, checkDirtyOnAssignment: true })
    ], Shape.prototype, "fillShadow", void 0);
    return Shape;
}(Node));

/**
 * Wraps the native Canvas element and overrides its CanvasRenderingContext2D to
 * provide resolution independent rendering based on `window.devicePixelRatio`.
 */
var HdpiCanvas = /** @class */ (function () {
    // The width/height attributes of the Canvas element default to
    // 300/150 according to w3.org.
    function HdpiCanvas(_a) {
        var _b = _a.document, document = _b === void 0 ? window.document : _b, _c = _a.width, width = _c === void 0 ? 600 : _c, _d = _a.height, height = _d === void 0 ? 300 : _d, _e = _a.domLayer, domLayer = _e === void 0 ? false : _e, _f = _a.zIndex, zIndex = _f === void 0 ? 0 : _f, _g = _a.name, name = _g === void 0 ? undefined : _g;
        this._container = undefined;
        this._enabled = true;
        this._opacity = 1;
        // `NaN` is deliberate here, so that overrides are always applied
        // and the `resetTransform` inside the `resize` method works in IE11.
        this._pixelRatio = NaN;
        this._width = 0;
        this._height = 0;
        this.document = document;
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.imageSource = this.context.canvas;
        var style = this.element.style;
        style.userSelect = 'none';
        style.display = 'block';
        if (domLayer) {
            style.position = 'absolute';
            style.zIndex = String(zIndex);
            style.top = '0';
            style.left = '0';
            style.pointerEvents = 'none';
            style.opacity = "1";
            if (name) {
                this.element.id = name;
            }
        }
        this.setPixelRatio();
        this.resize(width, height);
    }
    Object.defineProperty(HdpiCanvas.prototype, "container", {
        get: function () {
            return this._container;
        },
        set: function (value) {
            if (this._container !== value) {
                this.remove();
                if (value) {
                    value.appendChild(this.element);
                }
                this._container = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this.element.style.display = value ? 'block' : 'none';
            this._enabled = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas.prototype, "opacity", {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            this.element.style.opacity = "" + value;
            this._opacity = value;
        },
        enumerable: true,
        configurable: true
    });
    HdpiCanvas.prototype.remove = function () {
        var parentNode = this.element.parentNode;
        if (parentNode != null) {
            parentNode.removeChild(this.element);
        }
    };
    HdpiCanvas.prototype.destroy = function () {
        this.element.remove();
        this._canvas = undefined;
        Object.freeze(this);
    };
    HdpiCanvas.prototype.snapshot = function () {
        // No-op for compatibility with HdpiOffscreenCanvas.
    };
    HdpiCanvas.prototype.clear = function () {
        this.context.save();
        this.context.resetTransform();
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.restore();
    };
    HdpiCanvas.prototype.toImage = function () {
        var img = this.document.createElement('img');
        img.src = this.getDataURL();
        return img;
    };
    HdpiCanvas.prototype.getDataURL = function (type) {
        return this.element.toDataURL(type);
    };
    /**
     * @param fileName The name of the file upon save. The `.png` extension is going to be added automatically.
     */
    HdpiCanvas.prototype.download = function (fileName) {
        fileName = ((fileName || '').trim() || 'image') + '.png';
        // Chart images saved as JPEG are a few times larger at 50% quality than PNG images,
        // so we don't support saving to JPEG.
        var type = 'image/png';
        var dataUrl = this.getDataURL(type);
        var document = this.document;
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a); // required for the `click` to work in Firefox
        a.click();
        document.body.removeChild(a);
    };
    Object.defineProperty(HdpiCanvas.prototype, "pixelRatio", {
        get: function () {
            return this._pixelRatio;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Changes the pixel ratio of the Canvas element to the given value,
     * or uses the window.devicePixelRatio (default), then resizes the Canvas
     * element accordingly (default).
     */
    HdpiCanvas.prototype.setPixelRatio = function (ratio) {
        var pixelRatio = ratio || window.devicePixelRatio;
        if (pixelRatio === this.pixelRatio) {
            return;
        }
        HdpiCanvas.overrideScale(this.context, pixelRatio);
        this._pixelRatio = pixelRatio;
        this.resize(this.width, this.height);
    };
    Object.defineProperty(HdpiCanvas.prototype, "pixelated", {
        get: function () {
            return this.element.style.imageRendering === 'pixelated';
        },
        set: function (value) {
            this.element.style.imageRendering = value ? 'pixelated' : 'auto';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    HdpiCanvas.prototype.resize = function (width, height) {
        if (!(width > 0 && height > 0)) {
            return;
        }
        var _a = this, element = _a.element, context = _a.context, pixelRatio = _a.pixelRatio;
        element.width = Math.round(width * pixelRatio);
        element.height = Math.round(height * pixelRatio);
        element.style.width = width + 'px';
        element.style.height = height + 'px';
        context.resetTransform();
        this._width = width;
        this._height = height;
    };
    Object.defineProperty(HdpiCanvas, "textMeasuringContext", {
        get: function () {
            if (this._textMeasuringContext) {
                return this._textMeasuringContext;
            }
            var canvas = document.createElement('canvas');
            this._textMeasuringContext = canvas.getContext('2d');
            return this._textMeasuringContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas, "svgText", {
        get: function () {
            if (this._svgText) {
                return this._svgText;
            }
            var xmlns = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(xmlns, 'svg');
            svg.setAttribute('width', '100');
            svg.setAttribute('height', '100');
            // Add a descriptive class name in case someone sees this SVG element
            // in devtools and wonders about its purpose:
            if (svg.classList) {
                svg.classList.add('text-measuring-svg');
            }
            else {
                svg.setAttribute('class', 'text-measuring-svg');
            }
            svg.style.position = 'absolute';
            svg.style.top = '-1000px';
            svg.style.visibility = 'hidden';
            var svgText = document.createElementNS(xmlns, 'text');
            svgText.setAttribute('x', '0');
            svgText.setAttribute('y', '30');
            svgText.setAttribute('text', 'black');
            svg.appendChild(svgText);
            document.body.appendChild(svg);
            this._svgText = svgText;
            return svgText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas, "has", {
        get: function () {
            if (this._has) {
                return this._has;
            }
            var isChrome = navigator.userAgent.indexOf('Chrome') > -1;
            var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
            var isSafari = !isChrome && navigator.userAgent.indexOf('Safari') > -1;
            this._has = Object.freeze({
                textMetrics: this.textMeasuringContext.measureText('test').actualBoundingBoxDescent !== undefined &&
                    // Firefox implemented advanced TextMetrics object in v74:
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=1102584
                    // but it's buggy, so we'll keed using the SVG for text measurement in Firefox for now.
                    !isFirefox &&
                    !isSafari,
                getTransform: this.textMeasuringContext.getTransform !== undefined,
            });
            return this._has;
        },
        enumerable: true,
        configurable: true
    });
    HdpiCanvas.measureText = function (text, font, textBaseline, textAlign) {
        var ctx = this.textMeasuringContext;
        ctx.font = font;
        ctx.textBaseline = textBaseline;
        ctx.textAlign = textAlign;
        return ctx.measureText(text);
    };
    /**
     * Returns the width and height of the measured text.
     * @param text The single-line text to measure.
     * @param font The font shorthand string.
     */
    HdpiCanvas.getTextSize = function (text, font) {
        if (this.has.textMetrics) {
            var ctx = this.textMeasuringContext;
            ctx.font = font;
            var metrics = ctx.measureText(text);
            return {
                width: metrics.width,
                height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
            };
        }
        else {
            return this.measureSvgText(text, font);
        }
    };
    HdpiCanvas.measureSvgText = function (text, font) {
        var cache = this.textSizeCache;
        var fontCache = cache[font];
        // Note: consider not caching the size of numeric strings.
        // For example: if (isNaN(+text)) { // skip
        if (fontCache) {
            var size_1 = fontCache[text];
            if (size_1) {
                return size_1;
            }
        }
        else {
            cache[font] = {};
        }
        var svgText = this.svgText;
        svgText.style.font = font;
        svgText.textContent = text;
        // `getBBox` returns an instance of `SVGRect` with the same `width` and `height`
        // measurements as `DOMRect` instance returned by the `getBoundingClientRect`.
        // But the `SVGRect` instance has half the properties of the `DOMRect`,
        // so we use the `getBBox` method.
        var bbox = svgText.getBBox();
        var size = {
            width: bbox.width,
            height: bbox.height,
        };
        cache[font][text] = size;
        return size;
    };
    HdpiCanvas.overrideScale = function (ctx, scale) {
        var depth = 0;
        var overrides = {
            save: function () {
                this.$save();
                depth++;
            },
            restore: function () {
                if (depth > 0) {
                    this.$restore();
                    depth--;
                }
                else {
                    throw new Error('Unable to restore() past depth 0');
                }
            },
            setTransform: function (a, b, c, d, e, f) {
                if (typeof a === 'object') {
                    this.$setTransform(a);
                }
                else {
                    this.$setTransform(a * scale, b * scale, c * scale, d * scale, e * scale, f * scale);
                }
            },
            resetTransform: function () {
                // As of Jan 8, 2019, `resetTransform` is still an "experimental technology",
                // and doesn't work in IE11 and Edge 44.
                this.$setTransform(scale, 0, 0, scale, 0, 0);
            },
        };
        for (var name_1 in overrides) {
            if (overrides.hasOwnProperty(name_1)) {
                // Save native methods under prefixed names,
                // if this hasn't been done by the previous overrides already.
                if (!ctx['$' + name_1]) {
                    ctx['$' + name_1] = ctx[name_1];
                }
                // Replace native methods with overrides,
                // or previous overrides with the new ones.
                ctx[name_1] = overrides[name_1];
            }
        }
    };
    HdpiCanvas.textSizeCache = {};
    return HdpiCanvas;
}());

var __extends$Y = (undefined && undefined.__extends) || (function () {
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
var __decorate$g = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function SceneFontChangeDetection(opts) {
    var _a = opts || {}, _b = _a.redraw, redraw = _b === void 0 ? RedrawType.MAJOR : _b, changeCb = _a.changeCb;
    return SceneChangeDetection({ redraw: redraw, type: 'font', changeCb: changeCb });
}
var Text = /** @class */ (function (_super) {
    __extends$Y(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0;
        _this.y = 0;
        _this.lines = [];
        _this.text = '';
        _this._dirtyFont = true;
        _this.fontSize = 10;
        _this.fontFamily = 'sans-serif';
        _this.textAlign = Text.defaultStyles.textAlign;
        _this.textBaseline = Text.defaultStyles.textBaseline;
        // Multi-line text is complicated because:
        // - Canvas does not support it natively, so we have to implement it manually
        // - need to know the height of each line -> need to parse the font shorthand ->
        //   generally impossible to do because font size may not be in pixels
        // - so, need to measure the text instead, each line individually -> expensive
        // - or make the user provide the line height manually for multi-line text
        // - computeBBox should use the lineHeight for multi-line text but ignore it otherwise
        // - textBaseline kind of loses its meaning for multi-line text
        _this.lineHeight = 14;
        return _this;
    }
    Text.prototype._splitText = function () {
        this.lines = typeof this.text === 'string' ? this.text.split(/\r?\n/g) : [];
    };
    Object.defineProperty(Text.prototype, "font", {
        get: function () {
            if (this._dirtyFont) {
                this._dirtyFont = false;
                this._font = getFont(this.fontSize, this.fontFamily, this.fontStyle, this.fontWeight);
            }
            return this._font;
        },
        enumerable: true,
        configurable: true
    });
    Text.prototype.computeBBox = function () {
        return HdpiCanvas.has.textMetrics ? this.getPreciseBBox() : this.getApproximateBBox();
    };
    Text.prototype.getPreciseBBox = function () {
        var metrics = HdpiCanvas.measureText(this.text, this.font, this.textBaseline, this.textAlign);
        return new BBox(this.x - metrics.actualBoundingBoxLeft, this.y - metrics.actualBoundingBoxAscent, metrics.width, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    };
    Text.prototype.getApproximateBBox = function () {
        var size = HdpiCanvas.getTextSize(this.text, this.font);
        var _a = this, x = _a.x, y = _a.y;
        switch (this.textAlign) {
            case 'end':
            case 'right':
                x -= size.width;
                break;
            case 'center':
                x -= size.width / 2;
        }
        switch (this.textBaseline) {
            case 'alphabetic':
                y -= size.height * 0.7;
                break;
            case 'middle':
                y -= size.height * 0.45;
                break;
            case 'ideographic':
                y -= size.height;
                break;
            case 'hanging':
                y -= size.height * 0.2;
                break;
            case 'bottom':
                y -= size.height;
                break;
        }
        return new BBox(x, y, size.width, size.height);
    };
    Text.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return bbox ? bbox.containsPoint(point.x, point.y) : false;
    };
    Text.prototype.render = function (renderCtx) {
        var ctx = renderCtx.ctx, forceRender = renderCtx.forceRender, stats = renderCtx.stats;
        if (this.dirty === RedrawType.NONE && !forceRender) {
            if (stats)
                stats.nodesSkipped += this.nodeCount.count;
            return;
        }
        if (!this.lines.length || !this.scene) {
            if (stats)
                stats.nodesSkipped += this.nodeCount.count;
            return;
        }
        this.computeTransformMatrix();
        this.matrix.toContext(ctx);
        var _a = this, fill = _a.fill, stroke = _a.stroke, strokeWidth = _a.strokeWidth;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        var pixelRatio = this.scene.canvas.pixelRatio || 1;
        var globalAlpha = ctx.globalAlpha;
        if (fill) {
            ctx.fillStyle = fill;
            ctx.globalAlpha = globalAlpha * this.opacity * this.fillOpacity;
            var _b = this, fillShadow = _b.fillShadow, text = _b.text, x = _b.x, y = _b.y;
            if (fillShadow && fillShadow.enabled) {
                ctx.shadowColor = fillShadow.color;
                ctx.shadowOffsetX = fillShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = fillShadow.yOffset * pixelRatio;
                ctx.shadowBlur = fillShadow.blur * pixelRatio;
            }
            ctx.fillText(text, x, y);
        }
        if (stroke && strokeWidth) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.globalAlpha = globalAlpha * this.opacity * this.strokeOpacity;
            var _c = this, lineDash = _c.lineDash, lineDashOffset = _c.lineDashOffset, lineCap = _c.lineCap, lineJoin = _c.lineJoin, text = _c.text, x = _c.x, y = _c.y;
            if (lineDash) {
                ctx.setLineDash(lineDash);
            }
            if (lineDashOffset) {
                ctx.lineDashOffset = lineDashOffset;
            }
            if (lineCap) {
                ctx.lineCap = lineCap;
            }
            if (lineJoin) {
                ctx.lineJoin = lineJoin;
            }
            ctx.strokeText(text, x, y);
        }
        _super.prototype.render.call(this, renderCtx);
    };
    Text.className = 'Text';
    Text.defaultStyles = chainObjects(Shape.defaultStyles, {
        textAlign: 'start',
        fontStyle: undefined,
        fontWeight: undefined,
        fontSize: 10,
        fontFamily: 'sans-serif',
        textBaseline: 'alphabetic',
    });
    __decorate$g([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Text.prototype, "x", void 0);
    __decorate$g([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Text.prototype, "y", void 0);
    __decorate$g([
        SceneChangeDetection({ redraw: RedrawType.MAJOR, changeCb: function (o) { return o._splitText(); } })
    ], Text.prototype, "text", void 0);
    __decorate$g([
        SceneFontChangeDetection()
    ], Text.prototype, "fontStyle", void 0);
    __decorate$g([
        SceneFontChangeDetection()
    ], Text.prototype, "fontWeight", void 0);
    __decorate$g([
        SceneFontChangeDetection()
    ], Text.prototype, "fontSize", void 0);
    __decorate$g([
        SceneFontChangeDetection()
    ], Text.prototype, "fontFamily", void 0);
    __decorate$g([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Text.prototype, "textAlign", void 0);
    __decorate$g([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Text.prototype, "textBaseline", void 0);
    __decorate$g([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Text.prototype, "lineHeight", void 0);
    return Text;
}(Shape));
function getFont(fontSize, fontFamily, fontStyle, fontWeight) {
    return [fontStyle || '', fontWeight || '', fontSize + 'px', fontFamily].join(' ').trim();
}

var __assign$e = (undefined && undefined.__assign) || function () {
    __assign$e = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$e.apply(this, arguments);
};
var Observable = /** @class */ (function () {
    function Observable() {
        // Note that these maps can't be specified generically, so they are kept untyped.
        // Some methods in this class only need generics in their signatures, the generics inside the methods
        // are just for clarity. The generics in signatures allow for static type checking of user provided
        // listeners and for type inference, so that the users wouldn't have to specify the type of parameters
        // of their inline lambdas.
        this.allPropertyListeners = new Map(); // property name => property change listener => scopes
        this.allEventListeners = new Map(); // event type => event listener => scopes
    }
    Observable.prototype.addPropertyListener = function (name, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allPropertyListeners = this.allPropertyListeners;
        var propertyListeners = allPropertyListeners.get(name);
        if (!propertyListeners) {
            propertyListeners = new Map();
            allPropertyListeners.set(name, propertyListeners);
        }
        if (!propertyListeners.has(listener)) {
            var scopes_1 = new Set();
            propertyListeners.set(listener, scopes_1);
        }
        var scopes = propertyListeners.get(listener);
        if (scopes) {
            scopes.add(scope);
        }
    };
    Observable.prototype.removePropertyListener = function (name, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allPropertyListeners = this.allPropertyListeners;
        var propertyListeners = allPropertyListeners.get(name);
        if (propertyListeners) {
            if (listener) {
                var scopes = propertyListeners.get(listener);
                if (scopes) {
                    scopes.delete(scope);
                    if (!scopes.size) {
                        propertyListeners.delete(listener);
                    }
                }
            }
            else {
                propertyListeners.clear();
            }
        }
    };
    Observable.prototype.notifyPropertyListeners = function (name, oldValue, value) {
        var _this = this;
        var allPropertyListeners = this.allPropertyListeners;
        var propertyListeners = allPropertyListeners.get(name);
        if (propertyListeners) {
            propertyListeners.forEach(function (scopes, listener) {
                scopes.forEach(function (scope) { return listener.call(scope, { type: name, source: _this, value: value, oldValue: oldValue }); });
            });
        }
    };
    Observable.prototype.addEventListener = function (type, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allEventListeners = this.allEventListeners;
        var eventListeners = allEventListeners.get(type);
        if (!eventListeners) {
            eventListeners = new Map();
            allEventListeners.set(type, eventListeners);
        }
        if (!eventListeners.has(listener)) {
            var scopes_2 = new Set();
            eventListeners.set(listener, scopes_2);
        }
        var scopes = eventListeners.get(listener);
        if (scopes) {
            scopes.add(scope);
        }
    };
    Observable.prototype.removeEventListener = function (type, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allEventListeners = this.allEventListeners;
        var eventListeners = allEventListeners.get(type);
        if (eventListeners) {
            if (listener) {
                var scopes = eventListeners.get(listener);
                if (scopes) {
                    scopes.delete(scope);
                    if (!scopes.size) {
                        eventListeners.delete(listener);
                    }
                }
            }
            else {
                eventListeners.clear();
            }
        }
    };
    Observable.prototype.clearEventListeners = function () {
        this.allEventListeners = new Map();
    };
    Observable.prototype.notifyEventListeners = function (types) {
        var _this = this;
        var allEventListeners = this.allEventListeners;
        types.forEach(function (type) {
            var listeners = allEventListeners.get(type);
            if (listeners) {
                listeners.forEach(function (scopes, listener) {
                    scopes.forEach(function (scope) { return listener.call(scope, { type: type, source: _this }); });
                });
            }
        });
    };
    // 'source' is added automatically and is always the object this method belongs to.
    Observable.prototype.fireEvent = function (event) {
        var _this = this;
        var listeners = this.allEventListeners.get(event.type);
        if (listeners) {
            listeners.forEach(function (scopes, listener) {
                scopes.forEach(function (scope) { return listener.call(scope, __assign$e(__assign$e({}, event), { source: _this })); });
            });
        }
    };
    Observable.privateKeyPrefix = '_';
    return Observable;
}());

var __extends$X = (undefined && undefined.__extends) || (function () {
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
var Caption = /** @class */ (function (_super) {
    __extends$X(Caption, _super);
    function Caption() {
        var _this = _super.call(this) || this;
        _this.node = new Text();
        _this.enabled = false;
        var node = _this.node;
        node.textAlign = 'center';
        node.textBaseline = 'top';
        node.pointerEvents = PointerEvents.None;
        return _this;
    }
    Object.defineProperty(Caption.prototype, "text", {
        get: function () {
            return this.node.text;
        },
        set: function (value) {
            this.node.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontStyle", {
        get: function () {
            return this.node.fontStyle;
        },
        set: function (value) {
            this.node.fontStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontWeight", {
        get: function () {
            return this.node.fontWeight;
        },
        set: function (value) {
            this.node.fontWeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontSize", {
        get: function () {
            return this.node.fontSize;
        },
        set: function (value) {
            this.node.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontFamily", {
        get: function () {
            return this.node.fontFamily;
        },
        set: function (value) {
            this.node.fontFamily = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "color", {
        get: function () {
            return this.node.fill;
        },
        set: function (value) {
            this.node.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Caption.PADDING = 10;
    return Caption;
}(Observable));

var __extends$W = (undefined && undefined.__extends) || (function () {
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
function ticks (a, b, count) {
    var step = tickStep(a, b, count);
    a = Math.ceil(a / step) * step;
    b = Math.floor(b / step) * step + step / 2;
    // Add half a step here so that the array returned by `range` includes the last tick.
    return range(a, b, step);
}
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function tickStep(a, b, count) {
    var rawStep = Math.abs(b - a) / Math.max(0, count);
    var step = Math.pow(10, Math.floor(Math.log(rawStep) / Math.LN10)); // = Math.log10(rawStep)
    var error = rawStep / step;
    if (error >= e10) {
        step *= 10;
    }
    else if (error >= e5) {
        step *= 5;
    }
    else if (error >= e2) {
        step *= 2;
    }
    return b < a ? -step : step;
}
function tickIncrement(a, b, count) {
    var rawStep = (b - a) / Math.max(0, count);
    var power = Math.floor(Math.log(rawStep) / Math.LN10);
    var error = rawStep / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}
var NumericTicks = /** @class */ (function (_super) {
    __extends$W(NumericTicks, _super);
    function NumericTicks(fractionDigits, elements) {
        var _this = _super.call(this) || this;
        if (elements) {
            for (var i = 0, n = elements.length; i < n; i++) {
                _this[i] = elements[i];
            }
        }
        _this.fractionDigits = fractionDigits;
        return _this;
    }
    return NumericTicks;
}(Array));
function range(a, b, step) {
    if (step === void 0) { step = 1; }
    var absStep = Math.abs(step);
    var fractionDigits = absStep > 0 && absStep < 1 ? Math.abs(Math.floor(Math.log(absStep) / Math.LN10)) : 0;
    var f = Math.pow(10, fractionDigits);
    var n = Math.max(0, Math.ceil((b - a) / step)) || 0;
    var values = new NumericTicks(fractionDigits);
    for (var i = 0; i < n; i++) {
        var value = a + step * i;
        values[i] = Math.round(value * f) / f;
    }
    return values;
}

function calculateNiceSecondaryAxis(domain, primaryTickCount) {
    // Make secondary axis domain nice using strict tick count, matching the tick count from the primary axis.
    // This is to make the secondary axis grid lines/ tick positions align with the ones from the primary axis.
    var start = Math.floor(domain[0]);
    var stop = domain[1];
    start = calculateNiceStart(start, stop, primaryTickCount);
    var step = getTickStep(start, stop, primaryTickCount);
    var segments = primaryTickCount - 1;
    stop = start + segments * step;
    var d = [start, stop];
    var ticks = getTicks(start, step, primaryTickCount);
    return [d, ticks];
}
function calculateNiceStart(a, b, count) {
    var rawStep = Math.abs(b - a) / (count - 1);
    var order = Math.floor(Math.log10(rawStep));
    var magnitude = Math.pow(10, order);
    return Math.floor(a / magnitude) * magnitude;
}
function getTicks(start, step, count) {
    // power of the step will be negative if the step is a fraction (between 0 and 1)
    var stepPower = Math.floor(Math.log10(step));
    var fractionDigits = step > 0 && step < 1 ? Math.abs(stepPower) : 0;
    var f = Math.pow(10, fractionDigits);
    var ticks = new NumericTicks(fractionDigits);
    for (var i = 0; i < count; i++) {
        var tick = start + step * i;
        ticks[i] = Math.round(tick * f) / f;
    }
    return ticks;
}
function getTickStep(start, stop, count) {
    var segments = count - 1;
    var rawStep = (stop - start) / segments;
    return calculateNextNiceStep(rawStep);
}
function calculateNextNiceStep(rawStep) {
    var order = Math.floor(Math.log10(rawStep));
    var magnitude = Math.pow(10, order);
    // Make order 1
    var step = (rawStep / magnitude) * 10;
    if (step > 0 && step <= 1) {
        return magnitude / 10;
    }
    if (step > 1 && step <= 2) {
        return (2 * magnitude) / 10;
    }
    if (step > 1 && step <= 5) {
        return (5 * magnitude) / 10;
    }
    if (step > 5 && step <= 10) {
        return (10 * magnitude) / 10;
    }
    if (step > 10 && step <= 20) {
        return (20 * magnitude) / 10;
    }
    if (step > 20 && step <= 40) {
        return (40 * magnitude) / 10;
    }
    if (step > 40 && step <= 50) {
        return (50 * magnitude) / 10;
    }
    if (step > 50 && step <= 100) {
        return (100 * magnitude) / 10;
    }
    return step;
}

var constant$1 = (function (x) { return function () { return x; }; });

function interpolateNumber (a, b) {
    a = +a;
    b = +b;
    return function (t) { return a * (1 - t) + b * t; };
}

function date (a, b) {
    var date = new Date();
    var msA = +a;
    var msB = +b;
    return function (t) {
        date.setTime(msA * (1 - t) + msB * t);
        return date;
    };
}

function array (a, b) {
    var nb = b ? b.length : 0;
    var na = a ? Math.min(nb, a.length) : 0;
    var x = new Array(na);
    var c = new Array(nb);
    var i;
    for (i = 0; i < na; ++i) {
        x[i] = interpolateValue(a[i], b[i]);
    }
    for (; i < nb; ++i) {
        c[i] = b[i];
    }
    return function (t) {
        for (i = 0; i < na; ++i) {
            c[i] = x[i](t);
        }
        return c;
    };
}

function object (a, b) {
    var i = {};
    var c = {};
    var k;
    if (a === null || typeof a !== 'object') {
        a = {};
    }
    if (b === null || typeof b !== 'object') {
        b = {};
    }
    for (k in b) {
        if (k in a) {
            i[k] = interpolateValue(a[k], b[k]);
        }
        else {
            c[k] = b[k];
        }
    }
    return function (t) {
        for (k in i) {
            c[k] = i[k](t);
        }
        return c;
    };
}

var __read$u = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var Color = /** @class */ (function () {
    /**
     * Every color component should be in the [0, 1] range.
     * Some easing functions (such as elastic easing) can overshoot the target value by some amount.
     * So, when animating colors, if the source or target color components are already near
     * or at the edge of the allowed [0, 1] range, it is possible for the intermediate color
     * component value to end up outside of that range mid-animation. For this reason the constructor
     * performs range checking/constraining.
     * @param r Red component.
     * @param g Green component.
     * @param b Blue component.
     * @param a Alpha (opacity) component.
     */
    function Color(r, g, b, a) {
        if (a === void 0) { a = 1; }
        // NaN is treated as 0.
        this.r = Math.min(1, Math.max(0, r || 0));
        this.g = Math.min(1, Math.max(0, g || 0));
        this.b = Math.min(1, Math.max(0, b || 0));
        this.a = Math.min(1, Math.max(0, a || 0));
    }
    /**
     * The given string can be in one of the following formats:
     * - #rgb
     * - #rrggbb
     * - rgb(r, g, b)
     * - rgba(r, g, b, a)
     * - CSS color name such as 'white', 'orange', 'cyan', etc.
     * @param str
     */
    Color.fromString = function (str) {
        // hexadecimal notation
        if (str.indexOf('#') >= 0) {
            // there can be some leading whitespace
            return Color.fromHexString(str);
        }
        // color name
        var hex = Color.nameToHex[str];
        if (hex) {
            return Color.fromHexString(hex);
        }
        // rgb(a) notation
        if (str.indexOf('rgb') >= 0) {
            return Color.fromRgbaString(str);
        }
        throw new Error("Invalid color string: '" + str + "'");
    };
    // See https://drafts.csswg.org/css-color/#hex-notation
    Color.parseHex = function (input) {
        input = input.replace(/ /g, '').slice(1);
        var parts;
        switch (input.length) {
            case 6:
            case 8:
                parts = [];
                for (var i = 0; i < input.length; i += 2) {
                    parts.push(parseInt("" + input[i] + input[i + 1], 16));
                }
                break;
            case 3:
            case 4:
                parts = input
                    .split('')
                    .map(function (p) { return parseInt(p, 16); })
                    .map(function (p) { return p + p * 16; });
                break;
        }
        if (parts.length >= 3) {
            if (parts.every(function (p) { return p >= 0; })) {
                if (parts.length === 3) {
                    parts.push(255);
                }
                return parts;
            }
        }
    };
    Color.fromHexString = function (str) {
        var values = Color.parseHex(str);
        if (values) {
            var _a = __read$u(values, 4), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
            return new Color(r / 255, g / 255, b / 255, a / 255);
        }
        throw new Error("Malformed hexadecimal color string: '" + str + "'");
    };
    Color.stringToRgba = function (str) {
        // Find positions of opening and closing parentheses.
        var _a = __read$u([NaN, NaN], 2), po = _a[0], pc = _a[1];
        for (var i = 0; i < str.length; i++) {
            var c = str[i];
            if (!po && c === '(') {
                po = i;
            }
            else if (c === ')') {
                pc = i;
                break;
            }
        }
        var contents = po && pc && str.substring(po + 1, pc);
        if (!contents) {
            return;
        }
        var parts = contents.split(',');
        var rgba = [];
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var value = parseFloat(part);
            if (isNaN(value)) {
                return;
            }
            if (part.indexOf('%') >= 0) {
                // percentage r, g, or b value
                value = Math.max(0, Math.min(100, value));
                value /= 100;
            }
            else {
                if (i === 3) {
                    // alpha component
                    value = Math.max(0, Math.min(1, value));
                }
                else {
                    // absolute r, g, or b value
                    value = Math.max(0, Math.min(255, value));
                    value /= 255;
                }
            }
            rgba.push(value);
        }
        return rgba;
    };
    Color.fromRgbaString = function (str) {
        var rgba = Color.stringToRgba(str);
        if (rgba) {
            if (rgba.length === 3) {
                return new Color(rgba[0], rgba[1], rgba[2]);
            }
            else if (rgba.length === 4) {
                return new Color(rgba[0], rgba[1], rgba[2], rgba[3]);
            }
        }
        throw new Error("Malformed rgb/rgba color string: '" + str + "'");
    };
    Color.fromArray = function (arr) {
        if (arr.length === 4) {
            return new Color(arr[0], arr[1], arr[2], arr[3]);
        }
        if (arr.length === 3) {
            return new Color(arr[0], arr[1], arr[2]);
        }
        throw new Error('The given array should contain 3 or 4 color components (numbers).');
    };
    Color.fromHSB = function (h, s, b, alpha) {
        if (alpha === void 0) { alpha = 1; }
        var rgb = Color.HSBtoRGB(h, s, b);
        return new Color(rgb[0], rgb[1], rgb[2], alpha);
    };
    Color.padHex = function (str) {
        // Can't use `padStart(2, '0')` here because of IE.
        return str.length === 1 ? '0' + str : str;
    };
    Color.prototype.toHexString = function () {
        var hex = '#' +
            Color.padHex(Math.round(this.r * 255).toString(16)) +
            Color.padHex(Math.round(this.g * 255).toString(16)) +
            Color.padHex(Math.round(this.b * 255).toString(16));
        if (this.a < 1) {
            hex += Color.padHex(Math.round(this.a * 255).toString(16));
        }
        return hex;
    };
    Color.prototype.toRgbaString = function (fractionDigits) {
        if (fractionDigits === void 0) { fractionDigits = 3; }
        var components = [Math.round(this.r * 255), Math.round(this.g * 255), Math.round(this.b * 255)];
        var k = Math.pow(10, fractionDigits);
        if (this.a !== 1) {
            components.push(Math.round(this.a * k) / k);
            return "rgba(" + components.join(', ') + ")";
        }
        return "rgb(" + components.join(', ') + ")";
    };
    Color.prototype.toString = function () {
        if (this.a === 1) {
            return this.toHexString();
        }
        return this.toRgbaString();
    };
    Color.prototype.toHSB = function () {
        return Color.RGBtoHSB(this.r, this.g, this.b);
    };
    /**
     * Converts the given RGB triple to an array of HSB (HSV) components.
     * The hue component will be `NaN` for achromatic colors.
     */
    Color.RGBtoHSB = function (r, g, b) {
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var S = max !== 0 ? (max - min) / max : 0;
        var H = NaN;
        // min == max, means all components are the same
        // and the color is a shade of gray with no hue (H is NaN)
        if (min !== max) {
            var delta = max - min;
            var rc = (max - r) / delta;
            var gc = (max - g) / delta;
            var bc = (max - b) / delta;
            if (r === max) {
                H = bc - gc;
            }
            else if (g === max) {
                H = 2.0 + rc - bc;
            }
            else {
                H = 4.0 + gc - rc;
            }
            H /= 6.0;
            if (H < 0) {
                H = H + 1.0;
            }
        }
        return [H * 360, S, max];
    };
    /**
     * Converts the given HSB (HSV) triple to an array of RGB components.
     */
    Color.HSBtoRGB = function (H, S, B) {
        if (isNaN(H)) {
            H = 0;
        }
        H = (((H % 360) + 360) % 360) / 360; // normalize hue to [0, 360] interval, then scale to [0, 1]
        var r = 0;
        var g = 0;
        var b = 0;
        if (S === 0) {
            r = g = b = B;
        }
        else {
            var h = (H - Math.floor(H)) * 6;
            var f = h - Math.floor(h);
            var p = B * (1 - S);
            var q = B * (1 - S * f);
            var t = B * (1 - S * (1 - f));
            switch (h >> 0 // discard the floating point part of the number
            ) {
                case 0:
                    r = B;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = B;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = B;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = B;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = B;
                    break;
                case 5:
                    r = B;
                    g = p;
                    b = q;
                    break;
            }
        }
        return [r, g, b];
    };
    Color.prototype.derive = function (hueShift, saturationFactor, brightnessFactor, opacityFactor) {
        var hsb = Color.RGBtoHSB(this.r, this.g, this.b);
        var b = hsb[2];
        if (b == 0 && brightnessFactor > 1.0) {
            b = 0.05;
        }
        var h = (((hsb[0] + hueShift) % 360) + 360) % 360;
        var s = Math.max(Math.min(hsb[1] * saturationFactor, 1.0), 0.0);
        b = Math.max(Math.min(b * brightnessFactor, 1.0), 0.0);
        var a = Math.max(Math.min(this.a * opacityFactor, 1.0), 0.0);
        var rgba = Color.HSBtoRGB(h, s, b);
        rgba.push(a);
        return Color.fromArray(rgba);
    };
    Color.prototype.brighter = function () {
        return this.derive(0, 1.0, 1.0 / 0.7, 1.0);
    };
    Color.prototype.darker = function () {
        return this.derive(0, 1.0, 0.7, 1.0);
    };
    /**
     * CSS Color Module Level 4:
     * https://drafts.csswg.org/css-color/#named-colors
     */
    Color.nameToHex = Object.freeze({
        aliceblue: '#F0F8FF',
        antiquewhite: '#FAEBD7',
        aqua: '#00FFFF',
        aquamarine: '#7FFFD4',
        azure: '#F0FFFF',
        beige: '#F5F5DC',
        bisque: '#FFE4C4',
        black: '#000000',
        blanchedalmond: '#FFEBCD',
        blue: '#0000FF',
        blueviolet: '#8A2BE2',
        brown: '#A52A2A',
        burlywood: '#DEB887',
        cadetblue: '#5F9EA0',
        chartreuse: '#7FFF00',
        chocolate: '#D2691E',
        coral: '#FF7F50',
        cornflowerblue: '#6495ED',
        cornsilk: '#FFF8DC',
        crimson: '#DC143C',
        cyan: '#00FFFF',
        darkblue: '#00008B',
        darkcyan: '#008B8B',
        darkgoldenrod: '#B8860B',
        darkgray: '#A9A9A9',
        darkgreen: '#006400',
        darkgrey: '#A9A9A9',
        darkkhaki: '#BDB76B',
        darkmagenta: '#8B008B',
        darkolivegreen: '#556B2F',
        darkorange: '#FF8C00',
        darkorchid: '#9932CC',
        darkred: '#8B0000',
        darksalmon: '#E9967A',
        darkseagreen: '#8FBC8F',
        darkslateblue: '#483D8B',
        darkslategray: '#2F4F4F',
        darkslategrey: '#2F4F4F',
        darkturquoise: '#00CED1',
        darkviolet: '#9400D3',
        deeppink: '#FF1493',
        deepskyblue: '#00BFFF',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1E90FF',
        firebrick: '#B22222',
        floralwhite: '#FFFAF0',
        forestgreen: '#228B22',
        fuchsia: '#FF00FF',
        gainsboro: '#DCDCDC',
        ghostwhite: '#F8F8FF',
        gold: '#FFD700',
        goldenrod: '#DAA520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#ADFF2F',
        grey: '#808080',
        honeydew: '#F0FFF0',
        hotpink: '#FF69B4',
        indianred: '#CD5C5C',
        indigo: '#4B0082',
        ivory: '#FFFFF0',
        khaki: '#F0E68C',
        lavender: '#E6E6FA',
        lavenderblush: '#FFF0F5',
        lawngreen: '#7CFC00',
        lemonchiffon: '#FFFACD',
        lightblue: '#ADD8E6',
        lightcoral: '#F08080',
        lightcyan: '#E0FFFF',
        lightgoldenrodyellow: '#FAFAD2',
        lightgray: '#D3D3D3',
        lightgreen: '#90EE90',
        lightgrey: '#D3D3D3',
        lightpink: '#FFB6C1',
        lightsalmon: '#FFA07A',
        lightseagreen: '#20B2AA',
        lightskyblue: '#87CEFA',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#B0C4DE',
        lightyellow: '#FFFFE0',
        lime: '#00FF00',
        limegreen: '#32CD32',
        linen: '#FAF0E6',
        magenta: '#FF00FF',
        maroon: '#800000',
        mediumaquamarine: '#66CDAA',
        mediumblue: '#0000CD',
        mediumorchid: '#BA55D3',
        mediumpurple: '#9370DB',
        mediumseagreen: '#3CB371',
        mediumslateblue: '#7B68EE',
        mediumspringgreen: '#00FA9A',
        mediumturquoise: '#48D1CC',
        mediumvioletred: '#C71585',
        midnightblue: '#191970',
        mintcream: '#F5FFFA',
        mistyrose: '#FFE4E1',
        moccasin: '#FFE4B5',
        navajowhite: '#FFDEAD',
        navy: '#000080',
        oldlace: '#FDF5E6',
        olive: '#808000',
        olivedrab: '#6B8E23',
        orange: '#FFA500',
        orangered: '#FF4500',
        orchid: '#DA70D6',
        palegoldenrod: '#EEE8AA',
        palegreen: '#98FB98',
        paleturquoise: '#AFEEEE',
        palevioletred: '#DB7093',
        papayawhip: '#FFEFD5',
        peachpuff: '#FFDAB9',
        peru: '#CD853F',
        pink: '#FFC0CB',
        plum: '#DDA0DD',
        powderblue: '#B0E0E6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#FF0000',
        rosybrown: '#BC8F8F',
        royalblue: '#4169E1',
        saddlebrown: '#8B4513',
        salmon: '#FA8072',
        sandybrown: '#F4A460',
        seagreen: '#2E8B57',
        seashell: '#FFF5EE',
        sienna: '#A0522D',
        silver: '#C0C0C0',
        skyblue: '#87CEEB',
        slateblue: '#6A5ACD',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#FFFAFA',
        springgreen: '#00FF7F',
        steelblue: '#4682B4',
        tan: '#D2B48C',
        teal: '#008080',
        thistle: '#D8BFD8',
        tomato: '#FF6347',
        turquoise: '#40E0D0',
        violet: '#EE82EE',
        wheat: '#F5DEB3',
        white: '#FFFFFF',
        whitesmoke: '#F5F5F5',
        yellow: '#FFFF00',
        yellowgreen: '#9ACD32',
    });
    return Color;
}());

function color (a, b) {
    if (typeof a === 'string') {
        try {
            a = Color.fromString(a);
        }
        catch (e) {
            a = Color.fromArray([0, 0, 0]);
        }
    }
    if (typeof b === 'string') {
        try {
            b = Color.fromString(b);
        }
        catch (e) {
            b = Color.fromArray([0, 0, 0]);
        }
    }
    var red = interpolateNumber(a.r, b.r);
    var green = interpolateNumber(a.g, b.g);
    var blue = interpolateNumber(a.b, b.b);
    var alpha = interpolateNumber(a.a, b.a);
    return function (t) {
        return Color.fromArray([red(t), green(t), blue(t), alpha(t)]).toRgbaString();
    };
}

function interpolateValue (a, b) {
    var t = typeof b;
    var c;
    if (b == null || t === 'boolean') {
        return constant$1(b);
    }
    if (t === 'number') {
        return interpolateNumber(a, b);
    }
    if (t === 'string') {
        try {
            c = Color.fromString(b);
            b = c;
            return color(a, b);
        }
        catch (e) {
            // return string(a, b);
        }
    }
    if (b instanceof Color) {
        return color(a, b);
    }
    if (b instanceof Date) {
        return date(a, b);
    }
    if (Array.isArray(b)) {
        return array(a, b);
    }
    if ((typeof b.valueOf !== 'function' && typeof b.toString !== 'function') || isNaN(b)) {
        return object(a, b);
    }
    return interpolateNumber(a, b);
}

function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function ascendingStringNumberUndefined(a, b) {
    var diff = 0;
    if (typeof a === 'number' && typeof b === 'number') {
        diff = a - b;
    }
    else if (typeof a === 'string' && typeof b === 'string') {
        diff = a.localeCompare(b);
    }
    else if (a == null && b == null) ;
    else if (a == null) {
        diff = -1;
    }
    else if (b == null) {
        diff = 1;
    }
    else {
        diff = String(a).localeCompare(String(b));
    }
    return diff;
}
function compoundAscending(a, b, comparator) {
    for (var idx in a) {
        var diff = comparator(a[idx], b[idx]);
        if (diff !== 0) {
            return diff;
        }
    }
    return 0;
}

/**
 * Returns the insertion point for `x` in array to maintain sorted order.
 * The arguments `lo` and `hi` may be used to specify a subset of the array which should be considered;
 * by default the entire array is used. If `x` is already present in array, the insertion point will be before
 * (to the left of) any existing entries. The return value is suitable for use as the first argument to `splice`
 * assuming that array is already sorted. The returned insertion point `i` partitions the array into two halves
 * so that all `v < x` for `v` in `array.slice(lo, i)` for the left side and all `v >= x` for `v` in `array.slice(i, hi)`
 * for the right side.
 * @param list
 * @param x
 * @param comparator
 * @param lo
 * @param hi
 */
function bisectRight(list, x, comparator, lo, hi) {
    if (lo === void 0) { lo = 0; }
    if (hi === void 0) { hi = list.length; }
    while (lo < hi) {
        var mid = (lo + hi) >>> 1;
        if (comparator(list[mid], x) > 0) {
            // list[mid] > x
            hi = mid;
        }
        else {
            lo = mid + 1;
        }
    }
    return lo;
}
/**
 * A specialized version of `bisectRight` that works with the arrays whose elements cannot be compared directly.
 * The map function is used instead to produce a comparable value for a given array element, then the values
 * returned by the map are compared using the `ascendingComparator`.
 * @param list
 * @param x
 * @param map
 * @param lo
 * @param hi
 */
function complexBisectRight(list, x, map, lo, hi) {
    if (lo === void 0) { lo = 0; }
    if (hi === void 0) { hi = list.length; }
    var comparator = ascendingComparator(map);
    while (lo < hi) {
        var mid = (lo + hi) >>> 1;
        if (comparator(list[mid], x) < 0) {
            lo = mid + 1;
        }
        else {
            hi = mid;
        }
    }
    return lo;
}
function ascendingComparator(map) {
    return function (item, x) {
        return ascending(map(item), x);
    };
}

var __read$t = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var constant = function (x) { return function () { return x; }; };
var identity$3 = function (x) { return x; };
function clamper$1(domain) {
    var _a;
    var a = domain[0];
    var b = domain[domain.length - 1];
    if (a > b) {
        _a = __read$t([b, a], 2), a = _a[0], b = _a[1];
    }
    return function (x) { return Math.max(a, Math.min(b, x)); };
}
var ContinuousScale = /** @class */ (function () {
    function ContinuousScale() {
        /**
         * The output value of the scale for `undefined` or `NaN` input values.
         */
        this.unknown = undefined;
        this.clamper = clamper$1;
        this._clamp = identity$3;
        this._domain = [0, 1];
        this._range = [0, 1];
        this.transform = identity$3; // transforms domain value
        this.untransform = identity$3; // untransforms domain value
        this._interpolate = interpolateValue;
        this.rescale();
    }
    Object.defineProperty(ContinuousScale.prototype, "clamp", {
        get: function () {
            return this._clamp !== identity$3;
        },
        set: function (value) {
            this._clamp = value ? this.clamper(this.domain) : identity$3;
        },
        enumerable: true,
        configurable: true
    });
    ContinuousScale.prototype.setDomain = function (values) {
        this._domain = values.map(function (v) { return +v; });
        if (this._clamp !== identity$3) {
            this._clamp = this.clamper(this.domain);
        }
        this.rescale();
    };
    ContinuousScale.prototype.getDomain = function () {
        return this._domain.slice();
    };
    Object.defineProperty(ContinuousScale.prototype, "domain", {
        get: function () {
            return this.getDomain();
        },
        set: function (values) {
            this.setDomain(values);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContinuousScale.prototype, "range", {
        get: function () {
            return this._range.slice();
        },
        set: function (values) {
            this._range = values.slice();
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContinuousScale.prototype, "interpolate", {
        get: function () {
            return this._interpolate;
        },
        set: function (value) {
            this._interpolate = value;
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    ContinuousScale.prototype.rescale = function () {
        if (Math.min(this.domain.length, this.range.length) > 2) {
            this.piecewise = this.polymap;
        }
        else {
            this.piecewise = this.bimap;
        }
        this.output = undefined;
        this.input = undefined;
    };
    /**
     * Returns a function that converts `x` in `[a, b]` to `t` in `[0, 1]`. Non-clamping.
     * @param a
     * @param b
     */
    ContinuousScale.prototype.normalize = function (a, b) {
        a = +a;
        b -= a;
        return b ? function (x) { return (x - a) / b; } : constant(isNaN(b) ? NaN : 0.5);
    };
    ContinuousScale.prototype.bimap = function (domain, range, interpolate) {
        var x0 = domain[0];
        var x1 = domain[1];
        var y0 = range[0];
        var y1 = range[1];
        var xt;
        var ty;
        if (x1 < x0) {
            xt = this.normalize(x1, x0);
            ty = interpolate(y1, y0);
        }
        else {
            xt = this.normalize(x0, x1);
            ty = interpolate(y0, y1);
        }
        return function (x) { return ty(xt(x)); }; // domain value x --> t in [0, 1] --> range value y
    };
    ContinuousScale.prototype.polymap = function (domain, range, interpolate) {
        var _this = this;
        // number of segments in the polylinear scale
        var n = Math.min(domain.length, range.length) - 1;
        if (domain[n] < domain[0]) {
            domain = domain.slice().reverse();
            range = range.slice().reverse();
        }
        // deinterpolators from domain segment value to t
        var dt = Array.from({ length: n }, function (_, i) { return _this.normalize(domain[i], domain[i + 1]); });
        // reinterpolators from t to range segment value
        var tr = Array.from({ length: n }, function (_, i) { return interpolate(range[i], range[i + 1]); });
        return function (x) {
            var i = bisectRight(domain, x, ascending, 1, n) - 1; // Find the domain segment that `x` belongs to.
            // This also tells us which deinterpolator/reinterpolator pair to use.
            return tr[i](dt[i](x));
        };
    };
    ContinuousScale.prototype.convert = function (x, clamper) {
        x = +x;
        if (isNaN(x)) {
            return this.unknown;
        }
        if (!this.output) {
            this.output = this.piecewise(this.domain.map(this.transform), this.range, this.interpolate);
        }
        var clamp = clamper ? clamper(this.domain) : this._clamp;
        return this.output(this.transform(clamp(x)));
    };
    ContinuousScale.prototype.invert = function (y) {
        if (!this.input) {
            this.input = this.piecewise(this.range, this.domain.map(this.transform), interpolateNumber);
        }
        return this._clamp(this.untransform(this.input(y)));
    };
    return ContinuousScale;
}());

function formatDefault(x, p) {
    var xs = x.toPrecision(p);
    var i0 = -1;
    var i1 = 0;
    var exit = false;
    for (var n = xs.length, i = 1; !exit && i < n; ++i) {
        switch (xs[i]) {
            case '.':
                i0 = i1 = i;
                break;
            case '0':
                if (i0 === 0)
                    i0 = i;
                i1 = i;
                break;
            case 'e':
                exit = true;
                break;
            default:
                if (i0 > 0)
                    i0 = 0;
                break;
        }
    }
    return i0 > 0 ? xs.slice(0, i0) + xs.slice(i1 + 1) : xs;
}
var formatTypes = {
    '': formatDefault,
    // Multiply by 100, and then decimal notation with a percent sign.
    '%': function (x, p) { return (x * 100).toFixed(p); },
    // Binary notation, rounded to integer.
    b: function (x) { return Math.round(x).toString(2); },
    // Converts the integer to the corresponding unicode character before printing.
    c: function (x) { return String(x); },
    // Decimal notation, rounded to integer.
    d: formatDecimal,
    // Exponent notation.
    e: function (x, p) { return x.toExponential(p); },
    // Fixed point notation.
    f: function (x, p) { return x.toFixed(p); },
    // Either decimal or exponent notation, rounded to significant digits.
    g: function (x, p) { return x.toPrecision(p); },
    // Octal notation, rounded to integer.
    o: function (x) { return Math.round(x).toString(8); },
    // Multiply by 100, round to significant digits, and then decimal notation with a percent sign.
    p: function (x, p) { return formatRounded(x * 100, p); },
    // Decimal notation, rounded to significant digits.
    r: formatRounded,
    // Decimal notation with a SI prefix, rounded to significant digits.
    s: formatPrefixAuto,
    // Hexadecimal notation, using upper-case letters, rounded to integer.
    X: function (x) { return Math.round(x).toString(16).toUpperCase(); },
    // Hexadecimal notation, using lower-case letters, rounded to integer.
    x: function (x) { return Math.round(x).toString(16); },
};
var prefixes = ['y', 'z', 'a', 'f', 'p', 'n', '\xB5', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
/**
 * [[fill]align][sign][#][0][width][grouping_option][.precision][type]
 */
var FormatSpecifier = /** @class */ (function () {
    function FormatSpecifier(specifier) {
        if (specifier instanceof FormatSpecifier) {
            this.fill = specifier.fill;
            this.align = specifier.align;
            this.sign = specifier.sign;
            this.symbol = specifier.symbol;
            this.zero = specifier.zero;
            this.width = specifier.width;
            this.comma = specifier.comma;
            this.precision = specifier.precision;
            this.trim = specifier.trim;
            this.type = specifier.type;
            this.string = specifier.string;
        }
        else {
            this.fill = specifier.fill === undefined ? ' ' : String(specifier.fill);
            this.align = specifier.align === undefined ? '>' : String(specifier.align);
            this.sign = specifier.sign === undefined ? '-' : String(specifier.sign);
            this.symbol = specifier.symbol === undefined ? '' : String(specifier.symbol);
            this.zero = !!specifier.zero;
            this.width = specifier.width === undefined ? undefined : +specifier.width;
            this.comma = !!specifier.comma;
            this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
            this.trim = !!specifier.trim;
            this.type = specifier.type === undefined ? '' : String(specifier.type);
            this.string = specifier.string;
        }
    }
    return FormatSpecifier;
}());
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var formatRegEx = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
var interpolateRegEx = /(#\{(.*?)\})/g;
function makeFormatSpecifier(specifier) {
    if (specifier instanceof FormatSpecifier) {
        return new FormatSpecifier(specifier);
    }
    var found = false;
    var string = specifier.replace(interpolateRegEx, function () {
        if (!found) {
            specifier = arguments[2];
            found = true;
        }
        return '#{}';
    });
    var match = formatRegEx.exec(specifier);
    if (!match) {
        throw new Error("Invalid format: " + specifier);
    }
    return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10],
        string: found ? string : undefined,
    });
}
function tickFormat(start, stop, count, specifier) {
    var step = tickStep(start, stop, count);
    var formatSpecifier = makeFormatSpecifier(specifier == undefined ? ',f' : specifier);
    var precision;
    switch (formatSpecifier.type) {
        case 's': {
            var value = Math.max(Math.abs(start), Math.abs(stop));
            if (formatSpecifier.precision == null) {
                precision = precisionPrefix(step, value);
                if (!isNaN(precision)) {
                    formatSpecifier.precision = precision;
                }
            }
            return formatPrefix(formatSpecifier, value);
        }
        case '':
        case 'e':
        case 'g':
        case 'p':
        case 'r': {
            if (formatSpecifier.precision == null) {
                precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop)));
                if (!isNaN(precision)) {
                    formatSpecifier.precision = precision - +(formatSpecifier.type === 'e');
                }
            }
            break;
        }
        case 'f':
        case '%': {
            if (formatSpecifier.precision == null) {
                precision = precisionFixed(step);
                if (!isNaN(precision)) {
                    formatSpecifier.precision = precision - +(formatSpecifier.type === '%') * 2;
                }
            }
            break;
        }
    }
    return format(formatSpecifier);
}
var prefixExponent;
function formatPrefixAuto(x, p) {
    if (p === void 0) { p = 0; }
    var d = formatDecimalParts(x, p);
    if (!d) {
        return String(x);
    }
    var coefficient = d[0];
    var exponent = d[1];
    prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3;
    var i = exponent - prefixExponent + 1;
    var n = coefficient.length;
    if (i === n) {
        return coefficient;
    }
    else if (i > n) {
        return coefficient + new Array(i - n + 1).join('0');
    }
    else if (i > 0) {
        return coefficient.slice(0, i) + '.' + coefficient.slice(i);
    }
    else {
        var parts = formatDecimalParts(x, Math.max(0, p + i - 1));
        return '0.' + new Array(1 - i).join('0') + parts[0]; // less than 1y!
    }
}
function formatDecimal(x) {
    x = Math.round(x);
    return Math.abs(x) >= 1e21 ? x.toLocaleString('en').replace(/,/g, '') : x.toString(10);
}
function formatGroup(grouping, thousands) {
    return function (value, width) {
        var t = [];
        var i = value.length;
        var j = 0;
        var g = grouping[0];
        var length = 0;
        while (i > 0 && g > 0) {
            if (length + g + 1 > width) {
                g = Math.max(1, width - length);
            }
            i -= g;
            t.push(value.substring(i, i + g));
            if ((length += g + 1) > width) {
                break;
            }
            j = (j + 1) % grouping.length;
            g = grouping[j];
        }
        t.reverse();
        return t.join(thousands);
    };
}
function formatNumerals(numerals) {
    return function (value) { return value.replace(/[0-9]/g, function (i) { return numerals[+i]; }); };
}
// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
    var i0 = -1, i1 = 0;
    var exit = false;
    for (var n = s.length, i = 1; !exit && i < n; ++i) {
        switch (s[i]) {
            case '.':
                i0 = i1 = i;
                break;
            case '0':
                if (i0 === 0)
                    i0 = i;
                i1 = i;
                break;
            default:
                if (!+s[i]) {
                    exit = true;
                    break;
                }
                if (i0 > 0)
                    i0 = 0;
                break;
        }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) {
        return String(x);
    }
    var coefficient = d[0];
    var exponent = d[1];
    if (exponent < 0) {
        return '0.' + new Array(-exponent).join('0') + coefficient;
    }
    else {
        if (coefficient.length > exponent + 1) {
            return coefficient.slice(0, exponent + 1) + '.' + coefficient.slice(exponent + 1);
        }
        else {
            return coefficient + new Array(exponent - coefficient.length + 2).join('0');
        }
    }
}
// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimalParts(1.23) returns ['123', 0].
function formatDecimalParts(x, p) {
    var sx = p ? x.toExponential(p - 1) : x.toExponential();
    var i = sx.indexOf('e');
    if (i < 0) {
        // NaN, ±Infinity
        return undefined;
    }
    var coefficient = sx.slice(0, i);
    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +sx.slice(i + 1)];
}
function identity$2(x) {
    return x;
}
var formatDefaultLocale;
var format;
var formatPrefix;
defaultLocale({
    thousands: ',',
    grouping: [3],
    currency: ['$', ''],
});
function defaultLocale(definition) {
    formatDefaultLocale = formatLocale$1(definition);
    format = formatDefaultLocale.format;
    formatPrefix = formatDefaultLocale.formatPrefix;
}
function exponent(x) {
    var parts = formatDecimalParts(Math.abs(x));
    if (parts) {
        return parts[1];
    }
    return NaN;
}
function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
}
function precisionPrefix(step, value) {
    var x = Math.floor(exponent(value) / 3);
    x = Math.min(8, x);
    x = Math.max(-8, x);
    return Math.max(0, x * 3 - exponent(Math.abs(step)));
}
function precisionRound(step, max) {
    step = Math.abs(step);
    max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
}
function formatLocale$1(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined
        ? identity$2
        : formatGroup(locale.grouping.map(Number), String(locale.thousands));
    var currencyPrefix = locale.currency === undefined ? '' : String(locale.currency[0]);
    var currencySuffix = locale.currency === undefined ? '' : String(locale.currency[1]);
    var decimal = locale.decimal === undefined ? '.' : String(locale.decimal);
    var numerals = locale.numerals === undefined ? identity$2 : formatNumerals(locale.numerals.map(String));
    var percent = locale.percent === undefined ? '%' : String(locale.percent);
    var minus = locale.minus === undefined ? '\u2212' : String(locale.minus);
    var nan = locale.nan === undefined ? 'NaN' : String(locale.nan);
    function newFormat(specifier) {
        var formatSpecifier = makeFormatSpecifier(specifier);
        var fill = formatSpecifier.fill;
        var align = formatSpecifier.align;
        var sign = formatSpecifier.sign;
        var symbol = formatSpecifier.symbol;
        var zero = formatSpecifier.zero;
        var width = formatSpecifier.width;
        var comma = formatSpecifier.comma;
        var precision = formatSpecifier.precision;
        var trim = formatSpecifier.trim;
        var type = formatSpecifier.type;
        // The 'n' type is an alias for ',g'.
        if (type === 'n') {
            comma = true;
            type = 'g';
        }
        else if (!formatTypes[type]) {
            // The '' type, and any invalid type, is an alias for '.12~g'.
            if (precision === undefined) {
                precision = 12;
            }
            trim = true;
            type = 'g';
        }
        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === '0' && align === '=')) {
            zero = true;
            fill = '0';
            align = '=';
        }
        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === '$' ? currencyPrefix : symbol === '#' && /[boxX]/.test(type) ? '0' + type.toLowerCase() : '';
        var suffix = symbol === '$' ? currencySuffix : /[%p]/.test(type) ? percent : '';
        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type];
        var maybeSuffix = /[defgprs%]/.test(type);
        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        if (precision === undefined) {
            precision = 6;
        }
        else if (/[gprs]/.test(type)) {
            precision = Math.max(1, Math.min(21, precision));
        }
        else {
            precision = Math.max(0, Math.min(20, precision));
        }
        function format(x) {
            var valuePrefix = prefix;
            var valueSuffix = suffix;
            var value;
            if (type === 'c') {
                valueSuffix = formatType(+x) + valueSuffix;
                value = '';
            }
            else {
                var nx = +x;
                // Determine the sign. -0 is not less than 0, but 1 / -0 is!
                var valueNegative = x < 0 || 1 / nx < 0;
                // Perform the initial formatting.
                value = isNaN(nx) ? nan : formatType(Math.abs(nx), precision);
                // Trim insignificant zeros.
                if (trim) {
                    value = formatTrim(value);
                }
                // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
                if (valueNegative && +value === 0 && sign !== '+') {
                    valueNegative = false;
                }
                // Compute the prefix and suffix.
                var signPrefix = valueNegative
                    ? sign === '('
                        ? sign
                        : minus
                    : sign === '-' || sign === '('
                        ? ''
                        : sign;
                var signSuffix = valueNegative && sign === '(' ? ')' : '';
                valuePrefix = signPrefix + valuePrefix;
                valueSuffix = (type === 's' ? prefixes[8 + prefixExponent / 3] : '') + valueSuffix + signSuffix;
                // Break the formatted value into the integer “value” part that can be
                // grouped, and fractional or exponential “suffix” part that is not.
                if (maybeSuffix) {
                    for (var i = 0, n = value.length; i < n; i++) {
                        var c = value.charCodeAt(i);
                        if (48 > c || c > 57) {
                            valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                            value = value.slice(0, i);
                            break;
                        }
                    }
                }
            }
            // If the fill character is not '0', grouping is applied before padding.
            if (comma && !zero)
                value = group(value, Infinity);
            // Compute the padding.
            var length = valuePrefix.length + value.length + valueSuffix.length;
            var padding = length < width ? new Array(width - length + 1).join(fill) : '';
            // If the fill character is '0', grouping is applied after padding.
            if (comma && zero) {
                value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity);
                padding = '';
            }
            // Reconstruct the final output based on the desired alignment.
            switch (align) {
                case '<':
                    value = valuePrefix + value + valueSuffix + padding;
                    break;
                case '=':
                    value = valuePrefix + padding + value + valueSuffix;
                    break;
                case '^':
                    value =
                        padding.slice(0, (length = padding.length >> 1)) +
                            valuePrefix +
                            value +
                            valueSuffix +
                            padding.slice(length);
                    break;
                default:
                    value = padding + valuePrefix + value + valueSuffix;
                    break;
            }
            var string = formatSpecifier.string;
            if (string) {
                return string.replace(interpolateRegEx, function () { return numerals(value); });
            }
            return numerals(value);
        }
        return format;
    }
    function formatPrefix(specifier, value) {
        var formatSpecifier = makeFormatSpecifier(specifier);
        formatSpecifier.type = 'f';
        var f = newFormat(formatSpecifier);
        var e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3;
        var k = Math.pow(10, -e);
        var prefix = prefixes[8 + e / 3];
        return function (value) {
            return f(k * +value) + prefix;
        };
    }
    return {
        format: newFormat,
        formatPrefix: formatPrefix,
    };
}

var __extends$V = (undefined && undefined.__extends) || (function () {
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
/**
 * Maps continuous domain to a continuous range.
 */
var LinearScale = /** @class */ (function (_super) {
    __extends$V(LinearScale, _super);
    function LinearScale() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'linear';
        return _this;
    }
    LinearScale.prototype.ticks = function (count) {
        if (count === void 0) { count = 10; }
        var d = this._domain;
        return ticks(d[0], d[d.length - 1], count);
    };
    /**
     * Extends the domain so that it starts and ends on nice round values.
     * @param count Tick count.
     */
    LinearScale.prototype.nice = function (count) {
        if (count === void 0) { count = 10; }
        var d = this.domain;
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var step;
        if (stop < start) {
            step = start;
            start = stop;
            stop = step;
            step = i0;
            i0 = i1;
            i1 = step;
        }
        step = tickIncrement(start, stop, count);
        if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
            step = tickIncrement(start, stop, count);
        }
        else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
            step = tickIncrement(start, stop, count);
        }
        if (step > 0) {
            d[i0] = Math.floor(start / step) * step;
            d[i1] = Math.ceil(stop / step) * step;
            this.domain = d;
        }
        else if (step < 0) {
            d[i0] = Math.ceil(start * step) / step;
            d[i1] = Math.floor(stop * step) / step;
            this.domain = d;
        }
    };
    LinearScale.prototype.tickFormat = function (_a) {
        var count = _a.count, specifier = _a.specifier;
        var d = this.domain;
        return tickFormat(d[0], d[d.length - 1], count == undefined ? 10 : count, specifier);
    };
    return LinearScale;
}(ContinuousScale));

var __values$m = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// Custom `Array.find` implementation for legacy browsers.
function find(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        var value = arr[i];
        if (predicate(value, i, arr)) {
            return value;
        }
    }
}
function findIndex(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
}
function identity$1(value) {
    return value;
}
function extent(values, predicate, map) {
    var transform = map || identity$1;
    var n = values.length;
    var i = -1;
    var value;
    var min;
    var max;
    while (++i < n) {
        // Find the first value.
        value = values[i];
        if (predicate(value)) {
            min = max = value;
            while (++i < n) {
                // Compare the remaining values.
                value = values[i];
                if (predicate(value)) {
                    if (min > value) {
                        min = value;
                    }
                    if (max < value) {
                        max = value;
                    }
                }
            }
        }
    }
    return min === undefined || max === undefined ? undefined : [transform(min), transform(max)];
}
/**
 * finds the min and max using a process appropriate for stacked values. Ie,
 * summing up the positive and negative numbers, and returning the totals of each
 */
function findMinMax(values) {
    var e_1, _a;
    var min = undefined;
    var max = undefined;
    try {
        for (var values_1 = __values$m(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
            var value = values_1_1.value;
            if (value < 0) {
                min = ((min !== null && min !== void 0 ? min : 0)) + value;
            }
            else if (value >= 0) {
                max = ((max !== null && max !== void 0 ? max : 0)) + value;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { min: min, max: max };
}
function copy(array, start, count) {
    if (start === void 0) { start = 0; }
    if (count === void 0) { count = array.length; }
    var result = [];
    var n = array.length;
    if (n) {
        for (var i = 0; i < count; i++) {
            result.push(array[(start + i) % n]);
        }
    }
    return result;
}

// Simplified version of https://github.com/plotly/fast-isnumeric
// that doesn't treat number strings with leading/trailing whitespace as numbers.
function isNumber(value) {
    if (typeof value !== 'number') {
        return false;
    }
    return Number.isFinite(value);
}
function isNumberObject(value) {
    return !!value && value.hasOwnProperty('valueOf') && isNumber(value.valueOf());
}
function isNumeric(value) {
    return isNumber(value) || isNumberObject(value);
}
function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}
function isString(value) {
    return typeof value === 'string';
}
function isStringObject(value) {
    return !!value && value.hasOwnProperty('toString') && isString(value.toString());
}
function isDiscrete(value) {
    return isString(value) || isStringObject(value);
}
function isContinuous(value) {
    return isNumeric(value) || isDate(value);
}
function checkDatum(value, isContinuousScale) {
    if (isContinuousScale && isContinuous(value)) {
        return value;
    }
    else if (!isContinuousScale) {
        if (!isDiscrete(value)) {
            return String(value);
        }
        return value;
    }
    return undefined;
}

// @ts-ignore Suppress tsc error: Property 'sign' does not exist on type 'Math'
var sign = Math.sign
    ? Math.sign
    : function (x) {
        x = +x;
        if (x === 0 || isNaN(x)) {
            return x;
        }
        return x > 0 ? 1 : -1;
    };
/**
 * Finds the roots of a parametric linear equation in `t`,
 * where `t` lies in the interval of `[0,1]`.
 */
function linearRoot(a, b) {
    var t = -b / a;
    return a !== 0 && t >= 0 && t <= 1 ? [t] : [];
}
/**
 * Finds the roots of a parametric quadratic equation in `t`,
 * where `t` lies in the interval of `[0,1]`.
 */
function quadraticRoots(a, b, c) {
    if (a === 0) {
        return linearRoot(b, c);
    }
    var D = b * b - 4 * a * c; // The polynomial's discriminant.
    var roots = [];
    if (D === 0) {
        // A single real root.
        var t = -b / (2 * a);
        if (t >= 0 && t <= 1) {
            roots.push(t);
        }
    }
    else if (D > 0) {
        // A pair of distinct real roots.
        var rD = Math.sqrt(D);
        var t1 = (-b - rD) / (2 * a);
        var t2 = (-b + rD) / (2 * a);
        if (t1 >= 0 && t1 <= 1) {
            roots.push(t1);
        }
        if (t2 >= 0 && t2 <= 1) {
            roots.push(t2);
        }
    }
    // else -> Complex roots.
    return roots;
}
/**
 * Finds the roots of a parametric cubic equation in `t`,
 * where `t` lies in the interval of `[0,1]`.
 * Returns an array of parametric intersection locations along the cubic,
 * excluding out-of-bounds intersections (before or after the end point
 * or in the imaginary plane).
 * An adaptation of http://www.particleincell.com/blog/2013/cubic-line-intersection/
 */
function cubicRoots(a, b, c, d) {
    if (a === 0) {
        return quadraticRoots(b, c, d);
    }
    var A = b / a;
    var B = c / a;
    var C = d / a;
    var Q = (3 * B - A * A) / 9;
    var R = (9 * A * B - 27 * C - 2 * A * A * A) / 54;
    var D = Q * Q * Q + R * R; // The polynomial's discriminant.
    var third = 1 / 3;
    var roots = [];
    if (D >= 0) {
        // Complex or duplicate roots.
        var rD = Math.sqrt(D);
        var S = sign(R + rD) * Math.pow(Math.abs(R + rD), third);
        var T = sign(R - rD) * Math.pow(Math.abs(R - rD), third);
        var Im = Math.abs((Math.sqrt(3) * (S - T)) / 2); // Complex part of the root pair.
        var t = -third * A + (S + T); // A real root.
        if (t >= 0 && t <= 1) {
            roots.push(t);
        }
        if (Im === 0) {
            var t_1 = -third * A - (S + T) / 2; // The real part of a complex root.
            if (t_1 >= 0 && t_1 <= 1) {
                roots.push(t_1);
            }
        }
    }
    else {
        // Distinct real roots.
        var theta = Math.acos(R / Math.sqrt(-Q * Q * Q));
        var thirdA = third * A;
        var twoSqrtQ = 2 * Math.sqrt(-Q);
        var t1 = twoSqrtQ * Math.cos(third * theta) - thirdA;
        var t2 = twoSqrtQ * Math.cos(third * (theta + 2 * Math.PI)) - thirdA;
        var t3 = twoSqrtQ * Math.cos(third * (theta + 4 * Math.PI)) - thirdA;
        if (t1 >= 0 && t1 <= 1) {
            roots.push(t1);
        }
        if (t2 >= 0 && t2 <= 1) {
            roots.push(t2);
        }
        if (t3 >= 0 && t3 <= 1) {
            roots.push(t3);
        }
    }
    return roots;
}

/**
 * Returns the intersection point for the given pair of line segments, or null,
 * if the segments are parallel or don't intersect.
 * Based on http://paulbourke.net/geometry/pointlineplane/
 */
function segmentIntersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    var d = (ax2 - ax1) * (by2 - by1) - (ay2 - ay1) * (bx2 - bx1);
    if (d === 0) {
        // The lines are parallel.
        return null;
    }
    var ua = ((bx2 - bx1) * (ay1 - by1) - (ax1 - bx1) * (by2 - by1)) / d;
    var ub = ((ax2 - ax1) * (ay1 - by1) - (ay2 - ay1) * (ax1 - bx1)) / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return {
            x: ax1 + ua * (ax2 - ax1),
            y: ay1 + ua * (ay2 - ay1),
        };
    }
    return null; // The intersection point is outside either or both segments.
}
/**
 * Returns intersection points of the given cubic curve and the line segment.
 * Takes in x/y components of cubic control points and line segment start/end points
 * as parameters.
 */
function cubicSegmentIntersections(px1, py1, px2, py2, px3, py3, px4, py4, x1, y1, x2, y2) {
    var intersections = [];
    // Find line equation coefficients.
    var A = y1 - y2;
    var B = x2 - x1;
    var C = x1 * (y2 - y1) - y1 * (x2 - x1);
    // Find cubic Bezier curve equation coefficients from control points.
    var bx = bezierCoefficients(px1, px2, px3, px4);
    var by = bezierCoefficients(py1, py2, py3, py4);
    var a = A * bx[0] + B * by[0]; // t^3
    var b = A * bx[1] + B * by[1]; // t^2
    var c = A * bx[2] + B * by[2]; // t
    var d = A * bx[3] + B * by[3] + C; // 1
    var roots = cubicRoots(a, b, c, d);
    // Verify that the roots are within bounds of the linear segment.
    for (var i = 0; i < roots.length; i++) {
        var t = roots[i];
        var tt = t * t;
        var ttt = t * tt;
        // Find the cartesian plane coordinates for the parametric root `t`.
        var x = bx[0] * ttt + bx[1] * tt + bx[2] * t + bx[3];
        var y = by[0] * ttt + by[1] * tt + by[2] * t + by[3];
        // The parametric cubic roots we found are intersection points
        // with an infinite line, and so the x/y coordinates above are as well.
        // Make sure the x/y is also within the bounds of the given segment.
        var s = void 0;
        if (x1 !== x2) {
            s = (x - x1) / (x2 - x1);
        }
        else {
            // the line is vertical
            s = (y - y1) / (y2 - y1);
        }
        if (s >= 0 && s <= 1) {
            intersections.push({ x: x, y: y });
        }
    }
    return intersections;
}
/**
 * Returns the given coordinates vector multiplied by the coefficient matrix
 * of the parametric cubic Bézier equation.
 */
function bezierCoefficients(P1, P2, P3, P4) {
    return [
        // Bézier expressed as matrix operations:
        -P1 + 3 * P2 - 3 * P3 + P4,
        3 * P1 - 6 * P2 + 3 * P3,
        -3 * P1 + 3 * P2,
        P1,
    ];
}

var __values$l = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Path2D = /** @class */ (function () {
    function Path2D() {
        // The methods of this class will likely be called many times per animation frame,
        // and any allocation can trigger a GC cycle during animation, so we attempt
        // to minimize the number of allocations.
        this.previousCommands = [];
        this.previousParams = [];
        this.previousClosedPath = false;
        this.commands = [];
        this.params = [];
        this._closedPath = false;
    }
    Path2D.prototype.isDirty = function () {
        if (this._closedPath !== this.previousClosedPath) {
            return true;
        }
        if (this.previousCommands.length !== this.commands.length) {
            return true;
        }
        if (this.previousParams.length !== this.params.length) {
            return true;
        }
        for (var i = 0; i < this.commands.length; i++) {
            if (this.commands[i] !== this.previousCommands[i]) {
                return true;
            }
        }
        for (var i = 0; i < this.params.length; i++) {
            if (this.params[i] !== this.previousParams[i]) {
                return true;
            }
        }
        return false;
    };
    Path2D.prototype.draw = function (ctx) {
        var e_1, _a;
        var commands = this.commands;
        var params = this.params;
        var j = 0;
        ctx.beginPath();
        try {
            for (var commands_1 = __values$l(commands), commands_1_1 = commands_1.next(); !commands_1_1.done; commands_1_1 = commands_1.next()) {
                var command = commands_1_1.value;
                switch (command) {
                    case 'M':
                        ctx.moveTo(params[j++], params[j++]);
                        break;
                    case 'L':
                        ctx.lineTo(params[j++], params[j++]);
                        break;
                    case 'C':
                        ctx.bezierCurveTo(params[j++], params[j++], params[j++], params[j++], params[j++], params[j++]);
                        break;
                    case 'Z':
                        ctx.closePath();
                        break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (commands_1_1 && !commands_1_1.done && (_a = commands_1.return)) _a.call(commands_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (commands.length === 0) {
            ctx.closePath();
        }
    };
    Path2D.prototype.moveTo = function (x, y) {
        if (this.xy) {
            this.xy[0] = x;
            this.xy[1] = y;
        }
        else {
            this.xy = [x, y];
        }
        this.commands.push('M');
        this.params.push(x, y);
    };
    Path2D.prototype.lineTo = function (x, y) {
        if (this.xy) {
            this.commands.push('L');
            this.params.push(x, y);
            this.xy[0] = x;
            this.xy[1] = y;
        }
        else {
            this.moveTo(x, y);
        }
    };
    Path2D.prototype.rect = function (x, y, width, height) {
        this.moveTo(x, y);
        this.lineTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.closePath();
    };
    /**
     * Adds an arc segment to the path definition.
     * https://www.w3.org/TR/SVG11/paths.html#PathDataEllipticalArcCommands
     * @param rx The major-axis radius.
     * @param ry The minor-axis radius.
     * @param rotation The x-axis rotation, expressed in radians.
     * @param fA The large arc flag. `1` to use angle > π.
     * @param fS The sweep flag. `1` for the arc that goes to `x`/`y` clockwise.
     * @param x2 The x coordinate to arc to.
     * @param y2 The y coordinate to arc to.
     */
    Path2D.prototype.arcTo = function (rx, ry, rotation, fA, fS, x2, y2) {
        // Convert from endpoint to center parametrization:
        // https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        var xy = this.xy;
        if (!xy) {
            return;
        }
        if (rx < 0) {
            rx = -rx;
        }
        if (ry < 0) {
            ry = -ry;
        }
        var x1 = xy[0];
        var y1 = xy[1];
        var hdx = (x1 - x2) / 2;
        var hdy = (y1 - y2) / 2;
        var sinPhi = Math.sin(rotation);
        var cosPhi = Math.cos(rotation);
        var xp = cosPhi * hdx + sinPhi * hdy;
        var yp = -sinPhi * hdx + cosPhi * hdy;
        var ratX = xp / rx;
        var ratY = yp / ry;
        var lambda = ratX * ratX + ratY * ratY;
        var cx = (x1 + x2) / 2;
        var cy = (y1 + y2) / 2;
        var cpx = 0;
        var cpy = 0;
        if (lambda >= 1) {
            lambda = Math.sqrt(lambda);
            rx *= lambda;
            ry *= lambda;
            // me gives lambda == cpx == cpy == 0;
        }
        else {
            lambda = Math.sqrt(1 / lambda - 1);
            if (fA === fS) {
                lambda = -lambda;
            }
            cpx = lambda * rx * ratY;
            cpy = -lambda * ry * ratX;
            cx += cosPhi * cpx - sinPhi * cpy;
            cy += sinPhi * cpx + cosPhi * cpy;
        }
        var theta1 = Math.atan2((yp - cpy) / ry, (xp - cpx) / rx);
        var deltaTheta = Math.atan2((-yp - cpy) / ry, (-xp - cpx) / rx) - theta1;
        this.cubicArc(cx, cy, rx, ry, rotation, theta1, theta1 + deltaTheta, 1 - fS);
    };
    /**
     * Approximates an elliptical arc with up to four cubic Bézier curves.
     * @param commands The string array to write SVG command letters to.
     * @param params The number array to write SVG command parameters (cubic control points) to.
     * @param cx The x-axis coordinate for the ellipse's center.
     * @param cy The y-axis coordinate for the ellipse's center.
     * @param rx The ellipse's major-axis radius.
     * @param ry The ellipse's minor-axis radius.
     * @param phi The rotation for this ellipse, expressed in radians.
     * @param theta1 The starting angle, measured clockwise from the positive x-axis and expressed in radians.
     * @param theta2 The ending angle, measured clockwise from the positive x-axis and expressed in radians.
     * @param anticlockwise The arc control points are always placed clockwise from `theta1` to `theta2`,
     * even when `theta1 > theta2`, unless this flag is set to `1`.
     */
    Path2D.cubicArc = function (commands, params, cx, cy, rx, ry, phi, theta1, theta2, anticlockwise) {
        if (anticlockwise) {
            var temp = theta1;
            theta1 = theta2;
            theta2 = temp;
        }
        var start = params.length;
        // See https://pomax.github.io/bezierinfo/#circles_cubic
        // Arc of unit circle (start angle = 0, end angle <= π/2) in cubic Bézier coordinates:
        // S = [1, 0]
        // C1 = [1, f]
        // C2 = [cos(θ) + f * sin(θ), sin(θ) - f * cos(θ)]
        // E = [cos(θ), sin(θ)]
        // f = 4/3 * tan(θ/4)
        var f90 = 0.5522847498307935; // f for θ = π/2 is 4/3 * (Math.sqrt(2) - 1)
        var sinTheta1 = Math.sin(theta1);
        var cosTheta1 = Math.cos(theta1);
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        var rightAngle = Math.PI / 2;
        // Since we know how to draw an arc of a unit circle with a cubic Bézier,
        // to draw an elliptical arc with arbitrary rotation and radii we:
        // 1) rotate the Bézier coordinates that represent a circular arc by θ
        // 2) scale the circular arc separately along the x/y axes, making it elliptical
        // 3) rotate elliptical arc by φ
        // |cos(φ) -sin(φ)| |sx  0| |cos(θ) -sin(θ)| -> |xx xy|
        // |sin(φ)  cos(φ)| | 0 sy| |sin(θ)  cos(θ)| -> |yx yy|
        var xx = cosPhi * cosTheta1 * rx - sinPhi * sinTheta1 * ry;
        var yx = sinPhi * cosTheta1 * rx + cosPhi * sinTheta1 * ry;
        var xy = -cosPhi * sinTheta1 * rx - sinPhi * cosTheta1 * ry;
        var yy = -sinPhi * sinTheta1 * rx + cosPhi * cosTheta1 * ry;
        // Always draw clockwise from θ1 to θ2.
        theta2 -= theta1;
        if (theta2 < 0) {
            theta2 += Math.PI * 2;
        }
        // Multiplying each point [x, y] by:
        // |xx xy cx| |x|
        // |yx yy cy| |y|
        // | 0  0  1| |1|
        commands.push('M');
        params.push(xx + cx, yx + cy);
        while (theta2 >= rightAngle) {
            theta2 -= rightAngle;
            commands.push('C');
            // Temp workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=993330
            // Revert this commit when fixed ^^.
            var lastX = xy + cx;
            params.push(xx + xy * f90 + cx, yx + yy * f90 + cy, xx * f90 + xy + cx, yx * f90 + yy + cy, Math.abs(lastX) < 1e-8 ? 0 : lastX, yy + cy);
            // Prepend π/2 rotation matrix.
            // |xx xy| | 0 1| -> | xy -xx|
            // |yx yy| |-1 0| -> | yy -yx|
            // [xx, yx, xy, yy] = [xy, yy, -xx, -yx];
            // Compared to swapping with a temp variable, destructuring is:
            // - 10% faster in Chrome 70
            // - 99% slower in Firefox 63
            // Temp variable solution is 45% faster in FF than Chrome.
            // https://jsperf.com/multi-swap
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1165569
            var temp = xx;
            xx = xy;
            xy = -temp;
            temp = yx;
            yx = yy;
            yy = -temp;
        }
        if (theta2) {
            var f = (4 / 3) * Math.tan(theta2 / 4);
            var sinPhi2 = Math.sin(theta2);
            var cosPhi2 = Math.cos(theta2);
            var C2x = cosPhi2 + f * sinPhi2;
            var C2y = sinPhi2 - f * cosPhi2;
            commands.push('C');
            // Temp workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=993330
            // Revert this commit when fixed ^^.
            var lastX = xx * cosPhi2 + xy * sinPhi2 + cx;
            params.push(xx + xy * f + cx, yx + yy * f + cy, xx * C2x + xy * C2y + cx, yx * C2x + yy * C2y + cy, Math.abs(lastX) < 1e-8 ? 0 : lastX, yx * cosPhi2 + yy * sinPhi2 + cy);
        }
        if (anticlockwise) {
            for (var i = start, j = params.length - 2; i < j; i += 2, j -= 2) {
                var temp = params[i];
                params[i] = params[j];
                params[j] = temp;
                temp = params[i + 1];
                params[i + 1] = params[j + 1];
                params[j + 1] = temp;
            }
        }
    };
    Path2D.prototype.cubicArc = function (cx, cy, rx, ry, phi, theta1, theta2, anticlockwise) {
        var commands = this.commands;
        var params = this.params;
        var start = commands.length;
        Path2D.cubicArc(commands, params, cx, cy, rx, ry, phi, theta1, theta2, anticlockwise);
        var x = params[params.length - 2];
        var y = params[params.length - 1];
        if (this.xy) {
            commands[start] = 'L';
            this.xy[0] = x;
            this.xy[1] = y;
        }
        else {
            this.xy = [x, y];
        }
    };
    /**
     * Returns the `[x, y]` coordinates of the curve at `t`.
     * @param points `(n + 1) * 2` control point coordinates for a Bézier curve of n-th order.
     * @param t
     */
    Path2D.prototype.deCasteljau = function (points, t) {
        var n = points.length;
        if (n < 2 || n % 2 === 1) {
            throw new Error('Fewer than two points or not an even count.');
        }
        else if (n === 2 || t === 0) {
            return points.slice(0, 2);
        }
        else if (t === 1) {
            return points.slice(-2);
        }
        else {
            var newPoints = [];
            var last = n - 2;
            for (var i = 0; i < last; i += 2) {
                newPoints.push((1 - t) * points[i] + t * points[i + 2], // x
                (1 - t) * points[i + 1] + t * points[i + 3] // y
                );
            }
            return this.deCasteljau(newPoints, t);
        }
    };
    /**
     * Approximates the given curve using `n` line segments.
     * @param points `(n + 1) * 2` control point coordinates for a Bézier curve of n-th order.
     * @param n
     */
    Path2D.prototype.approximateCurve = function (points, n) {
        var xy = this.deCasteljau(points, 0);
        this.moveTo(xy[0], xy[1]);
        var step = 1 / n;
        for (var t = step; t <= 1; t += step) {
            var xy_1 = this.deCasteljau(points, t);
            this.lineTo(xy_1[0], xy_1[1]);
        }
    };
    /**
     * Adds a quadratic curve segment to the path definition.
     * Note: the given quadratic segment is converted and stored as a cubic one.
     * @param cx x-component of the curve's control point
     * @param cy y-component of the curve's control point
     * @param x x-component of the end point
     * @param y y-component of the end point
     */
    Path2D.prototype.quadraticCurveTo = function (cx, cy, x, y) {
        if (!this.xy) {
            this.moveTo(cx, cy);
        }
        // See https://pomax.github.io/bezierinfo/#reordering
        this.cubicCurveTo((this.xy[0] + 2 * cx) / 3, (this.xy[1] + 2 * cy) / 3, // 1/3 start + 2/3 control
        (2 * cx + x) / 3, (2 * cy + y) / 3, // 2/3 control + 1/3 end
        x, y);
    };
    Path2D.prototype.cubicCurveTo = function (cx1, cy1, cx2, cy2, x, y) {
        if (!this.xy) {
            this.moveTo(cx1, cy1);
        }
        this.commands.push('C');
        this.params.push(cx1, cy1, cx2, cy2, x, y);
        this.xy[0] = x;
        this.xy[1] = y;
    };
    Object.defineProperty(Path2D.prototype, "closedPath", {
        get: function () {
            return this._closedPath;
        },
        enumerable: true,
        configurable: true
    });
    Path2D.prototype.closePath = function () {
        if (this.xy) {
            this.xy = undefined;
            this.commands.push('Z');
            this._closedPath = true;
        }
    };
    Path2D.prototype.clear = function (_a) {
        var trackChanges = (_a === void 0 ? { trackChanges: false } : _a).trackChanges;
        if (trackChanges) {
            this.previousCommands = this.commands;
            this.previousParams = this.params;
            this.previousClosedPath = this._closedPath;
            this.commands = [];
            this.params = [];
        }
        else {
            this.commands.length = 0;
            this.params.length = 0;
        }
        this.xy = undefined;
        this._closedPath = false;
    };
    Path2D.prototype.isPointInPath = function (x, y) {
        var commands = this.commands;
        var params = this.params;
        var cn = commands.length;
        // Hit testing using ray casting method, where the ray's origin is some point
        // outside the path. In this case, an offscreen point that is remote enough, so that
        // even if the path itself is large and is partially offscreen, the ray's origin
        // will likely be outside the path anyway. To test if the given point is inside the
        // path or not, we cast a ray from the origin to the given point and check the number
        // of intersections of this segment with the path. If the number of intersections is
        // even, then the ray both entered and exited the path an equal number of times,
        // therefore the point is outside the path, and inside the path, if the number of
        // intersections is odd. Since the path is compound, we check if the ray segment
        // intersects with each of the path's segments, which can be either a line segment
        // (one or no intersection points) or a Bézier curve segment (up to 3 intersection
        // points).
        var ox = -10000;
        var oy = -10000;
        // the starting point of the  current path
        var sx = NaN;
        var sy = NaN;
        // the previous point of the current path
        var px = 0;
        var py = 0;
        var intersectionCount = 0;
        for (var ci = 0, pi = 0; ci < cn; ci++) {
            switch (commands[ci]) {
                case 'M':
                    if (!isNaN(sx)) {
                        if (segmentIntersection(sx, sy, px, py, ox, oy, x, y)) {
                            intersectionCount++;
                        }
                    }
                    px = params[pi++];
                    sx = px;
                    py = params[pi++];
                    sy = py;
                    break;
                case 'L':
                    if (segmentIntersection(px, py, params[pi++], params[pi++], ox, oy, x, y)) {
                        intersectionCount++;
                    }
                    px = params[pi - 2];
                    py = params[pi - 1];
                    break;
                case 'C':
                    intersectionCount += cubicSegmentIntersections(px, py, params[pi++], params[pi++], params[pi++], params[pi++], params[pi++], params[pi++], ox, oy, x, y).length;
                    px = params[pi - 2];
                    py = params[pi - 1];
                    break;
                case 'Z':
                    if (!isNaN(sx)) {
                        if (segmentIntersection(sx, sy, px, py, ox, oy, x, y)) {
                            intersectionCount++;
                        }
                    }
                    break;
            }
        }
        return intersectionCount % 2 === 1;
    };
    /**
     * Returns an array of sub-paths of this Path,
     * where each sub-path is represented exclusively by cubic segments.
     */
    Path2D.prototype.toCubicPaths = function () {
        // Each sub-path is an array of `(n * 3 + 1) * 2` numbers,
        // where `n` is the number of segments.
        var paths = [];
        var params = this.params;
        // current path
        var path;
        // the starting point of the  current path
        var sx;
        var sy;
        // the previous point of the current path
        var px;
        var py;
        var i = 0; // current parameter
        this.commands.forEach(function (command) {
            switch (command) {
                case 'M':
                    px = params[i++];
                    py = params[i++];
                    sx = px;
                    sy = py;
                    paths.push([sx, sy]);
                    break;
                case 'L':
                    var x = params[i++];
                    var y = params[i++];
                    // Place control points along the line `a + (b - a) * t`
                    // at t = 1/3 and 2/3:
                    path.push((px + px + x) / 3, (py + py + y) / 3, (px + x + x) / 3, (py + y + y) / 3, x, y);
                    px = x;
                    py = y;
                    break;
                case 'C':
                    path.push(params[i++], params[i++], params[i++], params[i++], params[i++], params[i++]);
                    px = params[i - 2];
                    py = params[i - 1];
                    break;
                case 'Z':
                    path.push((px + px + sx) / 3, (py + py + sy) / 3, (px + sx + sx) / 3, (py + sy + sy) / 3, sx, sy);
                    px = sx;
                    py = sy;
                    break;
            }
        });
        return paths;
    };
    Path2D.cubicPathToString = function (path) {
        var n = path.length;
        if (!(n % 2 === 0 && (n / 2 - 1) / 2 >= 1)) {
            throw new Error('Invalid path.');
        }
        return 'M' + path.slice(0, 2).join(',') + 'C' + path.slice(2).join(',');
    };
    return Path2D;
}());

var __extends$U = (undefined && undefined.__extends) || (function () {
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
var __assign$d = (undefined && undefined.__assign) || function () {
    __assign$d = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$d.apply(this, arguments);
};
var __decorate$f = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values$k = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$s = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$i = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$s(arguments[i]));
    return ar;
};
var Group = /** @class */ (function (_super) {
    __extends$U(Group, _super);
    function Group(opts) {
        var _a, _b;
        var _this = _super.call(this) || this;
        _this.opts = opts;
        _this.clipPath = new Path2D();
        _this.opacity = 1;
        var _c = opts || {}, zIndex = _c.zIndex, zIndexSubOrder = _c.zIndexSubOrder;
        _this.isContainerNode = true;
        if (zIndex !== undefined) {
            _this.zIndex = zIndex;
        }
        if (zIndexSubOrder !== undefined) {
            _this.zIndexSubOrder = zIndexSubOrder;
        }
        if ((_a = _this.opts) === null || _a === void 0 ? void 0 : _a.optimiseDirtyTracking) {
            _this.visibleChildren = {};
            _this.dirtyChildren = {};
        }
        _this.name = (_b = _this.opts) === null || _b === void 0 ? void 0 : _b.name;
        return _this;
    }
    Group.prototype.opacityChanged = function () {
        if (this.layer) {
            this.layer.opacity = this.opacity;
        }
    };
    Group.prototype.zIndexChanged = function () {
        var _a;
        if (this.layer) {
            (_a = this._scene) === null || _a === void 0 ? void 0 : _a.moveLayer(this.layer, this.zIndex, this.zIndexSubOrder);
        }
    };
    Group.prototype.isLayer = function () {
        return this.layer != null;
    };
    Group.prototype.append = function (nodes) {
        var e_1, _a;
        _super.prototype.append.call(this, nodes);
        if (this.dirtyChildren) {
            nodes = nodes instanceof Array ? nodes : [nodes];
            try {
                for (var nodes_1 = __values$k(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                    var node = nodes_1_1.value;
                    this.dirtyChildren[node.id] = node;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    Group.prototype._setScene = function (scene) {
        var _a;
        if (this._scene && this.layer) {
            this._scene.removeLayer(this.layer);
            this.layer = undefined;
        }
        if (this.layer) {
            throw new Error('AG Charts - unable to deregister scene rendering layer!');
        }
        _super.prototype._setScene.call(this, scene);
        if (scene && ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.layer)) {
            var _b = this.opts || {}, zIndex = _b.zIndex, zIndexSubOrder = _b.zIndexSubOrder, name_1 = _b.name;
            this.layer = scene.addLayer({ zIndex: zIndex, zIndexSubOrder: zIndexSubOrder, name: name_1 });
        }
    };
    Group.prototype.visibilityChanged = function () {
        if (this.layer) {
            this.layer.enabled = this.visible;
        }
    };
    Group.prototype.removeChild = function (node) {
        _super.prototype.removeChild.call(this, node);
        if (this.dirtyChildren && this.visibleChildren) {
            delete this.dirtyChildren[node.id];
            delete this.visibleChildren[node.id];
        }
        return node;
    };
    Group.prototype.markDirty = function (source, type) {
        if (type === void 0) { type = RedrawType.TRIVIAL; }
        var parentType = type <= RedrawType.MINOR ? RedrawType.TRIVIAL : type;
        _super.prototype.markDirty.call(this, source, type, parentType);
        if (source !== this && this.dirtyChildren) {
            this.dirtyChildren[source.id] = source;
        }
    };
    Group.prototype.markClean = function (opts) {
        var e_2, _a;
        // Ensure we update visibility tracking before blowing away dirty flags.
        this.syncChildVisibility();
        var _b = this.dirtyChildren, dirtyChildren = _b === void 0 ? {} : _b;
        try {
            for (var _c = __values$k(Object.keys(dirtyChildren)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var key = _d.value;
                delete dirtyChildren[key];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        _super.prototype.markClean.call(this, opts);
    };
    // We consider a group to be boundless, thus any point belongs to it.
    Group.prototype.containsPoint = function (_x, _y) {
        return true;
    };
    Group.prototype.computeBBox = function () {
        var left = Infinity;
        var right = -Infinity;
        var top = Infinity;
        var bottom = -Infinity;
        this.computeTransformMatrix();
        this.children.forEach(function (child) {
            if (!child.visible) {
                return;
            }
            var bbox = child.computeTransformedBBox();
            if (!bbox) {
                return;
            }
            var x = bbox.x;
            var y = bbox.y;
            if (x < left) {
                left = x;
            }
            if (y < top) {
                top = y;
            }
            if (x + bbox.width > right) {
                right = x + bbox.width;
            }
            if (y + bbox.height > bottom) {
                bottom = y + bbox.height;
            }
        });
        return new BBox(left, top, right - left, bottom - top);
    };
    Group.prototype.computeTransformedBBox = function () {
        return this.computeBBox();
    };
    Group.prototype.render = function (renderCtx) {
        var _a;
        if (this.layer && ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.optimiseDirtyTracking)) {
            this.optimisedRender(renderCtx);
            return;
        }
        this.basicRender(renderCtx);
    };
    Group.prototype.basicRender = function (renderCtx) {
        var e_3, _a;
        var _b = this.opts, _c = (_b === void 0 ? {} : _b).name, name = _c === void 0 ? undefined : _c;
        var _d = this._debug, _e = (_d === void 0 ? {} : _d).consoleLog, consoleLog = _e === void 0 ? false : _e;
        var _f = this, dirty = _f.dirty, dirtyZIndex = _f.dirtyZIndex, clipPath = _f.clipPath, layer = _f.layer, children = _f.children;
        var ctx = renderCtx.ctx, forceRender = renderCtx.forceRender, clipBBox = renderCtx.clipBBox, resized = renderCtx.resized, stats = renderCtx.stats;
        var isDirty = dirty >= RedrawType.MINOR || dirtyZIndex || resized;
        var isChildDirty = isDirty || children.some(function (n) { return n.dirty >= RedrawType.TRIVIAL; });
        if (name && consoleLog) {
            console.log({ name: name, group: this, isDirty: isDirty, isChildDirty: isChildDirty, renderCtx: renderCtx, forceRender: forceRender });
        }
        if (layer) {
            // By default there is no need to force redraw a group which has it's own canvas layer
            // as the layer is independent of any other layer.
            forceRender = false;
        }
        if (!isDirty && !isChildDirty && !forceRender) {
            if (name && consoleLog && stats) {
                var counts = this.nodeCount;
                console.log({ name: name, result: 'skipping', renderCtx: renderCtx, counts: counts, group: this });
            }
            if (layer && stats) {
                stats.layersSkipped++;
                stats.nodesSkipped += this.nodeCount.count;
            }
            _super.prototype.markClean.call(this, { recursive: false });
            // Nothing to do.
            return;
        }
        var groupVisible = this.visible;
        if (layer) {
            // Switch context to the canvas layer we use for this group.
            ctx = layer.context;
            ctx.save();
            ctx.setTransform(renderCtx.ctx.getTransform());
            forceRender = true;
            layer.clear();
            if (clipBBox) {
                var width = clipBBox.width, height = clipBBox.height, x = clipBBox.x, y = clipBBox.y;
                if (consoleLog) {
                    console.log({ name: name, clipBBox: clipBBox, ctxTransform: ctx.getTransform(), renderCtx: renderCtx, group: this });
                }
                clipPath.clear();
                clipPath.rect(x, y, width, height);
                clipPath.draw(ctx);
                ctx.clip();
            }
        }
        else {
            // Only apply opacity if this isn't a distinct layer - opacity will be applied
            // at composition time.
            ctx.globalAlpha *= this.opacity;
        }
        // A group can have `scaling`, `rotation`, `translation` properties
        // that are applied to the canvas context before children are rendered,
        // so all children can be transformed at once.
        this.computeTransformMatrix();
        this.matrix.toContext(ctx);
        clipBBox = clipBBox ? this.matrix.inverse().transformBBox(clipBBox) : undefined;
        if (dirtyZIndex) {
            this.sortChildren();
            forceRender = true;
        }
        // Reduce churn if renderCtx is identical.
        var renderContextChanged = forceRender !== renderCtx.forceRender || clipBBox !== renderCtx.clipBBox || ctx !== renderCtx.ctx;
        var childRenderContext = renderContextChanged ? __assign$d(__assign$d({}, renderCtx), { ctx: ctx, forceRender: forceRender, clipBBox: clipBBox }) : renderCtx;
        // Render visible children.
        var skipped = 0;
        try {
            for (var children_1 = __values$k(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                if (!child.visible || !groupVisible) {
                    // Skip invisible children, but make sure their dirty flag is reset.
                    child.markClean();
                    if (stats)
                        skipped += child.nodeCount.count;
                    continue;
                }
                if (!forceRender && child.dirty === RedrawType.NONE) {
                    // Skip children that don't need to be redrawn.
                    if (stats)
                        skipped += child.nodeCount.count;
                    continue;
                }
                // Render marks this node (and children) as clean - no need to explicitly markClean().
                ctx.save();
                child.render(childRenderContext);
                ctx.restore();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (stats)
            stats.nodesSkipped += skipped;
        // Render marks this node as clean - no need to explicitly markClean().
        _super.prototype.render.call(this, renderCtx);
        if (layer) {
            if (stats)
                stats.layersRendered++;
            ctx.restore();
            layer.snapshot();
        }
        if (name && consoleLog && stats) {
            var counts = this.nodeCount;
            console.log({ name: name, result: 'rendered', skipped: skipped, renderCtx: renderCtx, counts: counts, group: this });
        }
    };
    Group.prototype.optimisedRender = function (renderCtx) {
        var e_4, _a, e_5, _b;
        var _c = this._debug, _d = (_c === void 0 ? {} : _c).consoleLog, consoleLog = _d === void 0 ? false : _d;
        var _e = this, name = _e.name, dirty = _e.dirty, dirtyZIndex = _e.dirtyZIndex, clipPath = _e.clipPath, layer = _e.layer, _f = _e.dirtyChildren, dirtyChildren = _f === void 0 ? {} : _f, _g = _e.visibleChildren, visibleChildren = _g === void 0 ? {} : _g, groupVisible = _e.visible;
        var ctx = renderCtx.ctx, clipBBox = renderCtx.clipBBox, resized = renderCtx.resized, stats = renderCtx.stats;
        if (!layer) {
            return;
        }
        var isDirty = dirty >= RedrawType.MINOR || dirtyZIndex || resized;
        var isChildDirty = Object.keys(dirtyChildren).length > 0;
        if (name && consoleLog) {
            console.log({ name: name, group: this, isDirty: isDirty, isChildDirty: isChildDirty, renderCtx: renderCtx });
        }
        if (!isDirty && !isChildDirty) {
            if (name && consoleLog && stats) {
                var counts = this.nodeCount;
                console.log({ name: name, result: 'skipping', renderCtx: renderCtx, counts: counts, group: this });
            }
            if (stats) {
                stats.layersSkipped++;
                stats.nodesSkipped += this.nodeCount.count;
            }
            _super.prototype.markClean.call(this, { recursive: false });
            // Nothing to do.
            return;
        }
        // Switch context to the canvas layer we use for this group.
        ctx = layer.context;
        ctx.save();
        ctx.setTransform(renderCtx.ctx.getTransform());
        layer.clear();
        if (clipBBox) {
            var width = clipBBox.width, height = clipBBox.height, x = clipBBox.x, y = clipBBox.y;
            if (consoleLog) {
                console.log({ name: name, clipBBox: clipBBox, ctxTransform: ctx.getTransform(), renderCtx: renderCtx, group: this });
            }
            clipPath.clear();
            clipPath.rect(x, y, width, height);
            clipPath.draw(ctx);
            ctx.clip();
        }
        this.syncChildVisibility();
        // A group can have `scaling`, `rotation`, `translation` properties
        // that are applied to the canvas context before children are rendered,
        // so all children can be transformed at once.
        this.computeTransformMatrix();
        this.matrix.toContext(ctx);
        clipBBox = clipBBox ? this.matrix.inverse().transformBBox(clipBBox) : undefined;
        if (dirtyZIndex) {
            this.sortChildren();
        }
        // Reduce churn if renderCtx is identical.
        var renderContextChanged = renderCtx.forceRender !== true || clipBBox !== renderCtx.clipBBox || ctx !== renderCtx.ctx;
        var childRenderContext = renderContextChanged
            ? __assign$d(__assign$d({}, renderCtx), { ctx: ctx, forceRender: true, clipBBox: clipBBox }) : renderCtx;
        if (consoleLog) {
            console.log({ name: name, visibleChildren: visibleChildren, dirtyChildren: dirtyChildren });
        }
        var skipped = 0;
        if (groupVisible) {
            try {
                for (var _h = __values$k(Object.values(visibleChildren)), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var child = _j.value;
                    ctx.save();
                    child.render(childRenderContext);
                    ctx.restore();
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_a = _h.return)) _a.call(_h);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        this.markClean({ recursive: false });
        try {
            for (var _k = __values$k(Object.values(dirtyChildren)), _l = _k.next(); !_l.done; _l = _k.next()) {
                var child = _l.value;
                child.markClean();
                delete dirtyChildren[child.id];
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_l && !_l.done && (_b = _k.return)) _b.call(_k);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (stats)
            stats.nodesSkipped += skipped;
        if (stats)
            stats.layersRendered++;
        ctx.restore();
        layer.snapshot();
        if (name && consoleLog && stats) {
            var counts = this.nodeCount;
            console.log({ name: name, result: 'rendered', skipped: skipped, renderCtx: renderCtx, counts: counts, group: this });
        }
    };
    Group.prototype.syncChildVisibility = function () {
        var e_6, _a;
        var _b = this, dirtyChildren = _b.dirtyChildren, visibleChildren = _b.visibleChildren;
        if (!dirtyChildren || !visibleChildren) {
            return;
        }
        try {
            for (var _c = __values$k(Object.values(dirtyChildren)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                if (!child.visible && visibleChildren[child.id]) {
                    delete visibleChildren[child.id];
                }
                else if (child.visible && !visibleChildren[child.id]) {
                    visibleChildren[child.id] = child;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    Group.prototype.sortChildren = function () {
        this.dirtyZIndex = false;
        this.children.sort(function (a, b) {
            var _a, _b;
            return compoundAscending(__spread$i([a.zIndex], (_a = a.zIndexSubOrder, (_a !== null && _a !== void 0 ? _a : [undefined, undefined])), [a.serialNumber]), __spread$i([b.zIndex], (_b = b.zIndexSubOrder, (_b !== null && _b !== void 0 ? _b : [undefined, undefined])), [b.serialNumber]), ascendingStringNumberUndefined);
        });
    };
    Group.className = 'Group';
    __decorate$f([
        SceneChangeDetection({
            convertor: function (v) { return Math.min(1, Math.max(0, v)); },
            changeCb: function (o) { return o.opacityChanged(); },
        })
    ], Group.prototype, "opacity", void 0);
    return Group;
}(Node));

var __values$j = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var EnterNode = /** @class */ (function () {
    function EnterNode(parent, datum) {
        this.next = null;
        this.scene = parent.scene;
        this.parent = parent;
        this.datum = datum;
    }
    EnterNode.prototype.appendChild = function (node) {
        // This doesn't work without the `strict: true` in the `tsconfig.json`,
        // so we must have two `if` checks below, instead of this single one.
        // if (this.next && !Node.isNode(this.next)) {
        //     throw new Error(`${this.next} is not a Node.`);
        // }
        if (this.next === null) {
            return this.parent.insertBefore(node, null);
        }
        if (!Node.isNode(this.next)) {
            throw new Error(this.next + " is not a Node.");
        }
        return this.parent.insertBefore(node, this.next);
    };
    EnterNode.prototype.insertBefore = function (node, nextNode) {
        return this.parent.insertBefore(node, nextNode);
    };
    return EnterNode;
}());
/**
 * G - type of the selected node(s).
 * GDatum - type of the datum of the selected node(s).
 * P - type of the parent node(s).
 * PDatum - type of the datum of the parent node(s).
 */
var Selection = /** @class */ (function () {
    function Selection(groups, parents) {
        this.groups = groups;
        this.parents = parents;
    }
    Selection.select = function (node) {
        return new Selection([[typeof node === 'function' ? node() : node]], [undefined]);
    };
    Selection.selectAll = function (nodes) {
        return new Selection([nodes == null ? [] : nodes], [undefined]);
    };
    /**
     * Creates new nodes, appends them to the nodes of this selection and returns them
     * as a new selection. The created nodes inherit the datums and the parents of the nodes
     * they replace.
     * @param Class The constructor function to use to create the new nodes.
     */
    Selection.prototype.append = function (Class) {
        return this.select(function (node) {
            return node.appendChild(new Class());
        });
    };
    /**
     * Runs the given selector that returns a single node for every node in each group.
     * The original nodes are then replaced by the nodes returned by the selector
     * and returned as a new selection.
     * The selected nodes inherit the datums and the parents of the original nodes.
     */
    Selection.prototype.select = function (selector) {
        var groups = this.groups;
        var numGroups = groups.length;
        var subgroups = [];
        for (var j = 0; j < numGroups; j++) {
            var group = groups[j];
            var groupSize = group.length;
            var subgroup = (subgroups[j] = new Array(groupSize));
            for (var i = 0; i < groupSize; i++) {
                var node = group[i];
                if (node) {
                    var subnode = selector(node, node.datum, i, group);
                    if (subnode) {
                        subnode.datum = node.datum;
                    }
                    subgroup[i] = subnode;
                }
                // else this can be a group of the `enter` selection,
                // for example, with no nodes at the i-th position,
                // only nodes at the end of the group
            }
        }
        return new Selection(subgroups, this.parents);
    };
    /**
     * Same as {@link select}, but uses the given {@param Class} (constructor) as a selector.
     * @param Class The constructor function to use to find matching nodes.
     */
    Selection.prototype.selectByClass = function (Class) {
        return this.select(function (node) {
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child instanceof Class) {
                        return child;
                    }
                }
            }
        });
    };
    Selection.prototype.selectByTag = function (tag) {
        return this.select(function (node) {
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child.tag === tag) {
                        return child;
                    }
                }
            }
        });
    };
    Selection.prototype.selectAllByClass = function (Class) {
        return this.selectAll(function (node) {
            var nodes = [];
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child instanceof Class) {
                        nodes.push(child);
                    }
                }
            }
            return nodes;
        });
    };
    Selection.prototype.selectAllByTag = function (tag) {
        return this.selectAll(function (node) {
            var nodes = [];
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child.tag === tag) {
                        nodes.push(child);
                    }
                }
            }
            return nodes;
        });
    };
    Selection.prototype.selectNone = function () {
        return [];
    };
    /**
     * Runs the given selector that returns a group of nodes for every node in each group.
     * The original nodes are then replaced by the groups of nodes returned by the selector
     * and returned as a new selection. The original nodes become the parent nodes for each
     * group in the new selection. The selected nodes do not inherit the datums of the original nodes.
     * If called without any parameters, creates a new selection with an empty group for each
     * node in this selection.
     */
    Selection.prototype.selectAll = function (selectorAll) {
        if (!selectorAll) {
            selectorAll = this.selectNone;
        }
        // Each subgroup is populated with the selector (run on each group node) results.
        var subgroups = [];
        // In the new selection that we return, subgroups become groups,
        // and group nodes become parents.
        var parents = [];
        var groups = this.groups;
        var groupCount = groups.length;
        for (var j = 0; j < groupCount; j++) {
            var group = groups[j];
            var groupLength = group.length;
            for (var i = 0; i < groupLength; i++) {
                var node = group[i];
                if (node) {
                    subgroups.push(selectorAll(node, node.datum, i, group));
                    parents.push(node);
                }
            }
        }
        return new Selection(subgroups, parents);
    };
    /**
     * Runs the given callback for every node in this selection and returns this selection.
     * @param cb
     */
    Selection.prototype.each = function (cb) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values$j(this.groups), _d = _c.next(); !_d.done; _d = _c.next()) {
                var group = _d.value;
                var i = 0;
                try {
                    for (var group_1 = (e_2 = void 0, __values$j(group)), group_1_1 = group_1.next(); !group_1_1.done; group_1_1 = group_1.next()) {
                        var node = group_1_1.value;
                        if (node) {
                            cb(node, node.datum, i, group);
                        }
                        i++;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (group_1_1 && !group_1_1.done && (_b = group_1.return)) _b.call(group_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    Selection.prototype.remove = function () {
        return this.each(function (node) {
            if (Node.isNode(node)) {
                var parent_1 = node.parent;
                if (parent_1) {
                    parent_1.removeChild(node);
                }
            }
        });
    };
    Selection.prototype.merge = function (other) {
        var groups0 = this.groups;
        var groups1 = other.groups;
        var m0 = groups0.length;
        var m1 = groups1.length;
        var m = Math.min(m0, m1);
        var merges = new Array(m0);
        var j = 0;
        for (; j < m; j++) {
            var group0 = groups0[j];
            var group1 = groups1[j];
            var n = group0.length;
            var merge = (merges[j] = new Array(n));
            for (var i = 0; i < n; i++) {
                var node = group0[i] || group1[i];
                merge[i] = node || undefined;
            }
        }
        for (; j < m0; j++) {
            merges[j] = groups0[j];
        }
        return new Selection(merges, this.parents);
    };
    /**
     * Return the first non-null element in this selection.
     * If the selection is empty, returns null.
     */
    Selection.prototype.node = function () {
        var groups = this.groups;
        var numGroups = groups.length;
        for (var j = 0; j < numGroups; j++) {
            var group = groups[j];
            var groupSize = group.length;
            for (var i = 0; i < groupSize; i++) {
                var node = group[i];
                if (node) {
                    return node;
                }
            }
        }
        return null;
    };
    Selection.prototype.attr = function (name, value) {
        this.each(function (node) {
            node[name] = value;
        });
        return this;
    };
    Selection.prototype.attrFn = function (name, value) {
        this.each(function (node, datum, index, group) {
            node[name] = value(node, datum, index, group);
        });
        return this;
    };
    /**
     * Invokes the given function once, passing in this selection.
     * Returns this selection. Facilitates method chaining.
     * @param cb
     */
    Selection.prototype.call = function (cb) {
        cb(this);
        return this;
    };
    Object.defineProperty(Selection.prototype, "size", {
        /**
         * Returns the total number of nodes in this selection.
         */
        get: function () {
            var e_3, _a, e_4, _b;
            var size = 0;
            try {
                for (var _c = __values$j(this.groups), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var group = _d.value;
                    try {
                        for (var group_2 = (e_4 = void 0, __values$j(group)), group_2_1 = group_2.next(); !group_2_1.done; group_2_1 = group_2.next()) {
                            var node = group_2_1.value;
                            if (node) {
                                size++;
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (group_2_1 && !group_2_1.done && (_b = group_2.return)) _b.call(group_2);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "data", {
        /**
         * Returns the array of data for the selected elements.
         */
        get: function () {
            var e_5, _a, e_6, _b;
            var data = new Array(this.size);
            var i = 0;
            try {
                for (var _c = __values$j(this.groups), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var group = _d.value;
                    try {
                        for (var group_3 = (e_6 = void 0, __values$j(group)), group_3_1 = group_3.next(); !group_3_1.done; group_3_1 = group_3.next()) {
                            var node = group_3_1.value;
                            if (node) {
                                data[i++] = node.datum;
                            }
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (group_3_1 && !group_3_1.done && (_b = group_3.return)) _b.call(group_3);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "enter", {
        get: function () {
            return new Selection(this.enterGroups ? this.enterGroups : [[]], this.parents);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "exit", {
        get: function () {
            return new Selection(this.exitGroups ? this.exitGroups : [[]], this.parents);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Binds the given value to each selected node and returns this selection
     * with its {@link GDatum} type changed to the type of the given value.
     * This method doesn't compute a join and doesn't affect indexes or the enter and exit selections.
     * This method can also be used to clear bound data.
     * @param value
     */
    Selection.prototype.setDatum = function (value) {
        return this.each(function (node) {
            node.datum = value;
        });
    };
    Object.defineProperty(Selection.prototype, "datum", {
        /**
         * Returns the bound datum for the first non-null element in the selection.
         * This is generally useful only if you know the selection contains exactly one element.
         */
        get: function () {
            var node = this.node();
            return node ? node.datum : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Binds the specified array of values with the selected nodes, returning a new selection
     * that represents the _update_ selection: the nodes successfully bound to the values.
     * Also defines the {@link enter} and {@link exit} selections on the returned selection,
     * which can be used to add or remove the nodes to correspond to the new data.
     * The `values` is an array of values of a particular type, or a function that returns
     * an array of values for each group.
     * When values are assigned to the nodes, they are stored in the {@link Node.datum} property.
     * @param values
     * @param key
     */
    Selection.prototype.setData = function (values, key) {
        if (typeof values !== 'function') {
            var data_1 = values;
            values = function () { return data_1; };
        }
        var groups = this.groups;
        var parents = this.parents;
        var numGroups = groups.length;
        var updateGroups = new Array(numGroups);
        var enterGroups = new Array(numGroups);
        var exitGroups = new Array(numGroups);
        for (var j = 0; j < numGroups; j++) {
            var group = groups[j];
            var parent_2 = parents[j];
            if (!parent_2) {
                throw new Error("Group #" + j + " has no parent: " + group);
            }
            var groupSize = group.length;
            var data = values(parent_2, parent_2.datum, j, parents);
            var dataSize = data.length;
            var enterGroup = (enterGroups[j] = new Array(dataSize));
            var updateGroup = (updateGroups[j] = new Array(dataSize));
            var exitGroup = (exitGroups[j] = new Array(groupSize));
            if (key) {
                this.bindKey(parent_2, group, enterGroup, updateGroup, exitGroup, data, key);
            }
            else {
                this.bindIndex(parent_2, group, enterGroup, updateGroup, exitGroup, data);
            }
            // Now connect the enter nodes to their following update node, such that
            // appendChild can insert the materialized enter node before this node,
            // rather than at the end of the parent node.
            for (var i0 = 0, i1 = 0; i0 < dataSize; i0++) {
                var previous = enterGroup[i0];
                if (previous) {
                    if (i0 >= i1) {
                        i1 = i0 + 1;
                    }
                    var next = updateGroup[i1];
                    while (!next && i1 < dataSize) {
                        i1++;
                        next = updateGroup[i1];
                    }
                    previous.next = next || null;
                }
            }
        }
        var result = new Selection(updateGroups, parents);
        result.enterGroups = enterGroups;
        result.exitGroups = exitGroups;
        return result;
    };
    Selection.prototype.bindIndex = function (parent, group, enter, update, exit, data) {
        var groupSize = group.length;
        var dataSize = data.length;
        var i = 0;
        for (; i < dataSize; i++) {
            var node = group[i];
            if (node) {
                node.datum = data[i];
                update[i] = node;
            }
            else {
                // more datums than group nodes
                enter[i] = new EnterNode(parent, data[i]);
            }
        }
        // more group nodes than datums
        for (; i < groupSize; i++) {
            var node = group[i];
            if (node) {
                exit[i] = node;
            }
        }
    };
    Selection.prototype.bindKey = function (parent, group, enter, update, exit, data, key) {
        var groupSize = group.length;
        var dataSize = data.length;
        var keyValues = new Array(groupSize);
        var nodeByKeyValue = {};
        // Compute the key for each node.
        // If multiple nodes have the same key, the duplicates are added to exit.
        for (var i = 0; i < groupSize; i++) {
            var node = group[i];
            if (node) {
                var keyValue = (keyValues[i] = Selection.keyPrefix + key(node, node.datum, i, group));
                if (keyValue in nodeByKeyValue) {
                    exit[i] = node;
                }
                else {
                    nodeByKeyValue[keyValue] = node;
                }
            }
        }
        // Compute the key for each datum.
        // If there is a node associated with this key, join and add it to update.
        // If there is not (or the key is a duplicate), add it to enter.
        for (var i = 0; i < dataSize; i++) {
            var keyValue = Selection.keyPrefix + key(parent, data[i], i, data);
            var node = nodeByKeyValue[keyValue];
            if (node) {
                update[i] = node;
                node.datum = data[i];
                nodeByKeyValue[keyValue] = undefined;
            }
            else {
                enter[i] = new EnterNode(parent, data[i]);
            }
        }
        // Add any remaining nodes that were not bound to data to exit.
        for (var i = 0; i < groupSize; i++) {
            var node = group[i];
            if (node && nodeByKeyValue[keyValues[i]] === node) {
                exit[i] = node;
            }
        }
    };
    Selection.keyPrefix = '$'; // Protect against keys like '__proto__'.
    return Selection;
}());

var __extends$T = (undefined && undefined.__extends) || (function () {
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
var __decorate$e = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Line = /** @class */ (function (_super) {
    __extends$T(Line, _super);
    function Line() {
        var _this = _super.call(this) || this;
        _this.x1 = 0;
        _this.y1 = 0;
        _this.x2 = 0;
        _this.y2 = 0;
        _this.restoreOwnStyles();
        return _this;
    }
    Line.prototype.computeBBox = function () {
        return new BBox(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    };
    Line.prototype.isPointInPath = function (_x, _y) {
        return false;
    };
    Line.prototype.render = function (renderCtx) {
        var _a;
        var ctx = renderCtx.ctx, forceRender = renderCtx.forceRender, stats = renderCtx.stats;
        if (this.dirty === RedrawType.NONE && !forceRender) {
            if (stats)
                stats.nodesSkipped += this.nodeCount.count;
            return;
        }
        this.computeTransformMatrix();
        this.matrix.toContext(ctx);
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2;
        var y2 = this.y2;
        // Align to the pixel grid if the line is strictly vertical
        // or horizontal (but not both, i.e. a dot).
        if (x1 === x2) {
            var x = Math.round(x1) + (Math.floor(this.strokeWidth) % 2) / 2;
            x1 = x;
            x2 = x;
        }
        else if (y1 === y2) {
            var y = Math.round(y1) + (Math.floor(this.strokeWidth) % 2) / 2;
            y1 = y;
            y2 = y;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        this.fillStroke(ctx);
        (_a = this.fillShadow) === null || _a === void 0 ? void 0 : _a.markClean();
        _super.prototype.render.call(this, renderCtx);
    };
    Line.className = 'Line';
    Line.defaultStyles = chainObjects(Shape.defaultStyles, {
        fill: undefined,
        strokeWidth: 1,
    });
    __decorate$e([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Line.prototype, "x1", void 0);
    __decorate$e([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Line.prototype, "y1", void 0);
    __decorate$e([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Line.prototype, "x2", void 0);
    __decorate$e([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], Line.prototype, "y2", void 0);
    return Line;
}(Shape));

var __extends$S = (undefined && undefined.__extends) || (function () {
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
var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function ScenePathChangeDetection(opts) {
    var _a = opts || {}, _b = _a.redraw, redraw = _b === void 0 ? RedrawType.MAJOR : _b, changeCb = _a.changeCb, convertor = _a.convertor;
    return SceneChangeDetection({ redraw: redraw, type: 'path', convertor: convertor, changeCb: changeCb });
}
var Path = /** @class */ (function (_super) {
    __extends$S(Path, _super);
    function Path(renderOverride) {
        var _this = _super.call(this) || this;
        _this.renderOverride = renderOverride;
        /**
         * Declare a path to retain for later rendering and hit testing
         * using custom Path2D class. Think of it as a TypeScript version
         * of the native Path2D (with some differences) that works in all browsers.
         */
        _this.path = new Path2D();
        /**
         * The path only has to be updated when certain attributes change.
         * For example, if transform attributes (such as `translationX`)
         * are changed, we don't have to update the path. The `dirtyPath` flag
         * is how we keep track if the path has to be updated or not.
         */
        _this._dirtyPath = true;
        return _this;
    }
    Object.defineProperty(Path.prototype, "dirtyPath", {
        get: function () {
            return this._dirtyPath;
        },
        set: function (value) {
            if (this._dirtyPath !== value) {
                this._dirtyPath = value;
                if (value) {
                    this.markDirty(this, RedrawType.MAJOR);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Path.prototype.checkPathDirty = function () {
        var _a, _b;
        if (this._dirtyPath) {
            return;
        }
        this.dirtyPath = this.path.isDirty() || (_b = (_a = this.fillShadow) === null || _a === void 0 ? void 0 : _a.isDirty(), (_b !== null && _b !== void 0 ? _b : false));
    };
    Path.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        return this.path.closedPath && this.path.isPointInPath(point.x, point.y);
    };
    Path.prototype.isDirtyPath = function () {
        // Override point for more expensive dirty checks.
    };
    Path.prototype.updatePath = function () {
        // Override point for subclasses.
    };
    Path.prototype.render = function (renderCtx) {
        var _a, _b;
        var ctx = renderCtx.ctx, forceRender = renderCtx.forceRender, stats = renderCtx.stats;
        if (this.dirty === RedrawType.NONE && !forceRender) {
            if (stats)
                stats.nodesSkipped += this.nodeCount.count;
            return;
        }
        this.computeTransformMatrix();
        this.matrix.toContext(ctx);
        if (this.dirtyPath || this.isDirtyPath()) {
            this.updatePath();
            this.dirtyPath = false;
        }
        if (this.clipPath) {
            ctx.save();
            if (this.clipMode === 'normal') {
                // Bound the shape rendered to the clipping path.
                this.clipPath.draw(ctx);
                ctx.clip();
            }
            if (this.renderOverride) {
                this.renderOverride(ctx);
            }
            else {
                this.path.draw(ctx);
                this.fillStroke(ctx);
            }
            if (this.clipMode === 'punch-out') {
                // Bound the shape rendered to outside the clipping path.
                this.clipPath.draw(ctx);
                ctx.clip();
                // Fallback values, but practically these should never be used.
                var _c = (_a = this.computeBBox(), (_a !== null && _a !== void 0 ? _a : {})), _d = _c.x, x = _d === void 0 ? -10000 : _d, _e = _c.y, y = _e === void 0 ? -10000 : _e, _f = _c.width, width = _f === void 0 ? 20000 : _f, _g = _c.height, height = _g === void 0 ? 20000 : _g;
                ctx.clearRect(x, y, width, height);
            }
            ctx.restore();
        }
        else if (this.renderOverride) {
            this.renderOverride(ctx);
        }
        else {
            this.path.draw(ctx);
            this.fillStroke(ctx);
        }
        (_b = this.fillShadow) === null || _b === void 0 ? void 0 : _b.markClean();
        _super.prototype.render.call(this, renderCtx);
    };
    Path.className = 'Path';
    __decorate$d([
        ScenePathChangeDetection()
    ], Path.prototype, "clipPath", void 0);
    __decorate$d([
        ScenePathChangeDetection()
    ], Path.prototype, "clipMode", void 0);
    return Path;
}(Shape));

var twoPi = Math.PI * 2;
/**
 * Normalize the given angle to be in the [0, 2π) interval.
 * @param radians Angle in radians.
 */
function normalizeAngle360(radians) {
    radians %= twoPi;
    radians += twoPi;
    radians %= twoPi;
    return radians;
}
function normalizeAngle360Inclusive(radians) {
    radians %= twoPi;
    radians += twoPi;
    if (radians !== twoPi) {
        radians %= twoPi;
    }
    return radians;
}
/**
 * Normalize the given angle to be in the [-π, π) interval.
 * @param radians Angle in radians.
 */
function normalizeAngle180(radians) {
    radians %= twoPi;
    if (radians < -Math.PI) {
        radians += twoPi;
    }
    else if (radians >= Math.PI) {
        radians -= twoPi;
    }
    return radians;
}
function toRadians(degrees) {
    return (degrees / 180) * Math.PI;
}
function toDegrees(radians) {
    return (radians / Math.PI) * 180;
}

function isEqual(a, b, epsilon) {
    if (epsilon === void 0) { epsilon = 1e-10; }
    return Math.abs(a - b) < epsilon;
}
/**
 * `Number.toFixed(n)` always formats a number so that it has `n` digits after the decimal point.
 * For example, `Number(0.00003427).toFixed(2)` returns `0.00`.
 * That's not very helpful, because all the meaningful information is lost.
 * In this case we would want the formatted value to have at least two significant digits: `0.000034`,
 * not two fraction digits.
 * @param value
 * @param fractionOrSignificantDigits
 */
function toFixed(value, fractionOrSignificantDigits) {
    if (fractionOrSignificantDigits === void 0) { fractionOrSignificantDigits = 2; }
    var power = Math.floor(Math.log(Math.abs(value)) / Math.LN10);
    if (power >= 0 || !isFinite(power)) {
        return value.toFixed(fractionOrSignificantDigits); // fraction digits
    }
    return value.toFixed(Math.abs(power) - 1 + fractionOrSignificantDigits); // significant digits
}
/**
 * Returns the mathematically correct n modulus of m. For context, the JS % operator is remainder
 * NOT modulus, which is why this is needed.
 */
function mod(n, m) {
    // https://stackoverflow.com/a/13163436
    var remain = n % m;
    return remain >= 0 ? remain : remain + m;
}

var __extends$R = (undefined && undefined.__extends) || (function () {
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
var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ArcType;
(function (ArcType) {
    ArcType[ArcType["Open"] = 0] = "Open";
    ArcType[ArcType["Chord"] = 1] = "Chord";
    ArcType[ArcType["Round"] = 2] = "Round";
})(ArcType || (ArcType = {}));
/**
 * Elliptical arc node.
 */
var Arc = /** @class */ (function (_super) {
    __extends$R(Arc, _super);
    function Arc() {
        var _this = _super.call(this) || this;
        _this.centerX = 0;
        _this.centerY = 0;
        _this.radiusX = 10;
        _this.radiusY = 10;
        _this.startAngle = 0;
        _this.endAngle = Math.PI * 2;
        _this.counterClockwise = false;
        /**
         * The type of arc to render:
         * - {@link ArcType.Open} - end points of the arc segment are not connected (default)
         * - {@link ArcType.Chord} - end points of the arc segment are connected by a line segment
         * - {@link ArcType.Round} - each of the end points of the arc segment are connected
         *                           to the center of the arc
         * Arcs with {@link ArcType.Open} do not support hit testing, even if they have their
         * {@link Shape.fillStyle} set, because they are not closed paths. Hit testing support
         * would require using two paths - one for rendering, another for hit testing - and there
         * doesn't seem to be a compelling reason to do that, when one can just use {@link ArcType.Chord}
         * to create a closed path.
         */
        _this.type = ArcType.Open;
        _this.restoreOwnStyles();
        return _this;
    }
    Object.defineProperty(Arc.prototype, "fullPie", {
        get: function () {
            return isEqual(normalizeAngle360(this.startAngle), normalizeAngle360(this.endAngle));
        },
        enumerable: true,
        configurable: true
    });
    Arc.prototype.updatePath = function () {
        var path = this.path;
        path.clear(); // No need to recreate the Path, can simply clear the existing one.
        // This is much faster than the native Path2D implementation even though this `cubicArc`
        // method is pure TypeScript and actually produces the definition of an elliptical arc,
        // where you can specify two radii and rotation, while Path2D's `arc` method simply produces
        // a circular arc. Maybe it's due to the experimental nature of the Path2D class,
        // maybe it's because we have to create a new instance of it on each render, who knows...
        path.cubicArc(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, this.startAngle, this.endAngle, this.counterClockwise ? 1 : 0);
        if (this.type === ArcType.Chord) {
            path.closePath();
        }
        else if (this.type === ArcType.Round && !this.fullPie) {
            path.lineTo(this.centerX, this.centerY);
            path.closePath();
        }
    };
    Arc.prototype.computeBBox = function () {
        // Only works with full arcs (circles) and untransformed ellipses.
        return new BBox(this.centerX - this.radiusX, this.centerY - this.radiusY, this.radiusX * 2, this.radiusY * 2);
    };
    Arc.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return (this.type !== ArcType.Open &&
            bbox.containsPoint(point.x, point.y) &&
            this.path.isPointInPath(point.x, point.y));
    };
    Arc.className = 'Arc';
    Arc.defaultStyles = chainObjects(Shape.defaultStyles, {
        lineWidth: 1,
        fillStyle: null,
    });
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "centerX", void 0);
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "centerY", void 0);
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "radiusX", void 0);
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "radiusY", void 0);
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "startAngle", void 0);
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "endAngle", void 0);
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "counterClockwise", void 0);
    __decorate$c([
        ScenePathChangeDetection()
    ], Arc.prototype, "type", void 0);
    return Arc;
}(Path));

var doOnceFlags = {};
/**
 * If the key was passed before, then doesn't execute the func
 * @param {Function} func
 * @param {string} key
 */
function doOnce(func, key) {
    if (doOnceFlags[key]) {
        return;
    }
    func();
    doOnceFlags[key] = true;
}

function Validate(predicate) {
    return function (target, key) {
        // `target` is either a constructor (static member) or prototype (instance member)
        var privateKey = "__" + key;
        if (!target[key]) {
            var setter = function (v) {
                var _a, _b;
                if (predicate(v)) {
                    this[privateKey] = v;
                    return;
                }
                console.warn("AG Charts - Property [" + (_b = (_a = target.constructor) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : target.className)) + "." + key + "] cannot be set to [" + v + "], ignoring.");
            };
            var getter = function () {
                return this[privateKey];
            };
            Object.defineProperty(target, key, {
                set: setter,
                get: getter,
                enumerable: true,
                configurable: false,
            });
        }
    };
}
var BOOLEAN = function (v) { return v === true || v === false; };
var OPT_BOOLEAN = function (v) { return v === undefined || v === true || v === false; };
var STRING = function (v) { return typeof v === 'string'; };
var OPT_STRING = function (v) { return v === undefined || typeof v === 'string'; };
function OPT_NUMBER(min, max) {
    return function (v) { return v === undefined || (typeof v === 'number' && v >= ((min !== null && min !== void 0 ? min : -Infinity)) && v <= ((max !== null && max !== void 0 ? max : Infinity))); };
}
function NUMBER(min, max) {
    return function (v) { return typeof v === 'number' && v >= ((min !== null && min !== void 0 ? min : -Infinity)) && v <= ((max !== null && max !== void 0 ? max : Infinity)); };
}
var FONT_WEIGHTS = [
    'normal',
    'bold',
    'bolder',
    'lighter',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
];
var OPT_FONT_STYLE = function (v) { return v === undefined || v === 'normal' || v === 'italic' || v === 'oblique'; };
var OPT_FONT_WEIGHT = function (v) { return v === undefined || FONT_WEIGHTS.includes(v); };
function Deprecated(message, opts) {
    var logged = false;
    var _a = (opts !== null && opts !== void 0 ? opts : {}).default, def = _a === void 0 ? undefined : _a;
    return function (target, key) {
        // `target` is either a constructor (static member) or prototype (instance member)
        var privateKey = "__" + key;
        if (!target[key]) {
            var setter = function (v) {
                var _a, _b;
                if (v !== def && !logged) {
                    var msg = [
                        "AG Charts - Property [" + (_b = (_a = target.constructor) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : target.className)) + "." + key + "] is deprecated.",
                        message,
                    ]
                        .filter(function (v) { return v != null; })
                        .join(' ');
                    console.warn(msg);
                    logged = true;
                }
                this[privateKey] = v;
            };
            var getter = function () {
                return this[privateKey];
            };
            Object.defineProperty(target, key, {
                set: setter,
                get: getter,
                enumerable: true,
                configurable: false,
            });
        }
    };
}

/**
 * Constants to declare the expected nominal zIndex for all types of layer in chart rendering.
 */
var Layers;
(function (Layers) {
    Layers[Layers["AXIS_GRIDLINES_ZINDEX"] = 0] = "AXIS_GRIDLINES_ZINDEX";
    Layers[Layers["SERIES_CROSSLINE_RANGE_ZINDEX"] = 10] = "SERIES_CROSSLINE_RANGE_ZINDEX";
    Layers[Layers["AXIS_ZINDEX"] = 20] = "AXIS_ZINDEX";
    Layers[Layers["SERIES_LAYER_ZINDEX"] = 500] = "SERIES_LAYER_ZINDEX";
    Layers[Layers["SERIES_CROSSLINE_LINE_ZINDEX"] = 2500] = "SERIES_CROSSLINE_LINE_ZINDEX";
    Layers[Layers["LEGEND_ZINDEX"] = 3000] = "LEGEND_ZINDEX";
})(Layers || (Layers = {}));

var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$r = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$h = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$r(arguments[i]));
    return ar;
};
var __values$i = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Tags;
(function (Tags) {
    Tags[Tags["Tick"] = 0] = "Tick";
    Tags[Tags["GridLine"] = 1] = "GridLine";
})(Tags || (Tags = {}));
var AxisTick = /** @class */ (function () {
    function AxisTick() {
        /**
         * The line width to be used by axis ticks.
         */
        this.width = 1;
        /**
         * The line length to be used by axis ticks.
         */
        this.size = 6;
        /**
         * The color of the axis ticks.
         * Use `undefined` rather than `rgba(0, 0, 0, 0)` to make the ticks invisible.
         */
        this.color = 'rgba(195, 195, 195, 1)';
        /**
         * A hint of how many ticks to use (the exact number of ticks might differ),
         * a `TimeInterval` or a `CountableTimeInterval`.
         * For example:
         *
         *     axis.tick.count = 5;
         *     axis.tick.count = year;
         *     axis.tick.count = month.every(6);
         */
        this.count = undefined;
    }
    __decorate$b([
        Validate(NUMBER(0))
    ], AxisTick.prototype, "width", void 0);
    __decorate$b([
        Validate(NUMBER(0))
    ], AxisTick.prototype, "size", void 0);
    __decorate$b([
        Validate(OPT_STRING)
    ], AxisTick.prototype, "color", void 0);
    return AxisTick;
}());
var AxisLabel = /** @class */ (function () {
    function AxisLabel() {
        this.fontStyle = undefined;
        this.fontWeight = undefined;
        this.fontSize = 12;
        this.fontFamily = 'Verdana, sans-serif';
        /**
         * The padding between the labels and the ticks.
         */
        this.padding = 5;
        /**
         * The color of the labels.
         * Use `undefined` rather than `rgba(0, 0, 0, 0)` to make labels invisible.
         */
        this.color = 'rgba(87, 87, 87, 1)';
        /**
         * Custom label rotation in degrees.
         * Labels are rendered perpendicular to the axis line by default.
         * Or parallel to the axis line, if the {@link parallel} is set to `true`.
         * The value of this config is used as the angular offset/deflection
         * from the default rotation.
         */
        this.rotation = undefined;
        /**
         * If specified and axis labels may collide, they are rotated to reduce collisions. If the
         * `rotation` property is specified, it takes precedence.
         */
        this.autoRotate = undefined;
        /**
         * Rotation angle to use when autoRotate is applied.
         */
        this.autoRotateAngle = 335;
        /**
         * By default labels and ticks are positioned to the left of the axis line.
         * `true` positions the labels to the right of the axis line.
         * However, if the axis is rotated, it's easier to think in terms
         * of this side or the opposite side, rather than left and right.
         * We use the term `mirror` for conciseness, although it's not
         * true mirroring - for example, when a label is rotated, so that
         * it is inclined at the 45 degree angle, text flowing from north-west
         * to south-east, ending at the tick to the left of the axis line,
         * and then we set this config to `true`, the text will still be flowing
         * from north-west to south-east, _starting_ at the tick to the right
         * of the axis line.
         */
        this.mirrored = false;
        /**
         * Labels are rendered perpendicular to the axis line by default.
         * Setting this config to `true` makes labels render parallel to the axis line
         * and center aligns labels' text at the ticks.
         */
        this.parallel = false;
        /**
         * In case {@param value} is a number, the {@param fractionDigits} parameter will
         * be provided as well. The `fractionDigits` corresponds to the number of fraction
         * digits used by the tick step. For example, if the tick step is `0.0005`,
         * the `fractionDigits` is 4.
         */
        this.formatter = undefined;
        this.onFormatChange = undefined;
    }
    Object.defineProperty(AxisLabel.prototype, "format", {
        get: function () {
            return this._format;
        },
        set: function (value) {
            // See `TimeLocaleObject` docs for the list of supported format directives.
            if (this._format !== value) {
                this._format = value;
                if (this.onFormatChange) {
                    this.onFormatChange(value);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate$b([
        Validate(OPT_FONT_STYLE)
    ], AxisLabel.prototype, "fontStyle", void 0);
    __decorate$b([
        Validate(OPT_FONT_WEIGHT)
    ], AxisLabel.prototype, "fontWeight", void 0);
    __decorate$b([
        Validate(NUMBER(1))
    ], AxisLabel.prototype, "fontSize", void 0);
    __decorate$b([
        Validate(STRING)
    ], AxisLabel.prototype, "fontFamily", void 0);
    __decorate$b([
        Validate(NUMBER(0))
    ], AxisLabel.prototype, "padding", void 0);
    __decorate$b([
        Validate(STRING)
    ], AxisLabel.prototype, "color", void 0);
    __decorate$b([
        Validate(OPT_NUMBER(-360, 360))
    ], AxisLabel.prototype, "rotation", void 0);
    __decorate$b([
        Validate(OPT_BOOLEAN)
    ], AxisLabel.prototype, "autoRotate", void 0);
    __decorate$b([
        Validate(NUMBER(-360, 360))
    ], AxisLabel.prototype, "autoRotateAngle", void 0);
    __decorate$b([
        Validate(BOOLEAN)
    ], AxisLabel.prototype, "mirrored", void 0);
    __decorate$b([
        Validate(BOOLEAN)
    ], AxisLabel.prototype, "parallel", void 0);
    __decorate$b([
        Validate(STRING)
    ], AxisLabel.prototype, "_format", void 0);
    return AxisLabel;
}());
/**
 * A general purpose linear axis with no notion of orientation.
 * The axis is always rendered vertically, with horizontal labels positioned to the left
 * of the axis line by default. The axis can be {@link rotation | rotated} by an arbitrary angle,
 * so that it can be used as a top, right, bottom, left, radial or any other kind
 * of linear axis.
 * The generic `D` parameter is the type of the domain of the axis' scale.
 * The output range of the axis' scale is always numeric (screen coordinates).
 */
var Axis = /** @class */ (function () {
    function Axis(scale) {
        this.id = createId(this);
        this.axisGroup = new Group({ name: this.id + "-axis", layer: true, zIndex: Layers.AXIS_ZINDEX });
        this.crossLineGroup = new Group({ name: this.id + "-CrossLines" });
        this.lineGroup = this.axisGroup.appendChild(new Group({ name: this.id + "-Line" }));
        this.tickGroup = this.axisGroup.appendChild(new Group({ name: this.id + "-Tick" }));
        this.titleGroup = this.axisGroup.appendChild(new Group({ name: this.id + "-Title" }));
        this.tickGroupSelection = Selection.select(this.tickGroup).selectAll();
        this.lineNode = this.lineGroup.appendChild(new Line());
        this.gridlineGroup = new Group({
            name: this.id + "-gridline",
            layer: true,
            zIndex: Layers.AXIS_GRIDLINES_ZINDEX,
        });
        this.gridlineGroupSelection = Selection.select(this.gridlineGroup).selectAll();
        this._crossLines = [];
        this.line = {
            width: 1,
            color: 'rgba(195, 195, 195, 1)',
        };
        this.tick = new AxisTick();
        this.label = new AxisLabel();
        this.translation = { x: 0, y: 0 };
        this.rotation = 0; // axis rotation angle in degrees
        this._labelAutoRotated = false;
        /**
         * This will be assigned a value when `this.calculateTickCount` is invoked.
         * If the user has specified a tick count, it will be used, otherwise a tick count will be calculated based on the available range.
         */
        this._calculatedTickCount = undefined;
        this.requestedRange = [0, 1];
        this._visibleRange = [0, 1];
        this._title = undefined;
        /**
         * The length of the grid. The grid is only visible in case of a non-zero value.
         * In case {@link radialGrid} is `true`, the value is interpreted as an angle
         * (in degrees).
         */
        this._gridLength = 0;
        /**
         * The array of styles to cycle through when rendering grid lines.
         * For example, use two {@link GridStyle} objects for alternating styles.
         * Contains only one {@link GridStyle} object by default, meaning all grid lines
         * have the same style.
         */
        this.gridStyle = [
            {
                stroke: 'rgba(219, 219, 219, 1)',
                lineDash: [4, 2],
            },
        ];
        /**
         * `false` - render grid as lines of {@link gridLength} that extend the ticks
         *           on the opposite side of the axis
         * `true` - render grid as concentric circles that go through the ticks
         */
        this._radialGrid = false;
        this.fractionDigits = 0;
        this.thickness = 0;
        this.scale = scale;
        this.label.onFormatChange = this.onLabelFormatChange.bind(this);
    }
    Object.defineProperty(Axis.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            var _this = this;
            var _a;
            this._scale = value;
            this.requestedRange = value.range.slice();
            this.onLabelFormatChange();
            (_a = this.crossLines) === null || _a === void 0 ? void 0 : _a.forEach(function (crossLine) {
                _this.initCrossLine(crossLine);
            });
        },
        enumerable: true,
        configurable: true
    });
    Axis.prototype.getTicks = function () {
        var _a;
        return _a = this.ticks, (_a !== null && _a !== void 0 ? _a : this.scale.ticks(this.calculatedTickCount));
    };
    Object.defineProperty(Axis.prototype, "crossLines", {
        get: function () {
            return this._crossLines;
        },
        set: function (value) {
            var _this = this;
            var _a, _b;
            (_a = this._crossLines) === null || _a === void 0 ? void 0 : _a.forEach(function (crossLine) { return _this.detachCrossLine(crossLine); });
            this._crossLines = value;
            (_b = this._crossLines) === null || _b === void 0 ? void 0 : _b.forEach(function (crossLine) {
                _this.attachCrossLine(crossLine);
                _this.initCrossLine(crossLine);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "labelAutoRotated", {
        get: function () {
            return this._labelAutoRotated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "calculatedTickCount", {
        get: function () {
            var _a;
            return _a = this._calculatedTickCount, (_a !== null && _a !== void 0 ? _a : this.tick.count);
        },
        enumerable: true,
        configurable: true
    });
    Axis.prototype.attachCrossLine = function (crossLine) {
        this.crossLineGroup.appendChild(crossLine.group);
    };
    Axis.prototype.detachCrossLine = function (crossLine) {
        this.crossLineGroup.removeChild(crossLine.group);
    };
    /**
     * Overridden in ChartAxis subclass.
     * Sets an appropriate tick count based on the available range.
     */
    Axis.prototype.calculateTickCount = function (_availableRange) {
        // Override point for subclasses.
    };
    /**
     * Meant to be overridden in subclasses to provide extra context the the label formatter.
     * The return value of this function will be passed to the laber.formatter as the `axis` parameter.
     */
    Axis.prototype.getMeta = function () {
        // Override point for subclasses.
    };
    Axis.prototype.updateRange = function () {
        var _a = this, rr = _a.requestedRange, vr = _a.visibleRange, scale = _a.scale;
        var span = (rr[1] - rr[0]) / (vr[1] - vr[0]);
        var shift = span * vr[0];
        var start = rr[0] - shift;
        scale.range = [start, start + span];
    };
    /**
     * Checks if a point or an object is in range.
     * @param x A point (or object's starting point).
     * @param width Object's width.
     * @param tolerance Expands the range on both ends by this amount.
     */
    Axis.prototype.inRange = function (x, width, tolerance) {
        if (width === void 0) { width = 0; }
        if (tolerance === void 0) { tolerance = 0; }
        return this.inRangeEx(x, width, tolerance) === 0;
    };
    Axis.prototype.inRangeEx = function (x, width, tolerance) {
        if (width === void 0) { width = 0; }
        if (tolerance === void 0) { tolerance = 0; }
        var range = this.range;
        // Account for inverted ranges, for example [500, 100] as well as [100, 500]
        var min = Math.min(range[0], range[1]);
        var max = Math.max(range[0], range[1]);
        if (x + width < min - tolerance) {
            return -1; // left of range
        }
        if (x > max + tolerance) {
            return 1; // right of range
        }
        return 0; // in range
    };
    Object.defineProperty(Axis.prototype, "range", {
        get: function () {
            return this.requestedRange;
        },
        set: function (value) {
            this.requestedRange = value.slice();
            this.updateRange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "visibleRange", {
        get: function () {
            return this._visibleRange.slice();
        },
        set: function (value) {
            if (value && value.length === 2) {
                var _a = __read$r(value, 2), min = _a[0], max = _a[1];
                min = Math.max(0, min);
                max = Math.min(1, max);
                min = Math.min(min, max);
                max = Math.max(min, max);
                this._visibleRange = [min, max];
                this.updateRange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "domain", {
        get: function () {
            return this.scale.domain.slice();
        },
        set: function (value) {
            this.scale.domain = value.slice();
            this.onLabelFormatChange(this.label.format);
        },
        enumerable: true,
        configurable: true
    });
    Axis.prototype.onLabelFormatChange = function (format) {
        var scale = this.scale;
        if (format && scale && scale.tickFormat) {
            try {
                this.labelFormatter = scale.tickFormat({
                    ticks: this.getTicks(),
                    count: this.calculatedTickCount,
                    specifier: format,
                });
            }
            catch (e) {
                this.labelFormatter = undefined;
                doOnce(function () {
                    return console.warn("AG Charts - the axis label format string " + format + " is invalid. No formatting will be applied");
                }, "invalid axis label format string " + format);
            }
        }
        else {
            this.labelFormatter = undefined;
        }
    };
    Object.defineProperty(Axis.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            var oldTitle = this._title;
            if (oldTitle !== value) {
                if (oldTitle) {
                    this.titleGroup.removeChild(oldTitle.node);
                }
                if (value) {
                    value.node.rotation = -Math.PI / 2;
                    this.titleGroup.appendChild(value.node);
                }
                this._title = value;
                // position title so that it doesn't briefly get rendered in the top left hand corner of the canvas before update is called.
                this.updateTitle({ ticks: this.ticks || this.scale.ticks(this.calculatedTickCount) });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "gridLength", {
        get: function () {
            return this._gridLength;
        },
        set: function (value) {
            var _this = this;
            var _a;
            // Was visible and now invisible, or was invisible and now visible.
            if ((this._gridLength && !value) || (!this._gridLength && value)) {
                this.gridlineGroupSelection = this.gridlineGroupSelection.remove().setData([]);
            }
            this._gridLength = value;
            (_a = this.crossLines) === null || _a === void 0 ? void 0 : _a.forEach(function (crossLine) {
                _this.initCrossLine(crossLine);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "radialGrid", {
        get: function () {
            return this._radialGrid;
        },
        set: function (value) {
            if (this._radialGrid !== value) {
                this._radialGrid = value;
                this.gridlineGroupSelection = this.gridlineGroupSelection.remove().setData([]);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates/removes/updates the scene graph nodes that constitute the axis.
     */
    Axis.prototype.update = function () {
        var _a, _b;
        var _c = this, axisGroup = _c.axisGroup, gridlineGroup = _c.gridlineGroup, crossLineGroup = _c.crossLineGroup, scale = _c.scale, gridLength = _c.gridLength, tick = _c.tick, label = _c.label, requestedRange = _c.requestedRange, translation = _c.translation;
        var requestedRangeMin = Math.min.apply(Math, __spread$h(requestedRange));
        var requestedRangeMax = Math.max.apply(Math, __spread$h(requestedRange));
        var rotation = toRadians(this.rotation);
        var parallelLabels = label.parallel;
        var translationX = Math.floor(translation.x);
        var translationY = Math.floor(translation.y);
        crossLineGroup.translationX = translationX;
        crossLineGroup.translationY = translationY;
        crossLineGroup.rotation = rotation;
        axisGroup.translationX = translationX;
        axisGroup.translationY = translationY;
        axisGroup.rotation = rotation;
        gridlineGroup.translationX = translationX;
        gridlineGroup.translationY = translationY;
        gridlineGroup.rotation = rotation;
        this.updateLine();
        // The side of the axis line to position the labels on.
        // -1 = left (default)
        //  1 = right
        var sideFlag = label.mirrored ? 1 : -1;
        // When labels are parallel to the axis line, the `parallelFlipFlag` is used to
        // flip the labels to avoid upside-down text, when the axis is rotated
        // such that it is in the right hemisphere, i.e. the angle of rotation
        // is in the [0, π] interval.
        // The rotation angle is normalized, so that we have an easier time checking
        // if it's in the said interval. Since the axis is always rendered vertically
        // and then rotated, zero rotation means 12 (not 3) o-clock.
        // -1 = flip
        //  1 = don't flip (default)
        var parallelFlipRotation = normalizeAngle360(rotation);
        var regularFlipRotation = normalizeAngle360(rotation - Math.PI / 2);
        var halfBandwidth = (scale.bandwidth || 0) / 2;
        var ticks = this.getTicks();
        var tickGroupSelection = this.updateTicks({ ticks: ticks });
        var labelBboxes = this.updateLabels({
            parallelFlipRotation: parallelFlipRotation,
            regularFlipRotation: regularFlipRotation,
            sideFlag: sideFlag,
            tickLineGroupSelection: tickGroupSelection,
            ticks: ticks,
        });
        var gridlineGroupSelection = this.updateGridLines({
            gridLength: gridLength,
            ticks: ticks,
            halfBandwidth: halfBandwidth,
            labelBboxes: labelBboxes,
            sideFlag: sideFlag,
        });
        this.tickGroupSelection = tickGroupSelection;
        this.gridlineGroupSelection = gridlineGroupSelection;
        var anyTickVisible = false;
        var translationYFn = function (_, datum) { return Math.round(scale.convert(datum) + halfBandwidth); };
        var visibleFn = function (node) {
            var min = Math.floor(requestedRangeMin);
            var max = Math.ceil(requestedRangeMax);
            var visible = min !== max && node.translationY >= min && node.translationY <= max;
            anyTickVisible = visible || anyTickVisible;
            return visible;
        };
        tickGroupSelection.attrFn('translationY', translationYFn).attrFn('visible', visibleFn);
        gridlineGroupSelection.attrFn('translationY', translationYFn).attrFn('visible', visibleFn);
        this.tickGroup.visible = anyTickVisible;
        this.gridlineGroup.visible = anyTickVisible;
        if (!anyTickVisible) {
            (_a = this.crossLines) === null || _a === void 0 ? void 0 : _a.forEach(function (crossLine) {
                crossLine.update(anyTickVisible);
            });
            this.updateTitle({ ticks: ticks });
            return;
        }
        tickGroupSelection
            .selectByTag(Tags.Tick)
            .each(function (line, _, index) {
            line.strokeWidth = tick.width;
            line.stroke = tick.color;
            line.visible = labelBboxes.has(index);
        })
            .attr('x1', sideFlag * tick.size)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', 0);
        this.updateTitle({ ticks: ticks });
        (_b = this.crossLines) === null || _b === void 0 ? void 0 : _b.forEach(function (crossLine) {
            crossLine.sideFlag = -sideFlag;
            crossLine.direction = rotation === -Math.PI / 2 ? ChartAxisDirection.X : ChartAxisDirection.Y;
            crossLine.label.parallel =
                crossLine.label.parallel !== undefined ? crossLine.label.parallel : parallelLabels;
            crossLine.parallelFlipRotation = parallelFlipRotation;
            crossLine.regularFlipRotation = regularFlipRotation;
            crossLine.update(anyTickVisible);
        });
    };
    Axis.prototype.updateTicks = function (_a) {
        var ticks = _a.ticks;
        var updateAxis = this.tickGroupSelection.setData(ticks);
        updateAxis.exit.remove();
        var enterAxis = updateAxis.enter.append(Group);
        // Line auto-snaps to pixel grid if vertical or horizontal.
        enterAxis.append(Line).each(function (node) { return (node.tag = Tags.Tick); });
        enterAxis.append(Text);
        return updateAxis.merge(enterAxis);
    };
    Axis.prototype.updateGridLines = function (_a) {
        var gridLength = _a.gridLength, ticks = _a.ticks, labelBboxes = _a.labelBboxes, halfBandwidth = _a.halfBandwidth, sideFlag = _a.sideFlag;
        var _b = this, gridStyle = _b.gridStyle, scale = _b.scale, tick = _b.tick;
        var updateGridlines = this.gridlineGroupSelection.setData(gridLength ? ticks : []);
        updateGridlines.exit.remove();
        var gridlineGroupSelection = updateGridlines;
        if (gridLength) {
            var tagFn = function (node) { return (node.tag = Tags.GridLine); };
            var enterGridline = updateGridlines.enter.append(Group);
            if (this.radialGrid) {
                enterGridline.append(Arc).each(tagFn);
            }
            else {
                enterGridline.append(Line).each(tagFn);
            }
            gridlineGroupSelection = updateGridlines.merge(enterGridline);
        }
        if (gridLength && gridStyle.length) {
            var styleCount_1 = gridStyle.length;
            var gridLines = void 0;
            if (this.radialGrid) {
                var angularGridLength_1 = normalizeAngle360Inclusive(toRadians(gridLength));
                gridLines = gridlineGroupSelection.selectByTag(Tags.GridLine).each(function (arc, datum, index) {
                    var radius = Math.round(scale.convert(datum) + halfBandwidth);
                    arc.centerX = 0;
                    arc.centerY = scale.range[0] - radius;
                    arc.endAngle = angularGridLength_1;
                    arc.radiusX = radius;
                    arc.radiusY = radius;
                    arc.visible = labelBboxes.has(index);
                });
            }
            else {
                gridLines = gridlineGroupSelection.selectByTag(Tags.GridLine).each(function (line, _, index) {
                    line.x1 = 0;
                    line.x2 = -sideFlag * gridLength;
                    line.y1 = 0;
                    line.y2 = 0;
                    line.visible = Math.abs(line.parent.translationY - scale.range[0]) > 1 && labelBboxes.has(index);
                });
            }
            gridLines.each(function (gridLine, _, index) {
                var style = gridStyle[index % styleCount_1];
                gridLine.stroke = style.stroke;
                gridLine.strokeWidth = tick.width;
                gridLine.lineDash = style.lineDash;
                gridLine.fill = undefined;
            });
        }
        return gridlineGroupSelection;
    };
    Axis.prototype.updateLabels = function (_a) {
        var _this = this;
        var ticks = _a.ticks, tickLineGroupSelection = _a.tickLineGroupSelection, sideFlag = _a.sideFlag, parallelFlipRotation = _a.parallelFlipRotation, regularFlipRotation = _a.regularFlipRotation;
        var _b = this, label = _b.label, parallelLabels = _b.label.parallel, scale = _b.scale, tick = _b.tick, requestedRange = _b.requestedRange;
        var requestedRangeMin = Math.min.apply(Math, __spread$h(requestedRange));
        var requestedRangeMax = Math.max.apply(Math, __spread$h(requestedRange));
        var labelAutoRotation = 0;
        var labelRotation = label.rotation ? normalizeAngle360(toRadians(label.rotation)) : 0;
        var parallelFlipFlag = !labelRotation && parallelFlipRotation >= 0 && parallelFlipRotation <= Math.PI ? -1 : 1;
        // Flip if the axis rotation angle is in the top hemisphere.
        var regularFlipFlag = !labelRotation && regularFlipRotation >= 0 && regularFlipRotation <= Math.PI ? -1 : 1;
        // `ticks instanceof NumericTicks` doesn't work here, so we feature detect.
        this.fractionDigits = ticks.fractionDigits >= 0 ? ticks.fractionDigits : 0;
        // Update properties that affect the size of the axis labels and measure the labels
        var labelBboxes = new Map();
        var labelCount = 0;
        var halfFirstLabelLength = false;
        var halfLastLabelLength = false;
        var availableRange = requestedRangeMax - requestedRangeMin;
        var labelSelection = tickLineGroupSelection.selectByClass(Text).each(function (node, datum, index) {
            node.fontStyle = label.fontStyle;
            node.fontWeight = label.fontWeight;
            node.fontSize = label.fontSize;
            node.fontFamily = label.fontFamily;
            node.fill = label.color;
            node.text = _this.formatTickDatum(datum, index);
            node.visible = node.parent.visible;
            if (node.visible !== true) {
                return;
            }
            var userHidden = node.text === '' || node.text == undefined;
            labelBboxes.set(index, userHidden ? null : node.computeBBox());
            if (userHidden) {
                return;
            }
            labelCount++;
            if (index === 0 && node.translationY === scale.range[0]) {
                halfFirstLabelLength = true; // first label protrudes axis line
            }
            else if (index === ticks.length - 1 && node.translationY === scale.range[1]) {
                halfLastLabelLength = true; // last label protrudes axis line
            }
        });
        var labelX = sideFlag * (tick.size + label.padding);
        var step = availableRange / labelCount;
        var calculateLabelsLength = function (bboxes, useWidth) {
            var e_1, _a;
            var totalLength = 0;
            var rotate = false;
            var lastIdx = bboxes.size - 1;
            var padding = 12;
            try {
                for (var _b = __values$i(bboxes.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read$r(_c.value, 2), i = _d[0], bbox = _d[1];
                    if (bbox == null) {
                        continue;
                    }
                    var divideBy = (i === 0 && halfFirstLabelLength) || (i === lastIdx && halfLastLabelLength) ? 2 : 1;
                    var length_1 = useWidth ? bbox.width / divideBy : bbox.height / divideBy;
                    var lengthWithPadding = length_1 <= 0 ? 0 : length_1 + padding;
                    totalLength += lengthWithPadding;
                    if (lengthWithPadding > step) {
                        rotate = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return { totalLength: totalLength, rotate: rotate };
        };
        var useWidth = parallelLabels; // When the labels are parallel to the axis line, use the width of the text to calculate the total length of all labels
        var _c = calculateLabelsLength(labelBboxes, useWidth), totalLabelLength = _c.totalLength, rotate = _c.rotate;
        this._labelAutoRotated = false;
        if (label.rotation === undefined && label.autoRotate === true && rotate) {
            // When no user label rotation angle has been specified and the width of any label exceeds the average tick gap (`rotate` is `true`),
            // automatically rotate the labels
            labelAutoRotation = normalizeAngle360(toRadians(label.autoRotateAngle));
            this._labelAutoRotated = true;
        }
        if (labelRotation || labelAutoRotation) {
            // If the label rotation angle results in a non-parallel orientation, use the height of the texts to calculate the total length of all labels
            if (parallelLabels) {
                useWidth = labelRotation === Math.PI || labelAutoRotation === Math.PI ? true : false;
            }
            else {
                useWidth =
                    labelRotation === Math.PI / 2 ||
                        labelRotation === Math.PI + Math.PI / 2 ||
                        labelAutoRotation === Math.PI / 2 ||
                        labelAutoRotation === Math.PI + Math.PI / 2
                        ? true
                        : false;
            }
            totalLabelLength = calculateLabelsLength(labelBboxes, useWidth).totalLength;
        }
        var autoRotation = parallelLabels ? (parallelFlipFlag * Math.PI) / 2 : regularFlipFlag === -1 ? Math.PI : 0;
        var labelTextBaseline = parallelLabels && !labelRotation ? (sideFlag * parallelFlipFlag === -1 ? 'hanging' : 'bottom') : 'middle';
        var alignFlag = (labelRotation > 0 && labelRotation <= Math.PI) || (labelAutoRotation > 0 && labelAutoRotation <= Math.PI)
            ? -1
            : 1;
        var labelTextAlign = parallelLabels
            ? labelRotation || labelAutoRotation
                ? sideFlag * alignFlag === -1
                    ? 'end'
                    : 'start'
                : 'center'
            : sideFlag * regularFlipFlag === -1
                ? 'end'
                : 'start';
        labelSelection.each(function (label) {
            if (label.text === '' || label.text == undefined) {
                label.visible = false; // hide empty labels
                return;
            }
            label.textBaseline = labelTextBaseline;
            label.textAlign = labelTextAlign;
            label.x = labelX;
            label.rotationCenterX = labelX;
            label.rotation = autoRotation + labelRotation + labelAutoRotation;
        });
        if (totalLabelLength > availableRange) {
            var isContinuous_1 = scale instanceof ContinuousScale;
            var averageLabelLength = totalLabelLength / labelCount;
            var labelsToShow = Math.floor(availableRange / averageLabelLength);
            var showEvery_1 = labelsToShow > 2 ? Math.ceil(labelCount / labelsToShow) : labelCount;
            var visibleLabelIndex_1 = 0;
            labelSelection.each(function (label, _, index) {
                if (label.visible !== true) {
                    return;
                }
                var forceVisible = isContinuous_1 && _this.tick.count === undefined ? index === 0 || index === labelCount - 1 : false; // always show first and last labels for a continuous axis when tick count has not been specified by the user
                label.visible = forceVisible || visibleLabelIndex_1 % showEvery_1 === 0 ? true : false;
                visibleLabelIndex_1++;
                if (!label.visible) {
                    labelBboxes.delete(index);
                }
            });
        }
        return labelBboxes;
    };
    Axis.prototype.updateLine = function () {
        // Render axis line.
        var _a = this, lineNode = _a.lineNode, requestedRange = _a.requestedRange;
        lineNode.x1 = 0;
        lineNode.x2 = 0;
        lineNode.y1 = requestedRange[0];
        lineNode.y2 = requestedRange[1];
        lineNode.strokeWidth = this.line.width;
        lineNode.stroke = this.line.color;
        lineNode.visible = true;
    };
    Axis.prototype.updateTitle = function (_a) {
        var ticks = _a.ticks;
        var _b;
        var _c = this, label = _c.label, rotation = _c.rotation, title = _c.title, lineNode = _c.lineNode, requestedRange = _c.requestedRange, tickGroup = _c.tickGroup, lineGroup = _c.lineGroup;
        if (!title) {
            return;
        }
        var titleVisible = false;
        if (title.enabled && lineNode.visible) {
            titleVisible = true;
            var sideFlag = label.mirrored ? 1 : -1;
            var parallelFlipRotation = normalizeAngle360(rotation);
            var padding = Caption.PADDING;
            var titleNode = title.node;
            var titleRotationFlag = sideFlag === -1 && parallelFlipRotation > Math.PI && parallelFlipRotation < Math.PI * 2 ? -1 : 1;
            titleNode.rotation = (titleRotationFlag * sideFlag * Math.PI) / 2;
            titleNode.x = Math.floor((titleRotationFlag * sideFlag * (requestedRange[0] + requestedRange[1])) / 2);
            var lineBBox = lineGroup.computeBBox();
            var bboxYDimension = rotation === 0 ? lineBBox.width : lineBBox.height;
            if (((_b = ticks) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                var tickBBox = tickGroup.computeBBox();
                var tickWidth = rotation === 0 ? tickBBox.width : tickBBox.height;
                if (Math.abs(tickWidth) < Infinity) {
                    bboxYDimension += tickWidth;
                }
            }
            if (sideFlag === -1) {
                titleNode.y = Math.floor(titleRotationFlag * (-padding - bboxYDimension));
            }
            else {
                titleNode.y = Math.floor(-padding - bboxYDimension);
            }
            titleNode.textBaseline = titleRotationFlag === 1 ? 'bottom' : 'top';
        }
        title.node.visible = titleVisible;
    };
    // For formatting (nice rounded) tick values.
    Axis.prototype.formatTickDatum = function (datum, index) {
        var _a = this, label = _a.label, labelFormatter = _a.labelFormatter, fractionDigits = _a.fractionDigits;
        var meta = this.getMeta();
        return label.formatter
            ? label.formatter({
                value: fractionDigits >= 0 ? datum : String(datum),
                index: index,
                fractionDigits: fractionDigits,
                formatter: labelFormatter,
                axis: meta,
            })
            : labelFormatter
                ? labelFormatter(datum)
                : typeof datum === 'number' && fractionDigits >= 0
                    ? // the `datum` is a floating point number
                        datum.toFixed(fractionDigits)
                    : // the`datum` is an integer, a string or an object
                        String(datum);
    };
    // For formatting arbitrary values between the ticks.
    Axis.prototype.formatDatum = function (datum) {
        return String(datum);
    };
    Axis.prototype.computeBBox = function () {
        return this.axisGroup.computeBBox();
    };
    Axis.prototype.initCrossLine = function (crossLine) {
        crossLine.scale = this.scale;
        crossLine.gridLength = this.gridLength;
    };
    return Axis;
}());

var __extends$Q = (undefined && undefined.__extends) || (function () {
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
var __read$q = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$g = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$q(arguments[i]));
    return ar;
};
var ChartAxisDirection;
(function (ChartAxisDirection) {
    ChartAxisDirection["X"] = "x";
    ChartAxisDirection["Y"] = "y";
})(ChartAxisDirection || (ChartAxisDirection = {}));
function flipChartAxisDirection(direction) {
    if (direction === ChartAxisDirection.X) {
        return ChartAxisDirection.Y;
    }
    else {
        return ChartAxisDirection.X;
    }
}
var ChartAxisPosition;
(function (ChartAxisPosition) {
    ChartAxisPosition["Top"] = "top";
    ChartAxisPosition["Right"] = "right";
    ChartAxisPosition["Bottom"] = "bottom";
    ChartAxisPosition["Left"] = "left";
    ChartAxisPosition["Angle"] = "angle";
    ChartAxisPosition["Radius"] = "radius";
})(ChartAxisPosition || (ChartAxisPosition = {}));
var ChartAxis = /** @class */ (function (_super) {
    __extends$Q(ChartAxis, _super);
    function ChartAxis() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = [];
        _this.direction = ChartAxisDirection.Y;
        _this.boundSeries = [];
        _this.includeInvisibleDomains = false;
        _this._position = ChartAxisPosition.Left;
        return _this;
    }
    Object.defineProperty(ChartAxis.prototype, "type", {
        get: function () {
            return this.constructor.type || '';
        },
        enumerable: true,
        configurable: true
    });
    ChartAxis.prototype.getMeta = function () {
        return {
            id: this.id,
            direction: this.direction,
            boundSeries: this.boundSeries,
        };
    };
    ChartAxis.prototype.useCalculatedTickCount = function () {
        // We only want to use the new algorithm for number axes. Category axes don't use a
        // calculated or user-supplied tick-count, and time axes need special handling depending on
        // the time-range involved.
        return this.scale instanceof LinearScale;
    };
    /**
     * For continuous axes, if tick count has not been specified, set the number of ticks based on the available range
     */
    ChartAxis.prototype.calculateTickCount = function () {
        if (!this.useCalculatedTickCount()) {
            return;
        }
        var _a = this, count = _a.tick.count, _b = __read$q(_a.range, 2), min = _b[0], max = _b[1];
        if (count !== undefined) {
            this._calculatedTickCount = undefined;
            return;
        }
        var availableRange = Math.abs(max - min);
        var optimalTickInteralPx = this.calculateTickIntervalEstimate();
        // Approximate number of pixels to allocate for each tick.
        var optimalRangePx = 600;
        var minTickIntervalRatio = 0.75;
        var tickIntervalRatio = Math.max(Math.pow(Math.log(availableRange) / Math.log(optimalRangePx), 2), minTickIntervalRatio);
        var tickInterval = optimalTickInteralPx * tickIntervalRatio;
        this._calculatedTickCount = Math.max(2, Math.floor(availableRange / tickInterval));
    };
    ChartAxis.prototype.calculateTickIntervalEstimate = function () {
        var _a, _b;
        var _c = this, domain = _c.domain, fontSize = _c.label.fontSize, direction = _c.direction;
        var padding = fontSize * 1.5;
        if (direction === ChartAxisDirection.Y) {
            return fontSize * 2 + padding;
        }
        var ticks = ((_b = (_a = this.scale).ticks) === null || _b === void 0 ? void 0 : _b.call(_a, 10)) || [domain[0], domain[domain.length - 1]];
        // Dynamic optimal tick interval based upon label scale.
        var approxMaxLabelCharacters = Math.max.apply(Math, __spread$g(ticks.map(function (v) {
            return String(v).length;
        })));
        return approxMaxLabelCharacters * fontSize + padding;
    };
    Object.defineProperty(ChartAxis.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            if (this._position !== value) {
                this._position = value;
                switch (value) {
                    case ChartAxisPosition.Top:
                        this.direction = ChartAxisDirection.X;
                        this.rotation = -90;
                        this.label.mirrored = true;
                        this.label.parallel = true;
                        break;
                    case ChartAxisPosition.Right:
                        this.direction = ChartAxisDirection.Y;
                        this.rotation = 0;
                        this.label.mirrored = true;
                        this.label.parallel = false;
                        break;
                    case ChartAxisPosition.Bottom:
                        this.direction = ChartAxisDirection.X;
                        this.rotation = -90;
                        this.label.mirrored = false;
                        this.label.parallel = true;
                        break;
                    case ChartAxisPosition.Left:
                        this.direction = ChartAxisDirection.Y;
                        this.rotation = 0;
                        this.label.mirrored = false;
                        this.label.parallel = false;
                        break;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ChartAxis.prototype.calculateDomain = function (_a) {
        var _b;
        var primaryTickCount = _a.primaryTickCount;
        var _c = this, direction = _c.direction, boundSeries = _c.boundSeries, includeInvisibleDomains = _c.includeInvisibleDomains;
        if (boundSeries.length === 0) {
            console.warn('AG Charts - chart series not initialised; check series and axes configuration.');
        }
        if (this.linkedTo) {
            this.domain = this.linkedTo.domain;
        }
        else {
            var domains_1 = [];
            boundSeries
                .filter(function (s) { return includeInvisibleDomains || s.visible; })
                .forEach(function (series) {
                domains_1.push(series.getDomain(direction));
            });
            var domain = (_b = new Array()).concat.apply(_b, __spread$g(domains_1));
            var isYAxis = this.direction === 'y';
            primaryTickCount = this.updateDomain(domain, isYAxis, primaryTickCount);
        }
        return { primaryTickCount: primaryTickCount };
    };
    ChartAxis.prototype.updateDomain = function (domain, _isYAxis, primaryTickCount) {
        this.domain = domain;
        return primaryTickCount;
    };
    return ChartAxis;
}(Axis));

var __extends$P = (undefined && undefined.__extends) || (function () {
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
var __read$p = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
// Instead of clamping the values outside of domain to the range,
// return NaNs to indicate invalid input.
function clamper(domain) {
    var _a;
    var a = domain[0];
    var b = domain[domain.length - 1];
    if (a > b) {
        _a = __read$p([b, a], 2), a = _a[0], b = _a[1];
    }
    return function (x) { return (x >= a && x <= b ? x : NaN); };
}
var NumberAxis = /** @class */ (function (_super) {
    __extends$P(NumberAxis, _super);
    function NumberAxis() {
        var _this = _super.call(this, new LinearScale()) || this;
        _this._nice = true;
        _this._min = NaN;
        _this._max = NaN;
        _this.scale.clamper = clamper;
        return _this;
    }
    Object.defineProperty(NumberAxis.prototype, "nice", {
        get: function () {
            return this._nice;
        },
        set: function (value) {
            if (this._nice !== value) {
                this._nice = value;
                if (value && this.scale.nice) {
                    this.scale.nice(typeof this.calculatedTickCount === 'number' ? this.calculatedTickCount : undefined);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NumberAxis.prototype.setDomain = function (domain, primaryTickCount) {
        var _a = this, scale = _a.scale, min = _a.min, max = _a.max;
        if (domain.length > 2) {
            domain = extent(domain, isContinuous, Number) || [];
        }
        domain = [isNaN(min) ? domain[0] : min, isNaN(max) ? domain[1] : max];
        if (primaryTickCount) {
            // when `primaryTickCount` is supplied the current axis is a secondary axis which needs to be aligned to
            // the primary by constraining the tick count to the primary axis tick count
            var _b = __read$p(calculateNiceSecondaryAxis(domain, primaryTickCount), 2), d = _b[0], ticks = _b[1];
            scale.domain = d;
            this.ticks = ticks;
            return;
        }
        else {
            scale.domain = domain;
            this.onLabelFormatChange(this.label.format); // not sure why this is required?
            this.scale.clamp = true;
            if (this.nice && this.scale.nice) {
                this.scale.nice(typeof this.calculatedTickCount === 'number' ? this.calculatedTickCount : undefined);
            }
        }
    };
    Object.defineProperty(NumberAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain;
        },
        set: function (domain) {
            this.setDomain(domain);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberAxis.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (value) {
            if (this._min !== value) {
                this._min = value;
                if (!isNaN(value)) {
                    this.scale.domain = [value, this.scale.domain[1]];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberAxis.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (value) {
            if (this._max !== value) {
                this._max = value;
                if (!isNaN(value)) {
                    this.scale.domain = [this.scale.domain[0], value];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NumberAxis.prototype.formatDatum = function (datum) {
        if (typeof datum === 'number') {
            return datum.toFixed(2);
        }
        else {
            doOnce(function () {
                return console.warn('AG Charts - Data contains Date objects which are being plotted against a number axis, please only use a number axis for numbers.');
            }, "number axis config used with Date objects");
            return String(datum);
        }
    };
    NumberAxis.prototype.updateDomain = function (domain, isYAxis, primaryTickCount) {
        if (isYAxis) {
            // the `primaryTickCount` is used to align the secondary axis tick count with the primary
            this.setDomain(domain, primaryTickCount);
            return (primaryTickCount !== null && primaryTickCount !== void 0 ? primaryTickCount : this.scale.ticks(this.calculatedTickCount).length);
        }
        return _super.prototype.updateDomain.call(this, domain, isYAxis, primaryTickCount);
    };
    NumberAxis.className = 'NumberAxis';
    NumberAxis.type = 'number';
    return NumberAxis;
}(ChartAxis));

var __read$o = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * Maps a discrete domain to a continuous numeric range.
 * See https://github.com/d3/d3-scale#band-scales for more info.
 */
var BandScale = /** @class */ (function () {
    function BandScale() {
        this.type = 'band';
        /**
         * Maps datum to its index in the {@link domain} array.
         * Used to check for duplicate datums (not allowed).
         */
        this.index = new Map();
        /**
         * The output range values for datum at each index.
         */
        this.ordinalRange = [];
        /**
         * Contains unique datums only. Since `{}` is used in place of `Map`
         * for IE11 compatibility, the datums are converted `toString` before
         * the uniqueness check.
         */
        this._domain = [];
        this._range = [0, 1];
        this._bandwidth = 1;
        this._rawBandwidth = 1;
        /**
         * The ratio of the range that is reserved for space between bands.
         */
        this._paddingInner = 0;
        /**
         * The ratio of the range that is reserved for space before the first
         * and after the last band.
         */
        this._paddingOuter = 0;
        this._round = false;
        /**
         * How the leftover range is distributed.
         * `0.5` - equal distribution of space before the first and after the last band,
         * with bands effectively centered within the range.
         */
        this._align = 0.5;
    }
    Object.defineProperty(BandScale.prototype, "domain", {
        get: function () {
            return this._domain;
        },
        set: function (values) {
            var domain = this._domain;
            domain.length = 0;
            this.index = new Map();
            var index = this.index;
            // In case one wants to have duplicate domain values, for example, two 'Italy' categories,
            // one should use objects rather than strings for domain values like so:
            // { toString: () => 'Italy' }
            // { toString: () => 'Italy' }
            values.forEach(function (value) {
                if (index.get(value) === undefined) {
                    index.set(value, domain.push(value) - 1);
                }
            });
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "range", {
        get: function () {
            return this._range;
        },
        set: function (values) {
            this._range[0] = values[0];
            this._range[1] = values[1];
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    BandScale.prototype.ticks = function () {
        return this._domain;
    };
    BandScale.prototype.convert = function (d) {
        var i = this.index.get(d);
        if (i === undefined) {
            return NaN;
        }
        var r = this.ordinalRange[i];
        if (r === undefined) {
            return NaN;
        }
        return r;
    };
    Object.defineProperty(BandScale.prototype, "bandwidth", {
        get: function () {
            return this._bandwidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "rawBandwidth", {
        get: function () {
            return this._rawBandwidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "padding", {
        get: function () {
            return this._paddingInner;
        },
        set: function (value) {
            value = Math.max(0, Math.min(1, value));
            this._paddingInner = value;
            this._paddingOuter = value;
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "paddingInner", {
        get: function () {
            return this._paddingInner;
        },
        set: function (value) {
            this._paddingInner = Math.max(0, Math.min(1, value)); // [0, 1]
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "paddingOuter", {
        get: function () {
            return this._paddingOuter;
        },
        set: function (value) {
            this._paddingOuter = Math.max(0, Math.min(1, value)); // [0, 1]
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "round", {
        get: function () {
            return this._round;
        },
        set: function (value) {
            this._round = value;
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "align", {
        get: function () {
            return this._align;
        },
        set: function (value) {
            this._align = Math.max(0, Math.min(1, value)); // [0, 1]
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    BandScale.prototype.rescale = function () {
        var _a;
        var n = this._domain.length;
        if (!n) {
            return;
        }
        var _b = __read$o(this._range, 2), a = _b[0], b = _b[1];
        var reversed = b < a;
        if (reversed) {
            _a = __read$o([b, a], 2), a = _a[0], b = _a[1];
        }
        var rawStep = (b - a) / Math.max(1, n - this._paddingInner + this._paddingOuter * 2);
        var step = rawStep;
        if (this._round) {
            step = Math.floor(step);
        }
        a += (b - a - step * (n - this._paddingInner)) * this._align;
        this._bandwidth = step * (1 - this._paddingInner);
        this._rawBandwidth = rawStep * (1 - this._paddingInner);
        if (this._round) {
            a = Math.round(a);
            this._bandwidth = Math.round(this._bandwidth);
        }
        var values = [];
        for (var i = 0; i < n; i++) {
            values.push(a + step * i);
        }
        if (reversed) {
            values.reverse();
        }
        this.ordinalRange = values;
    };
    return BandScale;
}());

var __extends$O = (undefined && undefined.__extends) || (function () {
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
var __read$n = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$f = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$n(arguments[i]));
    return ar;
};
var CategoryAxis = /** @class */ (function (_super) {
    __extends$O(CategoryAxis, _super);
    function CategoryAxis() {
        var _this = _super.call(this, new BandScale()) || this;
        _this._paddingOverrideEnabled = false;
        _this.includeInvisibleDomains = true;
        return _this;
    }
    Object.defineProperty(CategoryAxis.prototype, "paddingInner", {
        get: function () {
            this._paddingOverrideEnabled = true;
            return this.scale.paddingInner;
        },
        set: function (value) {
            this._paddingOverrideEnabled = true;
            this.scale.paddingInner = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxis.prototype, "paddingOuter", {
        get: function () {
            return this.scale.paddingOuter;
        },
        set: function (value) {
            this.scale.paddingOuter = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain.slice();
        },
        set: function (values) {
            // Prevent duplicate categories.
            var valuesSet = new Set(values);
            this.scale.domain = new (Array.bind.apply(Array, __spread$f([void 0], valuesSet.values())))();
        },
        enumerable: true,
        configurable: true
    });
    CategoryAxis.prototype.calculateDomain = function (_a) {
        var primaryTickCount = _a.primaryTickCount;
        if (!this._paddingOverrideEnabled) {
            var boundSeries = this.boundSeries;
            if (boundSeries.some(function (s) { return ['bar', 'column'].includes(s.type); })) {
                this.scale.paddingInner = 0.2;
                this.scale.paddingOuter = 0.3;
            }
            else {
                this.scale.paddingInner = 1;
                this.scale.paddingOuter = 0;
            }
        }
        return _super.prototype.calculateDomain.call(this, { primaryTickCount: primaryTickCount });
    };
    CategoryAxis.className = 'CategoryAxis';
    CategoryAxis.type = 'category';
    return CategoryAxis;
}(ChartAxis));

/**
 * The tree layout is calculated in abstract x/y coordinates, where the root is at (0, 0)
 * and the tree grows downward from the root.
 */
var TreeNode = /** @class */ (function () {
    function TreeNode(label, parent, number) {
        if (label === void 0) { label = ''; }
        if (number === void 0) { number = 0; }
        this.x = 0;
        this.y = 0;
        this.subtreeLeft = NaN;
        this.subtreeRight = NaN;
        this.screenX = 0;
        this.screenY = 0;
        this.children = [];
        this.leafCount = 0;
        this.prelim = 0;
        this.mod = 0;
        this.ancestor = this;
        this.change = 0;
        this.shift = 0;
        this.label = label;
        // screenX and screenY are meant to be recomputed from (layout) x and y
        // when the tree is resized (without performing another layout)
        this.parent = parent;
        this.depth = parent ? parent.depth + 1 : 0;
        this.number = number;
    }
    TreeNode.prototype.getLeftSibling = function () {
        return this.number > 0 && this.parent ? this.parent.children[this.number - 1] : undefined;
    };
    TreeNode.prototype.getLeftmostSibling = function () {
        return this.number > 0 && this.parent ? this.parent.children[0] : undefined;
    };
    // traverse the left contour of a subtree, return the successor of v on this contour
    TreeNode.prototype.nextLeft = function () {
        return this.children ? this.children[0] : this.thread;
    };
    // traverse the right contour of a subtree, return the successor of v on this contour
    TreeNode.prototype.nextRight = function () {
        return this.children ? this.children[this.children.length - 1] : this.thread;
    };
    TreeNode.prototype.getSiblings = function () {
        var _this = this;
        return this.parent ? this.parent.children.filter(function (_, i) { return i !== _this.number; }) : [];
    };
    return TreeNode;
}());
/**
 * Converts an array of ticks, where each tick has an array of labels, to a label tree.
 * If `pad` is `true`, will ensure that every branch matches the depth of the tree by
 * creating empty labels.
 */
function ticksToTree(ticks, pad) {
    if (pad === void 0) { pad = true; }
    var root = new TreeNode();
    var depth = 0;
    if (pad) {
        ticks.forEach(function (tick) { return (depth = Math.max(depth, tick.labels.length)); });
    }
    ticks.forEach(function (tick) {
        if (pad) {
            while (tick.labels.length < depth) {
                tick.labels.unshift('');
            }
        }
        insertTick(root, tick);
    });
    return root;
}
function insertTick(root, tick) {
    var pathParts = tick.labels.slice().reverse(); // path elements from root to leaf label
    var lastPartIndex = pathParts.length - 1;
    pathParts.forEach(function (pathPart, partIndex) {
        var children = root.children;
        var existingNode = find(children, function (child) { return child.label === pathPart; });
        var isNotLeaf = partIndex !== lastPartIndex;
        if (existingNode && isNotLeaf) {
            // the isNotLeaf check is to allow duplicate leafs
            root = existingNode;
        }
        else {
            var node = new TreeNode(pathPart, root);
            node.number = children.length;
            children.push(node);
            if (isNotLeaf) {
                root = node;
            }
        }
    });
}
// Shift the subtree.
function moveSubtree(wm, wp, shift) {
    var subtrees = wp.number - wm.number;
    var ratio = shift / subtrees;
    wp.change -= ratio;
    wp.shift += shift;
    wm.change += ratio;
    wp.prelim += shift;
    wp.mod += shift;
}
function ancestor(vim, v, defaultAncestor) {
    return v.getSiblings().indexOf(vim.ancestor) >= 0 ? vim.ancestor : defaultAncestor;
}
// Spaces out the children.
function executeShifts(v) {
    var children = v.children;
    if (children) {
        var shift = 0;
        var change = 0;
        for (var i = children.length - 1; i >= 0; i--) {
            var w = children[i];
            w.prelim += shift;
            w.mod += shift;
            change += w.change;
            shift += w.shift + change;
        }
    }
}
// Moves current subtree with v as the root if some nodes are conflicting in space.
function apportion(v, defaultAncestor, distance) {
    var w = v.getLeftSibling();
    if (w) {
        var vop = v;
        var vip = v;
        var vim = w;
        var vom = vip.getLeftmostSibling();
        var sip = vip.mod;
        var sop = vop.mod;
        var sim = vim.mod;
        var som = vom.mod;
        while (vim.nextRight() && vip.nextLeft()) {
            vim = vim.nextRight();
            vip = vip.nextLeft();
            vom = vom.nextLeft();
            vop = vop.nextRight();
            vop.ancestor = v;
            var shift = vim.prelim + sim - (vip.prelim + sip) + distance;
            if (shift > 0) {
                moveSubtree(ancestor(vim, v, defaultAncestor), v, shift);
                sip += shift;
                sop += shift;
            }
            sim += vim.mod;
            sip += vip.mod;
            som += vom.mod;
            sop += vop.mod;
        }
        if (vim.nextRight() && !vop.nextRight()) {
            vop.thread = vim.nextRight();
            vop.mod += sim - sop;
        }
        else {
            if (vip.nextLeft() && !vom.nextLeft()) {
                vom.thread = vip.nextLeft();
                vom.mod += sip - som;
            }
            defaultAncestor = v;
        }
    }
    return defaultAncestor;
}
// Compute the preliminary x-coordinate of node and its children (recursively).
function firstWalk(node, distance) {
    var children = node.children;
    if (children.length) {
        var defaultAncestor_1 = children[0];
        children.forEach(function (child) {
            firstWalk(child, distance);
            defaultAncestor_1 = apportion(child, defaultAncestor_1, distance);
        });
        executeShifts(node);
        var midpoint = (children[0].prelim + children[children.length - 1].prelim) / 2;
        var leftSibling = node.getLeftSibling();
        if (leftSibling) {
            node.prelim = leftSibling.prelim + distance;
            node.mod = node.prelim - midpoint;
        }
        else {
            node.prelim = midpoint;
        }
    }
    else {
        var leftSibling = node.getLeftSibling();
        node.prelim = leftSibling ? leftSibling.prelim + distance : 0;
    }
}
var Dimensions = /** @class */ (function () {
    function Dimensions() {
        this.top = Infinity;
        this.right = -Infinity;
        this.bottom = -Infinity;
        this.left = Infinity;
    }
    Dimensions.prototype.update = function (node, xy) {
        var _a = xy(node), x = _a.x, y = _a.y;
        if (x > this.right) {
            this.right = x;
        }
        if (x < this.left) {
            this.left = x;
        }
        if (y > this.bottom) {
            this.bottom = y;
        }
        if (y < this.top) {
            this.top = y;
        }
    };
    return Dimensions;
}());
function secondWalk(v, m, layout) {
    v.x = v.prelim + m;
    v.y = v.depth;
    layout.update(v);
    v.children.forEach(function (w) { return secondWalk(w, m + v.mod, layout); });
}
// After the second walk the parent nodes are positioned at the center of their immediate children.
// If we want the parent nodes to be positioned at the center of the subtree for which they are roots,
// we need a third walk to adjust the positions.
function thirdWalk(v) {
    var children = v.children;
    var leafCount = 0;
    children.forEach(function (w) {
        thirdWalk(w);
        if (w.children.length) {
            leafCount += w.leafCount;
        }
        else {
            leafCount++;
        }
    });
    v.leafCount = leafCount;
    if (children.length) {
        v.subtreeLeft = children[0].subtreeLeft;
        v.subtreeRight = children[v.children.length - 1].subtreeRight;
        v.x = (v.subtreeLeft + v.subtreeRight) / 2;
    }
    else {
        v.subtreeLeft = v.x;
        v.subtreeRight = v.x;
    }
}
function treeLayout(root) {
    var layout = new TreeLayout();
    firstWalk(root, 1);
    secondWalk(root, -root.prelim, layout);
    thirdWalk(root);
    return layout;
}
var TreeLayout = /** @class */ (function () {
    function TreeLayout() {
        this.dimensions = new Dimensions();
        this.leafCount = 0;
        this.nodes = [];
        // One might want to process leaf nodes separately from the rest of the tree.
        // For example, position labels corresponding to leafs vertically, rather than horizontally.
        this.leafNodes = [];
        this.nonLeafNodes = [];
        this.depth = 0;
    }
    TreeLayout.prototype.update = function (node) {
        this.dimensions.update(node, function (node) { return ({ x: node.x, y: node.y }); });
        if (!node.children.length) {
            this.leafCount++;
            this.leafNodes.push(node);
        }
        else {
            this.nonLeafNodes.push(node);
        }
        if (node.depth > this.depth) {
            this.depth = node.depth;
        }
        this.nodes.push(node);
    };
    TreeLayout.prototype.resize = function (width, height, shiftX, shiftY, flipX) {
        if (shiftX === void 0) { shiftX = 0; }
        if (shiftY === void 0) { shiftY = 0; }
        if (flipX === void 0) { flipX = false; }
        var xSteps = this.leafCount - 1;
        var ySteps = this.depth;
        var dimensions = this.dimensions;
        var scalingX = 1;
        var scalingY = 1;
        if (width > 0 && xSteps) {
            var existingSpacingX = (dimensions.right - dimensions.left) / xSteps;
            var desiredSpacingX = width / xSteps;
            scalingX = desiredSpacingX / existingSpacingX;
            if (flipX) {
                scalingX = -scalingX;
            }
        }
        if (height > 0 && ySteps) {
            var existingSpacingY = (dimensions.bottom - dimensions.top) / ySteps;
            var desiredSpacingY = height / ySteps;
            scalingY = desiredSpacingY / existingSpacingY;
        }
        var screenDimensions = new Dimensions();
        this.nodes.forEach(function (node) {
            node.screenX = node.x * scalingX;
            node.screenY = node.y * scalingY;
            screenDimensions.update(node, function (node) { return ({ x: node.screenX, y: node.screenY }); });
        });
        // Normalize so that root top and leftmost leaf left start at zero.
        var offsetX = -screenDimensions.left;
        var offsetY = -screenDimensions.top;
        this.nodes.forEach(function (node) {
            node.screenX += offsetX + shiftX;
            node.screenY += offsetY + shiftY;
        });
    };
    return TreeLayout;
}());

var __extends$N = (undefined && undefined.__extends) || (function () {
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
var __read$m = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$e = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$m(arguments[i]));
    return ar;
};
var GroupedCategoryAxisLabel = /** @class */ (function (_super) {
    __extends$N(GroupedCategoryAxisLabel, _super);
    function GroupedCategoryAxisLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.grid = false;
        return _this;
    }
    return GroupedCategoryAxisLabel;
}(AxisLabel));
var GroupedCategoryAxis = /** @class */ (function (_super) {
    __extends$N(GroupedCategoryAxis, _super);
    function GroupedCategoryAxis() {
        var _this = _super.call(this, new BandScale()) || this;
        // Label scale (labels are positioned between ticks, tick count = label count + 1).
        // We don't call is `labelScale` for consistency with other axes.
        _this.tickScale = new BandScale();
        _this.translation = {
            x: 0,
            y: 0,
        };
        _this.line = {
            width: 1,
            color: 'rgba(195, 195, 195, 1)',
        };
        // readonly tick = new AxisTick();
        _this.label = new GroupedCategoryAxisLabel();
        /**
         * The color of the labels.
         * Use `undefined` rather than `rgba(0, 0, 0, 0)` to make labels invisible.
         */
        _this.labelColor = 'rgba(87, 87, 87, 1)';
        _this.includeInvisibleDomains = true;
        var _a = _this, axisGroup = _a.axisGroup, gridlineGroup = _a.gridlineGroup, tickScale = _a.tickScale, scale = _a.scale;
        scale.paddingOuter = 0.1;
        scale.paddingInner = scale.paddingOuter * 2;
        _this.requestedRange = scale.range.slice();
        _this.scale = scale;
        tickScale.paddingInner = 1;
        tickScale.paddingOuter = 0;
        _this.gridLineSelection = Selection.select(gridlineGroup).selectAll();
        _this.axisLineSelection = Selection.select(axisGroup).selectAll();
        _this.separatorSelection = Selection.select(axisGroup).selectAll();
        _this.labelSelection = Selection.select(axisGroup).selectAll();
        return _this;
    }
    Object.defineProperty(GroupedCategoryAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain;
        },
        set: function (domainValues) {
            // Prevent duplicate categories.
            var values = domainValues.filter(function (s, i, arr) { return arr.indexOf(s) === i; });
            this.scale.domain = values;
            var tickTree = ticksToTree(values);
            this.tickTreeLayout = treeLayout(tickTree);
            var domain = values.slice();
            domain.push('');
            this.tickScale.domain = domain;
            this.resizeTickTree();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GroupedCategoryAxis.prototype, "range", {
        get: function () {
            return this.requestedRange.slice();
        },
        set: function (value) {
            this.requestedRange = value.slice();
            this.updateRange();
        },
        enumerable: true,
        configurable: true
    });
    GroupedCategoryAxis.prototype.updateRange = function () {
        var _a = this, rr = _a.requestedRange, vr = _a.visibleRange, scale = _a.scale;
        var span = (rr[1] - rr[0]) / (vr[1] - vr[0]);
        var shift = span * vr[0];
        var start = rr[0] - shift;
        this.tickScale.range = scale.range = [start, start + span];
        this.resizeTickTree();
    };
    GroupedCategoryAxis.prototype.resizeTickTree = function () {
        var s = this.scale;
        var range = s.domain.length ? [s.convert(s.domain[0]), s.convert(s.domain[s.domain.length - 1])] : s.range;
        var layout = this.tickTreeLayout;
        var lineHeight = this.lineHeight;
        if (layout) {
            layout.resize(Math.abs(range[1] - range[0]), layout.depth * lineHeight, (Math.min(range[0], range[1]) || 0) + (s.bandwidth || 0) / 2, -layout.depth * lineHeight, range[1] - range[0] < 0);
        }
    };
    Object.defineProperty(GroupedCategoryAxis.prototype, "lineHeight", {
        get: function () {
            return this.label.fontSize * 1.5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GroupedCategoryAxis.prototype, "gridLength", {
        get: function () {
            return this._gridLength;
        },
        /**
         * The length of the grid. The grid is only visible in case of a non-zero value.
         */
        set: function (value) {
            // Was visible and now invisible, or was invisible and now visible.
            if ((this._gridLength && !value) || (!this._gridLength && value)) {
                this.gridLineSelection = this.gridLineSelection.remove().setData([]);
                this.labelSelection = this.labelSelection.remove().setData([]);
            }
            this._gridLength = value;
        },
        enumerable: true,
        configurable: true
    });
    GroupedCategoryAxis.prototype.calculateDomain = function (_a) {
        var _b;
        var primaryTickCount = _a.primaryTickCount;
        var _c = this, direction = _c.direction, boundSeries = _c.boundSeries;
        var domains = [];
        var isNumericX = undefined;
        boundSeries
            .filter(function (s) { return s.visible; })
            .forEach(function (series) {
            if (direction === ChartAxisDirection.X) {
                if (isNumericX === undefined) {
                    // always add first X domain
                    var domain_1 = series.getDomain(direction);
                    domains.push(domain_1);
                    isNumericX = typeof domain_1[0] === 'number';
                }
                else if (isNumericX) {
                    // only add further X domains if the axis is numeric
                    domains.push(series.getDomain(direction));
                }
            }
            else {
                domains.push(series.getDomain(direction));
            }
        });
        var domain = (_b = new Array()).concat.apply(_b, __spread$e(domains));
        this.domain = extent(domain, isContinuous) || domain;
        return { primaryTickCount: primaryTickCount };
    };
    /**
     * Creates/removes/updates the scene graph nodes that constitute the axis.
     * Supposed to be called _manually_ after changing _any_ of the axis properties.
     * This allows to bulk set axis properties before updating the nodes.
     * The node changes made by this method are rendered on the next animation frame.
     * We could schedule this method call automatically on the next animation frame
     * when any of the axis properties change (the way we do when properties of scene graph's
     * nodes change), but this will mean that we first wait for the next animation
     * frame to make changes to the nodes of the axis, then wait for another animation
     * frame to render those changes. It's nice to have everything update automatically,
     * but this extra level of async indirection will not just introduce an unwanted delay,
     * it will also make it harder to reason about the program.
     */
    GroupedCategoryAxis.prototype.update = function () {
        var _this = this;
        var _a = this, axisGroup = _a.axisGroup, gridlineGroup = _a.gridlineGroup, scale = _a.scale, label = _a.label, tickScale = _a.tickScale, requestedRange = _a.requestedRange;
        var rangeStart = scale.range[0];
        var rangeEnd = scale.range[1];
        var rangeLength = Math.abs(rangeEnd - rangeStart);
        var bandwidth = rangeLength / scale.domain.length || 0;
        var parallelLabels = label.parallel;
        var rotation = toRadians(this.rotation);
        var isHorizontal = Math.abs(Math.cos(rotation)) < 1e-8;
        var labelRotation = this.label.rotation ? normalizeAngle360(toRadians(this.label.rotation)) : 0;
        axisGroup.translationX = this.translation.x;
        axisGroup.translationY = this.translation.y;
        axisGroup.rotation = rotation;
        gridlineGroup.translationX = this.translation.x;
        gridlineGroup.translationY = this.translation.y;
        gridlineGroup.rotation = rotation;
        var title = this.title;
        // The Text `node` of the Caption is not used to render the title of the grouped category axis.
        // The phantom root of the tree layout is used instead.
        if (title) {
            title.node.visible = false;
        }
        var lineHeight = this.lineHeight;
        // Render ticks and labels.
        var tickTreeLayout = this.tickTreeLayout;
        var labels = scale.ticks();
        var treeLabels = tickTreeLayout ? tickTreeLayout.nodes : [];
        var isLabelTree = tickTreeLayout ? tickTreeLayout.depth > 1 : false;
        var ticks = tickScale.ticks();
        // The side of the axis line to position the labels on.
        // -1 = left (default)
        //  1 = right
        var sideFlag = label.mirrored ? 1 : -1;
        // When labels are parallel to the axis line, the `parallelFlipFlag` is used to
        // flip the labels to avoid upside-down text, when the axis is rotated
        // such that it is in the right hemisphere, i.e. the angle of rotation
        // is in the [0, π] interval.
        // The rotation angle is normalized, so that we have an easier time checking
        // if it's in the said interval. Since the axis is always rendered vertically
        // and then rotated, zero rotation means 12 (not 3) o-clock.
        // -1 = flip
        //  1 = don't flip (default)
        var parallelFlipRotation = normalizeAngle360(rotation);
        var parallelFlipFlag = !labelRotation && parallelFlipRotation >= 0 && parallelFlipRotation <= Math.PI ? -1 : 1;
        var regularFlipRotation = normalizeAngle360(rotation - Math.PI / 2);
        // Flip if the axis rotation angle is in the top hemisphere.
        var regularFlipFlag = !labelRotation && regularFlipRotation >= 0 && regularFlipRotation <= Math.PI ? -1 : 1;
        var updateGridLines = this.gridLineSelection.setData(this.gridLength ? ticks : []);
        updateGridLines.exit.remove();
        var enterGridLines = updateGridLines.enter.append(Line);
        var gridLineSelection = updateGridLines.merge(enterGridLines);
        var updateLabels = this.labelSelection.setData(treeLabels);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text);
        var labelSelection = updateLabels.merge(enterLabels);
        var labelFormatter = label.formatter;
        var labelBBoxes = new Map();
        var maxLeafLabelWidth = 0;
        labelSelection.each(function (node, datum, index) {
            node.fontStyle = label.fontStyle;
            node.fontWeight = label.fontWeight;
            node.fontSize = label.fontSize;
            node.fontFamily = label.fontFamily;
            node.fill = label.color;
            node.textBaseline = parallelFlipFlag === -1 ? 'bottom' : 'hanging';
            node.textAlign = 'center';
            node.translationX = datum.screenY - label.fontSize * 0.25;
            node.translationY = datum.screenX;
            if (index === 0) {
                // use the phantom root as the axis title
                if (title && title.enabled && labels.length > 0) {
                    node.visible = true;
                    node.text = title.text;
                    node.fontSize = title.fontSize;
                    node.fontStyle = title.fontStyle;
                    node.fontWeight = title.fontWeight;
                    node.fontFamily = title.fontFamily;
                    node.textBaseline = 'hanging';
                }
                else {
                    node.visible = false;
                }
            }
            else {
                node.text = labelFormatter
                    ? labelFormatter({
                        value: String(datum.label),
                        index: index,
                    })
                    : String(datum.label);
                node.visible = datum.screenX >= requestedRange[0] && datum.screenX <= requestedRange[1];
            }
            var bbox = node.computeBBox();
            labelBBoxes.set(node.id, bbox);
            if (bbox.width > maxLeafLabelWidth) {
                maxLeafLabelWidth = bbox.width;
            }
        });
        var labelX = sideFlag * label.padding;
        var autoRotation = parallelLabels ? (parallelFlipFlag * Math.PI) / 2 : regularFlipFlag === -1 ? Math.PI : 0;
        var labelGrid = this.label.grid;
        var separatorData = [];
        labelSelection.each(function (label, datum, index) {
            label.x = labelX;
            label.rotationCenterX = labelX;
            if (!datum.children.length) {
                label.rotation = labelRotation;
                label.textAlign = 'end';
                label.textBaseline = 'middle';
                var bbox = labelBBoxes.get(label.id);
                if (bbox && bbox.height > bandwidth) {
                    label.visible = false;
                }
            }
            else {
                label.translationX -= maxLeafLabelWidth - lineHeight + _this.label.padding;
                var availableRange = datum.leafCount * bandwidth;
                var bbox = labelBBoxes.get(label.id);
                if (bbox && bbox.width > availableRange) {
                    label.visible = false;
                }
                else if (isHorizontal) {
                    label.rotation = autoRotation;
                }
                else {
                    label.rotation = -Math.PI / 2;
                }
            }
            // Calculate positions of label separators for all nodes except the root.
            // Each separator is placed to the top of the current label.
            if (datum.parent && isLabelTree) {
                var y = !datum.children.length
                    ? datum.screenX - bandwidth / 2
                    : datum.screenX - (datum.leafCount * bandwidth) / 2;
                if (!datum.children.length) {
                    if (datum.number !== datum.children.length - 1 || labelGrid) {
                        separatorData.push({
                            y: y,
                            x1: 0,
                            x2: -maxLeafLabelWidth - _this.label.padding * 2,
                            toString: function () { return String(index); },
                        });
                    }
                }
                else {
                    var x = -maxLeafLabelWidth - _this.label.padding * 2 + datum.screenY;
                    separatorData.push({
                        y: y,
                        x1: x + lineHeight,
                        x2: x,
                        toString: function () { return String(index); },
                    });
                }
            }
        });
        // Calculate the position of the long separator on the far bottom of the axis.
        var minX = 0;
        separatorData.forEach(function (d) { return (minX = Math.min(minX, d.x2)); });
        separatorData.push({
            y: Math.max(rangeStart, rangeEnd),
            x1: 0,
            x2: minX,
            toString: function () { return String(separatorData.length); },
        });
        var updateSeparators = this.separatorSelection.setData(separatorData);
        updateSeparators.exit.remove();
        var enterSeparators = updateSeparators.enter.append(Line);
        var separatorSelection = updateSeparators.merge(enterSeparators);
        this.separatorSelection = separatorSelection;
        var epsilon = 0.0000001;
        separatorSelection.each(function (line, datum) {
            line.x1 = datum.x1;
            line.x2 = datum.x2;
            line.y1 = datum.y;
            line.y2 = datum.y;
            line.visible = datum.y >= requestedRange[0] - epsilon && datum.y <= requestedRange[1] + epsilon;
            line.stroke = _this.tick.color;
            line.fill = undefined;
            line.strokeWidth = 1;
        });
        this.gridLineSelection = gridLineSelection;
        this.labelSelection = labelSelection;
        // Render axis lines.
        var lineCount = tickTreeLayout ? tickTreeLayout.depth + 1 : 1;
        var lines = [];
        for (var i = 0; i < lineCount; i++) {
            lines.push(i);
        }
        var updateAxisLines = this.axisLineSelection.setData(lines);
        updateAxisLines.exit.remove();
        var enterAxisLines = updateAxisLines.enter.append(Line);
        var axisLineSelection = updateAxisLines.merge(enterAxisLines);
        this.axisLineSelection = axisLineSelection;
        axisLineSelection.each(function (line, _, index) {
            var x = index > 0 ? -maxLeafLabelWidth - _this.label.padding * 2 - (index - 1) * lineHeight : 0;
            line.x1 = x;
            line.x2 = x;
            line.y1 = requestedRange[0];
            line.y2 = requestedRange[1];
            line.strokeWidth = _this.line.width;
            line.stroke = _this.line.color;
            line.visible = labels.length > 0 && (index === 0 || (labelGrid && isLabelTree));
        });
        if (this.gridLength) {
            var styles_1 = this.gridStyle;
            var styleCount_1 = styles_1.length;
            gridLineSelection.each(function (line, datum, index) {
                var y = Math.round(tickScale.convert(datum));
                line.x1 = 0;
                line.x2 = -sideFlag * _this.gridLength;
                line.y1 = y;
                line.y2 = y;
                line.visible =
                    y >= requestedRange[0] &&
                        y <= requestedRange[1] &&
                        Math.abs(line.parent.translationY - rangeStart) > 1;
                var style = styles_1[index % styleCount_1];
                line.stroke = style.stroke;
                line.strokeWidth = _this.tick.width;
                line.lineDash = style.lineDash;
                line.fill = undefined;
            });
        }
    };
    GroupedCategoryAxis.className = 'GroupedCategoryAxis';
    GroupedCategoryAxis.type = 'groupedCategory';
    return GroupedCategoryAxis;
}(ChartAxis));

var __extends$M = (undefined && undefined.__extends) || (function () {
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
var t0 = new Date();
var t1 = new Date();
/**
 * The interval methods don't mutate Date parameters.
 */
var TimeInterval = /** @class */ (function () {
    function TimeInterval(floor, offset) {
        this._floor = floor;
        this._offset = offset;
    }
    /**
     * Returns a new date representing the latest interval boundary date before or equal to date.
     * For example, `day.floor(date)` typically returns 12:00 AM local time on the given date.
     * @param date
     */
    TimeInterval.prototype.floor = function (date) {
        date = new Date(+date);
        this._floor(date);
        return date;
    };
    /**
     * Returns a new date representing the earliest interval boundary date after or equal to date.
     * @param date
     */
    TimeInterval.prototype.ceil = function (date) {
        date = new Date(+date - 1);
        this._floor(date);
        this._offset(date, 1);
        this._floor(date);
        return date;
    };
    /**
     * Returns a new date representing the closest interval boundary date to date.
     * @param date
     */
    TimeInterval.prototype.round = function (date) {
        var d0 = this.floor(date);
        var d1 = this.ceil(date);
        var ms = +date;
        return ms - d0.getTime() < d1.getTime() - ms ? d0 : d1;
    };
    /**
     * Returns a new date equal to date plus step intervals.
     * @param date
     * @param step
     */
    TimeInterval.prototype.offset = function (date, step) {
        if (step === void 0) { step = 1; }
        date = new Date(+date);
        this._offset(date, Math.floor(step));
        return date;
    };
    /**
     * Returns an array of dates representing every interval boundary after or equal to start (inclusive) and before stop (exclusive).
     * @param start
     * @param stop
     * @param step
     */
    TimeInterval.prototype.range = function (start, stop, step) {
        if (step === void 0) { step = 1; }
        var range = [];
        start = this.ceil(start);
        step = Math.floor(step);
        if (start > stop || step <= 0) {
            return range;
        }
        var previous;
        do {
            previous = new Date(+start);
            range.push(previous);
            this._offset(start, step);
            this._floor(start);
        } while (previous < start && start < stop);
        return range;
    };
    // Returns an interval that is a subset of this interval.
    // For example, to create an interval that return 1st, 11th, 21st and 31st of each month:
    // day.filter(date => (date.getDate() - 1) % 10 === 0)
    TimeInterval.prototype.filter = function (test) {
        var _this = this;
        var floor = function (date) {
            if (date >= date) {
                _this._floor(date);
                while (!test(date)) {
                    date.setTime(date.getTime() - 1);
                    _this._floor(date);
                }
            }
            return date;
        };
        var offset = function (date, step) {
            if (date >= date) {
                if (step < 0) {
                    while (++step <= 0) {
                        do {
                            _this._offset(date, -1);
                        } while (!test(date));
                    }
                }
                else {
                    while (--step >= 0) {
                        do {
                            _this._offset(date, 1);
                        } while (!test(date));
                    }
                }
            }
            return date;
        };
        return new TimeInterval(floor, offset);
    };
    return TimeInterval;
}());
var CountableTimeInterval = /** @class */ (function (_super) {
    __extends$M(CountableTimeInterval, _super);
    function CountableTimeInterval(floor, offset, count, field) {
        var _this = _super.call(this, floor, offset) || this;
        _this._count = count;
        _this._field = field;
        return _this;
    }
    /**
     * Returns the number of interval boundaries after start (exclusive) and before or equal to end (inclusive).
     * @param start
     * @param end
     */
    CountableTimeInterval.prototype.count = function (start, end) {
        t0.setTime(+start);
        t1.setTime(+end);
        this._floor(t0);
        this._floor(t1);
        return Math.floor(this._count(t0, t1));
    };
    /**
     * Returns a filtered view of this interval representing every step'th date.
     * The meaning of step is dependent on this interval’s parent interval as defined by the `field` function.
     * @param step
     */
    CountableTimeInterval.prototype.every = function (step) {
        var _this = this;
        var result;
        step = Math.floor(step);
        if (isFinite(step) && step > 0) {
            if (step > 1) {
                var field_1 = this._field;
                if (field_1) {
                    result = this.filter(function (d) { return field_1(d) % step === 0; });
                }
                else {
                    result = this.filter(function (d) { return _this.count(0, d) % step === 0; });
                }
            }
            else {
                result = this;
            }
        }
        return result;
    };
    return CountableTimeInterval;
}(TimeInterval));

function floor$b(date) {
    return date;
}
function offset$b(date, milliseconds) {
    date.setTime(date.getTime() + milliseconds);
}
function count$b(start, end) {
    return end.getTime() - start.getTime();
}
var millisecond = new CountableTimeInterval(floor$b, offset$b, count$b);

// Common time unit sizes in milliseconds.
var epochYear = new Date(0).getFullYear();
var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;

function floor$a(date) {
    date.setTime(date.getTime() - date.getMilliseconds());
}
function offset$a(date, seconds) {
    date.setTime(date.getTime() + seconds * durationSecond);
}
function count$a(start, end) {
    return (end.getTime() - start.getTime()) / durationSecond;
}
var second = new CountableTimeInterval(floor$a, offset$a, count$a);

function floor$9(date) {
    date.setTime(date.getTime() - date.getMilliseconds() - date.getSeconds() * durationSecond);
}
function offset$9(date, minutes) {
    date.setTime(date.getTime() + minutes * durationMinute);
}
function count$9(start, end) {
    return (end.getTime() - start.getTime()) / durationMinute;
}
function field$9(date) {
    return Math.floor(date.getTime() / durationMinute);
}
var minute = new CountableTimeInterval(floor$9, offset$9, count$9, field$9);

function floor$8(date) {
    date.setTime(date.getTime() -
        date.getMilliseconds() -
        date.getSeconds() * durationSecond -
        date.getMinutes() * durationMinute);
}
function offset$8(date, hours) {
    date.setTime(date.getTime() + hours * durationHour);
}
function count$8(start, end) {
    return (end.getTime() - start.getTime()) / durationHour;
}
function field$8(date) {
    return Math.floor(date.getTime() / durationHour);
}
var hour = new CountableTimeInterval(floor$8, offset$8, count$8, field$8);

function floor$7(date) {
    date.setHours(0, 0, 0, 0);
}
function offset$7(date, days) {
    date.setDate(date.getDate() + days);
}
function count$7(start, end) {
    var tzMinuteDelta = end.getTimezoneOffset() - start.getTimezoneOffset();
    return (end.getTime() - start.getTime() - tzMinuteDelta * durationMinute) / durationDay;
}
function field$7(date) {
    return Math.floor(date.getTime() / durationDay);
}
var day = new CountableTimeInterval(floor$7, offset$7, count$7, field$7);

// Set date to n-th day of the week.
function weekday$1(n) {
    // Sets the `date` to the start of the `n`-th day of the current week.
    // n == 0 is Sunday.
    function floor(date) {
        //                  1..31            1..7
        date.setDate(date.getDate() - ((date.getDay() + 7 - n) % 7));
        date.setHours(0, 0, 0, 0); // h, m, s, ms
    }
    // Offset the date by the given number of weeks.
    function offset(date, weeks) {
        date.setDate(date.getDate() + weeks * 7);
    }
    // Count the number of weeks between the start and end dates.
    function count(start, end) {
        var msDelta = end.getTime() - start.getTime();
        var tzMinuteDelta = end.getTimezoneOffset() - start.getTimezoneOffset();
        return (msDelta - tzMinuteDelta * durationMinute) / durationWeek;
    }
    return new CountableTimeInterval(floor, offset, count);
}
var sunday = weekday$1(0);
var monday = weekday$1(1);
var tuesday = weekday$1(2);
var wednesday = weekday$1(3);
var thursday = weekday$1(4);
var friday = weekday$1(5);
var saturday = weekday$1(6);

function floor$6(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
}
function offset$6(date, months) {
    date.setMonth(date.getMonth() + months);
}
function count$6(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}
function field$6(date) {
    var yearsSinceEpoch = date.getFullYear() - epochYear;
    var monthsSinceEpoch = yearsSinceEpoch * 12 + date.getMonth();
    return monthsSinceEpoch;
}
var month = new CountableTimeInterval(floor$6, offset$6, count$6, field$6);

function floor$5(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
}
function offset$5(date, years) {
    date.setFullYear(date.getFullYear() + years);
}
function count$5(start, end) {
    return end.getFullYear() - start.getFullYear();
}
function field$5(date) {
    return date.getFullYear() - epochYear;
}
var year = new CountableTimeInterval(floor$5, offset$5, count$5, field$5);

function floor$4(date) {
    date.setUTCHours(0, 0, 0, 0);
}
function offset$4(date, days) {
    date.setUTCDate(date.getUTCDate() + days);
}
function count$4(start, end) {
    return (end.getTime() - start.getTime()) / durationDay;
}
function field$4(date) {
    return date.getUTCDate() - 1;
}
var utcDay = new CountableTimeInterval(floor$4, offset$4, count$4, field$4);

function floor$3(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
}
function offset$3(date, years) {
    date.setUTCFullYear(date.getUTCFullYear() + years);
}
function count$3(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
}
function field$3(date) {
    return date.getUTCFullYear();
}
var utcYear = new CountableTimeInterval(floor$3, offset$3, count$3, field$3);

// Set date to n-th day of the week.
function weekday(n) {
    // Sets the `date` to the start of the `n`-th day of the current week.
    // n == 0 is Sunday.
    function floor(date) {
        date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 7 - n) % 7));
        date.setHours(0, 0, 0, 0); // h, m, s, ms
    }
    // Offset the date by the given number of weeks.
    function offset(date, weeks) {
        date.setUTCDate(date.getUTCDate() + weeks * 7);
    }
    // Count the number of weeks between the start and end dates.
    function count(start, end) {
        return (end.getTime() - start.getTime()) / durationWeek;
    }
    return new CountableTimeInterval(floor, offset, count);
}
var utcSunday = weekday(0);
var utcMonday = weekday(1);
weekday(2);
weekday(3);
var utcThursday = weekday(4);
weekday(5);
weekday(6);

function localDate(d) {
    // For JS Dates the [0, 100) interval is a time warp, a fast forward to the 20th century.
    // For example, -1 is -0001 BC, 0 is already 1900 AD.
    if (d.y >= 0 && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate(d) {
    if (d.y >= 0 && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
/**
 * Creates a lookup map for array of names to go from a name to index.
 * @param names
 */
function formatLookup(names) {
    var map = {};
    for (var i = 0, n = names.length; i < n; i++) {
        map[names[i].toLowerCase()] = i;
    }
    return map;
}
function newYear(y) {
    return {
        y: y,
        m: 0,
        d: 1,
        H: 0,
        M: 0,
        S: 0,
        L: 0,
    };
}
var percentCharCode = 37;
var numberRe = /^\s*\d+/; // ignores next directive
var percentRe = /^%/;
var requoteRe = /[\\^$*+?|[\]().{}]/g;
/**
 * Prepends any character in the `requoteRe` set with a backslash.
 * @param s
 */
var requote = function (s) { return s.replace(requoteRe, '\\$&'); }; // $& - matched substring
/**
 * Returns a RegExp that matches any string that starts with any of the given names (case insensitive).
 * @param names
 */
var formatRe = function (names) { return new RegExp('^(?:' + names.map(requote).join('|') + ')', 'i'); };
// A map of padding modifiers to padding strings. Default is `0`.
var pads = {
    '-': '',
    _: ' ',
    '0': '0',
};
function pad(value, fill, width) {
    var sign = value < 0 ? '-' : '';
    var string = String(sign ? -value : value);
    var length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}
/**
 * Create a new time-locale-based object which exposes time-formatting
 * methods for the specified locale definition.
 *
 * @param timeLocale A time locale definition.
 */
function formatLocale(timeLocale) {
    var lDateTime = timeLocale.dateTime;
    var lDate = timeLocale.date;
    var lTime = timeLocale.time;
    var lPeriods = timeLocale.periods;
    var lWeekdays = timeLocale.days;
    var lShortWeekdays = timeLocale.shortDays;
    var lMonths = timeLocale.months;
    var lShortMonths = timeLocale.shortMonths;
    var periodRe = formatRe(lPeriods);
    var periodLookup = formatLookup(lPeriods);
    var weekdayRe = formatRe(lWeekdays);
    var weekdayLookup = formatLookup(lWeekdays);
    var shortWeekdayRe = formatRe(lShortWeekdays);
    var shortWeekdayLookup = formatLookup(lShortWeekdays);
    var monthRe = formatRe(lMonths);
    var monthLookup = formatLookup(lMonths);
    var shortMonthRe = formatRe(lShortMonths);
    var shortMonthLookup = formatLookup(lShortMonths);
    var formats = {
        a: formatShortWeekday,
        A: formatWeekday,
        b: formatShortMonth,
        B: formatMonth,
        c: undefined,
        d: formatDayOfMonth,
        e: formatDayOfMonth,
        f: formatMicroseconds,
        H: formatHour24,
        I: formatHour12,
        j: formatDayOfYear,
        L: formatMilliseconds,
        m: formatMonthNumber,
        M: formatMinutes,
        p: formatPeriod,
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatSeconds,
        u: formatWeekdayNumberMonday,
        U: formatWeekNumberSunday,
        V: formatWeekNumberISO,
        w: formatWeekdayNumberSunday,
        W: formatWeekNumberMonday,
        x: undefined,
        X: undefined,
        y: formatYear,
        Y: formatFullYear,
        Z: formatZone,
        '%': formatLiteralPercent,
    };
    var utcFormats = {
        a: formatUTCShortWeekday,
        A: formatUTCWeekday,
        b: formatUTCShortMonth,
        B: formatUTCMonth,
        c: undefined,
        d: formatUTCDayOfMonth,
        e: formatUTCDayOfMonth,
        f: formatUTCMicroseconds,
        H: formatUTCHour24,
        I: formatUTCHour12,
        j: formatUTCDayOfYear,
        L: formatUTCMilliseconds,
        m: formatUTCMonthNumber,
        M: formatUTCMinutes,
        p: formatUTCPeriod,
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatUTCSeconds,
        u: formatUTCWeekdayNumberMonday,
        U: formatUTCWeekNumberSunday,
        V: formatUTCWeekNumberISO,
        w: formatUTCWeekdayNumberSunday,
        W: formatUTCWeekNumberMonday,
        x: undefined,
        X: undefined,
        y: formatUTCYear,
        Y: formatUTCFullYear,
        Z: formatUTCZone,
        '%': formatLiteralPercent,
    };
    var parses = {
        a: parseShortWeekday,
        A: parseWeekday,
        b: parseShortMonth,
        B: parseMonth,
        c: parseLocaleDateTime,
        d: parseDayOfMonth,
        e: parseDayOfMonth,
        f: parseMicroseconds,
        H: parseHour24,
        I: parseHour24,
        j: parseDayOfYear,
        L: parseMilliseconds,
        m: parseMonthNumber,
        M: parseMinutes,
        p: parsePeriod,
        Q: parseUnixTimestamp,
        s: parseUnixTimestampSeconds,
        S: parseSeconds,
        u: parseWeekdayNumberMonday,
        U: parseWeekNumberSunday,
        V: parseWeekNumberISO,
        w: parseWeekdayNumberSunday,
        W: parseWeekNumberMonday,
        x: parseLocaleDate,
        X: parseLocaleTime,
        y: parseYear,
        Y: parseFullYear,
        Z: parseZone,
        '%': parseLiteralPercent,
    };
    // Recursive definitions.
    formats.x = newFormat(lDate, formats);
    formats.X = newFormat(lTime, formats);
    formats.c = newFormat(lDateTime, formats);
    utcFormats.x = newFormat(lDate, utcFormats);
    utcFormats.X = newFormat(lTime, utcFormats);
    utcFormats.c = newFormat(lDateTime, utcFormats);
    function newParse(specifier, newDate) {
        return function (str) {
            var d = newYear(1900);
            str += '';
            var i = parseSpecifier(d, specifier, str, 0);
            if (i != str.length) {
                return undefined;
            }
            // If a UNIX timestamp is specified, return it.
            if ('Q' in d) {
                return new Date(d.Q);
            }
            // The am-pm flag is 0 for AM, and 1 for PM.
            if ('p' in d) {
                d.H = (d.H % 12) + d.p * 12;
            }
            // Convert day-of-week and week-of-year to day-of-year.
            if ('V' in d) {
                if (d.V < 1 || d.V > 53) {
                    return undefined;
                }
                if (!('w' in d)) {
                    d.w = 1;
                }
                if ('Z' in d) {
                    var week = utcDate(newYear(d.y));
                    var day$1 = week.getUTCDay();
                    week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday.floor(week);
                    week = utcDay.offset(week, (d.V - 1) * 7);
                    d.y = week.getUTCFullYear();
                    d.m = week.getUTCMonth();
                    d.d = week.getUTCDate() + ((d.w + 6) % 7);
                }
                else {
                    var week = newDate(newYear(d.y));
                    var day$1 = week.getDay();
                    week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday.floor(week);
                    week = day.offset(week, (d.V - 1) * 7);
                    d.y = week.getFullYear();
                    d.m = week.getMonth();
                    d.d = week.getDate() + ((d.w + 6) % 7);
                }
            }
            else if ('W' in d || 'U' in d) {
                if (!('w' in d)) {
                    d.w = 'u' in d ? d.u % 7 : 'W' in d ? 1 : 0;
                }
                var day$1 = 'Z' in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
                d.m = 0;
                d.d = 'W' in d ? ((d.w + 6) % 7) + d.W * 7 - ((day$1 + 5) % 7) : d.w + d.U * 7 - ((day$1 + 6) % 7);
            }
            // If a time zone is specified, all fields are interpreted as UTC and then
            // offset according to the specified time zone.
            if ('Z' in d) {
                d.H += (d.Z / 100) | 0;
                d.M += d.Z % 100;
                return utcDate(d);
            }
            // Otherwise, all fields are in local time.
            return newDate(d);
        };
    }
    /**
     * Creates a new function that formats the given Date or timestamp according to specifier.
     * @param specifier
     * @param formats
     */
    function newFormat(specifier, formats) {
        return function (date) {
            var string = [];
            var n = specifier.length;
            var i = -1;
            var j = 0;
            if (!(date instanceof Date)) {
                date = new Date(+date);
            }
            while (++i < n) {
                if (specifier.charCodeAt(i) === percentCharCode) {
                    string.push(specifier.slice(j, i)); // copy the chunks of specifier with no directives as is
                    var c = specifier.charAt(++i);
                    var pad_1 = pads[c];
                    if (pad_1 != undefined) {
                        // if format directive has a padding modifier in front of it
                        c = specifier.charAt(++i); // fetch the directive itself
                    }
                    else {
                        pad_1 = c === 'e' ? ' ' : '0'; // use the default padding modifier
                    }
                    var format = formats[c];
                    if (format) {
                        // if the directive has a corresponding formatting function
                        c = format(date, pad_1); // replace the directive with the formatted date
                    }
                    string.push(c);
                    j = i + 1;
                }
            }
            string.push(specifier.slice(j, i));
            return string.join('');
        };
    }
    // Simultaneously walks over the specifier and the parsed string, populating the `d` map with parsed values.
    // The returned number is expected to equal the length of the parsed `string`, if parsing succeeded.
    function parseSpecifier(d, specifier, string, j) {
        // i - `specifier` string index
        // j - parsed `string` index
        var i = 0;
        var n = specifier.length;
        var m = string.length;
        while (i < n) {
            if (j >= m) {
                return -1;
            }
            var code = specifier.charCodeAt(i++);
            if (code === percentCharCode) {
                var char = specifier.charAt(i++);
                var parse = parses[(char in pads ? specifier.charAt(i++) : char)];
                if (!parse || (j = parse(d, string, j)) < 0) {
                    return -1;
                }
            }
            else if (code != string.charCodeAt(j++)) {
                return -1;
            }
        }
        return j;
    }
    // ----------------------------- formats ----------------------------------
    function formatMicroseconds(date, fill) {
        return formatMilliseconds(date, fill) + '000';
    }
    function formatMilliseconds(date, fill) {
        return pad(date.getMilliseconds(), fill, 3);
    }
    function formatSeconds(date, fill) {
        return pad(date.getSeconds(), fill, 2);
    }
    function formatMinutes(date, fill) {
        return pad(date.getMinutes(), fill, 2);
    }
    function formatHour12(date, fill) {
        return pad(date.getHours() % 12 || 12, fill, 2);
    }
    function formatHour24(date, fill) {
        return pad(date.getHours(), fill, 2);
    }
    function formatPeriod(date) {
        return lPeriods[date.getHours() >= 12 ? 1 : 0];
    }
    function formatShortWeekday(date) {
        return lShortWeekdays[date.getDay()];
    }
    function formatWeekday(date) {
        return lWeekdays[date.getDay()];
    }
    function formatWeekdayNumberMonday(date) {
        var dayOfWeek = date.getDay();
        return dayOfWeek === 0 ? 7 : dayOfWeek;
    }
    function formatWeekNumberSunday(date, fill) {
        return pad(sunday.count(year.floor(date), date), fill, 2);
    }
    function formatWeekNumberISO(date, fill) {
        var day = date.getDay();
        date = day >= 4 || day === 0 ? thursday.floor(date) : thursday.ceil(date);
        var yearStart = year.floor(date);
        return pad(thursday.count(yearStart, date) + (yearStart.getDay() === 4 ? 1 : 0), fill, 2);
    }
    function formatWeekdayNumberSunday(date) {
        return date.getDay();
    }
    function formatWeekNumberMonday(date, fill) {
        return pad(monday.count(year.floor(date), date), fill, 2);
    }
    function formatDayOfMonth(date, fill) {
        return pad(date.getDate(), fill, 2);
    }
    function formatDayOfYear(date, fill) {
        return pad(1 + day.count(year.floor(date), date), fill, 3);
    }
    function formatShortMonth(date) {
        return lShortMonths[date.getMonth()];
    }
    function formatMonth(date) {
        return lMonths[date.getMonth()];
    }
    function formatMonthNumber(date, fill) {
        return pad(date.getMonth() + 1, fill, 2);
    }
    function formatYear(date, fill) {
        return pad(date.getFullYear() % 100, fill, 2);
    }
    function formatFullYear(date, fill) {
        return pad(date.getFullYear() % 10000, fill, 4);
    }
    function formatZone(date) {
        var z = date.getTimezoneOffset();
        return (z > 0 ? '-' : ((z *= -1), '+')) + pad(Math.floor(z / 60), '0', 2) + pad(z % 60, '0', 2);
    }
    // -------------------------- UTC formats -----------------------------------
    function formatUTCMicroseconds(date, fill) {
        return formatUTCMilliseconds(date, fill) + '000';
    }
    function formatUTCMilliseconds(date, fill) {
        return pad(date.getUTCMilliseconds(), fill, 3);
    }
    function formatUTCSeconds(date, fill) {
        return pad(date.getUTCSeconds(), fill, 2);
    }
    function formatUTCMinutes(date, fill) {
        return pad(date.getUTCMinutes(), fill, 2);
    }
    function formatUTCHour12(date, fill) {
        return pad(date.getUTCHours() % 12 || 12, fill, 2);
    }
    function formatUTCHour24(date, fill) {
        return pad(date.getUTCHours(), fill, 2);
    }
    function formatUTCPeriod(date) {
        return lPeriods[date.getUTCHours() >= 12 ? 1 : 0];
    }
    function formatUTCDayOfMonth(date, fill) {
        return pad(date.getUTCDate(), fill, 2);
    }
    function formatUTCDayOfYear(date, fill) {
        return pad(1 + utcDay.count(utcYear.floor(date), date), fill, 3);
    }
    function formatUTCMonthNumber(date, fill) {
        return pad(date.getUTCMonth() + 1, fill, 2);
    }
    function formatUTCShortMonth(date) {
        return lShortMonths[date.getUTCMonth()];
    }
    function formatUTCMonth(date) {
        return lMonths[date.getUTCMonth()];
    }
    function formatUTCShortWeekday(date) {
        return lShortWeekdays[date.getUTCDay()];
    }
    function formatUTCWeekday(date) {
        return lWeekdays[date.getUTCDay()];
    }
    function formatUTCWeekdayNumberMonday(date) {
        var dayOfWeek = date.getUTCDay();
        return dayOfWeek === 0 ? 7 : dayOfWeek;
    }
    function formatUTCWeekNumberSunday(date, fill) {
        return pad(utcSunday.count(utcYear.floor(date), date), fill, 2);
    }
    function formatUTCWeekNumberISO(date, fill) {
        var day = date.getUTCDay();
        date = day >= 4 || day === 0 ? utcThursday.floor(date) : utcThursday.ceil(date);
        var yearStart = utcYear.floor(date);
        return pad(utcThursday.count(yearStart, date) + (yearStart.getUTCDay() === 4 ? 1 : 0), fill, 4);
    }
    function formatUTCWeekdayNumberSunday(date) {
        return date.getUTCDay();
    }
    function formatUTCWeekNumberMonday(date, fill) {
        return pad(utcMonday.count(utcYear.floor(date), date), fill, 2);
    }
    function formatUTCYear(date, fill) {
        return pad(date.getUTCFullYear() % 100, fill, 2);
    }
    function formatUTCFullYear(date, fill) {
        return pad(date.getUTCFullYear() % 10000, fill, 4);
    }
    function formatUTCZone() {
        return '+0000';
    }
    function formatLiteralPercent() {
        return '%';
    }
    function formatUnixTimestamp(date) {
        return date.getTime();
    }
    function formatUnixTimestampSeconds(date) {
        return Math.floor(date.getTime() / 1000);
    }
    // ------------------------------- parsers ------------------------------------
    function parseMicroseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 6));
        return n ? ((d.L = Math.floor(parseFloat(n[0]) / 1000)), i + n[0].length) : -1;
    }
    function parseMilliseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? ((d.L = +n[0]), i + n[0].length) : -1;
    }
    function parseSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.S = +n[0]), i + n[0].length) : -1;
    }
    function parseMinutes(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.M = +n[0]), i + n[0].length) : -1;
    }
    function parseHour24(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.H = +n[0]), i + n[0].length) : -1;
    }
    function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? ((d.p = periodLookup[n[0].toLowerCase()]), i + n[0].length) : -1;
    }
    function parseDayOfMonth(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.d = +n[0]), i + n[0].length) : -1;
    }
    function parseDayOfYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? ((d.m = 0), (d.d = +n[0]), i + n[0].length) : -1;
    }
    function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? ((d.w = shortWeekdayLookup[n[0].toLowerCase()]), i + n[0].length) : -1;
    }
    function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? ((d.w = weekdayLookup[n[0].toLowerCase()]), i + n[0].length) : -1;
    }
    function parseWeekdayNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? ((d.u = +n[0]), i + n[0].length) : -1;
    }
    function parseWeekNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.U = +n[0]), i + n[0].length) : -1;
    }
    function parseWeekNumberISO(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.V = +n[0]), i + n[0].length) : -1;
    }
    function parseWeekNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.W = +n[0]), i + n[0].length) : -1;
    }
    function parseWeekdayNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? ((d.w = +n[0]), i + n[0].length) : -1;
    }
    function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? ((d.m = shortMonthLookup[n[0].toLowerCase()]), i + n[0].length) : -1;
    }
    function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? ((d.m = monthLookup[n[0].toLowerCase()]), i + n[0].length) : -1;
    }
    function parseMonthNumber(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.m = parseFloat(n[0]) - 1), i + n[0].length) : -1;
    }
    function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, lDateTime, string, i);
    }
    function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, lDate, string, i);
    }
    function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, lTime, string, i);
    }
    function parseUnixTimestamp(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? ((d.Q = +n[0]), i + n[0].length) : -1;
    }
    function parseUnixTimestampSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? ((d.Q = +n[0] * 1000), i + n[0].length) : -1;
    }
    function parseYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? ((d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000)), i + n[0].length) : -1;
    }
    function parseFullYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 4));
        return n ? ((d.y = +n[0]), i + n[0].length) : -1;
    }
    function parseZone(d, string, i) {
        var n = /^(Z)|^([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
        return n ? ((d.Z = n[1] ? 0 : -(n[2] + (n[3] || '00'))), i + n[0].length) : -1;
    }
    function parseLiteralPercent(_, string, i) {
        var n = percentRe.exec(string.slice(i, i + 1));
        return n ? i + n[0].length : -1;
    }
    return {
        format: function (specifier) {
            var f = newFormat(specifier, formats);
            f.toString = function () { return specifier; };
            return f;
        },
        parse: function (specifier) {
            var p = newParse(specifier, localDate);
            p.toString = function () { return specifier; };
            return p;
        },
        utcFormat: function (specifier) {
            var f = newFormat(specifier, utcFormats);
            f.toString = function () { return specifier; };
            return f;
        },
        utcParse: function (specifier) {
            var p = newParse(specifier, utcDate);
            p.toString = function () { return specifier; };
            return p;
        },
    };
}

var locale;
setDefaultLocale({
    dateTime: '%x, %X',
    date: '%-m/%-d/%Y',
    time: '%-I:%M:%S %p',
    periods: ['AM', 'PM'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
});
function setDefaultLocale(definition) {
    locale = formatLocale(definition);
    return locale;
}

var __extends$L = (undefined && undefined.__extends) || (function () {
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
var __values$h = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$l = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$d = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$l(arguments[i]));
    return ar;
};
var _a;
var DefaultTimeFormats;
(function (DefaultTimeFormats) {
    DefaultTimeFormats[DefaultTimeFormats["MILLISECOND"] = 0] = "MILLISECOND";
    DefaultTimeFormats[DefaultTimeFormats["SECOND"] = 1] = "SECOND";
    DefaultTimeFormats[DefaultTimeFormats["MINUTE"] = 2] = "MINUTE";
    DefaultTimeFormats[DefaultTimeFormats["HOUR"] = 3] = "HOUR";
    DefaultTimeFormats[DefaultTimeFormats["SHORT_MONTH"] = 4] = "SHORT_MONTH";
    DefaultTimeFormats[DefaultTimeFormats["MONTH"] = 5] = "MONTH";
    DefaultTimeFormats[DefaultTimeFormats["YEAR"] = 6] = "YEAR";
})(DefaultTimeFormats || (DefaultTimeFormats = {}));
var formatStrings = (_a = {},
    _a[DefaultTimeFormats.MILLISECOND] = '.%L',
    _a[DefaultTimeFormats.SECOND] = ':%S',
    _a[DefaultTimeFormats.MINUTE] = '%I:%M',
    _a[DefaultTimeFormats.HOUR] = '%I %p',
    _a[DefaultTimeFormats.SHORT_MONTH] = '%b %d',
    _a[DefaultTimeFormats.MONTH] = '%B',
    _a[DefaultTimeFormats.YEAR] = '%Y',
    _a);
var TimeScale = /** @class */ (function (_super) {
    __extends$L(TimeScale, _super);
    function TimeScale() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'time';
        _this.year = year;
        _this.month = month;
        _this.week = sunday;
        _this.day = day;
        _this.hour = hour;
        _this.minute = minute;
        _this.second = second;
        _this.millisecond = millisecond;
        _this.format = locale.format;
        /**
         * Array of default tick intervals in the following format:
         *
         *     [
         *         interval (unit of time),
         *         number of units (step),
         *         the length of that number of units in milliseconds
         *     ]
         */
        _this.tickIntervals = [
            [_this.second, 1, durationSecond],
            [_this.second, 5, 5 * durationSecond],
            [_this.second, 15, 15 * durationSecond],
            [_this.second, 30, 30 * durationSecond],
            [_this.minute, 1, durationMinute],
            [_this.minute, 5, 5 * durationMinute],
            [_this.minute, 15, 15 * durationMinute],
            [_this.minute, 30, 30 * durationMinute],
            [_this.hour, 1, durationHour],
            [_this.hour, 3, 3 * durationHour],
            [_this.hour, 6, 6 * durationHour],
            [_this.hour, 12, 12 * durationHour],
            [_this.day, 1, durationDay],
            [_this.day, 2, 2 * durationDay],
            [_this.week, 1, durationWeek],
            [_this.month, 1, durationMonth],
            [_this.month, 3, 3 * durationMonth],
            [_this.year, 1, durationYear],
        ];
        _this._domain = [new Date(2000, 0, 1), new Date(2000, 0, 2)];
        return _this;
    }
    TimeScale.prototype.defaultTickFormat = function (ticks) {
        var e_1, _a;
        var _this = this;
        var defaultTimeFormat = DefaultTimeFormats.YEAR;
        var updateFormat = function (format) {
            if (format < defaultTimeFormat) {
                defaultTimeFormat = format;
            }
        };
        try {
            for (var _b = __values$h((ticks !== null && ticks !== void 0 ? ticks : [])), _c = _b.next(); !_c.done; _c = _b.next()) {
                var value = _c.value;
                this.second.floor(value) < value
                    ? updateFormat(DefaultTimeFormats.MILLISECOND)
                    : this.minute.floor(value) < value
                        ? updateFormat(DefaultTimeFormats.SECOND)
                        : this.hour.floor(value) < value
                            ? updateFormat(DefaultTimeFormats.MINUTE)
                            : this.day.floor(value) < value
                                ? updateFormat(DefaultTimeFormats.HOUR)
                                : this.month.floor(value) < value
                                    ? updateFormat(DefaultTimeFormats.SHORT_MONTH)
                                    : this.year.floor(value) < value
                                        ? updateFormat(DefaultTimeFormats.MONTH)
                                        : updateFormat(DefaultTimeFormats.YEAR);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var domain = _super.prototype.getDomain.call(this);
        var start = Math.min.apply(Math, __spread$d(domain));
        var stop = Math.max.apply(Math, __spread$d(domain));
        var extent = stop - start;
        var formatStringArray = [formatStrings[defaultTimeFormat]];
        switch (defaultTimeFormat) {
            case DefaultTimeFormats.SECOND:
                if (extent / durationMinute > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.MINUTE]);
                }
            // fall through deliberately
            case DefaultTimeFormats.MINUTE:
                if (extent / durationHour > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.HOUR]);
                }
            // fall through deliberately
            case DefaultTimeFormats.HOUR:
                if (extent / durationDay > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.SHORT_MONTH]);
                }
            // fall through deliberately
            case DefaultTimeFormats.SHORT_MONTH:
            // fall through deliberately
            case DefaultTimeFormats.MONTH:
                if (extent / durationYear > 1) {
                    formatStringArray.push(formatStrings[DefaultTimeFormats.YEAR]);
                }
        }
        var formatString = formatStringArray.join(' ');
        return function (date) { return _this.format(formatString)(date); };
    };
    /**
     *
     * @param interval If the `interval` is a number, it's interpreted as the desired tick count
     * and the method tries to pick an appropriate interval automatically, based on the extent of the domain.
     * If the `interval` is `undefined`, it defaults to `10`.
     * If the `interval` is a time interval, simply use it.
     * @param start The start time (timestamp).
     * @param stop The end time (timestamp).
     * @param step Number of intervals between ticks.
     */
    TimeScale.prototype.tickInterval = function (interval, start, stop, step) {
        var _a;
        if (typeof interval === 'number') {
            var tickCount = interval;
            var tickIntervals = this.tickIntervals;
            var target = Math.abs(stop - start) / tickCount;
            var i = complexBisectRight(tickIntervals, target, function (interval) { return interval[2]; });
            if (i === tickIntervals.length) {
                step = tickStep(start / durationYear, stop / durationYear, tickCount);
                interval = this.year;
            }
            else if (i) {
                _a = __read$l(tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i], 2), interval = _a[0], step = _a[1];
            }
            else {
                step = Math.max(tickStep(start, stop, interval), 1);
                interval = this.millisecond;
            }
        }
        return step == undefined ? interval : interval.every(step);
    };
    Object.defineProperty(TimeScale.prototype, "domain", {
        get: function () {
            return _super.prototype.getDomain.call(this).map(function (t) { return new Date(t); });
        },
        set: function (values) {
            _super.prototype.setDomain.call(this, values.map(function (t) { return (t instanceof Date ? +t : +new Date(+t)); }));
        },
        enumerable: true,
        configurable: true
    });
    TimeScale.prototype.invert = function (y) {
        return new Date(_super.prototype.invert.call(this, y));
    };
    /**
     * Returns uniformly-spaced dates that represent the scale's domain.
     * @param interval The desired tick count or a time interval object.
     */
    TimeScale.prototype.ticks = function (interval) {
        if (interval === void 0) { interval = 10; }
        var d = _super.prototype.getDomain.call(this);
        var t0 = d[0];
        var t1 = d[d.length - 1];
        var reverse = t1 < t0;
        if (reverse) {
            var _ = t0;
            t0 = t1;
            t1 = _;
        }
        var t = this.tickInterval(interval, t0, t1);
        var i = t ? t.range(t0, t1 + 1) : []; // inclusive stop
        return reverse ? i.reverse() : i;
    };
    /**
     * Returns a time format function suitable for displaying tick values.
     * @param count Ignored. Used only to satisfy the {@link Scale} interface.
     * @param specifier If the specifier string is provided, this method is equivalent to
     * the {@link TimeLocaleObject.format} method.
     * If no specifier is provided, this method returns the default time format function.
     */
    TimeScale.prototype.tickFormat = function (_a) {
        var ticks = _a.ticks, specifier = _a.specifier;
        return specifier == undefined ? this.defaultTickFormat(ticks) : this.format(specifier);
    };
    /**
     * Extends the domain so that it starts and ends on nice round values.
     * This method typically modifies the scale’s domain, and may only extend the bounds to the nearest round value.
     * @param interval
     */
    TimeScale.prototype.nice = function (interval) {
        if (interval === void 0) { interval = 10; }
        var d = _super.prototype.getDomain.call(this);
        var i = this.tickInterval(interval, d[0], d[d.length - 1]);
        if (i) {
            this.domain = this._nice(d, i);
        }
    };
    TimeScale.prototype._nice = function (domain, interval) {
        var _a, _b;
        domain = domain.slice();
        var i0 = 0;
        var i1 = domain.length - 1;
        var x0 = domain[i0];
        var x1 = domain[i1];
        if (x1 < x0) {
            _a = __read$l([i1, i0], 2), i0 = _a[0], i1 = _a[1];
            _b = __read$l([x1, x0], 2), x0 = _b[0], x1 = _b[1];
        }
        domain[i0] = interval.floor(x0);
        domain[i1] = interval.ceil(x1);
        return domain;
    };
    return TimeScale;
}(ContinuousScale));

var __extends$K = (undefined && undefined.__extends) || (function () {
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
var __read$k = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var TimeAxis = /** @class */ (function (_super) {
    __extends$K(TimeAxis, _super);
    function TimeAxis() {
        var _this = _super.call(this, new TimeScale()) || this;
        _this.datumFormat = '%m/%d/%y, %H:%M:%S';
        _this._nice = true;
        _this._domain = [];
        var scale = _this.scale;
        scale.clamp = true;
        _this.scale = scale;
        _this.datumFormatter = scale.tickFormat({
            ticks: _this.getTicks(),
            count: _this.calculatedTickCount,
            specifier: _this.datumFormat,
        });
        return _this;
    }
    Object.defineProperty(TimeAxis.prototype, "nice", {
        get: function () {
            return this._nice;
        },
        set: function (value) {
            if (this._nice !== value) {
                this._nice = value;
                if (value && this.scale.nice) {
                    this.scale.nice(typeof this.calculatedTickCount === 'number' ? this.calculatedTickCount : undefined);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain;
        },
        set: function (domain) {
            this._domain = domain;
            this.setDomain(domain);
        },
        enumerable: true,
        configurable: true
    });
    TimeAxis.prototype.setDomain = function (domain, _primaryTickCount) {
        var _a = this, scale = _a.scale, nice = _a.nice, _b = __read$k(_a._domain, 2), min = _b[0], max = _b[1], calculatedTickCount = _a.calculatedTickCount;
        if (domain.length > 2) {
            domain = (extent(domain, isContinuous, Number) || [0, 1000]).map(function (x) { return new Date(x); });
        }
        domain = [min instanceof Date ? min : domain[0], max instanceof Date ? max : domain[1]];
        this.scale.domain = domain;
        if (nice && scale.nice) {
            scale.nice(typeof calculatedTickCount === 'number' ? calculatedTickCount : undefined);
        }
        this.onLabelFormatChange(this.label.format);
    };
    TimeAxis.prototype.onLabelFormatChange = function (format) {
        if (format) {
            _super.prototype.onLabelFormatChange.call(this, format);
        }
        else {
            // For time axis labels to look nice, even if date format wasn't set.
            this.labelFormatter = this.scale.tickFormat({ ticks: this.getTicks(), count: this.calculatedTickCount });
        }
    };
    TimeAxis.prototype.formatDatum = function (datum) {
        return this.datumFormatter(datum);
    };
    TimeAxis.prototype.updateDomain = function (domain, _isYAxis, primaryTickCount) {
        // the `primaryTickCount` is used to align the secondary axis tick count with the primary
        this.setDomain(domain, primaryTickCount);
        return (primaryTickCount !== null && primaryTickCount !== void 0 ? primaryTickCount : this.scale.ticks(this.calculatedTickCount).length);
    };
    TimeAxis.className = 'TimeAxis';
    TimeAxis.type = 'time';
    return TimeAxis;
}(ChartAxis));

/**
 * Wraps a native OffscreenCanvas and overrides its OffscreenCanvasRenderingContext2D to
 * provide resolution independent rendering based on `window.devicePixelRatio`.
 */
var HdpiOffscreenCanvas = /** @class */ (function () {
    // The width/height attributes of the Canvas element default to
    // 300/150 according to w3.org.
    function HdpiOffscreenCanvas(_a) {
        var _b = _a.width, width = _b === void 0 ? 600 : _b, _c = _a.height, height = _c === void 0 ? 300 : _c;
        this.enabled = true;
        this.opacity = 1;
        // `NaN` is deliberate here, so that overrides are always applied
        // and the `resetTransform` inside the `resize` method works in IE11.
        this._pixelRatio = NaN;
        this._width = 0;
        this._height = 0;
        this.canvas = new OffscreenCanvas(width, height);
        this.context = this.canvas.getContext('2d');
        this.imageSource = this.canvas.transferToImageBitmap();
        this.setPixelRatio();
        this.resize(width, height);
    }
    HdpiOffscreenCanvas.isSupported = function () {
        return window['OffscreenCanvas'] != null;
    };
    HdpiOffscreenCanvas.prototype.snapshot = function () {
        this.imageSource.close();
        this.imageSource = this.canvas.transferToImageBitmap();
    };
    HdpiOffscreenCanvas.prototype.destroy = function () {
        this.imageSource.close();
    };
    HdpiOffscreenCanvas.prototype.clear = function () {
        this.context.save();
        this.context.resetTransform();
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.restore();
    };
    Object.defineProperty(HdpiOffscreenCanvas.prototype, "pixelRatio", {
        get: function () {
            return this._pixelRatio;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Changes the pixel ratio of the Canvas element to the given value,
     * or uses the window.devicePixelRatio (default), then resizes the Canvas
     * element accordingly (default).
     */
    HdpiOffscreenCanvas.prototype.setPixelRatio = function (ratio) {
        var pixelRatio = ratio || window.devicePixelRatio;
        if (pixelRatio === this.pixelRatio) {
            return;
        }
        HdpiCanvas.overrideScale(this.context, pixelRatio);
        this._pixelRatio = pixelRatio;
        this.resize(this.width, this.height);
    };
    Object.defineProperty(HdpiOffscreenCanvas.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiOffscreenCanvas.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    HdpiOffscreenCanvas.prototype.resize = function (width, height) {
        if (!(width > 0 && height > 0)) {
            return;
        }
        var _a = this, canvas = _a.canvas, context = _a.context, pixelRatio = _a.pixelRatio;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.resetTransform();
        this._width = width;
        this._height = height;
    };
    return HdpiOffscreenCanvas;
}());

var __assign$c = (undefined && undefined.__assign) || function () {
    __assign$c = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$c.apply(this, arguments);
};
var __read$j = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$c = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$j(arguments[i]));
    return ar;
};
var __values$g = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Scene = /** @class */ (function () {
    function Scene(opts) {
        var _a, _b;
        this.id = createId(this);
        this.layers = [];
        this._nextZIndex = 0;
        this._nextLayerId = 0;
        this._dirty = false;
        this._root = null;
        this.debug = {
            dirtyTree: false,
            stats: false,
            renderBoundingBoxes: false,
            consoleLog: false,
        };
        var _c = opts.document, document = _c === void 0 ? window.document : _c, _d = opts.mode, mode = _d === void 0 ? windowValue('agChartsSceneRenderModel') || 'adv-composite' : _d, width = opts.width, height = opts.height;
        this.opts = { document: document, mode: mode };
        this.debug.stats = (_a = windowValue('agChartsSceneStats'), (_a !== null && _a !== void 0 ? _a : false));
        this.debug.dirtyTree = (_b = windowValue('agChartsSceneDirtyTree'), (_b !== null && _b !== void 0 ? _b : false));
        this.canvas = new HdpiCanvas({ document: document, width: width, height: height });
        this.ctx = this.canvas.context;
    }
    Object.defineProperty(Scene.prototype, "container", {
        get: function () {
            return this.canvas.container;
        },
        set: function (value) {
            this.canvas.container = value;
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.download = function (fileName) {
        this.canvas.download(fileName);
    };
    Scene.prototype.getDataURL = function (type) {
        return this.canvas.getDataURL(type);
    };
    Object.defineProperty(Scene.prototype, "width", {
        get: function () {
            return this.pendingSize ? this.pendingSize[0] : this.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "height", {
        get: function () {
            return this.pendingSize ? this.pendingSize[1] : this.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.resize = function (width, height) {
        width = Math.round(width);
        height = Math.round(height);
        // HdpiCanvas doesn't allow width/height <= 0.
        var lessThanZero = width <= 0 || height <= 0;
        var unchanged = width === this.width && height === this.height;
        if (unchanged || lessThanZero) {
            return false;
        }
        this.pendingSize = [width, height];
        this.markDirty();
        return true;
    };
    Scene.prototype.addLayer = function (opts) {
        var _a;
        var mode = this.opts.mode;
        var layeredModes = ['composite', 'dom-composite', 'adv-composite'];
        if (!layeredModes.includes(mode)) {
            return undefined;
        }
        var _b = opts || {}, _c = _b.zIndex, zIndex = _c === void 0 ? this._nextZIndex++ : _c, name = _b.name, zIndexSubOrder = _b.zIndexSubOrder;
        var _d = this, width = _d.width, height = _d.height;
        var domLayer = mode === 'dom-composite';
        var advLayer = mode === 'adv-composite';
        var canvas = !advLayer || !HdpiOffscreenCanvas.isSupported()
            ? new HdpiCanvas({
                document: this.opts.document,
                width: width,
                height: height,
                domLayer: domLayer,
                zIndex: zIndex,
                name: name,
            })
            : new HdpiOffscreenCanvas({
                width: width,
                height: height,
            });
        var newLayer = {
            id: this._nextLayerId++,
            name: name,
            zIndex: zIndex,
            zIndexSubOrder: zIndexSubOrder,
            canvas: canvas,
        };
        if (zIndex >= this._nextZIndex) {
            this._nextZIndex = zIndex + 1;
        }
        this.layers.push(newLayer);
        this.sortLayers();
        if (domLayer) {
            var domCanvases = this.layers
                .map(function (v) { return v.canvas; })
                .filter(function (v) { return v instanceof HdpiCanvas; });
            var newLayerIndex = domCanvases.findIndex(function (v) { return v === canvas; });
            var lastLayer = (_a = domCanvases[newLayerIndex - 1], (_a !== null && _a !== void 0 ? _a : this.canvas));
            lastLayer.element.insertAdjacentElement('afterend', canvas.element);
        }
        if (this.debug.consoleLog) {
            console.log({ layers: this.layers });
        }
        return newLayer.canvas;
    };
    Scene.prototype.removeLayer = function (canvas) {
        var index = this.layers.findIndex(function (l) { return l.canvas === canvas; });
        if (index >= 0) {
            this.layers.splice(index, 1);
            canvas.destroy();
            this.markDirty();
            if (this.debug.consoleLog) {
                console.log({ layers: this.layers });
            }
        }
    };
    Scene.prototype.moveLayer = function (canvas, newZIndex, newZIndexSubOrder) {
        var layer = this.layers.find(function (l) { return l.canvas === canvas; });
        if (layer) {
            layer.zIndex = newZIndex;
            layer.zIndexSubOrder = newZIndexSubOrder;
            this.sortLayers();
            this.markDirty();
            if (this.debug.consoleLog) {
                console.log({ layers: this.layers });
            }
        }
    };
    Scene.prototype.sortLayers = function () {
        this.layers.sort(function (a, b) {
            var _a, _b;
            return compoundAscending(__spread$c([a.zIndex], (_a = a.zIndexSubOrder, (_a !== null && _a !== void 0 ? _a : [undefined, undefined])), [a.id]), __spread$c([b.zIndex], (_b = b.zIndexSubOrder, (_b !== null && _b !== void 0 ? _b : [undefined, undefined])), [b.id]), ascendingStringNumberUndefined);
        });
    };
    Scene.prototype.markDirty = function () {
        this._dirty = true;
    };
    Object.defineProperty(Scene.prototype, "dirty", {
        get: function () {
            return this._dirty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (node) {
            if (node === this._root) {
                return;
            }
            if (this._root) {
                this._root._setScene();
            }
            this._root = node;
            if (node) {
                // If `node` is the root node of another scene ...
                if (node.parent === null && node.scene && node.scene !== this) {
                    node.scene.root = null;
                }
                node._setScene(this);
            }
            this.markDirty();
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.render = function (opts) {
        var _a, e_1, _b;
        var _c = opts || {}, _d = _c.debugSplitTimes, debugSplitTimes = _d === void 0 ? [performance.now()] : _d, _e = _c.extraDebugStats, extraDebugStats = _e === void 0 ? {} : _e;
        var _f = this, canvas = _f.canvas, ctx = _f.ctx, root = _f.root, layers = _f.layers, pendingSize = _f.pendingSize, mode = _f.opts.mode;
        if (pendingSize) {
            (_a = this.canvas).resize.apply(_a, __spread$c(pendingSize));
            this.layers.forEach(function (layer) {
                var _a;
                return (_a = layer.canvas).resize.apply(_a, __spread$c(pendingSize));
            });
            this.pendingSize = undefined;
        }
        if (root && !root.visible) {
            this._dirty = false;
            return;
        }
        if (!this.dirty) {
            return;
        }
        var renderCtx = {
            ctx: ctx,
            forceRender: true,
            resized: !!pendingSize,
        };
        if (this.debug.stats === 'detailed') {
            renderCtx.stats = { layersRendered: 0, layersSkipped: 0, nodesRendered: 0, nodesSkipped: 0 };
        }
        var canvasCleared = false;
        if (!root || root.dirty >= RedrawType.TRIVIAL) {
            // start with a blank canvas, clear previous drawing
            canvasCleared = true;
            canvas.clear();
        }
        if (root && this.debug.dirtyTree) {
            var _g = this.buildDirtyTree(root), dirtyTree = _g.dirtyTree, paths = _g.paths;
            console.log({ dirtyTree: dirtyTree, paths: paths });
        }
        if (root && canvasCleared) {
            if (this.debug.consoleLog) {
                console.log('before', {
                    redrawType: RedrawType[root.dirty],
                    canvasCleared: canvasCleared,
                    tree: this.buildTree(root),
                });
            }
            if (root.visible) {
                ctx.save();
                root.render(renderCtx);
                ctx.restore();
            }
        }
        if (mode !== 'dom-composite' && layers.length > 0 && canvasCleared) {
            ctx.save();
            ctx.setTransform(1 / canvas.pixelRatio, 0, 0, 1 / canvas.pixelRatio, 0, 0);
            layers.forEach(function (_a) {
                var _b = _a.canvas, imageSource = _b.imageSource, enabled = _b.enabled, opacity = _b.opacity;
                if (!enabled) {
                    return;
                }
                ctx.globalAlpha = opacity;
                ctx.drawImage(imageSource, 0, 0);
            });
            ctx.restore();
        }
        this._dirty = false;
        var end = performance.now();
        if (this.debug.stats) {
            var start = debugSplitTimes[0];
            debugSplitTimes.push(end);
            var pct = function (rendered, skipped) {
                var total = rendered + skipped;
                return rendered + " / " + total + " (" + Math.round((100 * rendered) / total) + "%)";
            };
            var time_1 = function (start, end) {
                return Math.round((end - start) * 100) / 100 + "ms";
            };
            var _h = renderCtx.stats || {}, _j = _h.layersRendered, layersRendered = _j === void 0 ? 0 : _j, _k = _h.layersSkipped, layersSkipped = _k === void 0 ? 0 : _k, _l = _h.nodesRendered, nodesRendered = _l === void 0 ? 0 : _l, _m = _h.nodesSkipped, nodesSkipped = _m === void 0 ? 0 : _m;
            var splits = debugSplitTimes
                .map(function (t, i) { return (i > 0 ? time_1(debugSplitTimes[i - 1], t) : null); })
                .filter(function (v) { return v != null; })
                .join(' + ');
            var extras = Object.entries(extraDebugStats)
                .map(function (_a) {
                var _b = __read$j(_a, 2), k = _b[0], v = _b[1];
                return k + ": " + v;
            })
                .join(' ; ');
            var stats = [
                time_1(start, end) + " (" + splits + ")",
                "" + extras,
                this.debug.stats === 'detailed' ? "Layers: " + pct(layersRendered, layersSkipped) : null,
                this.debug.stats === 'detailed' ? "Nodes: " + pct(nodesRendered, nodesSkipped) : null,
            ].filter(function (v) { return v != null; });
            var lineHeight = 15;
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 120, 10 + lineHeight * stats.length);
            ctx.fillStyle = 'black';
            var index = 0;
            try {
                for (var stats_1 = __values$g(stats), stats_1_1 = stats_1.next(); !stats_1_1.done; stats_1_1 = stats_1.next()) {
                    var stat = stats_1_1.value;
                    ctx.fillText(stat, 2, 10 + index++ * lineHeight);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (stats_1_1 && !stats_1_1.done && (_b = stats_1.return)) _b.call(stats_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            ctx.restore();
        }
        if (root && this.debug.consoleLog) {
            console.log('after', { redrawType: RedrawType[root.dirty], canvasCleared: canvasCleared, tree: this.buildTree(root) });
        }
    };
    Scene.prototype.buildTree = function (node) {
        var _this = this;
        var _a;
        var name = (_a = (node instanceof Group ? node.name : null), (_a !== null && _a !== void 0 ? _a : node.id));
        return __assign$c({ name: name,
            node: node, dirty: RedrawType[node.dirty] }, node.children
            .map(function (c) { return _this.buildTree(c); })
            .reduce(function (result, childTree) {
            var treeNodeName = childTree.name, _a = childTree.node, visible = _a.visible, opacity = _a.opacity, zIndex = _a.zIndex, zIndexSubOrder = _a.zIndexSubOrder;
            if (!visible || opacity <= 0) {
                treeNodeName = "* " + treeNodeName;
            }
            if (node instanceof Group && node.isLayer()) {
                treeNodeName = "[ " + treeNodeName + " ]";
            }
            var key = [
                "" + (treeNodeName !== null && treeNodeName !== void 0 ? treeNodeName : '<unknown>'),
                "z: " + zIndex,
                zIndexSubOrder && "zo: " + zIndexSubOrder.join(' / '),
            ]
                .filter(function (v) { return !!v; })
                .join(' ');
            result[key] = childTree;
            return result;
        }, {}));
    };
    Scene.prototype.buildDirtyTree = function (node) {
        var _this = this;
        var _a;
        if (node.dirty === RedrawType.NONE) {
            return { dirtyTree: {}, paths: [] };
        }
        var childrenDirtyTree = node.children.map(function (c) { return _this.buildDirtyTree(c); }).filter(function (c) { return c.paths.length > 0; });
        var name = (_a = (node instanceof Group ? node.name : null), (_a !== null && _a !== void 0 ? _a : node.id));
        var paths = childrenDirtyTree.length === 0
            ? [name]
            : childrenDirtyTree
                .map(function (c) { return c.paths; })
                .reduce(function (r, p) { return r.concat(p); }, [])
                .map(function (p) { return name + "." + p; });
        return {
            dirtyTree: __assign$c({ name: name,
                node: node, dirty: RedrawType[node.dirty] }, childrenDirtyTree
                .map(function (c) { return c.dirtyTree; })
                .filter(function (t) { return t.dirty !== undefined; })
                .reduce(function (result, childTree) {
                result[childTree.name || '<unknown>'] = childTree;
                return result;
            }, {})),
            paths: paths,
        };
    };
    Scene.className = 'Scene';
    return Scene;
}());

var Label = /** @class */ (function () {
    function Label() {
        this.enabled = true;
        this.fontSize = 12;
        this.fontFamily = 'Verdana, sans-serif';
        this.fontStyle = undefined;
        this.fontWeight = undefined;
        this.color = 'rgba(70, 70, 70, 1)';
    }
    Label.prototype.getFont = function () {
        return getFont(this.fontSize, this.fontFamily, this.fontStyle, this.fontWeight);
    };
    return Label;
}());

var __extends$J = (undefined && undefined.__extends) || (function () {
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
var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$i = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$b = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$i(arguments[i]));
    return ar;
};
var __values$f = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/** Modes of matching user interactions to rendered nodes (e.g. hover or click) */
var SeriesNodePickMode;
(function (SeriesNodePickMode) {
    /** Pick matches based upon pick coordinates being inside a matching shape/marker. */
    SeriesNodePickMode[SeriesNodePickMode["EXACT_SHAPE_MATCH"] = 0] = "EXACT_SHAPE_MATCH";
    /** Pick matches by nearest category/X-axis value, then distance within that category/X-value. */
    SeriesNodePickMode[SeriesNodePickMode["NEAREST_BY_MAIN_AXIS_FIRST"] = 1] = "NEAREST_BY_MAIN_AXIS_FIRST";
    /** Pick matches by nearest category value, then distance within that category. */
    SeriesNodePickMode[SeriesNodePickMode["NEAREST_BY_MAIN_CATEGORY_AXIS_FIRST"] = 2] = "NEAREST_BY_MAIN_CATEGORY_AXIS_FIRST";
    /** Pick matches based upon distance to ideal position */
    SeriesNodePickMode[SeriesNodePickMode["NEAREST_NODE"] = 3] = "NEAREST_NODE";
})(SeriesNodePickMode || (SeriesNodePickMode = {}));
var SeriesItemHighlightStyle = /** @class */ (function () {
    function SeriesItemHighlightStyle() {
        this.fill = 'yellow';
        this.fillOpacity = undefined;
        this.stroke = undefined;
        this.strokeWidth = undefined;
    }
    return SeriesItemHighlightStyle;
}());
var SeriesHighlightStyle = /** @class */ (function () {
    function SeriesHighlightStyle() {
        this.strokeWidth = undefined;
        this.dimOpacity = undefined;
        this.enabled = undefined;
    }
    return SeriesHighlightStyle;
}());
var HighlightStyle = /** @class */ (function () {
    function HighlightStyle() {
        /**
         * @deprecated Use item.fill instead.
         */
        this.fill = undefined;
        /**
         * @deprecated Use item.stroke instead.
         */
        this.stroke = undefined;
        /**
         * @deprecated Use item.strokeWidth instead.
         */
        this.strokeWidth = undefined;
        this.item = new SeriesItemHighlightStyle();
        this.series = new SeriesHighlightStyle();
    }
    __decorate$a([
        Deprecated('Use item.fill instead.')
    ], HighlightStyle.prototype, "fill", void 0);
    __decorate$a([
        Deprecated('Use item.stroke instead.')
    ], HighlightStyle.prototype, "stroke", void 0);
    __decorate$a([
        Deprecated('Use item.strokeWidth instead.')
    ], HighlightStyle.prototype, "strokeWidth", void 0);
    return HighlightStyle;
}());
var SeriesTooltip = /** @class */ (function () {
    function SeriesTooltip() {
        this.enabled = true;
    }
    return SeriesTooltip;
}());
var Series = /** @class */ (function (_super) {
    __extends$J(Series, _super);
    function Series(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.seriesGroupUsesLayer, seriesGroupUsesLayer = _c === void 0 ? true : _c, _d = _b.pickModes, pickModes = _d === void 0 ? [SeriesNodePickMode.NEAREST_BY_MAIN_AXIS_FIRST] : _d;
        var _this = _super.call(this) || this;
        _this.id = createId(_this);
        // The group node that contains all the nodes used to render this series.
        _this.group = new Group();
        _this.directions = [ChartAxisDirection.X, ChartAxisDirection.Y];
        _this.directionKeys = {};
        // Flag to determine if we should recalculate node data.
        _this.nodeDataRefresh = true;
        _this.label = new Label();
        _this._data = undefined;
        _this._visible = true;
        _this.showInLegend = true;
        _this.cursor = 'default';
        _this.highlightStyle = new HighlightStyle();
        var group = _this.group;
        _this.seriesGroup = group.appendChild(new Group({
            name: _this.id + "-series",
            layer: seriesGroupUsesLayer,
            zIndex: Layers.SERIES_LAYER_ZINDEX,
        }));
        _this.pickGroup = _this.seriesGroup.appendChild(new Group());
        _this.highlightGroup = group.appendChild(new Group({
            name: _this.id + "-highlight",
            layer: true,
            zIndex: Layers.SERIES_LAYER_ZINDEX,
            optimiseDirtyTracking: true,
        }));
        _this.highlightNode = _this.highlightGroup.appendChild(new Group());
        _this.highlightLabel = _this.highlightGroup.appendChild(new Group());
        _this.highlightNode.zIndex = 0;
        _this.highlightLabel.zIndex = 10;
        _this.pickModes = pickModes;
        return _this;
    }
    Object.defineProperty(Series.prototype, "type", {
        get: function () {
            return this.constructor.type || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (input) {
            this._data = input;
            this.nodeDataRefresh = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
            this.visibleChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "grouped", {
        set: function (g) {
            if (g === true) {
                throw new Error("AG Charts - grouped: true is unsupported for series of type: " + this.type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Series.prototype.setColors = function (_fills, _strokes) {
        // Override point for subclasses.
    };
    // Returns the actual keys used (to fetch the values from `data` items) for the given direction.
    Series.prototype.getKeys = function (direction) {
        var _this = this;
        var directionKeys = this.directionKeys;
        var keys = directionKeys && directionKeys[direction];
        var values = [];
        if (keys) {
            keys.forEach(function (key) {
                var value = _this[key];
                if (value) {
                    if (Array.isArray(value)) {
                        values.push.apply(values, __spread$b(value));
                    }
                    else {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    };
    // Indicate that something external changed and we should recalculate nodeData.
    Series.prototype.markNodeDataDirty = function () {
        this.nodeDataRefresh = true;
    };
    Series.prototype.visibleChanged = function () {
        // Override point for this.visible change post-processing.
    };
    Series.prototype.getOpacity = function (datum) {
        var _a = this.highlightStyle.series, _b = _a.dimOpacity, dimOpacity = _b === void 0 ? 1 : _b, _c = _a.enabled, enabled = _c === void 0 ? true : _c;
        var defaultOpacity = 1;
        if (enabled === false || dimOpacity === defaultOpacity) {
            return defaultOpacity;
        }
        switch (this.isItemIdHighlighted(datum)) {
            case 'no-highlight':
            case 'highlighted':
                return defaultOpacity;
            case 'peer-highlighted':
            case 'other-highlighted':
                return dimOpacity;
        }
    };
    Series.prototype.getStrokeWidth = function (defaultStrokeWidth, datum) {
        var _a = this.highlightStyle.series, strokeWidth = _a.strokeWidth, _b = _a.enabled, enabled = _b === void 0 ? true : _b;
        if (enabled === false || strokeWidth === undefined) {
            // No change in styling for highlight cases.
            return defaultStrokeWidth;
        }
        switch (this.isItemIdHighlighted(datum)) {
            case 'highlighted':
                return strokeWidth;
            case 'no-highlight':
            case 'other-highlighted':
            case 'peer-highlighted':
                return defaultStrokeWidth;
        }
    };
    Series.prototype.isItemIdHighlighted = function (datum) {
        var _a = this.chart, _b = _a === void 0 ? {} : _a, _c = _b.highlightedDatum, _d = _c === void 0 ? {} : _c, _e = _d.series, series = _e === void 0 ? undefined : _e, _f = _d.itemId, itemId = _f === void 0 ? undefined : _f, _g = _b.highlightedDatum, highlightedDatum = _g === void 0 ? undefined : _g;
        var highlighting = series != null;
        if (!highlighting) {
            // Highlighting not active.
            return 'no-highlight';
        }
        if (series !== this) {
            // Highlighting active, this series not highlighted.
            return 'other-highlighted';
        }
        if (itemId === undefined) {
            // Series doesn't use itemIds - so no further refinement needed, series is highlighted.
            return 'highlighted';
        }
        if (datum && highlightedDatum !== datum && itemId !== datum.itemId) {
            // A peer (in same Series instance) sub-series has highlight active, but this sub-series
            // does not.
            return 'peer-highlighted';
        }
        return 'highlighted';
    };
    Series.prototype.pickNode = function (point, limitPickModes) {
        var e_1, _a;
        var _b = this, pickModes = _b.pickModes, visible = _b.visible, group = _b.group;
        if (!visible || !group.visible) {
            return;
        }
        try {
            for (var pickModes_1 = __values$f(pickModes), pickModes_1_1 = pickModes_1.next(); !pickModes_1_1.done; pickModes_1_1 = pickModes_1.next()) {
                var pickMode = pickModes_1_1.value;
                if (limitPickModes && !limitPickModes.includes(pickMode)) {
                    continue;
                }
                var match = undefined;
                switch (pickMode) {
                    case SeriesNodePickMode.EXACT_SHAPE_MATCH:
                        match = this.pickNodeExactShape(point);
                        break;
                    case SeriesNodePickMode.NEAREST_BY_MAIN_AXIS_FIRST:
                    case SeriesNodePickMode.NEAREST_BY_MAIN_CATEGORY_AXIS_FIRST:
                        match = this.pickNodeMainAxisFirst(point, pickMode === SeriesNodePickMode.NEAREST_BY_MAIN_CATEGORY_AXIS_FIRST);
                        break;
                    case SeriesNodePickMode.NEAREST_NODE:
                        match = this.pickNodeClosestDatum(point);
                        break;
                }
                if (match) {
                    return { pickMode: pickMode, match: match.datum, distance: match.distance };
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pickModes_1_1 && !pickModes_1_1.done && (_a = pickModes_1.return)) _a.call(pickModes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Series.prototype.pickNodeExactShape = function (point) {
        var match = this.pickGroup.pickNode(point.x, point.y);
        if (match) {
            return {
                datum: match.datum,
                distance: 0,
            };
        }
    };
    Series.prototype.pickNodeClosestDatum = function (_point) {
        // Override point for sub-classes - but if this is invoked, the sub-class specified it wants
        // to use this feature.
        throw new Error('AG Charts - Series.pickNodeClosestDatum() not implemented');
    };
    Series.prototype.pickNodeMainAxisFirst = function (_point, _requireCategoryAxis) {
        // Override point for sub-classes - but if this is invoked, the sub-class specified it wants
        // to use this feature.
        throw new Error('AG Charts - Series.pickNodeMainAxisFirst() not implemented');
    };
    Series.prototype.fireNodeClickEvent = function (_event, _datum) {
        // Override point for subclasses.
    };
    Series.prototype.toggleSeriesItem = function (_itemId, enabled) {
        this.visible = enabled;
        this.nodeDataRefresh = true;
    };
    Series.prototype.fixNumericExtent = function (extent, axis) {
        if (extent === undefined) {
            // Don't return a range, there is no range.
            return [];
        }
        var _a = __read$i(extent, 2), min = _a[0], max = _a[1];
        min = +min;
        max = +max;
        if (min === 0 && max === 0) {
            // domain has zero length and the single valid value is 0. Use the default of [0, 1].
            return [0, 1];
        }
        if (min === Infinity && max === -Infinity) {
            // There's no data in the domain.
            return [];
        }
        if (min === Infinity) {
            min = 0;
        }
        if (max === -Infinity) {
            max = 0;
        }
        if (min === max) {
            // domain has zero length, there is only a single valid value in data
            if (axis instanceof TimeAxis) {
                // numbers in domain correspond to Unix timestamps
                // automatically expand domain by 1 in each direction
                min -= 1;
                max += 1;
            }
            else {
                var padding = Math.abs(min * 0.01);
                min -= padding;
                max += padding;
            }
        }
        if (!(isNumber(min) && isNumber(max))) {
            return [];
        }
        return [min, max];
    };
    Series.highlightedZIndex = 1000000000000;
    return Series;
}(Observable));

var __extends$I = (undefined && undefined.__extends) || (function () {
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
var Padding = /** @class */ (function (_super) {
    __extends$I(Padding, _super);
    function Padding(top, right, bottom, left) {
        if (top === void 0) { top = 0; }
        if (right === void 0) { right = top; }
        if (bottom === void 0) { bottom = top; }
        if (left === void 0) { left = right; }
        var _this = _super.call(this) || this;
        _this.top = top;
        _this.right = right;
        _this.bottom = bottom;
        _this.left = left;
        return _this;
    }
    Padding.prototype.clear = function () {
        this.top = this.right = this.bottom = this.left = 0;
    };
    return Padding;
}(Observable));

var Gradient = /** @class */ (function () {
    function Gradient() {
        this.stops = [];
    }
    return Gradient;
}());

var __extends$H = (undefined && undefined.__extends) || (function () {
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
var LinearGradient = /** @class */ (function (_super) {
    __extends$H(LinearGradient, _super);
    function LinearGradient() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.angle = 0;
        return _this;
    }
    LinearGradient.prototype.createGradient = function (ctx, bbox) {
        var stops = this.stops;
        var radians = ((this.angle % 360) * Math.PI) / 180;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var w = bbox.width;
        var h = bbox.height;
        var cx = bbox.x + w * 0.5;
        var cy = bbox.y + h * 0.5;
        if (w > 0 && h > 0) {
            var l = (Math.sqrt(h * h + w * w) * Math.abs(Math.cos(radians - Math.atan(h / w)))) / 2;
            var gradient_1 = ctx.createLinearGradient(cx + cos * l, cy + sin * l, cx - cos * l, cy - sin * l);
            stops.forEach(function (stop) {
                gradient_1.addColorStop(stop.offset, stop.color);
            });
            return gradient_1;
        }
        return 'black';
    };
    return LinearGradient;
}(Gradient));

var __extends$G = (undefined && undefined.__extends) || (function () {
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
var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RectSizing;
(function (RectSizing) {
    RectSizing[RectSizing["Content"] = 0] = "Content";
    RectSizing[RectSizing["Border"] = 1] = "Border";
})(RectSizing || (RectSizing = {}));
var Rect = /** @class */ (function (_super) {
    __extends$G(Rect, _super);
    function Rect() {
        var _this = _super.call(this, function (ctx) { return _this.renderRect(ctx); }) || this;
        _this.borderPath = new Path2D();
        _this.x = 0;
        _this.y = 0;
        _this.width = 10;
        _this.height = 10;
        _this.radius = 0;
        /**
         * If `true`, the rect is aligned to the pixel grid for crisp looking lines.
         * Animated rects may not look nice with this option enabled, for example
         * when a rect is translated by a sub-pixel value on each frame.
         */
        _this.crisp = false;
        _this.gradient = false;
        _this.lastUpdatePathStrokeWidth = Shape.defaultStyles.strokeWidth;
        _this.effectiveStrokeWidth = Shape.defaultStyles.strokeWidth;
        return _this;
    }
    Rect.prototype.updateGradientInstance = function () {
        var fill = this.fill;
        if (this.gradient) {
            if (fill) {
                var gradient = new LinearGradient();
                gradient.angle = 270;
                gradient.stops = [
                    {
                        offset: 0,
                        color: Color.fromString(fill).brighter().toString(),
                    },
                    {
                        offset: 1,
                        color: Color.fromString(fill).darker().toString(),
                    },
                ];
                this.gradientInstance = gradient;
            }
        }
        else {
            this.gradientInstance = undefined;
        }
        this.gradientFill = fill;
    };
    Rect.prototype.isDirtyPath = function () {
        var _a;
        if (this.lastUpdatePathStrokeWidth !== this.strokeWidth) {
            return true;
        }
        if (this.path.isDirty() || this.borderPath.isDirty() || ((_a = this.clipPath) === null || _a === void 0 ? void 0 : _a.isDirty())) {
            return true;
        }
        return false;
    };
    Rect.prototype.updatePath = function () {
        var _a;
        var _b = this, path = _b.path, borderPath = _b.borderPath, crisp = _b.crisp;
        var _c = this, x = _c.x, y = _c.y, w = _c.width, h = _c.height, strokeWidth = _c.strokeWidth;
        path.clear({ trackChanges: true });
        borderPath.clear({ trackChanges: true });
        if (crisp) {
            // Order matters here, since we need unaligned x/y for w/h calculations.
            w = this.align(x, w);
            h = this.align(y, h);
            x = this.align(x);
            y = this.align(y);
        }
        if (strokeWidth) {
            if (strokeWidth < w && strokeWidth < h) {
                var halfStrokeWidth = strokeWidth / 2;
                x += halfStrokeWidth;
                y += halfStrokeWidth;
                w -= strokeWidth;
                h -= strokeWidth;
                // Clipping not needed in this case; fill to center of stroke.
                this.clipPath = undefined;
                path.rect(x, y, w, h);
            }
            else {
                // Skip the fill and just render the stroke.
                this.clipPath = (_a = this.clipPath, (_a !== null && _a !== void 0 ? _a : new Path2D()));
                this.clipPath.clear({ trackChanges: true });
                this.clipPath.rect(x, y, w, h);
            }
            borderPath.rect(x, y, w, h);
        }
        else {
            // No borderPath needed, and thus no clipPath needed either. Fill to full extent of
            // Rect.
            this.clipPath = undefined;
            path.rect(x, y, w, h);
        }
        this.effectiveStrokeWidth = strokeWidth;
        this.lastUpdatePathStrokeWidth = strokeWidth;
    };
    Rect.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    Rect.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return bbox.containsPoint(point.x, point.y);
    };
    Rect.prototype.renderRect = function (ctx) {
        var _a, _b;
        var _c = this, stroke = _c.stroke, effectiveStrokeWidth = _c.effectiveStrokeWidth, fill = _c.fill, path = _c.path, borderPath = _c.borderPath, clipPath = _c.clipPath, opacity = _c.opacity;
        var borderActive = !!stroke && !!effectiveStrokeWidth;
        if (fill) {
            var _d = this, gradientFill = _d.gradientFill, fillOpacity = _d.fillOpacity, fillShadow = _d.fillShadow;
            if (fill !== gradientFill) {
                this.updateGradientInstance();
            }
            var gradientInstance = this.gradientInstance;
            if (gradientInstance) {
                ctx.fillStyle = gradientInstance.createGradient(ctx, this.computeBBox());
            }
            else {
                ctx.fillStyle = fill;
            }
            ctx.globalAlpha = opacity * fillOpacity;
            // The canvas context scaling (depends on the device's pixel ratio)
            // has no effect on shadows, so we have to account for the pixel ratio
            // manually here.
            if (fillShadow && fillShadow.enabled) {
                var pixelRatio = (_b = (_a = this.scene) === null || _a === void 0 ? void 0 : _a.canvas.pixelRatio, (_b !== null && _b !== void 0 ? _b : 1));
                ctx.shadowColor = fillShadow.color;
                ctx.shadowOffsetX = fillShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = fillShadow.yOffset * pixelRatio;
                ctx.shadowBlur = fillShadow.blur * pixelRatio;
            }
            path.draw(ctx);
            ctx.fill();
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        }
        if (borderActive) {
            var _e = this, strokeOpacity = _e.strokeOpacity, lineDash = _e.lineDash, lineDashOffset = _e.lineDashOffset, lineCap = _e.lineCap, lineJoin = _e.lineJoin;
            if (clipPath) {
                // strokeWidth is larger than width or height, so use clipping to render correctly.
                // This is the simplest way to achieve the correct rendering due to nuances with ~0
                // width/height lines in Canvas operations.
                clipPath.draw(ctx);
                ctx.clip();
            }
            borderPath.draw(ctx);
            ctx.strokeStyle = stroke;
            ctx.globalAlpha = opacity * strokeOpacity;
            ctx.lineWidth = effectiveStrokeWidth;
            if (lineDash) {
                ctx.setLineDash(lineDash);
            }
            if (lineDashOffset) {
                ctx.lineDashOffset = lineDashOffset;
            }
            if (lineCap) {
                ctx.lineCap = lineCap;
            }
            if (lineJoin) {
                ctx.lineJoin = lineJoin;
            }
            ctx.stroke();
        }
    };
    Rect.className = 'Rect';
    __decorate$9([
        ScenePathChangeDetection()
    ], Rect.prototype, "x", void 0);
    __decorate$9([
        ScenePathChangeDetection()
    ], Rect.prototype, "y", void 0);
    __decorate$9([
        ScenePathChangeDetection()
    ], Rect.prototype, "width", void 0);
    __decorate$9([
        ScenePathChangeDetection()
    ], Rect.prototype, "height", void 0);
    __decorate$9([
        ScenePathChangeDetection()
    ], Rect.prototype, "radius", void 0);
    __decorate$9([
        ScenePathChangeDetection()
    ], Rect.prototype, "crisp", void 0);
    __decorate$9([
        ScenePathChangeDetection({ changeCb: function (r) { return r.updateGradientInstance(); } })
    ], Rect.prototype, "gradient", void 0);
    return Rect;
}(Path));

var __extends$F = (undefined && undefined.__extends) || (function () {
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
var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values$e = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Marker = /** @class */ (function (_super) {
    __extends$F(Marker, _super);
    function Marker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0;
        _this.y = 0;
        _this.size = 12;
        return _this;
    }
    Marker.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, size = _a.size;
        var half = size / 2;
        return new BBox(x - half, y - half, size, size);
    };
    Marker.prototype.applyPath = function (s, moves) {
        var e_1, _a;
        var path = this.path;
        var _b = this, x = _b.x, y = _b.y;
        path.clear();
        try {
            for (var moves_1 = __values$e(moves), moves_1_1 = moves_1.next(); !moves_1_1.done; moves_1_1 = moves_1.next()) {
                var _c = moves_1_1.value, mx = _c.x, my = _c.y, t = _c.t;
                x += mx * s;
                y += my * s;
                if (t === 'move') {
                    path.moveTo(x, y);
                }
                else {
                    path.lineTo(x, y);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (moves_1_1 && !moves_1_1.done && (_a = moves_1.return)) _a.call(moves_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        path.closePath();
    };
    __decorate$8([
        ScenePathChangeDetection()
    ], Marker.prototype, "x", void 0);
    __decorate$8([
        ScenePathChangeDetection()
    ], Marker.prototype, "y", void 0);
    __decorate$8([
        ScenePathChangeDetection({ convertor: Math.abs })
    ], Marker.prototype, "size", void 0);
    return Marker;
}(Path));

var __extends$E = (undefined && undefined.__extends) || (function () {
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
var Square = /** @class */ (function (_super) {
    __extends$E(Square, _super);
    function Square() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Square.prototype.updatePath = function () {
        var _a = this, path = _a.path, x = _a.x, y = _a.y;
        var hs = this.size / 2;
        path.clear();
        path.moveTo(this.align(x - hs), this.align(y - hs));
        path.lineTo(this.align(x + hs), this.align(y - hs));
        path.lineTo(this.align(x + hs), this.align(y + hs));
        path.lineTo(this.align(x - hs), this.align(y + hs));
        path.closePath();
    };
    Square.className = 'Square';
    return Square;
}(Marker));

var __extends$D = (undefined && undefined.__extends) || (function () {
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
var MarkerLabel = /** @class */ (function (_super) {
    __extends$D(MarkerLabel, _super);
    function MarkerLabel() {
        var _this = _super.call(this) || this;
        _this.label = new Text();
        _this._marker = new Square();
        _this._markerSize = 15;
        _this._spacing = 8;
        var label = _this.label;
        label.textBaseline = 'middle';
        label.fontSize = 12;
        label.fontFamily = 'Verdana, sans-serif';
        label.fill = 'black';
        // For better looking vertical alignment of labels to markers.
        label.y = HdpiCanvas.has.textMetrics ? 1 : 0;
        _this.append([_this.marker, label]);
        _this.update();
        return _this;
    }
    Object.defineProperty(MarkerLabel.prototype, "text", {
        get: function () {
            return this.label.text;
        },
        set: function (value) {
            this.label.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontStyle", {
        get: function () {
            return this.label.fontStyle;
        },
        set: function (value) {
            this.label.fontStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontWeight", {
        get: function () {
            return this.label.fontWeight;
        },
        set: function (value) {
            this.label.fontWeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontSize", {
        get: function () {
            return this.label.fontSize;
        },
        set: function (value) {
            this.label.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontFamily", {
        get: function () {
            return this.label.fontFamily;
        },
        set: function (value) {
            this.label.fontFamily = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "color", {
        get: function () {
            return this.label.fill;
        },
        set: function (value) {
            this.label.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "marker", {
        get: function () {
            return this._marker;
        },
        set: function (value) {
            if (this._marker !== value) {
                this.removeChild(this._marker);
                this._marker = value;
                this.appendChild(value);
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerSize", {
        get: function () {
            return this._markerSize;
        },
        set: function (value) {
            if (this._markerSize !== value) {
                this._markerSize = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerFill", {
        get: function () {
            return this.marker.fill;
        },
        set: function (value) {
            this.marker.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStroke", {
        get: function () {
            return this.marker.stroke;
        },
        set: function (value) {
            this.marker.stroke = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStrokeWidth", {
        get: function () {
            return this.marker.strokeWidth;
        },
        set: function (value) {
            this.marker.strokeWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerFillOpacity", {
        get: function () {
            return this.marker.fillOpacity;
        },
        set: function (value) {
            this.marker.fillOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStrokeOpacity", {
        get: function () {
            return this.marker.strokeOpacity;
        },
        set: function (value) {
            this.marker.strokeOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "spacing", {
        get: function () {
            return this._spacing;
        },
        set: function (value) {
            if (this._spacing !== value) {
                this._spacing = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    MarkerLabel.prototype.update = function () {
        var marker = this.marker;
        var markerSize = this.markerSize;
        marker.size = markerSize;
        this.label.x = markerSize / 2 + this.spacing;
    };
    MarkerLabel.prototype.render = function (renderCtx) {
        // Cannot override field Group.opacity with get/set pair, so
        // propagate opacity changes here.
        this.marker.opacity = this.opacity;
        this.label.opacity = this.opacity;
        _super.prototype.render.call(this, renderCtx);
    };
    MarkerLabel.className = 'MarkerLabel';
    return MarkerLabel;
}(Group));

var __extends$C = (undefined && undefined.__extends) || (function () {
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
var Circle = /** @class */ (function (_super) {
    __extends$C(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype.updatePath = function () {
        var _a = this, x = _a.x, y = _a.y, path = _a.path, size = _a.size;
        var r = size / 2;
        path.clear();
        path.cubicArc(x, y, r, r, 0, 0, Math.PI * 2, 0);
        path.closePath();
    };
    Circle.className = 'Circle';
    return Circle;
}(Marker));

var __extends$B = (undefined && undefined.__extends) || (function () {
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
var Cross = /** @class */ (function (_super) {
    __extends$B(Cross, _super);
    function Cross() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cross.prototype.updatePath = function () {
        var s = this.size / 4.2;
        _super.prototype.applyPath.call(this, s, Cross.moves);
    };
    Cross.className = 'Cross';
    Cross.moves = [
        { x: -1, y: 0, t: 'move' },
        { x: -1, y: -1 },
        { x: +1, y: -1 },
        { x: +1, y: +1 },
        { x: +1, y: -1 },
        { x: +1, y: +1 },
        { x: -1, y: +1 },
        { x: +1, y: +1 },
        { x: -1, y: +1 },
        { x: -1, y: -1 },
        { x: -1, y: +1 },
        { x: -1, y: -1 },
    ];
    return Cross;
}(Marker));

var __extends$A = (undefined && undefined.__extends) || (function () {
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
var Diamond = /** @class */ (function (_super) {
    __extends$A(Diamond, _super);
    function Diamond() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Diamond.prototype.updatePath = function () {
        var s = this.size / 2;
        _super.prototype.applyPath.call(this, s, Diamond.moves);
    };
    Diamond.className = 'Diamond';
    Diamond.moves = [
        { x: 0, y: -1, t: 'move' },
        { x: +1, y: +1 },
        { x: -1, y: +1 },
        { x: -1, y: -1 },
        { x: +1, y: -1 },
    ];
    return Diamond;
}(Marker));

var __extends$z = (undefined && undefined.__extends) || (function () {
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
var Heart = /** @class */ (function (_super) {
    __extends$z(Heart, _super);
    function Heart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Heart.prototype.rad = function (degree) {
        return (degree / 180) * Math.PI;
    };
    Heart.prototype.updatePath = function () {
        var _a = this, x = _a.x, path = _a.path, size = _a.size, rad = _a.rad;
        var r = size / 4;
        var y = this.y + r / 2;
        path.clear();
        path.cubicArc(x - r, y - r, r, r, 0, rad(130), rad(330), 0);
        path.cubicArc(x + r, y - r, r, r, 0, rad(220), rad(50), 0);
        path.lineTo(x, y + r);
        path.closePath();
    };
    Heart.className = 'Heart';
    return Heart;
}(Marker));

var __extends$y = (undefined && undefined.__extends) || (function () {
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
var Plus = /** @class */ (function (_super) {
    __extends$y(Plus, _super);
    function Plus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Plus.prototype.updatePath = function () {
        var s = this.size / 3;
        _super.prototype.applyPath.call(this, s, Plus.moves);
    };
    Plus.className = 'Plus';
    Plus.moves = [
        { x: -0.5, y: -0.5, t: 'move' },
        { x: 0, y: -1 },
        { x: +1, y: 0 },
        { x: 0, y: +1 },
        { x: +1, y: 0 },
        { x: 0, y: +1 },
        { x: -1, y: 0 },
        { x: 0, y: +1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ];
    return Plus;
}(Marker));

var __extends$x = (undefined && undefined.__extends) || (function () {
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
var Triangle = /** @class */ (function (_super) {
    __extends$x(Triangle, _super);
    function Triangle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Triangle.prototype.updatePath = function () {
        var s = this.size * 1.1;
        _super.prototype.applyPath.call(this, s, Triangle.moves);
    };
    Triangle.className = 'Triangle';
    Triangle.moves = [
        { x: 0, y: -0.48, t: 'move' },
        { x: 0.5, y: 0.87 },
        { x: -1, y: 0 },
    ];
    return Triangle;
}(Marker));

// This function is in its own file because putting it into SeriesMarker makes the Legend
// suddenly aware of the series (it's an agnostic component), and putting it into Marker
// introduces circular dependencies.
function getMarker(shape) {
    if (shape === void 0) { shape = Square; }
    if (typeof shape === 'string') {
        switch (shape) {
            case 'circle':
                return Circle;
            case 'cross':
                return Cross;
            case 'diamond':
                return Diamond;
            case 'heart':
                return Heart;
            case 'plus':
                return Plus;
            case 'triangle':
                return Triangle;
            default:
                return Square;
        }
    }
    if (typeof shape === 'function') {
        return shape;
    }
    return Square;
}

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$h = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$a = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$h(arguments[i]));
    return ar;
};
var __values$d = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var LegendOrientation;
(function (LegendOrientation) {
    LegendOrientation[LegendOrientation["Vertical"] = 0] = "Vertical";
    LegendOrientation[LegendOrientation["Horizontal"] = 1] = "Horizontal";
})(LegendOrientation || (LegendOrientation = {}));
var LegendPosition;
(function (LegendPosition) {
    LegendPosition["Top"] = "top";
    LegendPosition["Right"] = "right";
    LegendPosition["Bottom"] = "bottom";
    LegendPosition["Left"] = "left";
})(LegendPosition || (LegendPosition = {}));
var LegendLabel = /** @class */ (function () {
    function LegendLabel() {
        this.maxLength = undefined;
        this.color = 'black';
        this.fontStyle = undefined;
        this.fontWeight = undefined;
        this.fontSize = 12;
        this.fontFamily = 'Verdana, sans-serif';
        this.formatter = undefined;
    }
    LegendLabel.prototype.getFont = function () {
        return getFont(this.fontSize, this.fontFamily, this.fontStyle, this.fontWeight);
    };
    return LegendLabel;
}());
var LegendMarker = /** @class */ (function () {
    function LegendMarker() {
        this.size = 15;
        /**
         * If the marker type is set, the legend will always use that marker type for all its items,
         * regardless of the type that comes from the `data`.
         */
        this._shape = undefined;
        /**
         * Padding between the marker and the label within each legend item.
         */
        this.padding = 8;
        this.strokeWidth = 1;
    }
    Object.defineProperty(LegendMarker.prototype, "shape", {
        get: function () {
            return this._shape;
        },
        set: function (value) {
            var _a;
            this._shape = value;
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.onMarkerShapeChange();
        },
        enumerable: true,
        configurable: true
    });
    return LegendMarker;
}());
var LegendItem = /** @class */ (function () {
    function LegendItem() {
        this.marker = new LegendMarker();
        this.label = new LegendLabel();
        /** Used to constrain the width of legend items. */
        this.maxWidth = undefined;
        /**
         * The legend uses grid layout for its items, occupying as few columns as possible when positioned to left or right,
         * and as few rows as possible when positioned to top or bottom. This config specifies the amount of horizontal
         * padding between legend items.
         */
        this.paddingX = 16;
        /**
         * The legend uses grid layout for its items, occupying as few columns as possible when positioned to left or right,
         * and as few rows as possible when positioned to top or bottom. This config specifies the amount of vertical
         * padding between legend items.
         */
        this.paddingY = 8;
    }
    return LegendItem;
}());
var NO_OP_LISTENER = function () {
    // Default listener that does nothing.
};
var LegendListeners = /** @class */ (function () {
    function LegendListeners() {
        this.legendItemClick = NO_OP_LISTENER;
    }
    return LegendListeners;
}());
var Legend = /** @class */ (function () {
    function Legend() {
        this.id = createId(this);
        this.group = new Group({ name: 'legend', layer: true, zIndex: Layers.LEGEND_ZINDEX });
        this.itemSelection = Selection.select(this.group).selectAll();
        this.oldSize = [0, 0];
        this.item = new LegendItem();
        this.listeners = new LegendListeners();
        this.truncatedItems = new Set();
        this._data = [];
        this._enabled = true;
        this.orientation = LegendOrientation.Vertical;
        this._position = LegendPosition.Right;
        /** Reverse the display order of legend items if `true`. */
        this.reverseOrder = undefined;
        /**
         * Spacing between the legend and the edge of the chart's element.
         */
        this.spacing = 20;
        this.characterWidths = new Map();
        this.size = [0, 0];
        this.item.marker.parent = this;
    }
    Object.defineProperty(Legend.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
            this.group.visible = value.length > 0 && this.enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Legend.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
            this.group.visible = value && this.data.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Legend.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
            switch (value) {
                case 'right':
                case 'left':
                    this.orientation = LegendOrientation.Vertical;
                    break;
                case 'bottom':
                case 'top':
                    this.orientation = LegendOrientation.Horizontal;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Legend.prototype.onMarkerShapeChange = function () {
        this.itemSelection = this.itemSelection.setData([]);
        this.itemSelection.exit.remove();
        this.group.markDirty(this.group, RedrawType.MINOR);
    };
    Legend.prototype.getCharacterWidths = function (font) {
        var characterWidths = this.characterWidths;
        if (characterWidths.has(font)) {
            return characterWidths.get(font);
        }
        var cw = {
            '...': HdpiCanvas.getTextSize('...', font).width,
        };
        characterWidths.set(font, cw);
        return cw;
    };
    /**
     * The method is given the desired size of the legend, which only serves as a hint.
     * The vertically oriented legend will take as much horizontal space as needed, but will
     * respect the height constraints, and the horizontal legend will take as much vertical
     * space as needed in an attempt not to exceed the given width.
     * After the layout is done, the {@link size} will contain the actual size of the legend.
     * If the actual size is not the same as the previous actual size, the legend will fire
     * the 'layoutChange' event to communicate that another layout is needed, and the above
     * process should be repeated.
     * @param width
     * @param height
     */
    Legend.prototype.performLayout = function (width, height) {
        var _this = this;
        var _a = this.item, paddingX = _a.paddingX, paddingY = _a.paddingY, label = _a.label, maxWidth = _a.maxWidth, _b = _a.marker, markerSize = _b.size, markerPadding = _b.padding, markerShape = _b.shape, _c = _a.label, _d = _c.maxLength, maxLength = _d === void 0 ? Infinity : _d, fontStyle = _c.fontStyle, fontWeight = _c.fontWeight, fontSize = _c.fontSize, fontFamily = _c.fontFamily;
        var data = __spread$a(this.data);
        if (this.reverseOrder) {
            data.reverse();
        }
        var updateSelection = this.itemSelection.setData(data, function (_, datum) {
            var Marker = getMarker(markerShape || datum.marker.shape);
            return datum.id + '-' + datum.itemId + '-' + Marker.name;
        });
        updateSelection.exit.remove();
        var enterSelection = updateSelection.enter.append(MarkerLabel).each(function (node, datum) {
            var Marker = getMarker(markerShape || datum.marker.shape);
            node.marker = new Marker();
        });
        var itemSelection = (this.itemSelection = updateSelection.merge(enterSelection));
        var itemCount = itemSelection.size;
        // Update properties that affect the size of the legend items and measure them.
        var bboxes = [];
        var font = label.getFont();
        var ellipsis = "...";
        var itemMaxWidthPercentage = 0.8;
        var maxItemWidth = (maxWidth !== null && maxWidth !== void 0 ? maxWidth : width * itemMaxWidthPercentage);
        itemSelection.each(function (markerLabel, datum) {
            var e_1, _a;
            var _b;
            var text = (_b = datum.label.text, (_b !== null && _b !== void 0 ? _b : '<unknown>'));
            markerLabel.markerSize = markerSize;
            markerLabel.spacing = markerPadding;
            markerLabel.fontStyle = fontStyle;
            markerLabel.fontWeight = fontWeight;
            markerLabel.fontSize = fontSize;
            markerLabel.fontFamily = fontFamily;
            var textChars = text.split('');
            var addEllipsis = false;
            if (text.length > maxLength) {
                text = "" + text.substring(0, maxLength);
                addEllipsis = true;
            }
            var labelWidth = markerSize + markerPadding + HdpiCanvas.getTextSize(text, font).width;
            if (labelWidth > maxItemWidth) {
                var truncatedText = '';
                var characterWidths = _this.getCharacterWidths(font);
                var cumCharSize = characterWidths[ellipsis];
                try {
                    for (var textChars_1 = __values$d(textChars), textChars_1_1 = textChars_1.next(); !textChars_1_1.done; textChars_1_1 = textChars_1.next()) {
                        var char = textChars_1_1.value;
                        if (!characterWidths[char]) {
                            characterWidths[char] = HdpiCanvas.getTextSize(char, font).width;
                        }
                        cumCharSize += characterWidths[char];
                        if (cumCharSize > maxItemWidth) {
                            break;
                        }
                        truncatedText += char;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (textChars_1_1 && !textChars_1_1.done && (_a = textChars_1.return)) _a.call(textChars_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                text = truncatedText;
                addEllipsis = true;
            }
            var id = datum.itemId || datum.id;
            if (addEllipsis) {
                text += ellipsis;
                _this.truncatedItems.add(id);
            }
            else {
                _this.truncatedItems.delete(id);
            }
            markerLabel.text = text;
            bboxes.push(markerLabel.computeBBox());
        });
        var itemHeight = bboxes.length && bboxes[0].height;
        var rowCount = 0;
        var columnWidth = 0;
        var paddedItemsWidth = 0;
        var paddedItemsHeight = 0;
        width = Math.max(1, width);
        height = Math.max(1, height);
        switch (this.orientation) {
            case LegendOrientation.Horizontal:
                if (!(isFinite(width) && width > 0)) {
                    return false;
                }
                rowCount = 0;
                var columnCount = 0;
                // Split legend items into columns until the width is suitable.
                do {
                    var itemsWidth = 0;
                    columnCount = 0;
                    columnWidth = 0;
                    rowCount++;
                    var i = 0;
                    while (i < itemCount) {
                        var bbox = bboxes[i];
                        if (bbox.width > columnWidth) {
                            columnWidth = bbox.width;
                        }
                        i++;
                        if (i % rowCount === 0) {
                            itemsWidth += columnWidth;
                            columnWidth = 0;
                            columnCount++;
                        }
                    }
                    if (i % rowCount !== 0) {
                        itemsWidth += columnWidth;
                        columnCount++;
                    }
                    paddedItemsWidth = itemsWidth + (columnCount - 1) * paddingX;
                } while (paddedItemsWidth > width && columnCount > 1);
                paddedItemsHeight = itemHeight * rowCount + (rowCount - 1) * paddingY;
                break;
            case LegendOrientation.Vertical:
                if (!(isFinite(height) && height > 0)) {
                    return false;
                }
                rowCount = itemCount * 2;
                // Split legend items into columns until the height is suitable.
                do {
                    rowCount = (rowCount >> 1) + (rowCount % 2);
                    columnWidth = 0;
                    var itemsWidth = 0;
                    var itemsHeight = 0;
                    var columnCount_1 = 0;
                    var i = 0;
                    while (i < itemCount) {
                        var bbox = bboxes[i];
                        if (!columnCount_1) {
                            itemsHeight += bbox.height;
                        }
                        if (bbox.width > columnWidth) {
                            columnWidth = bbox.width;
                        }
                        i++;
                        if (i % rowCount === 0) {
                            itemsWidth += columnWidth;
                            columnWidth = 0;
                            columnCount_1++;
                        }
                    }
                    if (i % rowCount !== 0) {
                        itemsWidth += columnWidth;
                        columnCount_1++;
                    }
                    paddedItemsWidth = itemsWidth + (columnCount_1 - 1) * paddingX;
                    paddedItemsHeight = itemsHeight + (rowCount - 1) * paddingY;
                } while (paddedItemsHeight > height && rowCount > 1);
                break;
        }
        // Top-left corner of the first legend item.
        var startX = (width - paddedItemsWidth) / 2;
        var startY = (height - paddedItemsHeight) / 2;
        var x = 0;
        var y = 0;
        columnWidth = 0;
        // Position legend items using the layout computed above.
        itemSelection.each(function (markerLabel, _, i) {
            // Round off for pixel grid alignment to work properly.
            markerLabel.translationX = Math.floor(startX + x);
            markerLabel.translationY = Math.floor(startY + y);
            var bbox = bboxes[i];
            if (bbox.width > columnWidth) {
                columnWidth = bbox.width;
            }
            if ((i + 1) % rowCount === 0) {
                x += columnWidth + paddingX;
                y = 0;
                columnWidth = 0;
            }
            else {
                y += bbox.height + paddingY;
            }
        });
        // Update legend item properties that don't affect the layout.
        this.update();
        var size = this.size;
        var oldSize = this.oldSize;
        size[0] = paddedItemsWidth;
        size[1] = paddedItemsHeight;
        if (size[0] !== oldSize[0] || size[1] !== oldSize[1]) {
            oldSize[0] = size[0];
            oldSize[1] = size[1];
        }
    };
    Legend.prototype.update = function () {
        var _a = this.item, strokeWidth = _a.marker.strokeWidth, color = _a.label.color;
        this.itemSelection.each(function (markerLabel, datum) {
            var marker = datum.marker;
            markerLabel.markerFill = marker.fill;
            markerLabel.markerStroke = marker.stroke;
            markerLabel.markerStrokeWidth = strokeWidth;
            markerLabel.markerFillOpacity = marker.fillOpacity;
            markerLabel.markerStrokeOpacity = marker.strokeOpacity;
            markerLabel.opacity = datum.enabled ? 1 : 0.5;
            markerLabel.color = color;
        });
    };
    Legend.prototype.getDatumForPoint = function (x, y) {
        var node = this.group.pickNode(x, y);
        if (node && node.parent) {
            return node.parent.datum;
        }
    };
    Legend.className = 'Legend';
    __decorate$7([
        Validate(OPT_BOOLEAN)
    ], Legend.prototype, "reverseOrder", void 0);
    return Legend;
}());

var __values$c = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var SizeMonitor = /** @class */ (function () {
    function SizeMonitor() {
    }
    SizeMonitor.init = function () {
        var _this = this;
        var NativeResizeObserver = window.ResizeObserver;
        if (NativeResizeObserver) {
            this.resizeObserver = new NativeResizeObserver(function (entries) {
                var e_1, _a;
                try {
                    for (var entries_1 = __values$c(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                        var entry = entries_1_1.value;
                        var _b = entry.contentRect, width = _b.width, height = _b.height;
                        _this.checkSize(_this.elements.get(entry.target), entry.target, width, height);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        }
        else {
            // polyfill (more reliable even in browsers that support ResizeObserver)
            var step = function () {
                _this.elements.forEach(function (entry, element) {
                    _this.checkClientSize(element, entry);
                });
            };
            window.setInterval(step, 100);
        }
        this.ready = true;
    };
    SizeMonitor.checkSize = function (entry, element, width, height) {
        if (entry) {
            if (!entry.size || width !== entry.size.width || height !== entry.size.height) {
                entry.size = { width: width, height: height };
                entry.cb(entry.size, element);
            }
        }
    };
    // Only a single callback is supported.
    SizeMonitor.observe = function (element, cb) {
        if (!this.ready) {
            this.init();
        }
        this.unobserve(element);
        if (this.resizeObserver) {
            this.resizeObserver.observe(element);
        }
        this.elements.set(element, { cb: cb });
        // Ensure first size callback happens synchronously.
        this.checkClientSize(element, { cb: cb });
    };
    SizeMonitor.unobserve = function (element) {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(element);
        }
        this.elements.delete(element);
    };
    SizeMonitor.checkClientSize = function (element, entry) {
        var width = element.clientWidth ? element.clientWidth : 0;
        var height = element.clientHeight ? element.clientHeight : 0;
        this.checkSize(entry, element, width, height);
    };
    SizeMonitor.elements = new Map();
    SizeMonitor.ready = false;
    return SizeMonitor;
}());

function circleRectOverlap(cx, cy, r, x, y, w, h) {
    // Find closest horizontal and vertical edges.
    var edgeX = cx < x ? x : cx > x + w ? x + w : cx;
    var edgeY = cy < y ? y : cy > y + h ? y + h : cy;
    // Find distance to closest edges.
    var dx = cx - edgeX;
    var dy = cy - edgeY;
    var d = Math.sqrt(dx * dx + dy * dy);
    return d <= r;
}
function rectRectOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    var xOverlap = x1 + w1 > x2 && x1 < x2 + w2;
    var yOverlap = y1 + h1 > y2 && y1 < y2 + h2;
    return xOverlap && yOverlap;
}
function rectContainsRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    return r2x + r2w < r1x + r1w && r2x > r1x && r2y > r1y && r2y + r2h < r1y + r1h;
}
function isPointLabelDatum(x) {
    return x != null && typeof x.point === 'object' && typeof x.label === 'object';
}
/**
 * @param data Points and labels for one or more series. The order of series determines label placement precedence.
 * @param bounds Bounds to fit the labels into. If a label can't be fully contained, it doesn't fit.
 * @returns Placed labels for the given series (in the given order).
 */
function placeLabels(data, bounds, padding) {
    if (padding === void 0) { padding = 5; }
    var result = [];
    data = data.map(function (d) { return d.slice().sort(function (a, b) { return b.point.size - a.point.size; }); });
    for (var j = 0; j < data.length; j++) {
        var labels = (result[j] = []);
        var datum = data[j];
        if (!(datum && datum.length && datum[0].label)) {
            continue;
        }
        var _loop_1 = function (i, ln) {
            var d = datum[i];
            var l = d.label;
            var r = d.point.size * 0.5;
            var x = d.point.x - l.width * 0.5;
            var y = d.point.y - r - l.height - padding;
            var width = l.width, height = l.height;
            var withinBounds = !bounds || rectContainsRect(bounds.x, bounds.y, bounds.width, bounds.height, x, y, width, height);
            if (!withinBounds) {
                return "continue";
            }
            var overlapPoints = data.some(function (datum) {
                return datum.some(function (d) { return circleRectOverlap(d.point.x, d.point.y, d.point.size * 0.5, x, y, width, height); });
            });
            if (overlapPoints) {
                return "continue";
            }
            var overlapLabels = result.some(function (labels) {
                return labels.some(function (l) { return rectRectOverlap(l.x, l.y, l.width, l.height, x, y, width, height); });
            });
            if (overlapLabels) {
                return "continue";
            }
            labels.push({
                index: i,
                text: l.text,
                x: x,
                y: y,
                width: width,
                height: height,
                datum: d,
            });
        };
        for (var i = 0, ln = datum.length; i < ln; i++) {
            _loop_1(i, ln);
        }
    }
    return result;
}

/**
 * Wrap a function in debouncing trigger function. A requestAnimationFrame() is scheduled
 * after the first schedule() call, and subsequent schedule() calls will be ignored until the
 * animation callback executes.
 */
function debouncedAnimationFrame(cb) {
    return buildScheduler(function (cb) { return requestAnimationFrame(cb); }, cb);
}
function debouncedCallback(cb) {
    return buildScheduler(function (cb) { return setTimeout(cb, 0); }, cb);
}
function buildScheduler(scheduleFn, cb) {
    var scheduleCount = 0;
    return {
        schedule: function () {
            if (scheduleCount === 0) {
                scheduleFn(function () {
                    var count = scheduleCount;
                    scheduleCount = 0;
                    cb({ count: count });
                });
            }
            scheduleCount++;
        },
    };
}

var __extends$w = (undefined && undefined.__extends) || (function () {
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
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SeriesMarker = /** @class */ (function (_super) {
    __extends$w(SeriesMarker, _super);
    function SeriesMarker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        /**
         * One of the predefined marker names, or a marker constructor function (for user-defined markers).
         * A series will create one marker instance per data point.
         */
        _this.shape = Circle;
        _this.size = 6;
        /**
         * In case a series has the `sizeKey` set, the `sizeKey` values along with the `size` and `maxSize` configs
         * will be used to determine the size of the marker. All values will be mapped to a marker size
         * within the `[size, maxSize]` range, where the largest values will correspond to the `maxSize`
         * and the lowest to the `size`.
         */
        _this.maxSize = 30;
        _this.domain = undefined;
        _this.fill = undefined;
        _this.stroke = undefined;
        _this.strokeWidth = 1;
        _this.fillOpacity = undefined;
        _this.strokeOpacity = undefined;
        return _this;
    }
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "enabled", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "shape", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "size", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "maxSize", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "domain", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "fill", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "stroke", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "strokeWidth", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "fillOpacity", void 0);
    __decorate$6([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], SeriesMarker.prototype, "strokeOpacity", void 0);
    return SeriesMarker;
}(ChangeDetectable));

var __extends$v = (undefined && undefined.__extends) || (function () {
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
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$g = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$9 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$g(arguments[i]));
    return ar;
};
var __values$b = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var CartesianSeries = /** @class */ (function (_super) {
    __extends$v(CartesianSeries, _super);
    function CartesianSeries(opts) {
        var _a;
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, { seriesGroupUsesLayer: true, pickModes: opts.pickModes }) || this;
        _this.highlightSelection = Selection.select(_this.highlightNode).selectAll();
        _this.highlightLabelSelection = Selection.select(_this.highlightLabel).selectAll();
        _this.subGroups = [];
        _this.subGroupId = 0;
        /**
         * The assumption is that the values will be reset (to `true`)
         * in the {@link yKeys} setter.
         */
        _this.seriesItemEnabled = new Map();
        _this.directionKeys = (_a = {},
            _a[ChartAxisDirection.X] = ['xKey'],
            _a[ChartAxisDirection.Y] = ['yKey'],
            _a);
        var _b = opts.pickGroupIncludes, pickGroupIncludes = _b === void 0 ? ['datumNodes'] : _b, _c = opts.pathsPerSeries, pathsPerSeries = _c === void 0 ? 1 : _c, _d = opts.features, features = _d === void 0 ? [] : _d, _e = opts.pathsZIndexSubOrderOffset, pathsZIndexSubOrderOffset = _e === void 0 ? [] : _e;
        _this.opts = { pickGroupIncludes: pickGroupIncludes, pathsPerSeries: pathsPerSeries, features: features, pathsZIndexSubOrderOffset: pathsZIndexSubOrderOffset };
        return _this;
    }
    Object.defineProperty(CartesianSeries.prototype, "contextNodeData", {
        get: function () {
            var _a;
            return (_a = this._contextNodeData) === null || _a === void 0 ? void 0 : _a.slice();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Note: we are passing `isContinuousX` and `isContinuousY` into this method because it will
     *       typically be called inside a loop and this check only needs to happen once.
     * @param x A domain value to be plotted along the x-axis.
     * @param y A domain value to be plotted along the y-axis.
     * @param isContinuousX Typically this will be the value of `xAxis.scale instanceof ContinuousScale`.
     * @param isContinuousY Typically this will be the value of `yAxis.scale instanceof ContinuousScale`.
     * @returns `[x, y]`, if both x and y are valid domain values for their respective axes/scales, or `undefined`.
     */
    CartesianSeries.prototype.checkDomainXY = function (x, y, isContinuousX, isContinuousY) {
        var isValidDatum = ((isContinuousX && isContinuous(x)) || (!isContinuousX && isDiscrete(x))) &&
            ((isContinuousY && isContinuous(y)) || (!isContinuousY && isDiscrete(y)));
        return isValidDatum ? [x, y] : undefined;
    };
    /**
     * Note: we are passing the xAxis and yAxis because the calling code is supposed to make sure
     *       that series has both of them defined, and also to avoid one level of indirection,
     *       e.g. `this.xAxis!.inRange(x)`, both of which are suboptimal in tight loops where this method is used.
     * @param x A range value to be plotted along the x-axis.
     * @param y A range value to be plotted along the y-axis.
     * @param xAxis The series' x-axis.
     * @param yAxis The series' y-axis.
     * @returns
     */
    CartesianSeries.prototype.checkRangeXY = function (x, y, xAxis, yAxis) {
        return !isNaN(x) && !isNaN(y) && xAxis.inRange(x) && yAxis.inRange(y);
    };
    CartesianSeries.prototype.update = function () {
        var _a = this, seriesItemEnabled = _a.seriesItemEnabled, visible = _a.visible, _b = _a.chart, _c = (_b === void 0 ? {} : _b).highlightedDatum, _d = (_c === void 0 ? {} : _c).series, series = _d === void 0 ? undefined : _d;
        var seriesHighlighted = series ? series === this : undefined;
        var anySeriesItemEnabled = (visible && seriesItemEnabled.size === 0) || __spread$9(seriesItemEnabled.values()).some(function (v) { return v === true; });
        this.updateSelections(seriesHighlighted, anySeriesItemEnabled);
        this.updateNodes(seriesHighlighted, anySeriesItemEnabled);
    };
    CartesianSeries.prototype.updateSelections = function (seriesHighlighted, anySeriesItemEnabled) {
        var _this = this;
        this.updateHighlightSelection(seriesHighlighted);
        if (!anySeriesItemEnabled) {
            return;
        }
        if (!this.nodeDataRefresh && !this.isPathOrSelectionDirty()) {
            return;
        }
        if (this.nodeDataRefresh) {
            this.nodeDataRefresh = false;
            this._contextNodeData = this.createNodeData();
            this.updateSeriesGroups();
        }
        this.subGroups.forEach(function (subGroup, seriesIdx) {
            var datumSelection = subGroup.datumSelection, labelSelection = subGroup.labelSelection, markerSelection = subGroup.markerSelection, paths = subGroup.paths;
            var contextData = _this._contextNodeData[seriesIdx];
            var nodeData = contextData.nodeData, labelData = contextData.labelData, itemId = contextData.itemId;
            _this.updatePaths({ seriesHighlighted: seriesHighlighted, itemId: itemId, contextData: contextData, paths: paths, seriesIdx: seriesIdx });
            subGroup.datumSelection = _this.updateDatumSelection({ nodeData: nodeData, datumSelection: datumSelection, seriesIdx: seriesIdx });
            subGroup.labelSelection = _this.updateLabelSelection({ labelData: labelData, labelSelection: labelSelection, seriesIdx: seriesIdx });
            if (markerSelection) {
                subGroup.markerSelection = _this.updateMarkerSelection({ nodeData: nodeData, markerSelection: markerSelection, seriesIdx: seriesIdx });
            }
        });
    };
    CartesianSeries.prototype.updateSeriesGroups = function () {
        var _a;
        var _b = this, contextNodeData = _b._contextNodeData, seriesGroup = _b.seriesGroup, subGroups = _b.subGroups, _c = _b.opts, pickGroupIncludes = _c.pickGroupIncludes, pathsPerSeries = _c.pathsPerSeries, features = _c.features, pathsZIndexSubOrderOffset = _c.pathsZIndexSubOrderOffset;
        if (contextNodeData.length === subGroups.length) {
            return;
        }
        if (contextNodeData.length < subGroups.length) {
            subGroups.splice(contextNodeData.length).forEach(function (_a) {
                var e_1, _b;
                var group = _a.group, markerGroup = _a.markerGroup, paths = _a.paths;
                seriesGroup.removeChild(group);
                if (markerGroup) {
                    seriesGroup.removeChild(markerGroup);
                }
                if (!pickGroupIncludes.includes('mainPath')) {
                    try {
                        for (var paths_1 = __values$b(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
                            var path = paths_1_1.value;
                            seriesGroup.removeChild(path);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (paths_1_1 && !paths_1_1.done && (_b = paths_1.return)) _b.call(paths_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            });
        }
        while (contextNodeData.length > subGroups.length) {
            var layer = false;
            var subGroupId = this.subGroupId++;
            var group = new Group({
                name: this.id + "-series-sub" + subGroupId,
                layer: layer,
                zIndex: Layers.SERIES_LAYER_ZINDEX,
                zIndexSubOrder: [this.id, subGroupId],
            });
            var markerGroup = features.includes('markers')
                ? new Group({
                    name: this.id + "-series-sub" + this.subGroupId++ + "-markers",
                    layer: layer,
                    zIndex: Layers.SERIES_LAYER_ZINDEX,
                    zIndexSubOrder: [this.id, 10000 + subGroupId],
                })
                : undefined;
            var labelGroup = new Group({
                name: this.id + "-series-sub" + this.subGroupId++ + "-labels",
                layer: layer,
                zIndex: Layers.SERIES_LAYER_ZINDEX,
                zIndexSubOrder: [this.id, 20000 + subGroupId],
            });
            var pickGroup = new Group({
                name: this.id + "-series-sub" + this.subGroupId++ + "-pickGroup",
                zIndex: Layers.SERIES_LAYER_ZINDEX,
                zIndexSubOrder: [this.id, 10000 + subGroupId],
            });
            var pathParentGroup = pickGroupIncludes.includes('mainPath') ? pickGroup : seriesGroup;
            var datumParentGroup = pickGroupIncludes.includes('datumNodes') ? pickGroup : group;
            seriesGroup.appendChild(group);
            seriesGroup.appendChild(labelGroup);
            if (markerGroup) {
                seriesGroup.appendChild(markerGroup);
            }
            var paths = [];
            for (var index = 0; index < pathsPerSeries; index++) {
                paths[index] = new Path();
                paths[index].zIndex = Layers.SERIES_LAYER_ZINDEX;
                paths[index].zIndexSubOrder = [this.id, (_a = pathsZIndexSubOrderOffset[index], (_a !== null && _a !== void 0 ? _a : 0)) + subGroupId];
                pathParentGroup.appendChild(paths[index]);
            }
            group.appendChild(pickGroup);
            subGroups.push({
                paths: paths,
                group: group,
                pickGroup: pickGroup,
                markerGroup: markerGroup,
                labelGroup: labelGroup,
                labelSelection: Selection.select(labelGroup).selectAll(),
                datumSelection: Selection.select(datumParentGroup).selectAll(),
                markerSelection: markerGroup ? Selection.select(markerGroup).selectAll() : undefined,
            });
        }
    };
    CartesianSeries.prototype.updateNodes = function (seriesHighlighted, anySeriesItemEnabled) {
        var _this = this;
        var _a;
        var _b = this, highlightSelection = _b.highlightSelection, highlightLabelSelection = _b.highlightLabelSelection, contextNodeData = _b._contextNodeData, seriesItemEnabled = _b.seriesItemEnabled, features = _b.opts.features;
        var markersEnabled = features.includes('markers');
        var visible = this.visible && ((_a = this._contextNodeData) === null || _a === void 0 ? void 0 : _a.length) > 0 && anySeriesItemEnabled;
        this.group.visible = visible;
        this.seriesGroup.visible = visible;
        this.highlightGroup.visible = visible && !!seriesHighlighted;
        this.seriesGroup.opacity = this.getOpacity();
        if (markersEnabled) {
            this.updateMarkerNodes({ markerSelection: highlightSelection, isHighlight: true, seriesIdx: -1 });
        }
        else {
            this.updateDatumNodes({ datumSelection: highlightSelection, isHighlight: true, seriesIdx: -1 });
        }
        this.updateLabelNodes({ labelSelection: highlightLabelSelection, seriesIdx: -1 });
        this.subGroups.forEach(function (subGroup, seriesIdx) {
            var e_2, _a;
            var _b;
            var group = subGroup.group, markerGroup = subGroup.markerGroup, datumSelection = subGroup.datumSelection, labelSelection = subGroup.labelSelection, markerSelection = subGroup.markerSelection, paths = subGroup.paths;
            var itemId = contextNodeData[seriesIdx].itemId;
            group.opacity = _this.getOpacity({ itemId: itemId });
            group.visible = visible && (_b = seriesItemEnabled.get(itemId), (_b !== null && _b !== void 0 ? _b : true));
            if (markerGroup) {
                markerGroup.opacity = group.opacity;
                markerGroup.zIndex = group.zIndex >= Layers.SERIES_LAYER_ZINDEX ? group.zIndex : group.zIndex + 1;
                markerGroup.visible = group.visible;
            }
            try {
                for (var paths_2 = __values$b(paths), paths_2_1 = paths_2.next(); !paths_2_1.done; paths_2_1 = paths_2.next()) {
                    var path = paths_2_1.value;
                    path.opacity = group.opacity;
                    path.visible = group.visible;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (paths_2_1 && !paths_2_1.done && (_a = paths_2.return)) _a.call(paths_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (!group.visible) {
                return;
            }
            _this.updatePathNodes({ seriesHighlighted: seriesHighlighted, itemId: itemId, paths: paths, seriesIdx: seriesIdx });
            _this.updateDatumNodes({ datumSelection: datumSelection, isHighlight: false, seriesIdx: seriesIdx });
            _this.updateLabelNodes({ labelSelection: labelSelection, seriesIdx: seriesIdx });
            if (markersEnabled && markerSelection) {
                _this.updateMarkerNodes({ markerSelection: markerSelection, isHighlight: false, seriesIdx: seriesIdx });
            }
        });
    };
    CartesianSeries.prototype.updateHighlightSelection = function (seriesHighlighted) {
        var e_3, _a;
        var _b = this, _c = _b.chart, _d = _c === void 0 ? {} : _c, _e = _d.highlightedDatum, _f = (_e === void 0 ? {} : _e).datum, datum = _f === void 0 ? undefined : _f, _g = _d.highlightedDatum, highlightedDatum = _g === void 0 ? undefined : _g, highlightSelection = _b.highlightSelection, highlightLabelSelection = _b.highlightLabelSelection, contextNodeData = _b._contextNodeData;
        var item = seriesHighlighted && highlightedDatum && datum ? highlightedDatum : undefined;
        this.highlightSelection = this.updateHighlightSelectionItem({ item: item, highlightSelection: highlightSelection });
        var labelItem;
        if (this.label.enabled && item != null) {
            var _h = item.itemId, itemId_1 = _h === void 0 ? undefined : _h;
            try {
                for (var contextNodeData_1 = __values$b(contextNodeData), contextNodeData_1_1 = contextNodeData_1.next(); !contextNodeData_1_1.done; contextNodeData_1_1 = contextNodeData_1.next()) {
                    var labelData = contextNodeData_1_1.value.labelData;
                    labelItem = labelData.find(function (ld) { return ld.datum === item.datum && ld.itemId === itemId_1; });
                    if (labelItem != null) {
                        break;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (contextNodeData_1_1 && !contextNodeData_1_1.done && (_a = contextNodeData_1.return)) _a.call(contextNodeData_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        this.highlightLabelSelection = this.updateHighlightSelectionLabel({ item: labelItem, highlightLabelSelection: highlightLabelSelection });
    };
    CartesianSeries.prototype.pickNodeExactShape = function (point) {
        var e_4, _a;
        var _b;
        var result = _super.prototype.pickNodeExactShape.call(this, point);
        if (result) {
            return result;
        }
        var x = point.x, y = point.y;
        var pickGroupIncludes = this.opts.pickGroupIncludes;
        var markerGroupIncluded = pickGroupIncludes.includes('markers');
        try {
            for (var _c = __values$b(this.subGroups), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = _d.value, pickGroup = _e.pickGroup, markerGroup = _e.markerGroup;
                var match = pickGroup.pickNode(x, y);
                if (!match && markerGroupIncluded) {
                    match = (_b = markerGroup) === null || _b === void 0 ? void 0 : _b.pickNode(x, y);
                }
                if (match) {
                    return { datum: match.datum, distance: 0 };
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    CartesianSeries.prototype.pickNodeClosestDatum = function (point) {
        var e_5, _a, e_6, _b;
        var _c, _d, _e, _f;
        var x = point.x, y = point.y;
        var _g = this, xAxis = _g.xAxis, yAxis = _g.yAxis, group = _g.group, contextNodeData = _g._contextNodeData;
        var hitPoint = group.transformPoint(x, y);
        var minDistance = Infinity;
        var closestDatum;
        try {
            for (var contextNodeData_2 = __values$b(contextNodeData), contextNodeData_2_1 = contextNodeData_2.next(); !contextNodeData_2_1.done; contextNodeData_2_1 = contextNodeData_2.next()) {
                var context = contextNodeData_2_1.value;
                try {
                    for (var _h = (e_6 = void 0, __values$b(context.nodeData)), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var datum = _j.value;
                        var _k = datum.point, _l = _k === void 0 ? {} : _k, _m = _l.x, datumX = _m === void 0 ? NaN : _m, _o = _l.y, datumY = _o === void 0 ? NaN : _o;
                        var isInRange = ((_c = xAxis) === null || _c === void 0 ? void 0 : _c.inRange(datumX)) && ((_d = yAxis) === null || _d === void 0 ? void 0 : _d.inRange(datumY));
                        if (!isInRange) {
                            continue;
                        }
                        // No need to use Math.sqrt() since x < y implies Math.sqrt(x) < Math.sqrt(y) for
                        // values > 1
                        var distance = Math.max(Math.pow((hitPoint.x - datumX), 2) + Math.pow((hitPoint.y - datumY), 2), 0);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestDatum = datum;
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (contextNodeData_2_1 && !contextNodeData_2_1.done && (_a = contextNodeData_2.return)) _a.call(contextNodeData_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (closestDatum) {
            var distance = Math.max(Math.sqrt(minDistance) - (_f = (_e = closestDatum.point) === null || _e === void 0 ? void 0 : _e.size, (_f !== null && _f !== void 0 ? _f : 0)), 0);
            return { datum: closestDatum, distance: distance };
        }
    };
    CartesianSeries.prototype.pickNodeMainAxisFirst = function (point, requireCategoryAxis) {
        var e_7, _a, e_8, _b;
        var _c, _d, _e, _f;
        var x = point.x, y = point.y;
        var _g = this, xAxis = _g.xAxis, yAxis = _g.yAxis, group = _g.group, contextNodeData = _g._contextNodeData;
        // Prefer to start search with any available category axis.
        var directions = [xAxis, yAxis]
            .filter(function (a) { return a instanceof CategoryAxis; })
            .map(function (a) { return a.direction; });
        if (requireCategoryAxis && directions.length === 0) {
            return;
        }
        // Default to X-axis unless we found a suitable category axis.
        var _h = __read$g(directions, 1), _j = _h[0], primaryDirection = _j === void 0 ? ChartAxisDirection.X : _j;
        var hitPoint = group.transformPoint(x, y);
        var hitPointCoords = primaryDirection === ChartAxisDirection.X ? [hitPoint.x, hitPoint.y] : [hitPoint.y, hitPoint.x];
        var minDistance = [Infinity, Infinity];
        var closestDatum = undefined;
        try {
            for (var contextNodeData_3 = __values$b(contextNodeData), contextNodeData_3_1 = contextNodeData_3.next(); !contextNodeData_3_1.done; contextNodeData_3_1 = contextNodeData_3.next()) {
                var context = contextNodeData_3_1.value;
                try {
                    for (var _k = (e_8 = void 0, __values$b(context.nodeData)), _l = _k.next(); !_l.done; _l = _k.next()) {
                        var datum = _l.value;
                        var _m = datum.point, _o = _m === void 0 ? {} : _m, _p = _o.x, datumX = _p === void 0 ? NaN : _p, _q = _o.y, datumY = _q === void 0 ? NaN : _q;
                        var isInRange = ((_c = xAxis) === null || _c === void 0 ? void 0 : _c.inRange(datumX)) && ((_d = yAxis) === null || _d === void 0 ? void 0 : _d.inRange(datumY));
                        if (!isInRange) {
                            continue;
                        }
                        var point_1 = primaryDirection === ChartAxisDirection.X ? [datumX, datumY] : [datumY, datumX];
                        // Compare distances from most significant dimension to least.
                        var newMinDistance = true;
                        for (var i = 0; i < point_1.length; i++) {
                            var dist = Math.abs(point_1[i] - hitPointCoords[i]);
                            if (dist > minDistance[i]) {
                                newMinDistance = false;
                                break;
                            }
                            if (dist < minDistance[i]) {
                                minDistance[i] = dist;
                                minDistance.fill(Infinity, i + 1, minDistance.length);
                            }
                        }
                        if (newMinDistance) {
                            closestDatum = datum;
                        }
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_l && !_l.done && (_b = _k.return)) _b.call(_k);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (contextNodeData_3_1 && !contextNodeData_3_1.done && (_a = contextNodeData_3.return)) _a.call(contextNodeData_3);
            }
            finally { if (e_7) throw e_7.error; }
        }
        if (closestDatum) {
            var distance = Math.max(Math.sqrt(Math.pow(minDistance[0], 2) + Math.pow(minDistance[1], 2)) - (_f = (_e = closestDatum.point) === null || _e === void 0 ? void 0 : _e.size, (_f !== null && _f !== void 0 ? _f : 0)), 0);
            return { datum: closestDatum, distance: distance };
        }
    };
    CartesianSeries.prototype.toggleSeriesItem = function (itemId, enabled) {
        if (this.seriesItemEnabled.size > 0) {
            this.seriesItemEnabled.set(itemId, enabled);
            this.nodeDataRefresh = true;
        }
        else {
            _super.prototype.toggleSeriesItem.call(this, itemId, enabled);
        }
    };
    CartesianSeries.prototype.isPathOrSelectionDirty = function () {
        // Override point to allow more sophisticated dirty selection detection.
        return false;
    };
    CartesianSeries.prototype.getLabelData = function () {
        return [];
    };
    CartesianSeries.prototype.updatePaths = function (opts) {
        // Override point for sub-classes.
        opts.paths.forEach(function (p) { return (p.visible = false); });
    };
    CartesianSeries.prototype.updatePathNodes = function (_opts) {
        // Override point for sub-classes.
    };
    CartesianSeries.prototype.updateHighlightSelectionItem = function (opts) {
        var features = this.opts.features;
        var markersEnabled = features.includes('markers');
        var item = opts.item, highlightSelection = opts.highlightSelection;
        var nodeData = item ? [item] : [];
        if (markersEnabled) {
            var markerSelection = highlightSelection;
            return this.updateMarkerSelection({ nodeData: nodeData, markerSelection: markerSelection, seriesIdx: -1 });
        }
        else {
            return this.updateDatumSelection({ nodeData: nodeData, datumSelection: highlightSelection, seriesIdx: -1 });
        }
    };
    CartesianSeries.prototype.updateHighlightSelectionLabel = function (opts) {
        var item = opts.item, highlightLabelSelection = opts.highlightLabelSelection;
        var labelData = item ? [item] : [];
        return this.updateLabelSelection({ labelData: labelData, labelSelection: highlightLabelSelection, seriesIdx: -1 });
    };
    CartesianSeries.prototype.updateDatumSelection = function (opts) {
        // Override point for sub-classes.
        return opts.datumSelection;
    };
    CartesianSeries.prototype.updateDatumNodes = function (_opts) {
        // Override point for sub-classes.
    };
    CartesianSeries.prototype.updateMarkerSelection = function (opts) {
        // Override point for sub-classes.
        return opts.markerSelection;
    };
    CartesianSeries.prototype.updateMarkerNodes = function (_opts) {
        // Override point for sub-classes.
    };
    return CartesianSeries;
}(Series));
var CartesianSeriesMarker = /** @class */ (function (_super) {
    __extends$v(CartesianSeriesMarker, _super);
    function CartesianSeriesMarker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.formatter = undefined;
        return _this;
    }
    __decorate$5([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], CartesianSeriesMarker.prototype, "formatter", void 0);
    return CartesianSeriesMarker;
}(SeriesMarker));

var __extends$u = (undefined && undefined.__extends) || (function () {
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
var __assign$b = (undefined && undefined.__assign) || function () {
    __assign$b = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$b.apply(this, arguments);
};
var __values$a = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$f = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$8 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$f(arguments[i]));
    return ar;
};
var defaultTooltipCss = "\n.ag-chart-tooltip {\n    display: table;\n    position: absolute;\n    user-select: none;\n    pointer-events: none;\n    white-space: nowrap;\n    z-index: 99999;\n    font: 12px Verdana, sans-serif;\n    color: black;\n    background: rgb(244, 244, 244);\n    border-radius: 5px;\n    box-shadow: 0 0 1px rgba(3, 3, 3, 0.7), 0.5vh 0.5vh 1vh rgba(3, 3, 3, 0.25);\n}\n\n.ag-chart-tooltip-hidden {\n    top: -10000px !important;\n}\n\n.ag-chart-tooltip-title {\n    font-weight: bold;\n    padding: 7px;\n    border-top-left-radius: 5px;\n    border-top-right-radius: 5px;\n    color: white;\n    background-color: #888888;\n    border-top-left-radius: 5px;\n    border-top-right-radius: 5px;\n}\n\n.ag-chart-tooltip-content {\n    padding: 7px;\n    line-height: 1.7em;\n    border-bottom-left-radius: 5px;\n    border-bottom-right-radius: 5px;\n    overflow: hidden;\n}\n\n.ag-chart-tooltip-content:empty {\n    padding: 0;\n    height: 7px;\n}\n\n.ag-chart-tooltip-arrow::before {\n    content: \"\";\n\n    position: absolute;\n    top: 100%;\n    left: 50%;\n    transform: translateX(-50%);\n\n    border: 6px solid #989898;\n\n    border-left-color: transparent;\n    border-right-color: transparent;\n    border-top-color: #989898;\n    border-bottom-color: transparent;\n\n    width: 0;\n    height: 0;\n\n    margin: 0 auto;\n}\n\n.ag-chart-tooltip-arrow::after {\n    content: \"\";\n\n    position: absolute;\n    top: 100%;\n    left: 50%;\n    transform: translateX(-50%);\n\n    border: 5px solid black;\n\n    border-left-color: transparent;\n    border-right-color: transparent;\n    border-top-color: rgb(244, 244, 244);\n    border-bottom-color: transparent;\n\n    width: 0;\n    height: 0;\n\n    margin: 0 auto;\n}\n\n.ag-chart-wrapper {\n    box-sizing: border-box;\n    overflow: hidden;\n}\n";
function toTooltipHtml(input, defaults) {
    if (typeof input === 'string') {
        return input;
    }
    defaults = defaults || {};
    var _a = input.content, content = _a === void 0 ? defaults.content || '' : _a, _b = input.title, title = _b === void 0 ? defaults.title || undefined : _b, _c = input.color, color = _c === void 0 ? defaults.color || 'white' : _c, _d = input.backgroundColor, backgroundColor = _d === void 0 ? defaults.backgroundColor || '#888' : _d;
    var titleHtml = title
        ? "<div class=\"" + Chart.defaultTooltipClass + "-title\"\n        style=\"color: " + color + "; background-color: " + backgroundColor + "\">" + title + "</div>"
        : '';
    return titleHtml + "<div class=\"" + Chart.defaultTooltipClass + "-content\">" + content + "</div>";
}
var ChartTooltip = /** @class */ (function (_super) {
    __extends$u(ChartTooltip, _super);
    function ChartTooltip(chart, document) {
        var _this = _super.call(this) || this;
        _this.enabled = true;
        _this.class = Chart.defaultTooltipClass;
        _this.delay = 0;
        /**
         * If `true`, the tooltip will be shown for the marker closest to the mouse cursor.
         * Only has effect on series with markers.
         */
        _this.tracking = true;
        _this.showTimeout = 0;
        _this.constrained = false;
        _this.chart = chart;
        _this.class = '';
        var tooltipRoot = document.body;
        var element = document.createElement('div');
        _this.element = tooltipRoot.appendChild(element);
        // Detect when the chart becomes invisible and hide the tooltip as well.
        if (window.IntersectionObserver) {
            var target_1 = _this.chart.scene.canvas.element;
            var observer = new IntersectionObserver(function (entries) {
                var e_1, _a;
                try {
                    for (var entries_1 = __values$a(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                        var entry = entries_1_1.value;
                        if (entry.target === target_1 && entry.intersectionRatio === 0) {
                            _this.toggle(false);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }, { root: tooltipRoot });
            observer.observe(target_1);
            _this.observer = observer;
        }
        return _this;
    }
    ChartTooltip.prototype.destroy = function () {
        var parentNode = this.element.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.element);
        }
        if (this.observer) {
            this.observer.unobserve(this.chart.scene.canvas.element);
        }
    };
    ChartTooltip.prototype.isVisible = function () {
        var element = this.element;
        if (element.classList) {
            // if not IE11
            return !element.classList.contains(Chart.defaultTooltipClass + '-hidden');
        }
        // IE11 part.
        var classes = element.getAttribute('class');
        if (classes) {
            return classes.split(' ').indexOf(Chart.defaultTooltipClass + '-hidden') < 0;
        }
        return false;
    };
    ChartTooltip.prototype.updateClass = function (visible, constrained) {
        var classList = [Chart.defaultTooltipClass, this.class];
        if (visible !== true) {
            classList.push(Chart.defaultTooltipClass + "-hidden");
        }
        if (constrained !== true) {
            classList.push(Chart.defaultTooltipClass + "-arrow");
        }
        this.element.setAttribute('class', classList.join(' '));
    };
    /**
     * Shows tooltip at the given event's coordinates.
     * If the `html` parameter is missing, moves the existing tooltip to the new position.
     */
    ChartTooltip.prototype.show = function (meta, html, instantly) {
        var _this = this;
        if (instantly === void 0) { instantly = false; }
        var el = this.element;
        if (html !== undefined) {
            el.innerHTML = html;
        }
        else if (!el.innerHTML) {
            return;
        }
        var left = meta.pageX - el.clientWidth / 2;
        var top = meta.pageY - el.clientHeight - 8;
        this.constrained = false;
        if (this.chart.container) {
            var tooltipRect = el.getBoundingClientRect();
            var minLeft = 0;
            var maxLeft = window.innerWidth - tooltipRect.width - 1;
            if (left < minLeft) {
                left = minLeft;
                this.constrained = true;
                this.updateClass(true, this.constrained);
            }
            else if (left > maxLeft) {
                left = maxLeft;
                this.constrained = true;
                this.updateClass(true, this.constrained);
            }
            if (top < window.pageYOffset) {
                top = meta.pageY + 20;
                this.constrained = true;
                this.updateClass(true, this.constrained);
            }
        }
        el.style.left = Math.round(left) + "px";
        el.style.top = Math.round(top) + "px";
        if (this.delay > 0 && !instantly) {
            this.toggle(false);
            this.showTimeout = window.setTimeout(function () {
                _this.toggle(true);
            }, this.delay);
            return;
        }
        this.toggle(true);
    };
    ChartTooltip.prototype.toggle = function (visible) {
        if (!visible) {
            window.clearTimeout(this.showTimeout);
            if (this.chart.lastPick && !this.delay) {
                this.chart.changeHighlightDatum();
            }
        }
        this.updateClass(visible, this.constrained);
    };
    return ChartTooltip;
}(Observable));
/** Types of chart-update, in pipeline execution order. */
var ChartUpdateType;
(function (ChartUpdateType) {
    ChartUpdateType[ChartUpdateType["FULL"] = 0] = "FULL";
    ChartUpdateType[ChartUpdateType["PROCESS_DATA"] = 1] = "PROCESS_DATA";
    ChartUpdateType[ChartUpdateType["PERFORM_LAYOUT"] = 2] = "PERFORM_LAYOUT";
    ChartUpdateType[ChartUpdateType["SERIES_UPDATE"] = 3] = "SERIES_UPDATE";
    ChartUpdateType[ChartUpdateType["SCENE_RENDER"] = 4] = "SCENE_RENDER";
    ChartUpdateType[ChartUpdateType["NONE"] = 5] = "NONE";
})(ChartUpdateType || (ChartUpdateType = {}));
var Chart = /** @class */ (function (_super) {
    __extends$u(Chart, _super);
    function Chart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this) || this;
        _this.id = createId(_this);
        _this.background = new Rect();
        _this.legend = new Legend();
        _this.legendAutoPadding = new Padding();
        _this._debug = false;
        _this.extraDebugStats = {};
        _this._container = undefined;
        _this._data = [];
        _this._autoSize = false;
        _this.padding = new Padding(20);
        _this._title = undefined;
        _this._subtitle = undefined;
        _this._performUpdateType = ChartUpdateType.NONE;
        _this.firstRenderComplete = false;
        _this.firstResizeReceived = false;
        _this.seriesToUpdate = new Set();
        _this.performUpdateTrigger = debouncedCallback(function (_a) {
            var count = _a.count;
            try {
                _this.performUpdate(count);
            }
            catch (error) {
                _this._lastPerformUpdateError = error;
                console.error(error);
            }
        });
        _this._axes = [];
        _this._series = [];
        _this.legendBBox = new BBox(0, 0, 0, 0);
        _this._onMouseDown = _this.onMouseDown.bind(_this);
        _this._onMouseMove = _this.onMouseMove.bind(_this);
        _this._onMouseUp = _this.onMouseUp.bind(_this);
        _this._onMouseOut = _this.onMouseOut.bind(_this);
        _this._onClick = _this.onClick.bind(_this);
        _this.lastTooltipMeta = undefined;
        _this.handleTooltipTrigger = debouncedAnimationFrame(function () {
            _this.handleTooltip(_this.lastTooltipMeta);
            _this.lastTooltipMeta = undefined;
        });
        _this.pointerInsideLegend = false;
        _this.pointerOverLegendDatum = false;
        var root = new Group({ name: 'root' });
        var background = _this.background;
        background.fill = 'white';
        root.appendChild(background);
        var element = (_this.element = document.createElement('div'));
        element.setAttribute('class', 'ag-chart-wrapper');
        element.style.position = 'relative';
        _this.scene = new Scene({ document: document });
        _this.scene.debug.consoleLog = _this._debug;
        _this.scene.root = root;
        _this.scene.container = element;
        _this.autoSize = true;
        SizeMonitor.observe(_this.element, function (size) {
            var width = size.width, height = size.height;
            _this._lastAutoSize = [width, height];
            if (!_this.autoSize) {
                return;
            }
            if (width === _this.width && height === _this.height) {
                return;
            }
            _this.resize(width, height);
        });
        _this.tooltip = new ChartTooltip(_this, document);
        _this.tooltip.addPropertyListener('class', function () { return _this.tooltip.toggle(); });
        if (Chart.tooltipDocuments.indexOf(document) < 0) {
            var styleElement = document.createElement('style');
            styleElement.innerHTML = defaultTooltipCss;
            // Make sure the default tooltip style goes before other styles so it can be overridden.
            document.head.insertBefore(styleElement, document.head.querySelector('style'));
            Chart.tooltipDocuments.push(document);
        }
        _this.setupDomListeners(_this.scene.canvas.element);
        return _this;
    }
    Object.defineProperty(Chart.prototype, "debug", {
        get: function () {
            return this._debug;
        },
        set: function (value) {
            this._debug = value;
            this.scene.debug.consoleLog = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "container", {
        get: function () {
            return this._container;
        },
        set: function (value) {
            if (this._container !== value) {
                var parentNode = this.element.parentNode;
                if (parentNode != null) {
                    parentNode.removeChild(this.element);
                }
                if (value) {
                    value.appendChild(this.element);
                }
                this._container = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
            this.series.forEach(function (series) { return (series.data = data); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "width", {
        get: function () {
            return this.scene.width;
        },
        set: function (value) {
            this.autoSize = false;
            if (this.width !== value) {
                this.resize(value, this.height);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "height", {
        get: function () {
            return this.scene.height;
        },
        set: function (value) {
            this.autoSize = false;
            if (this.height !== value) {
                this.resize(this.width, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "autoSize", {
        get: function () {
            return this._autoSize;
        },
        set: function (value) {
            if (this._autoSize === value) {
                return;
            }
            this._autoSize = value;
            var style = this.element.style;
            if (value) {
                style.display = 'block';
                style.width = '100%';
                style.height = '100%';
                if (!this._lastAutoSize) {
                    return;
                }
                this.resize(this._lastAutoSize[0], this._lastAutoSize[1]);
            }
            else {
                style.display = 'inline-block';
                style.width = 'auto';
                style.height = 'auto';
            }
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.download = function (fileName) {
        this.scene.download(fileName);
    };
    Object.defineProperty(Chart.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (caption) {
            var _a, _b;
            var root = this.scene.root;
            if (this._title != null) {
                (_a = root) === null || _a === void 0 ? void 0 : _a.removeChild(this._title.node);
            }
            this._title = caption;
            if (this._title != null) {
                (_b = root) === null || _b === void 0 ? void 0 : _b.appendChild(this._title.node);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "subtitle", {
        get: function () {
            return this._subtitle;
        },
        set: function (caption) {
            var _a, _b;
            var root = this.scene.root;
            if (this._subtitle != null) {
                (_a = root) === null || _a === void 0 ? void 0 : _a.removeChild(this._subtitle.node);
            }
            this._subtitle = caption;
            if (this._subtitle != null) {
                (_b = root) === null || _b === void 0 ? void 0 : _b.appendChild(this._subtitle.node);
            }
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.destroy = function () {
        this._performUpdateType = ChartUpdateType.NONE;
        this.tooltip.destroy();
        SizeMonitor.unobserve(this.element);
        this.container = undefined;
        this.cleanupDomListeners(this.scene.canvas.element);
        this.scene.container = undefined;
    };
    Object.defineProperty(Chart.prototype, "performUpdateType", {
        get: function () {
            return this._performUpdateType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "updatePending", {
        get: function () {
            return this._performUpdateType !== ChartUpdateType.NONE || this.lastTooltipMeta != null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "lastPerformUpdateError", {
        get: function () {
            return this._lastPerformUpdateError;
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.update = function (type, opts) {
        var e_2, _a;
        if (type === void 0) { type = ChartUpdateType.FULL; }
        var _b = opts || {}, _c = _b.forceNodeDataRefresh, forceNodeDataRefresh = _c === void 0 ? false : _c, _d = _b.seriesToUpdate, seriesToUpdate = _d === void 0 ? this.series : _d;
        if (forceNodeDataRefresh) {
            this.series.forEach(function (series) { return series.markNodeDataDirty(); });
        }
        try {
            for (var seriesToUpdate_1 = __values$a(seriesToUpdate), seriesToUpdate_1_1 = seriesToUpdate_1.next(); !seriesToUpdate_1_1.done; seriesToUpdate_1_1 = seriesToUpdate_1.next()) {
                var series = seriesToUpdate_1_1.value;
                this.seriesToUpdate.add(series);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (seriesToUpdate_1_1 && !seriesToUpdate_1_1.done && (_a = seriesToUpdate_1.return)) _a.call(seriesToUpdate_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (type < this._performUpdateType) {
            this._performUpdateType = type;
            this.performUpdateTrigger.schedule();
        }
    };
    Chart.prototype.performUpdate = function (count) {
        var _a = this, performUpdateType = _a._performUpdateType, firstRenderComplete = _a.firstRenderComplete, firstResizeReceived = _a.firstResizeReceived, extraDebugStats = _a.extraDebugStats;
        var splits = [performance.now()];
        switch (performUpdateType) {
            case ChartUpdateType.FULL:
            case ChartUpdateType.PROCESS_DATA:
                this.processData();
                splits.push(performance.now());
                // Disable tooltip/highlight if the data fundamentally shifted.
                this.disableTooltip({ updateProcessing: false });
            // Fall-through to next pipeline stage.
            case ChartUpdateType.PERFORM_LAYOUT:
                if (!firstRenderComplete && !firstResizeReceived) {
                    if (this.debug) {
                        console.log({ firstRenderComplete: firstRenderComplete, firstResizeReceived: firstResizeReceived });
                    }
                    // Reschedule if canvas size hasn't been set yet to avoid a race.
                    this._performUpdateType = ChartUpdateType.PERFORM_LAYOUT;
                    this.performUpdateTrigger.schedule();
                    break;
                }
                this.performLayout();
                splits.push(performance.now());
            // Fall-through to next pipeline stage.
            case ChartUpdateType.SERIES_UPDATE:
                this.seriesToUpdate.forEach(function (series) {
                    series.update();
                });
                this.seriesToUpdate.clear();
                splits.push(performance.now());
            // Fall-through to next pipeline stage.
            case ChartUpdateType.SCENE_RENDER:
                this.scene.render({ debugSplitTimes: splits, extraDebugStats: extraDebugStats });
                this.firstRenderComplete = true;
                this.extraDebugStats = {};
            // Fall-through to next pipeline stage.
            case ChartUpdateType.NONE:
                // Do nothing.
                this._performUpdateType = ChartUpdateType.NONE;
        }
        var end = performance.now();
        if (this.debug) {
            console.log({
                chart: this,
                durationMs: Math.round((end - splits[0]) * 100) / 100,
                count: count,
                performUpdateType: ChartUpdateType[performUpdateType],
            });
        }
    };
    Object.defineProperty(Chart.prototype, "axes", {
        get: function () {
            return this._axes;
        },
        set: function (values) {
            var _this = this;
            this._axes.forEach(function (axis) { return _this.detachAxis(axis); });
            // make linked axes go after the regular ones (simulates stable sort by `linkedTo` property)
            this._axes = values.filter(function (a) { return !a.linkedTo; }).concat(values.filter(function (a) { return a.linkedTo; }));
            this._axes.forEach(function (axis) { return _this.attachAxis(axis); });
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.attachAxis = function (axis) {
        this.scene.root.insertBefore(axis.gridlineGroup, this.seriesRoot);
        this.scene.root.insertBefore(axis.axisGroup, this.seriesRoot);
        this.scene.root.insertBefore(axis.crossLineGroup, this.seriesRoot);
    };
    Chart.prototype.detachAxis = function (axis) {
        this.scene.root.removeChild(axis.axisGroup);
        this.scene.root.removeChild(axis.gridlineGroup);
        this.scene.root.removeChild(axis.crossLineGroup);
    };
    Object.defineProperty(Chart.prototype, "series", {
        get: function () {
            return this._series;
        },
        set: function (values) {
            var _this = this;
            this.removeAllSeries();
            values.forEach(function (series) { return _this.addSeries(series); });
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.addSeries = function (series, before) {
        var _a = this, allSeries = _a.series, seriesRoot = _a.seriesRoot;
        var canAdd = allSeries.indexOf(series) < 0;
        if (canAdd) {
            var beforeIndex = before ? allSeries.indexOf(before) : -1;
            if (beforeIndex >= 0) {
                allSeries.splice(beforeIndex, 0, series);
                seriesRoot.insertBefore(series.group, before.group);
            }
            else {
                allSeries.push(series);
                seriesRoot.append(series.group);
            }
            this.initSeries(series);
            return true;
        }
        return false;
    };
    Chart.prototype.initSeries = function (series) {
        series.chart = this;
        if (!series.data) {
            series.data = this.data;
        }
        series.addEventListener('nodeClick', this.onSeriesNodeClick, this);
    };
    Chart.prototype.freeSeries = function (series) {
        series.chart = undefined;
        series.removeEventListener('nodeClick', this.onSeriesNodeClick, this);
    };
    Chart.prototype.addSeriesAfter = function (series, after) {
        var _a = this, allSeries = _a.series, seriesRoot = _a.seriesRoot;
        var canAdd = allSeries.indexOf(series) < 0;
        if (canAdd) {
            var afterIndex = after ? this.series.indexOf(after) : -1;
            if (afterIndex >= 0) {
                if (afterIndex + 1 < allSeries.length) {
                    seriesRoot.insertBefore(series.group, allSeries[afterIndex + 1].group);
                }
                else {
                    seriesRoot.append(series.group);
                }
                this.initSeries(series);
                allSeries.splice(afterIndex + 1, 0, series);
            }
            else {
                if (allSeries.length > 0) {
                    seriesRoot.insertBefore(series.group, allSeries[0].group);
                }
                else {
                    seriesRoot.append(series.group);
                }
                this.initSeries(series);
                allSeries.unshift(series);
            }
        }
        return false;
    };
    Chart.prototype.removeSeries = function (series) {
        var index = this.series.indexOf(series);
        if (index >= 0) {
            this.series.splice(index, 1);
            this.freeSeries(series);
            this.seriesRoot.removeChild(series.group);
            return true;
        }
        return false;
    };
    Chart.prototype.removeAllSeries = function () {
        var _this = this;
        this.series.forEach(function (series) {
            _this.freeSeries(series);
            _this.seriesRoot.removeChild(series.group);
        });
        this._series = []; // using `_series` instead of `series` to prevent infinite recursion
    };
    Chart.prototype.assignSeriesToAxes = function () {
        var _this = this;
        this.axes.forEach(function (axis) {
            axis.boundSeries = _this.series.filter(function (s) {
                var seriesAxis = axis.direction === ChartAxisDirection.X ? s.xAxis : s.yAxis;
                return seriesAxis === axis;
            });
        });
    };
    Chart.prototype.assignAxesToSeries = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        // This method has to run before `assignSeriesToAxes`.
        var directionToAxesMap = {};
        this.axes.forEach(function (axis) {
            var direction = axis.direction;
            var directionAxes = directionToAxesMap[direction] || (directionToAxesMap[direction] = []);
            directionAxes.push(axis);
        });
        this.series.forEach(function (series) {
            series.directions.forEach(function (direction) {
                var currentAxis = direction === ChartAxisDirection.X ? series.xAxis : series.yAxis;
                if (currentAxis && !force) {
                    return;
                }
                var directionAxes = directionToAxesMap[direction];
                if (!directionAxes) {
                    console.warn("AG Charts - no available axis for direction [" + direction + "]; check series and axes configuration.");
                    return;
                }
                var seriesKeys = series.getKeys(direction);
                var newAxis = _this.findMatchingAxis(directionAxes, series.getKeys(direction));
                if (!newAxis) {
                    console.warn("AG Charts - no matching axis for direction [" + direction + "] and keys [" + seriesKeys + "]; check series and axes configuration.");
                    return;
                }
                if (direction === ChartAxisDirection.X) {
                    series.xAxis = newAxis;
                }
                else {
                    series.yAxis = newAxis;
                }
            });
        });
    };
    Chart.prototype.findMatchingAxis = function (directionAxes, directionKeys) {
        var e_3, _a, e_4, _b;
        try {
            for (var directionAxes_1 = __values$a(directionAxes), directionAxes_1_1 = directionAxes_1.next(); !directionAxes_1_1.done; directionAxes_1_1 = directionAxes_1.next()) {
                var axis = directionAxes_1_1.value;
                var axisKeys = axis.keys;
                if (!axisKeys.length) {
                    return axis;
                }
                if (!directionKeys) {
                    continue;
                }
                try {
                    for (var directionKeys_1 = (e_4 = void 0, __values$a(directionKeys)), directionKeys_1_1 = directionKeys_1.next(); !directionKeys_1_1.done; directionKeys_1_1 = directionKeys_1.next()) {
                        var directionKey = directionKeys_1_1.value;
                        if (axisKeys.indexOf(directionKey) >= 0) {
                            return axis;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (directionKeys_1_1 && !directionKeys_1_1.done && (_b = directionKeys_1.return)) _b.call(directionKeys_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (directionAxes_1_1 && !directionAxes_1_1.done && (_a = directionAxes_1.return)) _a.call(directionAxes_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    Chart.prototype.resize = function (width, height) {
        if (this.scene.resize(width, height)) {
            this.firstResizeReceived = true;
            this.background.width = this.width;
            this.background.height = this.height;
            this.update(ChartUpdateType.PERFORM_LAYOUT, { forceNodeDataRefresh: true });
        }
    };
    Chart.prototype.processData = function () {
        if (this.axes.length > 0 || this.series.some(function (s) { return s instanceof CartesianSeries; })) {
            this.assignAxesToSeries(true);
            this.assignSeriesToAxes();
        }
        this.series.forEach(function (s) { return s.processData(); });
        this.updateLegend();
    };
    Chart.prototype.placeLabels = function () {
        var e_5, _a;
        var visibleSeries = [];
        var data = [];
        try {
            for (var _b = __values$a(this.series), _c = _b.next(); !_c.done; _c = _b.next()) {
                var series = _c.value;
                if (!series.visible || !series.label.enabled) {
                    continue;
                }
                var labelData = series.getLabelData();
                if (!(labelData && isPointLabelDatum(labelData[0]))) {
                    continue;
                }
                data.push(labelData);
                visibleSeries.push(series);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        var seriesRect = this.seriesRect;
        var labels = seriesRect && data.length > 0
            ? placeLabels(data, { x: 0, y: 0, width: seriesRect.width, height: seriesRect.height })
            : [];
        return new Map(labels.map(function (l, i) { return [visibleSeries[i], l]; }));
    };
    Chart.prototype.updateLegend = function () {
        var legendData = [];
        this.series.filter(function (s) { return s.showInLegend; }).forEach(function (series) { return series.listSeriesItems(legendData); });
        var formatter = this.legend.item.label.formatter;
        if (formatter) {
            legendData.forEach(function (datum) {
                return (datum.label.text = formatter({
                    id: datum.id,
                    itemId: datum.itemId,
                    value: datum.label.text,
                }));
            });
        }
        this.legend.data = legendData;
    };
    Chart.prototype.positionCaptions = function () {
        var _a = this, title = _a._title, subtitle = _a._subtitle;
        var spacing = 10;
        var paddingTop = spacing;
        if (!title) {
            return {};
        }
        title.node.visible = title.enabled;
        if (title.enabled) {
            title.node.x = this.width / 2;
            title.node.y = paddingTop;
            var titleBBox = title.node.computeBBox(); // make sure to set node's x/y, then computeBBox
            if (titleBBox) {
                paddingTop = titleBBox.y + titleBBox.height;
            }
        }
        if (!subtitle) {
            return {};
        }
        subtitle.node.visible = title.enabled && subtitle.enabled;
        if (title.enabled && subtitle.enabled) {
            subtitle.node.x = this.width / 2;
            subtitle.node.y = paddingTop + spacing;
            var subtitleBBox = subtitle.node.computeBBox();
            if (subtitleBBox) {
                paddingTop = subtitleBBox.y + subtitleBBox.height;
            }
        }
        return { captionAutoPadding: Math.floor(paddingTop) };
    };
    Chart.prototype.positionLegend = function (captionAutoPadding) {
        if (!this.legend.enabled || !this.legend.data.length) {
            return;
        }
        var _a = this, legend = _a.legend, legendAutoPadding = _a.legendAutoPadding;
        var width = this.width;
        var height = this.height - captionAutoPadding;
        var legendGroup = legend.group;
        var legendSpacing = legend.spacing;
        var translationX = 0;
        var translationY = 0;
        var legendBBox;
        switch (legend.position) {
            case 'bottom':
                legend.performLayout(width - legendSpacing * 2, 0);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.height < Math.floor(height * 0.5); // Remove legend if it takes up more than 50% of the chart height.
                if (legendGroup.visible) {
                    translationX = (width - legendBBox.width) / 2 - legendBBox.x;
                    translationY = captionAutoPadding + height - legendBBox.height - legendBBox.y - legendSpacing;
                    legendAutoPadding.bottom = legendBBox.height;
                }
                else {
                    legendAutoPadding.bottom = 0;
                }
                break;
            case 'top':
                legend.performLayout(width - legendSpacing * 2, 0);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.height < Math.floor(height * 0.5);
                if (legendGroup.visible) {
                    translationX = (width - legendBBox.width) / 2 - legendBBox.x;
                    translationY = captionAutoPadding + legendSpacing - legendBBox.y;
                    legendAutoPadding.top = legendBBox.height;
                }
                else {
                    legendAutoPadding.top = 0;
                }
                break;
            case 'left':
                legend.performLayout(width, height - legendSpacing * 2);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.width < Math.floor(width * 0.5); // Remove legend if it takes up more than 50% of the chart width.
                if (legendGroup.visible) {
                    translationX = legendSpacing - legendBBox.x;
                    translationY = captionAutoPadding + (height - legendBBox.height) / 2 - legendBBox.y;
                    legendAutoPadding.left = legendBBox.width;
                }
                else {
                    legendAutoPadding.left = 0;
                }
                break;
            default: // case 'right':
                legend.performLayout(width, height - legendSpacing * 2);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.width < Math.floor(width * 0.5);
                if (legendGroup.visible) {
                    translationX = width - legendBBox.width - legendBBox.x - legendSpacing;
                    translationY = captionAutoPadding + (height - legendBBox.height) / 2 - legendBBox.y;
                    legendAutoPadding.right = legendBBox.width;
                }
                else {
                    legendAutoPadding.right = 0;
                }
                break;
        }
        if (legendGroup.visible) {
            // Round off for pixel grid alignment to work properly.
            legendGroup.translationX = Math.floor(translationX + legendGroup.translationX);
            legendGroup.translationY = Math.floor(translationY + legendGroup.translationY);
            this.legendBBox = legendGroup.computeBBox();
        }
    };
    Chart.prototype.setupDomListeners = function (chartElement) {
        chartElement.addEventListener('mousedown', this._onMouseDown);
        chartElement.addEventListener('mousemove', this._onMouseMove);
        chartElement.addEventListener('mouseup', this._onMouseUp);
        chartElement.addEventListener('mouseout', this._onMouseOut);
        chartElement.addEventListener('click', this._onClick);
    };
    Chart.prototype.cleanupDomListeners = function (chartElement) {
        chartElement.removeEventListener('mousedown', this._onMouseDown);
        chartElement.removeEventListener('mousemove', this._onMouseMove);
        chartElement.removeEventListener('mouseup', this._onMouseUp);
        chartElement.removeEventListener('mouseout', this._onMouseOut);
        chartElement.removeEventListener('click', this._onClick);
    };
    Chart.prototype.getSeriesRect = function () {
        return this.seriesRect;
    };
    // x/y are local canvas coordinates in CSS pixels, not actual pixels
    Chart.prototype.pickSeriesNode = function (point) {
        var e_6, _a;
        var _b, _c;
        var tracking = this.tooltip.tracking;
        var start = performance.now();
        // Disable 'nearest match' options if tooltip.tracking is enabled.
        var pickModes = tracking ? undefined : [SeriesNodePickMode.EXACT_SHAPE_MATCH];
        // Iterate through series in reverse, as later declared series appears on top of earlier
        // declared series.
        var reverseSeries = __spread$8(this.series).reverse();
        var result = undefined;
        try {
            for (var reverseSeries_1 = __values$a(reverseSeries), reverseSeries_1_1 = reverseSeries_1.next(); !reverseSeries_1_1.done; reverseSeries_1_1 = reverseSeries_1.next()) {
                var series = reverseSeries_1_1.value;
                if (!series.visible || !series.group.visible) {
                    continue;
                }
                var _d = (_b = series.pickNode(point, pickModes), (_b !== null && _b !== void 0 ? _b : {})), match = _d.match, distance = _d.distance;
                if (!match || distance == null) {
                    continue;
                }
                if (!result || result.distance > distance) {
                    result = { series: series, distance: distance, datum: match };
                }
                if (distance === 0) {
                    break;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (reverseSeries_1_1 && !reverseSeries_1_1.done && (_a = reverseSeries_1.return)) _a.call(reverseSeries_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        this.extraDebugStats['pickSeriesNode'] = Math.round((_c = this.extraDebugStats['pickSeriesNode'], (_c !== null && _c !== void 0 ? _c : 0)) + (performance.now() - start));
        return result;
    };
    Chart.prototype.onMouseMove = function (event) {
        this.handleLegendMouseMove(event);
        if (this.tooltip.enabled) {
            if (this.tooltip.delay > 0) {
                this.tooltip.toggle(false);
            }
            this.lastTooltipMeta = {
                pageX: event.pageX,
                pageY: event.pageY,
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                event: event,
            };
            this.handleTooltipTrigger.schedule();
        }
    };
    Chart.prototype.disableTooltip = function (_a) {
        var _b = (_a === void 0 ? {} : _a).updateProcessing, updateProcessing = _b === void 0 ? true : _b;
        this.changeHighlightDatum(undefined, { updateProcessing: updateProcessing });
        this.tooltip.toggle(false);
    };
    Chart.prototype.handleTooltip = function (meta) {
        var _this = this;
        var lastPick = this.lastPick;
        var offsetX = meta.offsetX, offsetY = meta.offsetY;
        var disableTooltip = function () {
            if (lastPick) {
                // Cursor moved from a non-marker node to empty space.
                _this.disableTooltip();
            }
        };
        if (!(this.seriesRect && this.seriesRect.containsPoint(offsetX, offsetY))) {
            disableTooltip();
            return;
        }
        var pick = this.pickSeriesNode({ x: offsetX, y: offsetY });
        if (!pick) {
            disableTooltip();
            return;
        }
        if (!lastPick || lastPick.datum !== pick.datum) {
            this.onSeriesDatumPick(meta, pick.datum);
            return;
        }
        lastPick.event = meta.event;
        this.tooltip.show(this.mergeTooltipDatum(meta, pick.datum));
    };
    Chart.prototype.onMouseDown = function (_event) {
        // Override point for subclasses.
    };
    Chart.prototype.onMouseUp = function (_event) {
        // Override point for subclasses.
    };
    Chart.prototype.onMouseOut = function (_event) {
        this.tooltip.toggle(false);
    };
    Chart.prototype.onClick = function (event) {
        if (this.checkSeriesNodeClick()) {
            this.update(ChartUpdateType.SERIES_UPDATE);
            return;
        }
        if (this.checkLegendClick(event)) {
            this.update(ChartUpdateType.PROCESS_DATA, { forceNodeDataRefresh: true });
            return;
        }
        this.fireEvent({
            type: 'click',
            event: event,
        });
    };
    Chart.prototype.checkSeriesNodeClick = function () {
        var lastPick = this.lastPick;
        if (lastPick && lastPick.event) {
            var event_1 = lastPick.event, datum = lastPick.datum;
            datum.series.fireNodeClickEvent(event_1, datum);
            return true;
        }
        return false;
    };
    Chart.prototype.onSeriesNodeClick = function (event) {
        this.fireEvent(__assign$b(__assign$b({}, event), { type: 'seriesNodeClick' }));
    };
    Chart.prototype.checkLegendClick = function (event) {
        var _a;
        var _b = this, legend = _b.legend, legendItemClick = _b.legend.listeners.legendItemClick;
        var datum = legend.getDatumForPoint(event.offsetX, event.offsetY);
        if (!datum) {
            return false;
        }
        var id = datum.id, itemId = datum.itemId, enabled = datum.enabled;
        var series = find(this.series, function (s) { return s.id === id; });
        if (!series) {
            return false;
        }
        series.toggleSeriesItem(itemId, !enabled);
        if (enabled) {
            this.tooltip.toggle(false);
        }
        if (enabled && ((_a = this.highlightedDatum) === null || _a === void 0 ? void 0 : _a.series) === series) {
            this.highlightedDatum = undefined;
        }
        if (!enabled) {
            this.highlightedDatum = {
                series: series,
                itemId: itemId,
                datum: undefined,
            };
        }
        legendItemClick({ enabled: !enabled, itemId: itemId, seriesId: series.id });
        return true;
    };
    Chart.prototype.handleLegendMouseMove = function (event) {
        if (!this.legend.enabled) {
            return;
        }
        var offsetX = event.offsetX, offsetY = event.offsetY;
        var datum = this.legend.getDatumForPoint(offsetX, offsetY);
        var pointerInsideLegend = this.legendBBox.containsPoint(offsetX, offsetY);
        var pointerOverLegendDatum = pointerInsideLegend && datum !== undefined;
        if (!pointerInsideLegend && this.pointerInsideLegend) {
            this.pointerInsideLegend = false;
            this.element.style.cursor = 'default';
            // Dehighlight if the pointer was inside the legend and is now leaving it.
            this.changeHighlightDatum();
            return;
        }
        if (pointerOverLegendDatum && !this.pointerOverLegendDatum) {
            this.element.style.cursor = 'pointer';
            if (datum && this.legend.truncatedItems.has(datum.itemId || datum.id)) {
                this.element.title = datum.label.text;
            }
            else {
                this.element.title = '';
            }
        }
        if (!pointerOverLegendDatum && this.pointerOverLegendDatum) {
            this.element.style.cursor = 'default';
        }
        this.pointerInsideLegend = pointerInsideLegend;
        this.pointerOverLegendDatum = pointerOverLegendDatum;
        var oldHighlightedDatum = this.highlightedDatum;
        if (datum) {
            var id_1 = datum.id, itemId = datum.itemId, enabled = datum.enabled;
            if (enabled) {
                var series = find(this.series, function (series) { return series.id === id_1; });
                if (series) {
                    this.highlightedDatum = {
                        series: series,
                        itemId: itemId,
                        datum: undefined,
                    };
                }
            }
            else {
                this.highlightedDatum = undefined;
            }
        }
        // Careful to only schedule updates when necessary.
        if ((this.highlightedDatum && !oldHighlightedDatum) ||
            (!this.highlightedDatum && oldHighlightedDatum) ||
            (this.highlightedDatum &&
                oldHighlightedDatum &&
                (this.highlightedDatum.series !== oldHighlightedDatum.series ||
                    this.highlightedDatum.itemId !== oldHighlightedDatum.itemId))) {
            this.update(ChartUpdateType.SERIES_UPDATE);
        }
    };
    Chart.prototype.onSeriesDatumPick = function (meta, datum) {
        var lastPick = this.lastPick;
        if (lastPick) {
            if (lastPick.datum === datum) {
                return;
            }
        }
        this.changeHighlightDatum({
            datum: datum,
            event: meta.event,
        });
        if (datum) {
            meta = this.mergeTooltipDatum(meta, datum);
        }
        var html = datum.series.tooltip.enabled && datum.series.getTooltipHtml(datum);
        if (html) {
            this.tooltip.show(meta, html);
        }
    };
    Chart.prototype.mergeTooltipDatum = function (meta, datum) {
        if (datum.point) {
            var _a = datum.point, x = _a.x, y = _a.y;
            var canvas = this.scene.canvas;
            var point = datum.series.group.inverseTransformPoint(x, y);
            var canvasRect = canvas.element.getBoundingClientRect();
            return __assign$b(__assign$b({}, meta), { pageX: Math.round(canvasRect.left + window.scrollX + point.x), pageY: Math.round(canvasRect.top + window.scrollY + point.y), offsetX: Math.round(canvasRect.left + point.y), offsetY: Math.round(canvasRect.top + point.y) });
        }
        return meta;
    };
    Chart.prototype.changeHighlightDatum = function (newPick, opts) {
        var _a = (opts !== null && opts !== void 0 ? opts : {}).updateProcessing, updateProcessing = _a === void 0 ? true : _a;
        var seriesToUpdate = new Set();
        var _b = newPick || {}, _c = _b.datum, _d = (_c === void 0 ? {} : _c).series, newSeries = _d === void 0 ? undefined : _d, _e = _b.datum, datum = _e === void 0 ? undefined : _e;
        var _f = this.lastPick, _g = (_f === void 0 ? {} : _f).datum, _h = (_g === void 0 ? {} : _g).series, lastSeries = _h === void 0 ? undefined : _h;
        if (lastSeries) {
            seriesToUpdate.add(lastSeries);
        }
        if (newSeries) {
            seriesToUpdate.add(newSeries);
            this.element.style.cursor = newSeries.cursor;
        }
        this.lastPick = newPick;
        this.highlightedDatum = datum;
        if (!updateProcessing) {
            return;
        }
        var updateAll = newSeries == null || lastSeries == null;
        if (updateAll) {
            this.update(ChartUpdateType.SERIES_UPDATE);
        }
        else {
            this.update(ChartUpdateType.SERIES_UPDATE, { seriesToUpdate: seriesToUpdate });
        }
    };
    Chart.defaultTooltipClass = 'ag-chart-tooltip';
    Chart.tooltipDocuments = [];
    return Chart;
}(Observable));

var __extends$t = (undefined && undefined.__extends) || (function () {
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
var __assign$a = (undefined && undefined.__assign) || function () {
    __assign$a = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$a.apply(this, arguments);
};
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values$9 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/**
 * Acts as `Group` node but with specified bounds that form a rectangle.
 * Any parts of the child nodes outside that rectangle will not be visible.
 * Unlike the `Group` node, the `ClipRect` node cannot be transformed.
 */
var ClipRect = /** @class */ (function (_super) {
    __extends$t(ClipRect, _super);
    function ClipRect() {
        var _this = _super.call(this) || this;
        _this.path = new Path2D();
        _this.enabled = true;
        _this._dirtyPath = true;
        _this.x = 0;
        _this.y = 0;
        _this.width = 10;
        _this.height = 10;
        _this.isContainerNode = true;
        return _this;
    }
    ClipRect.prototype.containsPoint = function (x, y) {
        var point = this.transformPoint(x, y);
        return (point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height);
    };
    ClipRect.prototype.updatePath = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height, path = _a.path;
        path.clear();
        path.rect(x, y, width, height);
        this._dirtyPath = false;
    };
    ClipRect.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    ClipRect.prototype.render = function (renderCtx) {
        var e_1, _a;
        var _b = this, enabled = _b.enabled, dirty = _b.dirty, _dirtyPath = _b._dirtyPath, children = _b.children;
        var ctx = renderCtx.ctx, forceRender = renderCtx.forceRender, stats = renderCtx.stats;
        if (dirty === RedrawType.NONE && !forceRender) {
            if (stats)
                stats.nodesSkipped += this.nodeCount.count;
            return;
        }
        if (_dirtyPath) {
            this.updatePath();
        }
        if (enabled) {
            ctx.save();
            this.path.draw(ctx);
            ctx.clip();
        }
        var clipBBox = enabled ? this.computeBBox() : undefined;
        var childRenderContext = __assign$a(__assign$a({}, renderCtx), { clipBBox: clipBBox });
        try {
            for (var children_1 = __values$9(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                if (child.visible && (forceRender || child.dirty > RedrawType.NONE)) {
                    ctx.save();
                    child.render(childRenderContext);
                    ctx.restore();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        _super.prototype.render.call(this, renderCtx);
        if (enabled) {
            ctx.restore();
        }
    };
    ClipRect.className = 'ClipRect';
    __decorate$4([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], ClipRect.prototype, "enabled", void 0);
    __decorate$4([
        ScenePathChangeDetection()
    ], ClipRect.prototype, "x", void 0);
    __decorate$4([
        ScenePathChangeDetection()
    ], ClipRect.prototype, "y", void 0);
    __decorate$4([
        ScenePathChangeDetection()
    ], ClipRect.prototype, "width", void 0);
    __decorate$4([
        ScenePathChangeDetection()
    ], ClipRect.prototype, "height", void 0);
    return ClipRect;
}(Node));

var __extends$s = (undefined && undefined.__extends) || (function () {
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
var RangeHandle = /** @class */ (function (_super) {
    __extends$s(RangeHandle, _super);
    function RangeHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._fill = '#f2f2f2';
        _this._stroke = '#999999';
        _this._strokeWidth = 1;
        _this._lineCap = 'square';
        _this._centerX = 0;
        _this._centerY = 0;
        // Use an even number for better looking results.
        _this._width = 8;
        // Use an even number for better looking results.
        _this._gripLineGap = 2;
        // Use an even number for better looking results.
        _this._gripLineLength = 8;
        _this._height = 16;
        return _this;
    }
    Object.defineProperty(RangeHandle.prototype, "centerX", {
        get: function () {
            return this._centerX;
        },
        set: function (value) {
            if (this._centerX !== value) {
                this._centerX = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "centerY", {
        get: function () {
            return this._centerY;
        },
        set: function (value) {
            if (this._centerY !== value) {
                this._centerY = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width !== value) {
                this._width = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "gripLineGap", {
        get: function () {
            return this._gripLineGap;
        },
        set: function (value) {
            if (this._gripLineGap !== value) {
                this._gripLineGap = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "gripLineLength", {
        get: function () {
            return this._gripLineLength;
        },
        set: function (value) {
            if (this._gripLineLength !== value) {
                this._gripLineLength = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height !== value) {
                this._height = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    RangeHandle.prototype.computeBBox = function () {
        var _a = this, centerX = _a.centerX, centerY = _a.centerY, width = _a.width, height = _a.height;
        var x = centerX - width / 2;
        var y = centerY - height / 2;
        return new BBox(x, y, width, height);
    };
    RangeHandle.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return bbox.containsPoint(point.x, point.y);
    };
    RangeHandle.prototype.updatePath = function () {
        var _a = this, path = _a.path, centerX = _a.centerX, centerY = _a.centerY, width = _a.width, height = _a.height;
        path.clear();
        var x = centerX - width / 2;
        var y = centerY - height / 2;
        var ax = this.align(x);
        var ay = this.align(y);
        var axw = ax + this.align(x, width);
        var ayh = ay + this.align(y, height);
        // Handle.
        path.moveTo(ax, ay);
        path.lineTo(axw, ay);
        path.lineTo(axw, ayh);
        path.lineTo(ax, ayh);
        path.lineTo(ax, ay);
        // Grip lines.
        var dx = this.gripLineGap / 2;
        var dy = this.gripLineLength / 2;
        path.moveTo(this.align(centerX - dx), this.align(centerY - dy));
        path.lineTo(this.align(centerX - dx), this.align(centerY + dy));
        path.moveTo(this.align(centerX + dx), this.align(centerY - dy));
        path.lineTo(this.align(centerX + dx), this.align(centerY + dy));
    };
    RangeHandle.className = 'RangeHandle';
    return RangeHandle;
}(Path));

var __extends$r = (undefined && undefined.__extends) || (function () {
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
var RangeMask = /** @class */ (function (_super) {
    __extends$r(RangeMask, _super);
    function RangeMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._stroke = '#999999';
        _this._strokeWidth = 1;
        _this._fill = '#999999';
        _this._fillOpacity = 0.2;
        _this._lineCap = 'square';
        _this._x = 0;
        _this._y = 0;
        _this._width = 200;
        _this._height = 30;
        _this.minRange = 0.05;
        _this._min = 0;
        _this._max = 1;
        return _this;
    }
    Object.defineProperty(RangeMask.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (this._x !== value) {
                this._x = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (this._y !== value) {
                this._y = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width !== value) {
                this._width = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height !== value) {
                this._height = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (value) {
            value = Math.min(Math.max(value, 0), this.max - this.minRange);
            if (isNaN(value)) {
                return;
            }
            if (this._min !== value) {
                this._min = value;
                this.dirtyPath = true;
                this.onRangeChange && this.onRangeChange(value, this.max);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (value) {
            value = Math.max(Math.min(value, 1), this.min + this.minRange);
            if (isNaN(value)) {
                return;
            }
            if (this._max !== value) {
                this._max = value;
                this.dirtyPath = true;
                this.onRangeChange && this.onRangeChange(this.min, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    RangeMask.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    RangeMask.prototype.computeVisibleRangeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height, min = _a.min, max = _a.max;
        var minX = x + width * min;
        var maxX = x + width * max;
        return new BBox(minX, y, maxX - minX, height);
    };
    RangeMask.prototype.updatePath = function () {
        var _a = this, path = _a.path, x = _a.x, y = _a.y, width = _a.width, height = _a.height, min = _a.min, max = _a.max;
        path.clear();
        var ax = this.align(x);
        var ay = this.align(y);
        var axw = ax + this.align(x, width);
        var ayh = ay + this.align(y, height);
        // Whole range.
        path.moveTo(ax, ay);
        path.lineTo(axw, ay);
        path.lineTo(axw, ayh);
        path.lineTo(ax, ayh);
        path.lineTo(ax, ay);
        var minX = this.align(x + width * min);
        var maxX = this.align(x + width * max);
        // Visible range.
        path.moveTo(minX, ay);
        path.lineTo(minX, ayh);
        path.lineTo(maxX, ayh);
        path.lineTo(maxX, ay);
        path.lineTo(minX, ay);
    };
    RangeMask.className = 'RangeMask';
    return RangeMask;
}(Path));

var __extends$q = (undefined && undefined.__extends) || (function () {
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
var __assign$9 = (undefined && undefined.__assign) || function () {
    __assign$9 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$9.apply(this, arguments);
};
var RangeSelector = /** @class */ (function (_super) {
    __extends$q(RangeSelector, _super);
    function RangeSelector() {
        var _this = _super.call(this) || this;
        _this.minHandle = new RangeHandle();
        _this.maxHandle = new RangeHandle();
        _this.mask = (function () {
            var _a = RangeSelector.defaults, x = _a.x, y = _a.y, width = _a.width, height = _a.height, min = _a.min, max = _a.max;
            var mask = new RangeMask();
            mask.x = x;
            mask.y = y;
            mask.width = width;
            mask.height = height;
            mask.min = min;
            mask.max = max;
            var _b = _this, minHandle = _b.minHandle, maxHandle = _b.maxHandle;
            minHandle.centerX = x;
            maxHandle.centerX = x + width;
            minHandle.centerY = maxHandle.centerY = y + height / 2;
            _this.append([mask, minHandle, maxHandle]);
            mask.onRangeChange = function (min, max) {
                _this.updateHandles();
                _this.onRangeChange && _this.onRangeChange(min, max);
            };
            return mask;
        })();
        _this._x = RangeSelector.defaults.x;
        _this._y = RangeSelector.defaults.y;
        _this._width = RangeSelector.defaults.width;
        _this._height = RangeSelector.defaults.height;
        _this._min = RangeSelector.defaults.min;
        _this._max = RangeSelector.defaults.max;
        _this.isContainerNode = true;
        return _this;
    }
    Object.defineProperty(RangeSelector.prototype, "x", {
        get: function () {
            return this.mask.x;
        },
        set: function (value) {
            this.mask.x = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "y", {
        get: function () {
            return this.mask.y;
        },
        set: function (value) {
            this.mask.y = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "width", {
        get: function () {
            return this.mask.width;
        },
        set: function (value) {
            this.mask.width = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "height", {
        get: function () {
            return this.mask.height;
        },
        set: function (value) {
            this.mask.height = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "min", {
        get: function () {
            return this.mask.min;
        },
        set: function (value) {
            this.mask.min = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "max", {
        get: function () {
            return this.mask.max;
        },
        set: function (value) {
            this.mask.max = value;
        },
        enumerable: true,
        configurable: true
    });
    RangeSelector.prototype.updateHandles = function () {
        var _a = this, minHandle = _a.minHandle, maxHandle = _a.maxHandle, x = _a.x, y = _a.y, width = _a.width, height = _a.height, mask = _a.mask;
        minHandle.centerX = x + width * mask.min;
        maxHandle.centerX = x + width * mask.max;
        minHandle.centerY = maxHandle.centerY = y + height / 2;
    };
    RangeSelector.prototype.computeBBox = function () {
        return this.mask.computeBBox();
    };
    RangeSelector.prototype.computeVisibleRangeBBox = function () {
        return this.mask.computeVisibleRangeBBox();
    };
    RangeSelector.prototype.render = function (renderCtx) {
        var ctx = renderCtx.ctx, forceRender = renderCtx.forceRender, stats = renderCtx.stats;
        if (this.dirty === RedrawType.NONE && !forceRender) {
            if (stats)
                stats.nodesSkipped++;
            return;
        }
        this.computeTransformMatrix();
        this.matrix.toContext(ctx);
        var _a = this, mask = _a.mask, minHandle = _a.minHandle, maxHandle = _a.maxHandle;
        [mask, minHandle, maxHandle].forEach(function (child) {
            if (child.visible && (forceRender || child.dirty > RedrawType.NONE)) {
                ctx.save();
                child.render(__assign$9(__assign$9({}, renderCtx), { ctx: ctx, forceRender: forceRender }));
                ctx.restore();
            }
        });
        this.markClean({ force: true });
        if (stats)
            stats.nodesRendered++;
    };
    RangeSelector.className = 'Range';
    RangeSelector.defaults = {
        x: 0,
        y: 0,
        width: 200,
        height: 30,
        min: 0,
        max: 1,
    };
    return RangeSelector;
}(Group));

var NavigatorMask = /** @class */ (function () {
    function NavigatorMask(rangeMask) {
        this.rm = rangeMask;
    }
    Object.defineProperty(NavigatorMask.prototype, "fill", {
        get: function () {
            return this.rm.fill;
        },
        set: function (value) {
            this.rm.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorMask.prototype, "stroke", {
        get: function () {
            return this.rm.stroke;
        },
        set: function (value) {
            this.rm.stroke = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorMask.prototype, "strokeWidth", {
        get: function () {
            return this.rm.strokeWidth;
        },
        set: function (value) {
            this.rm.strokeWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorMask.prototype, "fillOpacity", {
        get: function () {
            return this.rm.fillOpacity;
        },
        set: function (value) {
            this.rm.fillOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    return NavigatorMask;
}());

var NavigatorHandle = /** @class */ (function () {
    function NavigatorHandle(rangeHandle) {
        this.rh = rangeHandle;
    }
    Object.defineProperty(NavigatorHandle.prototype, "fill", {
        get: function () {
            return this.rh.fill;
        },
        set: function (value) {
            this.rh.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "stroke", {
        get: function () {
            return this.rh.stroke;
        },
        set: function (value) {
            this.rh.stroke = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "strokeWidth", {
        get: function () {
            return this.rh.strokeWidth;
        },
        set: function (value) {
            this.rh.strokeWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "width", {
        get: function () {
            return this.rh.width;
        },
        set: function (value) {
            this.rh.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "height", {
        get: function () {
            return this.rh.height;
        },
        set: function (value) {
            this.rh.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "gripLineGap", {
        get: function () {
            return this.rh.gripLineGap;
        },
        set: function (value) {
            this.rh.gripLineGap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "gripLineLength", {
        get: function () {
            return this.rh.gripLineLength;
        },
        set: function (value) {
            this.rh.gripLineLength = value;
        },
        enumerable: true,
        configurable: true
    });
    return NavigatorHandle;
}());

var Navigator = /** @class */ (function () {
    function Navigator(chart) {
        var _this = this;
        this.rs = new RangeSelector();
        this.mask = new NavigatorMask(this.rs.mask);
        this.minHandle = new NavigatorHandle(this.rs.minHandle);
        this.maxHandle = new NavigatorHandle(this.rs.maxHandle);
        this.minHandleDragging = false;
        this.maxHandleDragging = false;
        this.panHandleOffset = NaN;
        this.changedCursor = false;
        this._margin = 10;
        this.chart = chart;
        chart.scene.root.append(this.rs);
        this.rs.onRangeChange = function (min, max) { return _this.updateAxes(min, max); };
    }
    Object.defineProperty(Navigator.prototype, "enabled", {
        get: function () {
            return this.rs.visible;
        },
        set: function (value) {
            this.rs.visible = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "x", {
        get: function () {
            return this.rs.x;
        },
        set: function (value) {
            this.rs.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "y", {
        get: function () {
            return this.rs.y;
        },
        set: function (value) {
            this.rs.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "width", {
        get: function () {
            return this.rs.width;
        },
        set: function (value) {
            this.rs.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "height", {
        get: function () {
            return this.rs.height;
        },
        set: function (value) {
            this.rs.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "margin", {
        get: function () {
            return this._margin;
        },
        set: function (value) {
            this._margin = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "min", {
        get: function () {
            return this.rs.min;
        },
        set: function (value) {
            this.rs.min = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "max", {
        get: function () {
            return this.rs.max;
        },
        set: function (value) {
            this.rs.max = value;
        },
        enumerable: true,
        configurable: true
    });
    Navigator.prototype.updateAxes = function (min, max) {
        var chart = this.chart;
        var clipSeries = false;
        var layoutRequired = false;
        chart.axes.forEach(function (axis) {
            if (axis.direction === ChartAxisDirection.X) {
                if (!clipSeries && (min > 0 || max < 1)) {
                    clipSeries = true;
                }
                axis.visibleRange = [min, max];
                var oldLabelAutoRotated = axis.labelAutoRotated;
                axis.update();
                if (axis.labelAutoRotated !== oldLabelAutoRotated) {
                    layoutRequired = true;
                }
            }
        });
        chart.seriesRoot.enabled = clipSeries;
        var updateType = layoutRequired ? ChartUpdateType.PERFORM_LAYOUT : ChartUpdateType.SERIES_UPDATE;
        chart.update(updateType, { forceNodeDataRefresh: true });
    };
    Navigator.prototype.onDragStart = function (offset) {
        if (!this.enabled) {
            return;
        }
        var offsetX = offset.offsetX, offsetY = offset.offsetY;
        var rs = this.rs;
        var minHandle = rs.minHandle, maxHandle = rs.maxHandle, x = rs.x, width = rs.width, min = rs.min;
        var visibleRange = rs.computeVisibleRangeBBox();
        if (!(this.minHandleDragging || this.maxHandleDragging)) {
            if (minHandle.containsPoint(offsetX, offsetY)) {
                this.minHandleDragging = true;
            }
            else if (maxHandle.containsPoint(offsetX, offsetY)) {
                this.maxHandleDragging = true;
            }
            else if (visibleRange.containsPoint(offsetX, offsetY)) {
                this.panHandleOffset = (offsetX - x) / width - min;
            }
        }
    };
    Navigator.prototype.onDrag = function (offset) {
        if (!this.enabled) {
            return;
        }
        var _a = this, rs = _a.rs, panHandleOffset = _a.panHandleOffset;
        var x = rs.x, y = rs.y, width = rs.width, height = rs.height, minHandle = rs.minHandle, maxHandle = rs.maxHandle;
        var style = this.chart.element.style;
        var offsetX = offset.offsetX, offsetY = offset.offsetY;
        var minX = x + width * rs.min;
        var maxX = x + width * rs.max;
        var visibleRange = new BBox(minX, y, maxX - minX, height);
        function getRatio() {
            return Math.min(Math.max((offsetX - x) / width, 0), 1);
        }
        if (minHandle.containsPoint(offsetX, offsetY) || maxHandle.containsPoint(offsetX, offsetY)) {
            this.changedCursor = true;
            style.cursor = 'ew-resize';
        }
        else if (visibleRange.containsPoint(offsetX, offsetY)) {
            this.changedCursor = true;
            style.cursor = 'grab';
        }
        else if (this.changedCursor) {
            this.changedCursor = false;
            style.cursor = 'default';
        }
        if (this.minHandleDragging) {
            rs.min = getRatio();
        }
        else if (this.maxHandleDragging) {
            rs.max = getRatio();
        }
        else if (!isNaN(panHandleOffset)) {
            var span = rs.max - rs.min;
            var min = Math.min(getRatio() - panHandleOffset, 1 - span);
            if (min <= rs.min) {
                // pan left
                rs.min = min;
                rs.max = rs.min + span;
            }
            else {
                // pan right
                rs.max = min + span;
                rs.min = rs.max - span;
            }
        }
    };
    Navigator.prototype.onDragStop = function () {
        this.stopHandleDragging();
    };
    Navigator.prototype.stopHandleDragging = function () {
        this.minHandleDragging = this.maxHandleDragging = false;
        this.panHandleOffset = NaN;
    };
    return Navigator;
}());

var __extends$p = (undefined && undefined.__extends) || (function () {
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
var __read$e = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var CartesianChart = /** @class */ (function (_super) {
    __extends$p(CartesianChart, _super);
    function CartesianChart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this, document) || this;
        _this.seriesRoot = new ClipRect();
        _this.navigator = new Navigator(_this);
        // Prevent the scene from rendering chart components in an invalid state
        // (before first layout is performed).
        _this.scene.root.visible = false;
        var root = _this.scene.root;
        root.append(_this.seriesRoot);
        root.append(_this.legend.group);
        _this.navigator.enabled = false;
        return _this;
    }
    CartesianChart.prototype.performLayout = function () {
        this.scene.root.visible = true;
        var _a = this, width = _a.width, height = _a.height, legend = _a.legend, navigator = _a.navigator;
        var shrinkRect = new BBox(0, 0, width, height);
        var _b = this.positionCaptions().captionAutoPadding, captionAutoPadding = _b === void 0 ? 0 : _b;
        this.positionLegend(captionAutoPadding);
        if (legend.enabled && legend.data.length) {
            var legendAutoPadding = this.legendAutoPadding;
            var legendPadding = this.legend.spacing;
            shrinkRect.x += legendAutoPadding.left;
            shrinkRect.y += legendAutoPadding.top;
            shrinkRect.width -= legendAutoPadding.left + legendAutoPadding.right;
            shrinkRect.height -= legendAutoPadding.top + legendAutoPadding.bottom;
            switch (this.legend.position) {
                case 'right':
                    shrinkRect.width -= legendPadding;
                    break;
                case 'bottom':
                    shrinkRect.height -= legendPadding;
                    break;
                case 'left':
                    shrinkRect.x += legendPadding;
                    shrinkRect.width -= legendPadding;
                    break;
                case 'top':
                    shrinkRect.y += legendPadding;
                    shrinkRect.height -= legendPadding;
                    break;
            }
        }
        var padding = this.padding;
        shrinkRect.x += padding.left;
        shrinkRect.width -= padding.left + padding.right;
        shrinkRect.y += padding.top + captionAutoPadding;
        shrinkRect.height -= padding.top + captionAutoPadding + padding.bottom;
        if (navigator.enabled) {
            var navigatorTotalHeight = navigator.height + navigator.margin;
            shrinkRect.height -= navigatorTotalHeight;
            navigator.x = shrinkRect.x;
            navigator.y = shrinkRect.y + shrinkRect.height + navigator.margin;
            navigator.width = shrinkRect.width;
        }
        var seriesRect = this.updateAxes(shrinkRect).seriesRect;
        this.seriesRect = seriesRect;
        this.series.forEach(function (series) {
            series.group.translationX = Math.floor(seriesRect.x);
            series.group.translationY = Math.floor(seriesRect.y);
        });
        var seriesRoot = this.seriesRoot;
        seriesRoot.x = seriesRect.x;
        seriesRoot.y = seriesRect.y;
        seriesRoot.width = seriesRect.width;
        seriesRoot.height = seriesRect.height;
    };
    CartesianChart.prototype.setupDomListeners = function (chartElement) {
        _super.prototype.setupDomListeners.call(this, chartElement);
        this._onTouchStart = this.onTouchStart.bind(this);
        this._onTouchMove = this.onTouchMove.bind(this);
        this._onTouchEnd = this.onTouchEnd.bind(this);
        this._onTouchCancel = this.onTouchCancel.bind(this);
        chartElement.addEventListener('touchstart', this._onTouchStart, { passive: true });
        chartElement.addEventListener('touchmove', this._onTouchMove, { passive: true });
        chartElement.addEventListener('touchend', this._onTouchEnd, { passive: true });
        chartElement.addEventListener('touchcancel', this._onTouchCancel, { passive: true });
    };
    CartesianChart.prototype.cleanupDomListeners = function (chartElement) {
        _super.prototype.cleanupDomListeners.call(this, chartElement);
        chartElement.removeEventListener('touchstart', this._onTouchStart);
        chartElement.removeEventListener('touchmove', this._onTouchMove);
        chartElement.removeEventListener('touchend', this._onTouchEnd);
        chartElement.removeEventListener('touchcancel', this._onTouchCancel);
    };
    CartesianChart.prototype.getTouchOffset = function (event) {
        var rect = this.scene.canvas.element.getBoundingClientRect();
        var touch = event.touches[0];
        return touch
            ? {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top,
            }
            : undefined;
    };
    CartesianChart.prototype.onTouchStart = function (event) {
        var offset = this.getTouchOffset(event);
        if (offset) {
            this.navigator.onDragStart(offset);
        }
    };
    CartesianChart.prototype.onTouchMove = function (event) {
        var offset = this.getTouchOffset(event);
        if (offset) {
            this.navigator.onDrag(offset);
        }
    };
    CartesianChart.prototype.onTouchEnd = function (_event) {
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.onTouchCancel = function (_event) {
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.onMouseDown = function (event) {
        _super.prototype.onMouseDown.call(this, event);
        this.navigator.onDragStart(event);
    };
    CartesianChart.prototype.onMouseMove = function (event) {
        _super.prototype.onMouseMove.call(this, event);
        this.navigator.onDrag(event);
    };
    CartesianChart.prototype.onMouseUp = function (event) {
        _super.prototype.onMouseUp.call(this, event);
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.onMouseOut = function (event) {
        _super.prototype.onMouseOut.call(this, event);
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.updateAxes = function (inputShrinkRect) {
        var _a;
        var axisWidths = (_a = {},
            _a[ChartAxisPosition.Top] = 0,
            _a[ChartAxisPosition.Bottom] = 0,
            _a[ChartAxisPosition.Left] = 0,
            _a[ChartAxisPosition.Right] = 0,
            _a);
        var stableWidths = function (other) {
            return Object.entries(axisWidths).every(function (_a) {
                var _b = __read$e(_a, 2), p = _b[0], w = _b[1];
                var otherW = other[p];
                if (w || otherW) {
                    return w === otherW;
                }
                return true;
            });
        };
        var ceilValues = function (records) {
            return Object.entries(records).reduce(function (out, _a) {
                var _b = __read$e(_a, 2), key = _b[0], value = _b[1];
                if (value && Math.abs(value) === Infinity) {
                    value = 0;
                }
                out[key] = value != null ? Math.ceil(value) : value;
                return out;
            }, {});
        };
        // Iteratively try to resolve axis widths - since X axis width affects Y axis range,
        // and vice-versa, we need to iteratively try and find a fit for the axes and their
        // ticks/labels.
        var lastPass = {};
        var clipSeries = false;
        var seriesRect = undefined;
        var count = 0;
        do {
            Object.assign(axisWidths, lastPass);
            var result = this.updateAxesPass(axisWidths, inputShrinkRect.clone(), seriesRect);
            lastPass = ceilValues(result.axisWidths);
            clipSeries = result.clipSeries;
            seriesRect = result.seriesRect;
            if (count++ > 10) {
                throw new Error('AG Charts - unable to find stable axis layout.');
            }
        } while (!stableWidths(lastPass));
        this.seriesRoot.enabled = clipSeries;
        return { seriesRect: seriesRect };
    };
    CartesianChart.prototype.updateAxesPass = function (axisWidths, bounds, lastPassSeriesRect) {
        var _a = this, navigator = _a.navigator, axes = _a.axes;
        var visited = {};
        var newAxisWidths = {};
        var clipSeries = false;
        var primaryTickCounts = {};
        var crossLinePadding = {};
        if (lastPassSeriesRect) {
            this.axes.forEach(function (axis) {
                if (axis.crossLines) {
                    axis.crossLines.forEach(function (crossLine) {
                        crossLine.calculatePadding(crossLinePadding, lastPassSeriesRect);
                    });
                }
            });
        }
        var buildAxisBound = function () {
            var result = bounds.clone();
            var _a = crossLinePadding.top, top = _a === void 0 ? 0 : _a, _b = crossLinePadding.right, right = _b === void 0 ? 0 : _b, _c = crossLinePadding.bottom, bottom = _c === void 0 ? 0 : _c, _d = crossLinePadding.left, left = _d === void 0 ? 0 : _d;
            result.x += left;
            result.y += top;
            result.width -= left + right;
            result.height -= top + bottom;
            return result;
        };
        var axisBound = buildAxisBound();
        var buildSeriesRect = function () {
            var result = axisBound.clone();
            var top = axisWidths.top, bottom = axisWidths.bottom, left = axisWidths.left, right = axisWidths.right;
            result.x += (left !== null && left !== void 0 ? left : 0);
            result.y += (top !== null && top !== void 0 ? top : 0);
            result.width -= ((left !== null && left !== void 0 ? left : 0)) + ((right !== null && right !== void 0 ? right : 0));
            result.height -= ((top !== null && top !== void 0 ? top : 0)) + ((bottom !== null && bottom !== void 0 ? bottom : 0));
            // Width and height should not be negative.
            result.width = Math.max(0, result.width);
            result.height = Math.max(0, result.height);
            return result;
        };
        var seriesRect = buildSeriesRect();
        var clampToOutsideSeriesRect = function (value, dimension, direction) {
            var x = seriesRect.x, y = seriesRect.y, width = seriesRect.width, height = seriesRect.height;
            var clampBounds = [x, y, x + width, y + height];
            var fn = direction === 1 ? Math.min : Math.max;
            var compareTo = clampBounds[(dimension === 'x' ? 0 : 1) + (direction === 1 ? 0 : 2)];
            return fn(value, compareTo);
        };
        // Set the number of ticks for continuous axes based on the available range
        // before updating the axis domain via `this.updateAxes()` as the tick count has an effect on the calculated `nice` domain extent
        axes.forEach(function (axis) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var position = axis.position, direction = axis.direction;
            visited[position] = (_a = visited[position], (_a !== null && _a !== void 0 ? _a : 0)) + 1;
            var axisLeftRightRange = function (axis) {
                if (axis instanceof CategoryAxis || axis instanceof GroupedCategoryAxis) {
                    return [0, seriesRect.height];
                }
                return [seriesRect.height, 0];
            };
            axis.label.mirrored = ['top', 'right'].includes(position);
            var axisOffset = (_b = newAxisWidths[position], (_b !== null && _b !== void 0 ? _b : 0));
            switch (position) {
                case ChartAxisPosition.Top:
                case ChartAxisPosition.Bottom:
                    axis.range = [0, seriesRect.width];
                    axis.gridLength = seriesRect.height;
                    break;
                case ChartAxisPosition.Right:
                case ChartAxisPosition.Left:
                    axis.range = axisLeftRightRange(axis);
                    axis.gridLength = seriesRect.width;
                    break;
            }
            axis.calculateTickCount();
            if (axis.direction === ChartAxisDirection.X) {
                var min = navigator.min, max = navigator.max, enabled = navigator.enabled;
                if (enabled) {
                    axis.visibleRange = [min, max];
                }
                else {
                    axis.visibleRange = [0, 1];
                }
            }
            if (!clipSeries && (axis.visibleRange[0] > 0 || axis.visibleRange[1] < 1)) {
                clipSeries = true;
            }
            var primaryTickCount = primaryTickCounts[axis.direction];
            (primaryTickCount = axis.calculateDomain({ primaryTickCount: primaryTickCount }).primaryTickCount);
            primaryTickCounts[axis.direction] = primaryTickCount;
            axis.update();
            var axisThickness = 0;
            if (axis.thickness) {
                axisThickness = axis.thickness;
            }
            else {
                var bbox = axis.computeBBox();
                axisThickness = direction === ChartAxisDirection.X ? bbox.height : bbox.width;
            }
            // for multiple axes in the same direction and position, apply padding at the top of each inner axis (i.e. between axes).
            var axisPadding = 15;
            var visitCount = (_c = visited[position], (_c !== null && _c !== void 0 ? _c : 0));
            if (visitCount > 1) {
                axisThickness += axisPadding;
            }
            axisThickness = Math.ceil(axisThickness);
            switch (position) {
                case ChartAxisPosition.Top:
                    axis.translation.x = axisBound.x + (_d = axisWidths.left, (_d !== null && _d !== void 0 ? _d : 0));
                    axis.translation.y = clampToOutsideSeriesRect(axisBound.y + 1 + axisOffset + axisThickness, 'y', 1);
                    break;
                case ChartAxisPosition.Bottom:
                    axis.translation.x = axisBound.x + (_e = axisWidths.left, (_e !== null && _e !== void 0 ? _e : 0));
                    axis.translation.y = clampToOutsideSeriesRect(axisBound.y + axisBound.height + 1 - axisThickness - axisOffset, 'y', -1);
                    break;
                case ChartAxisPosition.Left:
                    axis.translation.y = axisBound.y + (_f = axisWidths.top, (_f !== null && _f !== void 0 ? _f : 0));
                    axis.translation.x = clampToOutsideSeriesRect(axisBound.x + axisOffset + axisThickness, 'x', 1);
                    break;
                case ChartAxisPosition.Right:
                    axis.translation.y = axisBound.y + (_g = axisWidths.top, (_g !== null && _g !== void 0 ? _g : 0));
                    axis.translation.x = clampToOutsideSeriesRect(axisBound.x + axisBound.width - axisThickness - axisOffset, 'x', -1);
                    break;
            }
            axis.update();
            newAxisWidths[position] = (_h = newAxisWidths[position], (_h !== null && _h !== void 0 ? _h : 0)) + axisThickness;
        });
        return { clipSeries: clipSeries, seriesRect: seriesRect, axisWidths: newAxisWidths };
    };
    CartesianChart.className = 'CartesianChart';
    CartesianChart.type = 'cartesian';
    return CartesianChart;
}(Chart));

var __extends$o = (undefined && undefined.__extends) || (function () {
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
var HierarchyChart = /** @class */ (function (_super) {
    __extends$o(HierarchyChart, _super);
    function HierarchyChart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this, document) || this;
        _this._data = {};
        _this._seriesRoot = new ClipRect();
        // Prevent the scene from rendering chart components in an invalid state
        // (before first layout is performed).
        _this.scene.root.visible = false;
        var root = _this.scene.root;
        root.append(_this.seriesRoot);
        root.append(_this.legend.group);
        return _this;
    }
    Object.defineProperty(HierarchyChart.prototype, "seriesRoot", {
        get: function () {
            return this._seriesRoot;
        },
        enumerable: true,
        configurable: true
    });
    HierarchyChart.prototype.performLayout = function () {
        this.scene.root.visible = true;
        var _a = this, width = _a.width, height = _a.height, legend = _a.legend;
        var shrinkRect = new BBox(0, 0, width, height);
        var _b = this.positionCaptions().captionAutoPadding, captionAutoPadding = _b === void 0 ? 0 : _b;
        this.positionLegend(captionAutoPadding);
        if (legend.enabled && legend.data.length) {
            var legendAutoPadding = this.legendAutoPadding;
            var legendPadding = this.legend.spacing;
            shrinkRect.x += legendAutoPadding.left;
            shrinkRect.y += legendAutoPadding.top;
            shrinkRect.width -= legendAutoPadding.left + legendAutoPadding.right;
            shrinkRect.height -= legendAutoPadding.top + legendAutoPadding.bottom;
            switch (this.legend.position) {
                case 'right':
                    shrinkRect.width -= legendPadding;
                    break;
                case 'bottom':
                    shrinkRect.height -= legendPadding;
                    break;
                case 'left':
                    shrinkRect.x += legendPadding;
                    shrinkRect.width -= legendPadding;
                    break;
                case 'top':
                    shrinkRect.y += legendPadding;
                    shrinkRect.height -= legendPadding;
                    break;
            }
        }
        var padding = this.padding;
        shrinkRect.x += padding.left;
        shrinkRect.width -= padding.left + padding.right;
        shrinkRect.y += padding.top + captionAutoPadding;
        shrinkRect.height -= padding.top + captionAutoPadding + padding.bottom;
        this.seriesRect = shrinkRect;
        this.series.forEach(function (series) {
            series.group.translationX = Math.floor(shrinkRect.x);
            series.group.translationY = Math.floor(shrinkRect.y);
            series.update(); // this has to happen after the `updateAxes` call
        });
        var seriesRoot = this.seriesRoot;
        seriesRoot.x = shrinkRect.x;
        seriesRoot.y = shrinkRect.y;
        seriesRoot.width = shrinkRect.width;
        seriesRoot.height = shrinkRect.height;
    };
    HierarchyChart.className = 'HierarchyChart';
    HierarchyChart.type = 'hierarchy';
    return HierarchyChart;
}(Chart));

var __extends$n = (undefined && undefined.__extends) || (function () {
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
var GroupedCategoryChart = /** @class */ (function (_super) {
    __extends$n(GroupedCategoryChart, _super);
    function GroupedCategoryChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedCategoryChart.className = 'GroupedCategoryChart';
    GroupedCategoryChart.type = 'groupedCategory';
    return GroupedCategoryChart;
}(CartesianChart));

var __extends$m = (undefined && undefined.__extends) || (function () {
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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PolarSeries = /** @class */ (function (_super) {
    __extends$m(PolarSeries, _super);
    function PolarSeries() {
        var _a;
        var _this = _super.call(this, { pickModes: [SeriesNodePickMode.EXACT_SHAPE_MATCH] }) || this;
        _this.directionKeys = (_a = {},
            _a[ChartAxisDirection.X] = ['angleKey'],
            _a[ChartAxisDirection.Y] = ['radiusKey'],
            _a);
        /**
         * The center of the polar series (for example, the center of a pie).
         * If the polar chart has multiple series, all of them will have their
         * center set to the same value as a result of the polar chart layout.
         * The center coordinates are not supposed to be set by the user.
         */
        _this.centerX = 0;
        _this.centerY = 0;
        /**
         * The maximum radius the series can use.
         * This value is set automatically as a result of the polar chart layout
         * and is not supposed to be set by the user.
         */
        _this.radius = 0;
        return _this;
    }
    PolarSeries.prototype.getLabelData = function () {
        return [];
    };
    return PolarSeries;
}(Series));
/** @class */ ((function (_super) {
    __extends$m(PolarSeriesMarker, _super);
    function PolarSeriesMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], PolarSeriesMarker.prototype, "formatter", void 0);
    return PolarSeriesMarker;
})(SeriesMarker));

var __extends$l = (undefined && undefined.__extends) || (function () {
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
var PolarChart = /** @class */ (function (_super) {
    __extends$l(PolarChart, _super);
    function PolarChart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this, document) || this;
        _this.padding = new Padding(40);
        _this.scene.root.append(_this.legend.group);
        return _this;
    }
    Object.defineProperty(PolarChart.prototype, "seriesRoot", {
        get: function () {
            return this.scene.root;
        },
        enumerable: true,
        configurable: true
    });
    PolarChart.prototype.performLayout = function () {
        var shrinkRect = new BBox(0, 0, this.width, this.height);
        var _a = this.positionCaptions().captionAutoPadding, captionAutoPadding = _a === void 0 ? 0 : _a;
        this.positionLegend(captionAutoPadding);
        shrinkRect.y += captionAutoPadding;
        shrinkRect.height -= captionAutoPadding;
        if (this.legend.enabled && this.legend.data.length) {
            var legendAutoPadding = this.legendAutoPadding;
            shrinkRect.x += legendAutoPadding.left;
            shrinkRect.y += legendAutoPadding.top;
            shrinkRect.width -= legendAutoPadding.left + legendAutoPadding.right;
            shrinkRect.height -= legendAutoPadding.top + legendAutoPadding.bottom;
            var legendPadding = this.legend.spacing;
            switch (this.legend.position) {
                case 'right':
                    shrinkRect.width -= legendPadding;
                    break;
                case 'bottom':
                    shrinkRect.height -= legendPadding;
                    break;
                case 'left':
                    shrinkRect.x += legendPadding;
                    shrinkRect.width -= legendPadding;
                    break;
                case 'top':
                    shrinkRect.y += legendPadding;
                    shrinkRect.height -= legendPadding;
                    break;
            }
        }
        var padding = this.padding;
        shrinkRect.x += padding.left;
        shrinkRect.y += padding.top;
        shrinkRect.width -= padding.left + padding.right;
        shrinkRect.height -= padding.top + padding.bottom;
        this.seriesRect = shrinkRect;
        var centerX = shrinkRect.x + shrinkRect.width / 2;
        var centerY = shrinkRect.y + shrinkRect.height / 2;
        var radius = Math.max(0, Math.min(shrinkRect.width, shrinkRect.height) / 2); // radius shouldn't be negative
        this.series.forEach(function (series) {
            if (series instanceof PolarSeries) {
                series.centerX = centerX;
                series.centerY = centerY;
                series.radius = radius;
            }
        });
    };
    PolarChart.className = 'PolarChart';
    PolarChart.type = 'polar';
    return PolarChart;
}(Chart));

function equal(a, b) {
    if (a === b)
        return true;
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor)
            return false;
        var length_1, i = void 0;
        if (Array.isArray(a)) {
            length_1 = a.length;
            if (length_1 != b.length)
                return false;
            for (i = length_1; i-- !== 0;)
                if (!equal(a[i], b[i]))
                    return false;
            return true;
        }
        if (a.constructor === RegExp)
            return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString();
        var keys = Object.keys(a);
        length_1 = keys.length;
        if (length_1 !== Object.keys(b).length)
            return false;
        for (i = length_1; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
                return false;
        for (i = length_1; i-- !== 0;) {
            var key = keys[i];
            if (!equal(a[key], b[key]))
                return false;
        }
        return true;
    }
    // true if both NaN, false otherwise
    return a !== a && b !== b;
}

var __read$d = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var interpolatePattern = /(#\{(.*?)\})/g;
function interpolate(input, values, formats) {
    return input.replace(interpolatePattern, function () {
        var name = arguments[2];
        var _a = __read$d(name.split(':'), 2), valueName = _a[0], formatName = _a[1];
        var value = values[valueName];
        if (typeof value === 'number') {
            var format = formatName && formats && formats[formatName];
            if (format) {
                var _b = format, locales = _b.locales, options = _b.options;
                return value.toLocaleString(locales, options);
            }
            return String(value);
        }
        if (value instanceof Date) {
            var format = formatName && formats && formats[formatName];
            if (typeof format === 'string') {
                var formatter = locale.format(format);
                return formatter(value);
            }
            return value.toDateString();
        }
        if (typeof value === 'string' || (value && value.toString)) {
            return String(value);
        }
        return '';
    });
}

var element = null;
function sanitizeHtml(text) {
    element = element || document.createElement('div');
    if (!text) {
        return '';
    }
    element.innerText = text;
    return element.innerHTML;
}

var __extends$k = (undefined && undefined.__extends) || (function () {
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
var __values$8 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$c = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var AreaSeriesLabel = /** @class */ (function (_super) {
    __extends$k(AreaSeriesLabel, _super);
    function AreaSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.formatter = undefined;
        return _this;
    }
    return AreaSeriesLabel;
}(Label));
var AreaSeriesTooltip = /** @class */ (function (_super) {
    __extends$k(AreaSeriesTooltip, _super);
    function AreaSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        _this.format = undefined;
        return _this;
    }
    return AreaSeriesTooltip;
}(SeriesTooltip));
var AreaSeriesTag;
(function (AreaSeriesTag) {
    AreaSeriesTag[AreaSeriesTag["Fill"] = 0] = "Fill";
    AreaSeriesTag[AreaSeriesTag["Stroke"] = 1] = "Stroke";
    AreaSeriesTag[AreaSeriesTag["Marker"] = 2] = "Marker";
    AreaSeriesTag[AreaSeriesTag["Label"] = 3] = "Label";
})(AreaSeriesTag || (AreaSeriesTag = {}));
var AreaSeries = /** @class */ (function (_super) {
    __extends$k(AreaSeries, _super);
    function AreaSeries() {
        var _this = _super.call(this, {
            pathsPerSeries: 2,
            pathsZIndexSubOrderOffset: [0, 1000],
            pickGroupIncludes: ['markers'],
            features: ['markers'],
        }) || this;
        _this.tooltip = new AreaSeriesTooltip();
        _this.xData = [];
        _this.yData = [];
        _this.yDomain = [];
        _this.xDomain = [];
        _this.directionKeys = {
            x: ['xKey'],
            y: ['yKeys'],
        };
        _this.marker = new CartesianSeriesMarker();
        _this.label = new AreaSeriesLabel();
        _this.fills = ['#c16068', '#a2bf8a', '#ebcc87', '#80a0c3', '#b58dae', '#85c0d1'];
        _this.strokes = ['#874349', '#718661', '#a48f5f', '#5a7088', '#7f637a', '#5d8692'];
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this._xKey = '';
        _this.xName = '';
        _this._yKeys = [];
        _this.yNames = [];
        _this.strokeWidth = 2;
        _this.shadow = undefined;
        var _a = _this, marker = _a.marker, label = _a.label;
        marker.enabled = false;
        label.enabled = false;
        return _this;
    }
    Object.defineProperty(AreaSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            this._xKey = value;
            this.xData = [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AreaSeries.prototype, "yKeys", {
        get: function () {
            return this._yKeys;
        },
        set: function (values) {
            if (!equal(this._yKeys, values)) {
                this._yKeys = values;
                this.yData = [];
                this.processSeriesItemEnabled();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AreaSeries.prototype, "visibles", {
        get: function () {
            return this._visibles;
        },
        set: function (visibles) {
            this._visibles = visibles;
            this.processSeriesItemEnabled();
        },
        enumerable: true,
        configurable: true
    });
    AreaSeries.prototype.processSeriesItemEnabled = function () {
        var _a = this, seriesItemEnabled = _a.seriesItemEnabled, _b = _a._visibles, visibles = _b === void 0 ? [] : _b;
        seriesItemEnabled.clear();
        this._yKeys.forEach(function (key, idx) { var _a; return seriesItemEnabled.set(key, (_a = visibles[idx], (_a !== null && _a !== void 0 ? _a : true))); });
    };
    AreaSeries.prototype.setColors = function (fills, strokes) {
        this.fills = fills;
        this.strokes = strokes;
    };
    Object.defineProperty(AreaSeries.prototype, "normalizedTo", {
        get: function () {
            return this._normalizedTo;
        },
        set: function (value) {
            var absValue = value ? Math.abs(value) : undefined;
            if (this._normalizedTo !== absValue) {
                this._normalizedTo = absValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    AreaSeries.prototype.processData = function () {
        var e_1, _a, e_2, _b, e_3, _c;
        var _d = this, xKey = _d.xKey, yKeys = _d.yKeys, seriesItemEnabled = _d.seriesItemEnabled, xAxis = _d.xAxis, yAxis = _d.yAxis, normalizedTo = _d.normalizedTo;
        var data = xKey && yKeys.length && this.data ? this.data : [];
        if (!xAxis || !yAxis) {
            return false;
        }
        // If the data is an array of rows like so:
        //
        // [{
        //   xKey: 'Jan',
        //   yKey1: 5,
        //   yKey2: 7,
        //   yKey3: -9,
        // }, {
        //   xKey: 'Feb',
        //   yKey1: 10,
        //   yKey2: -15,
        //   yKey3: 20
        // }]
        //
        var isContinuousX = xAxis.scale instanceof ContinuousScale;
        var isContinuousY = yAxis.scale instanceof ContinuousScale;
        var normalized = normalizedTo && isFinite(normalizedTo);
        var yData = [];
        var xData = [];
        var xValues = [];
        var _loop_1 = function (datum) {
            // X datum
            if (!(xKey in datum)) {
                doOnce(function () { return console.warn("The key '" + xKey + "' was not found in the data: ", datum); }, xKey + " not found in data");
                return "continue";
            }
            var xDatum = checkDatum(datum[xKey], isContinuousX);
            if (isContinuousX && xDatum === undefined) {
                return "continue";
            }
            else {
                xValues.push(xDatum);
                xData.push({ xDatum: xDatum, seriesDatum: datum });
            }
            // Y datum
            yKeys.forEach(function (yKey, i) {
                if (!(yKey in datum)) {
                    doOnce(function () { return console.warn("The key '" + yKey + "' was not found in the data: ", datum); }, yKey + " not found in data");
                    return;
                }
                var value = datum[yKey];
                var seriesYs = yData[i] || (yData[i] = []);
                if (!seriesItemEnabled.get(yKey)) {
                    seriesYs.push(NaN);
                }
                else {
                    var yDatum = checkDatum(value, isContinuousY);
                    seriesYs.push(yDatum);
                }
            });
        };
        try {
            for (var data_1 = __values$8(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var datum = data_1_1.value;
                _loop_1(datum);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.yData = yData;
        this.xData = xData;
        this.xDomain = isContinuousX ? this.fixNumericExtent(extent(xValues, isContinuous), xAxis) : xValues;
        // xData: ['Jan', 'Feb', undefined]
        //
        // yData: [
        //   [5, 10], <- series 1 (yKey1)
        //   [7, -15], <- series 2 (yKey2)
        //   [-9, 20] <- series 3 (yKey3)
        // ]
        var yMin = undefined;
        var yMax = undefined;
        for (var i = 0; i < xData.length; i++) {
            var total = { sum: 0, absSum: 0 };
            try {
                for (var yData_1 = (e_2 = void 0, __values$8(yData)), yData_1_1 = yData_1.next(); !yData_1_1.done; yData_1_1 = yData_1.next()) {
                    var seriesYs = yData_1_1.value;
                    if (seriesYs[i] === undefined || isNaN(seriesYs[i])) {
                        continue;
                    }
                    var y = +seriesYs[i]; // convert to number as the value could be a Date object
                    total.absSum += Math.abs(y);
                    total.sum += y;
                    if (total.sum >= ((yMax !== null && yMax !== void 0 ? yMax : 0))) {
                        yMax = total.sum;
                    }
                    else if (total.sum <= ((yMin !== null && yMin !== void 0 ? yMin : 0))) {
                        yMin = total.sum;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (yData_1_1 && !yData_1_1.done && (_b = yData_1.return)) _b.call(yData_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (!(normalized && normalizedTo)) {
                continue;
            }
            var normalizedTotal = undefined;
            try {
                // normalize y values using the absolute sum of y values in the stack
                for (var yData_2 = (e_3 = void 0, __values$8(yData)), yData_2_1 = yData_2.next(); !yData_2_1.done; yData_2_1 = yData_2.next()) {
                    var seriesYs = yData_2_1.value;
                    var normalizedY = (+seriesYs[i] / total.absSum) * normalizedTo;
                    seriesYs[i] = normalizedY;
                    if (!isNaN(normalizedY)) {
                        // sum normalized values to get updated yMin and yMax of normalized area
                        normalizedTotal = ((normalizedTotal !== null && normalizedTotal !== void 0 ? normalizedTotal : 0)) + normalizedY;
                    }
                    else {
                        continue;
                    }
                    if (normalizedTotal >= ((yMax !== null && yMax !== void 0 ? yMax : 0))) {
                        yMax = normalizedTotal;
                    }
                    else if (normalizedTotal <= ((yMin !== null && yMin !== void 0 ? yMin : 0))) {
                        yMin = normalizedTotal;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (yData_2_1 && !yData_2_1.done && (_c = yData_2.return)) _c.call(yData_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        if (normalized && normalizedTo) {
            // multiplier to control the unused whitespace in the y domain, value selected by subjective visual 'niceness'.
            var domainWhitespaceAdjustment = 0.5;
            // set the yMin and yMax based on cumulative sum of normalized values
            yMin = ((yMin !== null && yMin !== void 0 ? yMin : 0)) < -normalizedTo * domainWhitespaceAdjustment ? -normalizedTo : yMin;
            yMax = ((yMax !== null && yMax !== void 0 ? yMax : 0)) > normalizedTo * domainWhitespaceAdjustment ? normalizedTo : yMax;
        }
        this.yDomain = this.fixNumericExtent(yMin === undefined && yMax === undefined ? undefined : [(yMin !== null && yMin !== void 0 ? yMin : 0), (yMax !== null && yMax !== void 0 ? yMax : 0)], yAxis);
        return true;
    };
    AreaSeries.prototype.getDomain = function (direction) {
        if (direction === ChartAxisDirection.X) {
            return this.xDomain;
        }
        else {
            return this.yDomain;
        }
    };
    AreaSeries.prototype.createNodeData = function () {
        var _this = this;
        var _a = this, data = _a.data, xAxis = _a.xAxis, yAxis = _a.yAxis, xData = _a.xData, yData = _a.yData;
        if (!data || !xAxis || !yAxis || !xData.length || !yData.length) {
            return [];
        }
        var contexts = [];
        var _b = this, yKeys = _b.yKeys, marker = _b.marker, label = _b.label, fills = _b.fills, strokes = _b.strokes;
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var continuousY = yScale instanceof ContinuousScale;
        var xOffset = (xScale.bandwidth || 0) / 2;
        var cumulativePathValues = new Array(xData.length)
            .fill(null)
            .map(function () { return ({ left: 0, right: 0 }); });
        var cumulativeMarkerValues = new Array(xData.length).fill(0);
        var createPathCoordinates = function (xDatum, yDatum, idx, side) {
            var x = xScale.convert(xDatum) + xOffset;
            var prevY = cumulativePathValues[idx][side];
            var currY = cumulativePathValues[idx][side] + yDatum;
            var prevYCoordinate = yScale.convert(prevY, continuousY ? clamper$1 : undefined);
            var currYCoordinate = yScale.convert(currY, continuousY ? clamper$1 : undefined);
            cumulativePathValues[idx][side] = currY;
            return [
                { x: x, y: currYCoordinate, size: marker.size },
                { x: x, y: prevYCoordinate, size: marker.size },
            ];
        };
        var createMarkerCoordinate = function (xDatum, yDatum, idx, rawYDatum) {
            var currY;
            // if not normalized, the invalid data points will be processed as `undefined` in processData()
            // if normalized, the invalid data points will be processed as 0 rather than `undefined`
            // check if unprocessed datum is valid as we only want to show markers for valid points
            var normalized = _this.normalizedTo && isFinite(_this.normalizedTo);
            var normalizedAndValid = normalized && continuousY && isContinuous(rawYDatum);
            var valid = (!normalized && !isNaN(rawYDatum)) || normalizedAndValid;
            if (valid) {
                currY = cumulativeMarkerValues[idx] += yDatum;
            }
            var x = xScale.convert(xDatum) + xOffset;
            var y = yScale.convert(currY, continuousY ? clamper$1 : undefined);
            return { x: x, y: y, size: marker.size };
        };
        yData.forEach(function (seriesYs, seriesIdx) {
            var yKey = yKeys[seriesIdx];
            var labelSelectionData = [];
            var markerSelectionData = [];
            var strokeSelectionData = { itemId: yKey, points: [], yValues: [] };
            var fillSelectionData = { itemId: yKey, points: [] };
            contexts[seriesIdx] = {
                itemId: yKey,
                fillSelectionData: fillSelectionData,
                labelData: labelSelectionData,
                nodeData: markerSelectionData,
                strokeSelectionData: strokeSelectionData,
            };
            if (!_this.seriesItemEnabled.get(yKey)) {
                return;
            }
            var fillPoints = fillSelectionData.points;
            var fillPhantomPoints = [];
            var strokePoints = strokeSelectionData.points;
            var yValues = strokeSelectionData.yValues;
            seriesYs.forEach(function (rawYDatum, datumIdx) {
                var _a;
                var yDatum = isNaN(rawYDatum) ? undefined : rawYDatum;
                var _b = xData[datumIdx], xDatum = _b.xDatum, seriesDatum = _b.seriesDatum;
                var nextXDatum = (_a = xData[datumIdx + 1]) === null || _a === void 0 ? void 0 : _a.xDatum;
                var rawNextYDatum = seriesYs[datumIdx + 1];
                var nextYDatum = isNaN(rawNextYDatum) ? undefined : rawNextYDatum;
                // marker data
                var point = createMarkerCoordinate(xDatum, +yDatum, datumIdx, seriesDatum[yKey]);
                if (marker) {
                    markerSelectionData.push({
                        index: datumIdx,
                        series: _this,
                        itemId: yKey,
                        datum: seriesDatum,
                        yValue: yDatum,
                        yKey: yKey,
                        point: point,
                        fill: fills[seriesIdx % fills.length],
                        stroke: strokes[seriesIdx % strokes.length],
                    });
                }
                // label data
                var labelText;
                if (label.formatter) {
                    labelText = label.formatter({ value: yDatum });
                }
                else {
                    labelText = isNumber(yDatum) ? Number(yDatum).toFixed(2) : String(yDatum);
                }
                if (label) {
                    labelSelectionData.push({
                        index: datumIdx,
                        itemId: yKey,
                        point: point,
                        label: _this.seriesItemEnabled.get(yKey) && labelText
                            ? {
                                text: labelText,
                                fontStyle: label.fontStyle,
                                fontWeight: label.fontWeight,
                                fontSize: label.fontSize,
                                fontFamily: label.fontFamily,
                                textAlign: 'center',
                                textBaseline: 'bottom',
                                fill: label.color,
                            }
                            : undefined,
                    });
                }
                // fill data
                // Handle data in pairs of current and next x and y values
                var windowX = [xDatum, nextXDatum];
                var windowY = [yDatum, nextYDatum];
                if (windowX.some(function (v) { return v == undefined; })) {
                    return;
                }
                if (windowY.some(function (v) { return v == undefined; })) {
                    windowY[0] = 0;
                    windowY[1] = 0;
                }
                var currCoordinates = createPathCoordinates(windowX[0], +windowY[0], datumIdx, 'right');
                fillPoints.push(currCoordinates[0]);
                fillPhantomPoints.push(currCoordinates[1]);
                var nextCoordinates = createPathCoordinates(windowX[1], +windowY[1], datumIdx, 'left');
                fillPoints.push(nextCoordinates[0]);
                fillPhantomPoints.push(nextCoordinates[1]);
                // stroke data
                strokePoints.push({ x: NaN, y: NaN }); // moveTo
                yValues.push(undefined);
                strokePoints.push(currCoordinates[0]);
                yValues.push(yDatum);
                if (nextYDatum !== undefined) {
                    strokePoints.push(nextCoordinates[0]);
                    yValues.push(yDatum);
                }
            });
            for (var i = fillPhantomPoints.length - 1; i >= 0; i--) {
                fillPoints.push(fillPhantomPoints[i]);
            }
        });
        return contexts;
    };
    AreaSeries.prototype.isPathOrSelectionDirty = function () {
        return this.marker.isDirty();
    };
    AreaSeries.prototype.updatePaths = function (opts) {
        var _a = opts.contextData, fillSelectionData = _a.fillSelectionData, strokeSelectionData = _a.strokeSelectionData, _b = __read$c(opts.paths, 2), fill = _b[0], stroke = _b[1];
        fill.datum = fillSelectionData;
        fill.tag = AreaSeriesTag.Fill;
        fill.lineJoin = 'round';
        fill.stroke = undefined;
        fill.pointerEvents = PointerEvents.None;
        stroke.datum = strokeSelectionData;
        stroke.tag = AreaSeriesTag.Stroke;
        stroke.fill = undefined;
        stroke.lineJoin = stroke.lineCap = 'round';
        stroke.pointerEvents = PointerEvents.None;
    };
    AreaSeries.prototype.updatePathNodes = function (opts) {
        var e_4, _a, e_5, _b;
        var _c = __read$c(opts.paths, 2), fill = _c[0], stroke = _c[1], seriesIdx = opts.seriesIdx, itemId = opts.itemId;
        var _d = this, strokes = _d.strokes, fills = _d.fills, fillOpacity = _d.fillOpacity, strokeOpacity = _d.strokeOpacity, strokeWidth = _d.strokeWidth, shadow = _d.shadow;
        {
            var points = fill.datum.points;
            fill.fill = fills[seriesIdx % fills.length];
            fill.fillOpacity = fillOpacity;
            fill.strokeOpacity = strokeOpacity;
            fill.strokeWidth = strokeWidth;
            fill.lineDash = this.lineDash;
            fill.lineDashOffset = this.lineDashOffset;
            fill.fillShadow = shadow;
            var path = fill.path;
            path.clear({ trackChanges: true });
            var i = 0;
            try {
                for (var points_1 = __values$8(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                    var p = points_1_1.value;
                    if (i++ > 0) {
                        path.lineTo(p.x, p.y);
                    }
                    else {
                        path.moveTo(p.x, p.y);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            path.closePath();
            fill.checkPathDirty();
        }
        {
            var _e = stroke.datum, points = _e.points, yValues = _e.yValues;
            var moveTo_1 = true;
            stroke.stroke = strokes[seriesIdx % strokes.length];
            stroke.strokeWidth = this.getStrokeWidth(this.strokeWidth, { itemId: itemId });
            stroke.strokeOpacity = strokeOpacity;
            stroke.lineDash = this.lineDash;
            stroke.lineDashOffset = this.lineDashOffset;
            var path = stroke.path;
            path.clear({ trackChanges: true });
            var i = 0;
            try {
                for (var points_2 = __values$8(points), points_2_1 = points_2.next(); !points_2_1.done; points_2_1 = points_2.next()) {
                    var p = points_2_1.value;
                    if (yValues[i++] === undefined) {
                        moveTo_1 = true;
                    }
                    else if (moveTo_1) {
                        path.moveTo(p.x, p.y);
                        moveTo_1 = false;
                    }
                    else {
                        path.lineTo(p.x, p.y);
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (points_2_1 && !points_2_1.done && (_b = points_2.return)) _b.call(points_2);
                }
                finally { if (e_5) throw e_5.error; }
            }
            stroke.checkPathDirty();
        }
    };
    AreaSeries.prototype.updateMarkerSelection = function (opts) {
        var nodeData = opts.nodeData, markerSelection = opts.markerSelection;
        var _a = this.marker, enabled = _a.enabled, shape = _a.shape;
        var data = enabled && nodeData ? nodeData : [];
        var MarkerShape = getMarker(shape);
        if (this.marker.isDirty()) {
            markerSelection = markerSelection.setData([]);
            markerSelection.exit.remove();
        }
        var updateMarkerSelection = markerSelection.setData(data);
        updateMarkerSelection.exit.remove();
        var enterMarkers = updateMarkerSelection.enter.append(MarkerShape).each(function (marker) {
            marker.tag = AreaSeriesTag.Marker;
        });
        return updateMarkerSelection.merge(enterMarkers);
    };
    AreaSeries.prototype.updateMarkerNodes = function (opts) {
        var markerSelection = opts.markerSelection, isDatumHighlighted = opts.isHighlight;
        var _a = this, xKey = _a.xKey, marker = _a.marker, seriesItemEnabled = _a.seriesItemEnabled, yKeys = _a.yKeys, fills = _a.fills, strokes = _a.strokes, seriesFillOpacity = _a.fillOpacity, _b = _a.marker.fillOpacity, markerFillOpacity = _b === void 0 ? seriesFillOpacity : _b, strokeOpacity = _a.strokeOpacity, _c = _a.highlightStyle, deprecatedFill = _c.fill, deprecatedStroke = _c.stroke, deprecatedStrokeWidth = _c.strokeWidth, _d = _c.item, _e = _d.fill, highlightedFill = _e === void 0 ? deprecatedFill : _e, _f = _d.fillOpacity, highlightFillOpacity = _f === void 0 ? markerFillOpacity : _f, _g = _d.stroke, highlightedStroke = _g === void 0 ? deprecatedStroke : _g, _h = _d.strokeWidth, highlightedDatumStrokeWidth = _h === void 0 ? deprecatedStrokeWidth : _h;
        var size = marker.size, formatter = marker.formatter;
        var markerStrokeWidth = marker.strokeWidth !== undefined ? marker.strokeWidth : this.strokeWidth;
        markerSelection.each(function (node, datum) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var yKeyIndex = yKeys.indexOf(datum.yKey);
            var fill = isDatumHighlighted && highlightedFill !== undefined
                ? highlightedFill
                : marker.fill || fills[yKeyIndex % fills.length];
            var fillOpacity = isDatumHighlighted ? highlightFillOpacity : markerFillOpacity;
            var stroke = isDatumHighlighted && highlightedStroke !== undefined
                ? highlightedStroke
                : marker.stroke || strokes[yKeyIndex % fills.length];
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : markerStrokeWidth;
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    xKey: xKey,
                    yKey: datum.yKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    size: size,
                    highlighted: isDatumHighlighted,
                });
            }
            node.fill = (format && format.fill) || fill;
            node.stroke = (format && format.stroke) || stroke;
            node.strokeWidth = format && format.strokeWidth !== undefined ? format.strokeWidth : strokeWidth;
            node.fillOpacity = (fillOpacity !== null && fillOpacity !== void 0 ? fillOpacity : 1);
            node.strokeOpacity = (_b = (_a = marker.strokeOpacity, (_a !== null && _a !== void 0 ? _a : strokeOpacity)), (_b !== null && _b !== void 0 ? _b : 1));
            node.size = format && format.size !== undefined ? format.size : size;
            node.translationX = (_d = (_c = datum.point) === null || _c === void 0 ? void 0 : _c.x, (_d !== null && _d !== void 0 ? _d : 0));
            node.translationY = (_f = (_e = datum.point) === null || _e === void 0 ? void 0 : _e.y, (_f !== null && _f !== void 0 ? _f : 0));
            node.visible =
                node.size > 0 &&
                    !!seriesItemEnabled.get(datum.yKey) &&
                    !isNaN(((_g = datum.point) === null || _g === void 0 ? void 0 : _g.x) || 0) &&
                    !isNaN(((_h = datum.point) === null || _h === void 0 ? void 0 : _h.y) || 0);
        });
        if (!isDatumHighlighted) {
            this.marker.markClean();
        }
    };
    AreaSeries.prototype.updateLabelSelection = function (opts) {
        var labelData = opts.labelData, labelSelection = opts.labelSelection;
        var updateLabels = labelSelection.setData(labelData);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text).each(function (text) {
            text.tag = AreaSeriesTag.Label;
        });
        return updateLabels.merge(enterLabels);
    };
    AreaSeries.prototype.updateLabelNodes = function (opts) {
        var labelSelection = opts.labelSelection;
        var _a = this.label, labelEnabled = _a.enabled, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily, color = _a.color;
        labelSelection.each(function (text, datum) {
            var point = datum.point, label = datum.label;
            if (label && labelEnabled) {
                text.fontStyle = fontStyle;
                text.fontWeight = fontWeight;
                text.fontSize = fontSize;
                text.fontFamily = fontFamily;
                text.textAlign = label.textAlign;
                text.textBaseline = label.textBaseline;
                text.text = label.text;
                text.x = point.x;
                text.y = point.y - 10;
                text.fill = color;
                text.visible = true;
            }
            else {
                text.visible = false;
            }
        });
    };
    AreaSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: datum.yKey,
        });
    };
    AreaSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var xKey = this.xKey;
        var yKey = nodeDatum.yKey;
        if (!(xKey && yKey) || !this.seriesItemEnabled.get(yKey)) {
            return '';
        }
        var datum = nodeDatum.datum;
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var _a = this, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!(xAxis && yAxis && isNumber(yValue))) {
            return '';
        }
        var _b = this, xName = _b.xName, yKeys = _b.yKeys, yNames = _b.yNames, yData = _b.yData, fills = _b.fills, strokes = _b.strokes, tooltip = _b.tooltip, marker = _b.marker;
        var size = marker.size, markerFormatter = marker.formatter, markerStrokeWidth = marker.strokeWidth, markerFill = marker.fill, markerStroke = marker.stroke;
        var xString = xAxis.formatDatum(xValue);
        var yString = yAxis.formatDatum(yValue);
        var yKeyIndex = yKeys.indexOf(yKey);
        var seriesYs = yData[yKeyIndex];
        var processedYValue = seriesYs[nodeDatum.index];
        var yName = yNames[yKeyIndex];
        var title = sanitizeHtml(yName);
        var content = sanitizeHtml(xString + ': ' + yString);
        var strokeWidth = markerStrokeWidth !== undefined ? markerStrokeWidth : this.strokeWidth;
        var fill = markerFill || fills[yKeyIndex % fills.length];
        var stroke = markerStroke || strokes[yKeyIndex % fills.length];
        var format = undefined;
        if (markerFormatter) {
            format = markerFormatter({
                datum: datum,
                xKey: xKey,
                yKey: yKey,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                size: size,
                highlighted: false,
            });
        }
        var color = (format && format.fill) || fill;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        var tooltipRenderer = tooltip.renderer, tooltipFormat = tooltip.format;
        if (tooltipFormat || tooltipRenderer) {
            var params = {
                datum: datum,
                xKey: xKey,
                xName: xName,
                xValue: xValue,
                yKey: yKey,
                yValue: yValue,
                processedYValue: processedYValue,
                yName: yName,
                color: color,
                title: title,
            };
            if (tooltipFormat) {
                return toTooltipHtml({
                    content: interpolate(tooltipFormat, params),
                }, defaults);
            }
            if (tooltipRenderer) {
                return toTooltipHtml(tooltipRenderer(params), defaults);
            }
        }
        return toTooltipHtml(defaults);
    };
    AreaSeries.prototype.listSeriesItems = function (legendData) {
        var _a, _b;
        var _c = this, data = _c.data, id = _c.id, xKey = _c.xKey, yKeys = _c.yKeys, yNames = _c.yNames, seriesItemEnabled = _c.seriesItemEnabled, marker = _c.marker, fills = _c.fills, strokes = _c.strokes, fillOpacity = _c.fillOpacity, strokeOpacity = _c.strokeOpacity;
        if (!data || !data.length || !xKey || !yKeys.length) {
            return;
        }
        // Area stacks should be listed in the legend in reverse order, for symmetry with the
        // vertical stack display order.
        for (var index = yKeys.length - 1; index >= 0; index--) {
            var yKey = yKeys[index];
            legendData.push({
                id: id,
                itemId: yKey,
                enabled: seriesItemEnabled.get(yKey) || false,
                label: {
                    text: yNames[index] || yKeys[index],
                },
                marker: {
                    shape: marker.shape,
                    fill: marker.fill || fills[index % fills.length],
                    stroke: marker.stroke || strokes[index % strokes.length],
                    fillOpacity: (_a = marker.fillOpacity, (_a !== null && _a !== void 0 ? _a : fillOpacity)),
                    strokeOpacity: (_b = marker.strokeOpacity, (_b !== null && _b !== void 0 ? _b : strokeOpacity)),
                },
            });
        }
    };
    AreaSeries.className = 'AreaSeries';
    AreaSeries.type = 'area';
    return AreaSeries;
}(CartesianSeries));

var __extends$j = (undefined && undefined.__extends) || (function () {
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
var __read$b = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$7 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$b(arguments[i]));
    return ar;
};
var __values$7 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var BarSeriesNodeTag;
(function (BarSeriesNodeTag) {
    BarSeriesNodeTag[BarSeriesNodeTag["Bar"] = 0] = "Bar";
    BarSeriesNodeTag[BarSeriesNodeTag["Label"] = 1] = "Label";
})(BarSeriesNodeTag || (BarSeriesNodeTag = {}));
var BarLabelPlacement;
(function (BarLabelPlacement) {
    BarLabelPlacement["Inside"] = "inside";
    BarLabelPlacement["Outside"] = "outside";
})(BarLabelPlacement || (BarLabelPlacement = {}));
var BarSeriesLabel = /** @class */ (function (_super) {
    __extends$j(BarSeriesLabel, _super);
    function BarSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.formatter = undefined;
        _this.placement = BarLabelPlacement.Inside;
        return _this;
    }
    return BarSeriesLabel;
}(Label));
var BarSeriesTooltip = /** @class */ (function (_super) {
    __extends$j(BarSeriesTooltip, _super);
    function BarSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        return _this;
    }
    return BarSeriesTooltip;
}(SeriesTooltip));
function flat(arr, target) {
    if (target === void 0) { target = []; }
    arr.forEach(function (v) {
        if (Array.isArray(v)) {
            flat(v, target);
        }
        else {
            target.push(v);
        }
    });
    return target;
}
function is2dArray$1(array) {
    return array.length > 0 && Array.isArray(array[0]);
}
var BarSeries = /** @class */ (function (_super) {
    __extends$j(BarSeries, _super);
    function BarSeries() {
        var _a;
        var _this = _super.call(this, {
            pickGroupIncludes: ['datumNodes'],
            pickModes: [SeriesNodePickMode.EXACT_SHAPE_MATCH],
            pathsPerSeries: 0,
        }) || this;
        _this.xData = [];
        _this.yData = [];
        _this.yDomain = [];
        _this.label = new BarSeriesLabel();
        _this.tooltip = new BarSeriesTooltip();
        _this.flipXY = false;
        _this.fills = ['#c16068', '#a2bf8a', '#ebcc87', '#80a0c3', '#b58dae', '#85c0d1'];
        _this.strokes = ['#874349', '#718661', '#a48f5f', '#5a7088', '#7f637a', '#5d8692'];
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this.formatter = undefined;
        /**
         * Used to get the position of bars within each group.
         */
        _this.groupScale = new BandScale();
        _this.directionKeys = (_a = {},
            _a[ChartAxisDirection.X] = ['xKey'],
            _a[ChartAxisDirection.Y] = ['yKeys'],
            _a);
        _this._xKey = '';
        _this.xName = '';
        _this.cumYKeyCount = [];
        _this.flatYKeys = undefined; // only set when a user used a flat array for yKeys
        _this.hideInLegend = [];
        /**
         * yKeys: [['coffee']] - regular bars, each category has a single bar that shows a value for coffee
         * yKeys: [['coffee'], ['tea'], ['milk']] - each category has three bars that show values for coffee, tea and milk
         * yKeys: [['coffee', 'tea', 'milk']] - each category has a single bar with three stacks that show values for coffee, tea and milk
         * yKeys: [['coffee', 'tea', 'milk'], ['paper', 'ink']] - each category has 2 stacked bars,
         *     first showing values for coffee, tea and milk and second values for paper and ink
         */
        _this._yKeys = [];
        _this._grouped = false;
        /**
         * A map of `yKeys` to their names (used in legends and tooltips).
         * For example, if a key is `product_name` it's name can be a more presentable `Product Name`.
         */
        _this._yNames = {};
        _this.strokeWidth = 1;
        _this.shadow = undefined;
        _this.smallestDataInterval = undefined;
        _this.label.enabled = false;
        return _this;
    }
    BarSeries.prototype.getKeys = function (direction) {
        var _this = this;
        var directionKeys = this.directionKeys;
        var keys = directionKeys && directionKeys[this.flipXY ? flipChartAxisDirection(direction) : direction];
        var values = [];
        if (keys) {
            keys.forEach(function (key) {
                var value = _this[key];
                if (value) {
                    if (Array.isArray(value)) {
                        values = values.concat(flat(value));
                    }
                    else {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    };
    Object.defineProperty(BarSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            this._xKey = value;
            this.xData = [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "yKeys", {
        get: function () {
            return this._yKeys;
        },
        set: function (yKeys) {
            var _this = this;
            var flatYKeys = undefined;
            // Convert from flat y-keys to grouped y-keys.
            if (!is2dArray$1(yKeys)) {
                flatYKeys = yKeys;
                yKeys = this.grouped ? flatYKeys.map(function (k) { return [k]; }) : [flatYKeys];
            }
            if (!equal(this._yKeys, yKeys)) {
                this.flatYKeys = flatYKeys ? flatYKeys : undefined;
                this._yKeys = yKeys;
                var prevYKeyCount_1 = 0;
                this.cumYKeyCount = [];
                var visibleStacks_1 = [];
                yKeys.forEach(function (stack, index) {
                    if (stack.length > 0) {
                        visibleStacks_1.push(String(index));
                    }
                    _this.cumYKeyCount.push(prevYKeyCount_1);
                    prevYKeyCount_1 += stack.length;
                });
                this.yData = [];
                this.processSeriesItemEnabled();
                var groupScale = this.groupScale;
                groupScale.domain = visibleStacks_1;
                groupScale.padding = 0.1;
                groupScale.round = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "visibles", {
        get: function () {
            return this._visibles;
        },
        set: function (visibles) {
            var flattenFn = function (r, n) { return r.concat.apply(r, __spread$7((Array.isArray(n) ? n : [n]))); };
            this._visibles = visibles.reduce(flattenFn, []);
            this.processSeriesItemEnabled();
        },
        enumerable: true,
        configurable: true
    });
    BarSeries.prototype.processSeriesItemEnabled = function () {
        var _a = this, seriesItemEnabled = _a.seriesItemEnabled, _b = _a._visibles, visibles = _b === void 0 ? [] : _b;
        seriesItemEnabled.clear();
        var visiblesIdx = 0;
        this._yKeys.forEach(function (stack) {
            stack.forEach(function (yKey) { var _a, _b; return seriesItemEnabled.set(yKey, (_b = (_a = visibles) === null || _a === void 0 ? void 0 : _a[visiblesIdx++], (_b !== null && _b !== void 0 ? _b : true))); });
        });
    };
    Object.defineProperty(BarSeries.prototype, "grouped", {
        get: function () {
            return this._grouped;
        },
        set: function (value) {
            if (this._grouped !== value) {
                this._grouped = value;
                if (this.flatYKeys) {
                    this.yKeys = this.flatYKeys;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "yNames", {
        get: function () {
            return this._yNames;
        },
        set: function (values) {
            if (Array.isArray(values) && this.flatYKeys) {
                var map_1 = {};
                this.flatYKeys.forEach(function (k, i) {
                    map_1[k] = values[i];
                });
                values = map_1;
            }
            this._yNames = values;
        },
        enumerable: true,
        configurable: true
    });
    BarSeries.prototype.setColors = function (fills, strokes) {
        this.fills = fills;
        this.strokes = strokes;
    };
    Object.defineProperty(BarSeries.prototype, "normalizedTo", {
        get: function () {
            return this._normalizedTo;
        },
        set: function (value) {
            var absValue = value ? Math.abs(value) : undefined;
            this._normalizedTo = absValue;
        },
        enumerable: true,
        configurable: true
    });
    BarSeries.prototype.processData = function () {
        var _this = this;
        var _a = this, xKey = _a.xKey, yKeys = _a.yKeys, seriesItemEnabled = _a.seriesItemEnabled;
        var data = xKey && yKeys.length && this.data ? this.data : [];
        var xAxis = this.getCategoryAxis();
        var yAxis = this.getValueAxis();
        if (!(xAxis && yAxis)) {
            return false;
        }
        var setSmallestXInterval = function (curr, prev) {
            if (_this.smallestDataInterval === undefined) {
                _this.smallestDataInterval = { x: Infinity, y: Infinity };
            }
            var x = _this.smallestDataInterval.x;
            var interval = Math.abs(curr - prev);
            if (interval > 0 && interval < x) {
                _this.smallestDataInterval.x = interval;
            }
        };
        var isContinuousX = xAxis.scale instanceof ContinuousScale;
        var isContinuousY = yAxis.scale instanceof ContinuousScale;
        var keysFound = true; // only warn once
        var prevX = Infinity;
        this.xData = data.map(function (datum) {
            if (keysFound && !(xKey in datum)) {
                keysFound = false;
                console.warn("The key '" + xKey + "' was not found in the data: ", datum);
            }
            var x = checkDatum(datum[xKey], isContinuousX);
            if (isContinuousX) {
                setSmallestXInterval(x, prevX);
            }
            prevX = x;
            return x;
        });
        this.yData = data.map(function (datum) {
            return yKeys.map(function (stack) {
                return stack.map(function (yKey) {
                    if (keysFound && !(yKey in datum)) {
                        keysFound = false;
                        console.warn("The key '" + yKey + "' was not found in the data: ", datum);
                    }
                    var yDatum = checkDatum(datum[yKey], isContinuousY);
                    if (!seriesItemEnabled.get(yKey) || yDatum === undefined) {
                        return NaN;
                    }
                    return yDatum;
                });
            });
        });
        // Contains min/max values for each stack in each group,
        // where min is zero and max is a positive total of all values in the stack
        // or min is a negative total of all values in the stack and max is zero.
        var yMinMax = this.yData.map(function (group) { return group.map(function (stack) { return findMinMax(stack); }); });
        var _b = this, yData = _b.yData, normalizedTo = _b.normalizedTo;
        // Calculate the sum of the absolute values of all items in each stack in each group. Used for normalization of stacked bars.
        var yAbsTotal = this.yData.map(function (group) {
            return group.map(function (stack) {
                return stack.reduce(function (acc, stack) {
                    acc += isNaN(stack) ? 0 : Math.abs(stack);
                    return acc;
                }, 0);
            });
        });
        var _c = this.findLargestMinMax(yMinMax), yMin = _c.min, yMax = _c.max;
        if (yMin === Infinity && yMax === -Infinity) {
            // There's no data in the domain.
            this.yDomain = [];
            return true;
        }
        if (normalizedTo && isFinite(normalizedTo)) {
            yMin = yMin < 0 ? -normalizedTo : 0;
            yMax = yMax > 0 ? normalizedTo : 0;
            yData.forEach(function (group, i) {
                group.forEach(function (stack, j) {
                    stack.forEach(function (y, k) {
                        stack[k] = (y / yAbsTotal[i][j]) * normalizedTo;
                    });
                });
            });
        }
        this.yDomain = this.fixNumericExtent([yMin, yMax], this.yAxis);
        return true;
    };
    BarSeries.prototype.findLargestMinMax = function (groups) {
        var e_1, _a, e_2, _b;
        var tallestStackMin = Infinity;
        var tallestStackMax = -Infinity;
        try {
            for (var groups_1 = __values$7(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
                var group = groups_1_1.value;
                try {
                    for (var group_1 = (e_2 = void 0, __values$7(group)), group_1_1 = group_1.next(); !group_1_1.done; group_1_1 = group_1.next()) {
                        var stack = group_1_1.value;
                        var _c = stack.min, min = _c === void 0 ? Infinity : _c, _d = stack.max, max = _d === void 0 ? -Infinity : _d;
                        if (min < tallestStackMin) {
                            tallestStackMin = min;
                        }
                        if (max > tallestStackMax) {
                            tallestStackMax = max;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (group_1_1 && !group_1_1.done && (_b = group_1.return)) _b.call(group_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (groups_1_1 && !groups_1_1.done && (_a = groups_1.return)) _a.call(groups_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return { min: tallestStackMin, max: tallestStackMax };
    };
    BarSeries.prototype.getDomain = function (direction) {
        if (this.flipXY) {
            direction = flipChartAxisDirection(direction);
        }
        if (direction === ChartAxisDirection.X) {
            return this.xData;
        }
        else {
            return this.yDomain;
        }
    };
    BarSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: datum.yKey,
        });
    };
    BarSeries.prototype.getCategoryAxis = function () {
        return this.flipXY ? this.yAxis : this.xAxis;
    };
    BarSeries.prototype.getValueAxis = function () {
        return this.flipXY ? this.xAxis : this.yAxis;
    };
    BarSeries.prototype.calculateStep = function (range) {
        var _a, _b;
        var smallestInterval = this.smallestDataInterval;
        var xAxis = this.getCategoryAxis();
        if (!xAxis) {
            return;
        }
        // calculate step
        var domainLength = xAxis.domain[1] - xAxis.domain[0];
        var intervals = domainLength / (_b = (_a = smallestInterval) === null || _a === void 0 ? void 0 : _a.x, (_b !== null && _b !== void 0 ? _b : 1)) + 1;
        // The number of intervals/bands is used to determine the width of individual bands by dividing the available range.
        // Allow a maximum number of bands to ensure the step does not fall below 1 pixel.
        // This means there could be some overlap of the bands in the chart.
        var maxBands = Math.floor(range); // A minimum of 1px per bar/column means the maximum number of bands will equal the available range
        var bands = Math.min(intervals, maxBands);
        var step = range / Math.max(1, bands);
        return step;
    };
    BarSeries.prototype.createNodeData = function () {
        var _this = this;
        var _a = this, chart = _a.chart, data = _a.data, visible = _a.visible;
        var xAxis = this.getCategoryAxis();
        var yAxis = this.getValueAxis();
        if (!(chart && data && visible && xAxis && yAxis)) {
            return [];
        }
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var _b = this, groupScale = _b.groupScale, yKeys = _b.yKeys, cumYKeyCount = _b.cumYKeyCount, fills = _b.fills, strokes = _b.strokes, strokeWidth = _b.strokeWidth, seriesItemEnabled = _b.seriesItemEnabled, xData = _b.xData, yData = _b.yData, label = _b.label, flipXY = _b.flipXY;
        var labelFontStyle = label.fontStyle, labelFontWeight = label.fontWeight, labelFontSize = label.fontSize, labelFontFamily = label.fontFamily, labelColor = label.color, labelFormatter = label.formatter, labelPlacement = label.placement;
        var xBandWidth = xScale.bandwidth;
        if (xScale instanceof ContinuousScale) {
            var availableRange = Math.max(xAxis.range[0], xAxis.range[1]);
            var step = this.calculateStep(availableRange);
            xBandWidth = step;
            // last node will be clipped if the scale is not a band scale
            // subtract last band width from the range so that the last band is not clipped
            xScale.range = this.flipXY ? [availableRange - ((step !== null && step !== void 0 ? step : 0)), 0] : [0, availableRange - ((step !== null && step !== void 0 ? step : 0))];
        }
        groupScale.range = [0, xBandWidth];
        var barWidth = groupScale.bandwidth >= 1
            ? // Pixel-rounded value for low-volume bar charts.
                groupScale.bandwidth
            : // Handle high-volume bar charts gracefully.
                groupScale.rawBandwidth;
        var contexts = [];
        xData.forEach(function (group, groupIndex) {
            var _a, _b;
            var seriesDatum = data[groupIndex];
            var x = xScale.convert(group);
            var groupYs = yData[groupIndex]; // y-data for groups of stacks
            for (var stackIndex = 0; stackIndex < groupYs.length; stackIndex++) {
                var stackYs = groupYs[stackIndex]; // y-data for a stack within a group
                contexts[stackIndex] = (_a = contexts[stackIndex], (_a !== null && _a !== void 0 ? _a : []));
                var prevMinY = 0;
                var prevMaxY = 0;
                for (var levelIndex = 0; levelIndex < stackYs.length; levelIndex++) {
                    var currY = +stackYs[levelIndex];
                    var yKey = yKeys[stackIndex][levelIndex];
                    var barX = x + groupScale.convert(String(stackIndex));
                    contexts[stackIndex][levelIndex] = (_b = contexts[stackIndex][levelIndex], (_b !== null && _b !== void 0 ? _b : {
                        itemId: yKey,
                        nodeData: [],
                        labelData: [],
                    }));
                    // Bars outside of visible range are not rendered, so we create node data
                    // only for the visible subset of user data.
                    if (!xAxis.inRange(barX, barWidth)) {
                        continue;
                    }
                    if (isNaN(currY)) {
                        continue;
                    }
                    var prevY = currY < 0 ? prevMinY : prevMaxY;
                    var continuousY = yScale instanceof ContinuousScale;
                    var y = yScale.convert(prevY + currY, continuousY ? clamper$1 : undefined);
                    var bottomY = yScale.convert(prevY, continuousY ? clamper$1 : undefined);
                    var yValue = seriesDatum[yKey]; // unprocessed y-value
                    var labelText = void 0;
                    if (labelFormatter) {
                        labelText = labelFormatter({ value: isNumber(yValue) ? yValue : undefined });
                    }
                    else {
                        labelText = isNumber(yValue) ? yValue.toFixed(2) : '';
                    }
                    var labelX = void 0;
                    var labelY = void 0;
                    if (flipXY) {
                        labelY = barX + barWidth / 2;
                        if (labelPlacement === BarLabelPlacement.Inside) {
                            labelX = y + ((yValue >= 0 ? -1 : 1) * Math.abs(bottomY - y)) / 2;
                        }
                        else {
                            labelX = y + (yValue >= 0 ? 1 : -1) * 4;
                        }
                    }
                    else {
                        labelX = barX + barWidth / 2;
                        if (labelPlacement === BarLabelPlacement.Inside) {
                            labelY = y + ((yValue >= 0 ? 1 : -1) * Math.abs(bottomY - y)) / 2;
                        }
                        else {
                            labelY = y + (yValue >= 0 ? -3 : 4);
                        }
                    }
                    var labelTextAlign = void 0;
                    var labelTextBaseline = void 0;
                    if (labelPlacement === BarLabelPlacement.Inside) {
                        labelTextAlign = 'center';
                        labelTextBaseline = 'middle';
                    }
                    else {
                        labelTextAlign = flipXY ? (yValue >= 0 ? 'start' : 'end') : 'center';
                        labelTextBaseline = flipXY ? 'middle' : yValue >= 0 ? 'bottom' : 'top';
                    }
                    var colorIndex = cumYKeyCount[stackIndex] + levelIndex;
                    var nodeData = {
                        index: groupIndex,
                        series: _this,
                        itemId: yKey,
                        datum: seriesDatum,
                        yValue: yValue,
                        yKey: yKey,
                        x: flipXY ? Math.min(y, bottomY) : barX,
                        y: flipXY ? barX : Math.min(y, bottomY),
                        width: flipXY ? Math.abs(bottomY - y) : barWidth,
                        height: flipXY ? barWidth : Math.abs(bottomY - y),
                        colorIndex: colorIndex,
                        fill: fills[colorIndex % fills.length],
                        stroke: strokes[colorIndex % strokes.length],
                        strokeWidth: strokeWidth,
                        label: seriesItemEnabled.get(yKey) && labelText
                            ? {
                                text: labelText,
                                fontStyle: labelFontStyle,
                                fontWeight: labelFontWeight,
                                fontSize: labelFontSize,
                                fontFamily: labelFontFamily,
                                textAlign: labelTextAlign,
                                textBaseline: labelTextBaseline,
                                fill: labelColor,
                                x: labelX,
                                y: labelY,
                            }
                            : undefined,
                    };
                    contexts[stackIndex][levelIndex].nodeData.push(nodeData);
                    contexts[stackIndex][levelIndex].labelData.push(nodeData);
                    if (currY < 0) {
                        prevMinY += currY;
                    }
                    else {
                        prevMaxY += currY;
                    }
                }
            }
        });
        return contexts.reduce(function (r, n) { return r.concat.apply(r, __spread$7(n)); }, []);
    };
    BarSeries.prototype.updateDatumSelection = function (opts) {
        var nodeData = opts.nodeData, datumSelection = opts.datumSelection;
        var updateRects = datumSelection.setData(nodeData);
        updateRects.exit.remove();
        var enterRects = updateRects.enter.append(Rect).each(function (rect) {
            rect.tag = BarSeriesNodeTag.Bar;
        });
        return updateRects.merge(enterRects);
    };
    BarSeries.prototype.updateDatumNodes = function (opts) {
        var _this = this;
        var _a, _b;
        var datumSelection = opts.datumSelection, isDatumHighlighted = opts.isHighlight;
        var _c = this, fills = _c.fills, strokes = _c.strokes, seriesFillOpacity = _c.fillOpacity, strokeOpacity = _c.strokeOpacity, shadow = _c.shadow, formatter = _c.formatter, xKey = _c.xKey, flipXY = _c.flipXY, _d = _c.highlightStyle, deprecatedFill = _d.fill, deprecatedStroke = _d.stroke, deprecatedStrokeWidth = _d.strokeWidth, _e = _d.item, _f = _e.fill, highlightedFill = _f === void 0 ? deprecatedFill : _f, _g = _e.fillOpacity, highlightFillOpacity = _g === void 0 ? seriesFillOpacity : _g, _h = _e.stroke, highlightedStroke = _h === void 0 ? deprecatedStroke : _h, _j = _e.strokeWidth, highlightedDatumStrokeWidth = _j === void 0 ? deprecatedStrokeWidth : _j;
        var _k = __read$b((_b = (_a = this.xAxis) === null || _a === void 0 ? void 0 : _a.visibleRange, (_b !== null && _b !== void 0 ? _b : [])), 2), visibleMin = _k[0], visibleMax = _k[1];
        var isZoomed = visibleMin !== 0 || visibleMax !== 1;
        var crisp = !isZoomed && !datumSelection.data.some(function (d) { return d.width <= 0.5 || d.height <= 0.5; });
        datumSelection.each(function (rect, datum) {
            var colorIndex = datum.colorIndex;
            var fill = isDatumHighlighted && highlightedFill !== undefined
                ? highlightedFill
                : fills[colorIndex % fills.length];
            var stroke = isDatumHighlighted && highlightedStroke !== undefined
                ? highlightedStroke
                : strokes[colorIndex % fills.length];
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : _this.getStrokeWidth(_this.strokeWidth, datum);
            var fillOpacity = isDatumHighlighted ? highlightFillOpacity : seriesFillOpacity;
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    highlighted: isDatumHighlighted,
                    xKey: xKey,
                    yKey: datum.yKey,
                });
            }
            rect.crisp = crisp;
            rect.x = datum.x;
            rect.y = datum.y;
            rect.width = datum.width;
            rect.height = datum.height;
            rect.fill = (format && format.fill) || fill;
            rect.stroke = (format && format.stroke) || stroke;
            rect.strokeWidth = format && format.strokeWidth !== undefined ? format.strokeWidth : strokeWidth;
            rect.fillOpacity = fillOpacity;
            rect.strokeOpacity = strokeOpacity;
            rect.lineDash = _this.lineDash;
            rect.lineDashOffset = _this.lineDashOffset;
            rect.fillShadow = shadow;
            // Prevent stroke from rendering for zero height columns and zero width bars.
            rect.visible = flipXY ? datum.width > 0 : datum.height > 0;
        });
    };
    BarSeries.prototype.updateLabelSelection = function (opts) {
        var labelData = opts.labelData, labelSelection = opts.labelSelection;
        var enabled = this.label.enabled;
        var data = enabled ? labelData : [];
        var updateLabels = labelSelection.setData(data);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text).each(function (text) {
            text.tag = BarSeriesNodeTag.Label;
            text.pointerEvents = PointerEvents.None;
        });
        return updateLabels.merge(enterLabels);
    };
    BarSeries.prototype.updateLabelNodes = function (opts) {
        var labelSelection = opts.labelSelection;
        var _a = this.label, labelEnabled = _a.enabled, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily, color = _a.color;
        labelSelection.each(function (text, datum) {
            var label = datum.label;
            if (label && labelEnabled) {
                text.fontStyle = fontStyle;
                text.fontWeight = fontWeight;
                text.fontSize = fontSize;
                text.fontFamily = fontFamily;
                text.textAlign = label.textAlign;
                text.textBaseline = label.textBaseline;
                text.text = label.text;
                text.x = label.x;
                text.y = label.y;
                text.fill = color;
                text.visible = true;
            }
            else {
                text.visible = false;
            }
        });
    };
    BarSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKeys = _a.yKeys, yData = _a.yData;
        var xAxis = this.getCategoryAxis();
        var yAxis = this.getValueAxis();
        var yKey = nodeDatum.yKey;
        if (!yData.length || !xKey || !yKey || !xAxis || !yAxis) {
            return '';
        }
        var yGroup = yData[nodeDatum.index];
        var fillIndex = 0;
        var i = 0;
        var j = 0;
        for (; j < yKeys.length; j++) {
            var stack = yKeys[j];
            i = stack.indexOf(yKey);
            if (i >= 0) {
                fillIndex += i;
                break;
            }
            fillIndex += stack.length;
        }
        var _b = this, xName = _b.xName, yNames = _b.yNames, fills = _b.fills, strokes = _b.strokes, tooltip = _b.tooltip, formatter = _b.formatter;
        var tooltipRenderer = tooltip.renderer;
        var datum = nodeDatum.datum;
        var yName = yNames[yKey];
        var fill = fills[fillIndex % fills.length];
        var stroke = strokes[fillIndex % fills.length];
        var strokeWidth = this.getStrokeWidth(this.strokeWidth);
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var processedYValue = yGroup[j][i];
        var xString = sanitizeHtml(xAxis.formatDatum(xValue));
        var yString = sanitizeHtml(yAxis.formatDatum(yValue));
        var title = sanitizeHtml(yName);
        var content = xString + ': ' + yString;
        var format = undefined;
        if (formatter) {
            format = formatter({
                datum: datum,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                highlighted: false,
                xKey: xKey,
                yKey: yKey,
            });
        }
        var color = (format && format.fill) || fill;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: datum,
                xKey: xKey,
                xValue: xValue,
                xName: xName,
                yKey: yKey,
                yValue: yValue,
                processedYValue: processedYValue,
                yName: yName,
                color: color,
                title: title,
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    BarSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, xKey = _a.xKey, yKeys = _a.yKeys, yNames = _a.yNames, cumYKeyCount = _a.cumYKeyCount, seriesItemEnabled = _a.seriesItemEnabled, hideInLegend = _a.hideInLegend, fills = _a.fills, strokes = _a.strokes, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity, flipXY = _a.flipXY;
        if (!data || !data.length || !xKey || !yKeys.length) {
            return;
        }
        this.yKeys.forEach(function (stack, stackIndex) {
            // Column stacks should be listed in the legend in reverse order, for symmetry with the
            // vertical stack display order. Bar stacks are already consistent left-to-right with
            // the legend.
            var startLevel = flipXY ? 0 : stack.length - 1;
            var endLevel = flipXY ? stack.length : -1;
            var direction = flipXY ? 1 : -1;
            for (var levelIndex = startLevel; levelIndex !== endLevel; levelIndex += direction) {
                var yKey = stack[levelIndex];
                if (hideInLegend.indexOf(yKey) >= 0) {
                    return;
                }
                var colorIndex = cumYKeyCount[stackIndex] + levelIndex;
                legendData.push({
                    id: id,
                    itemId: yKey,
                    enabled: seriesItemEnabled.get(yKey) || false,
                    label: {
                        text: yNames[yKey] || yKey,
                    },
                    marker: {
                        fill: fills[colorIndex % fills.length],
                        stroke: strokes[colorIndex % strokes.length],
                        fillOpacity: fillOpacity,
                        strokeOpacity: strokeOpacity,
                    },
                });
            }
        });
    };
    BarSeries.prototype.toggleSeriesItem = function (itemId, enabled) {
        _super.prototype.toggleSeriesItem.call(this, itemId, enabled);
        var yKeys = this.yKeys.map(function (stack) { return stack.slice(); }); // deep clone
        this.seriesItemEnabled.forEach(function (enabled, yKey) {
            if (!enabled) {
                yKeys.forEach(function (stack) {
                    var index = stack.indexOf(yKey);
                    if (index >= 0) {
                        stack.splice(index, 1);
                    }
                });
            }
        });
        var visibleStacks = [];
        yKeys.forEach(function (stack, index) {
            if (stack.length > 0) {
                visibleStacks.push(String(index));
            }
        });
        this.groupScale.domain = visibleStacks;
        this.nodeDataRefresh = true;
    };
    BarSeries.className = 'BarSeries';
    BarSeries.type = 'bar';
    return BarSeries;
}(CartesianSeries));

var __extends$i = (undefined && undefined.__extends) || (function () {
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
var __values$6 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$a = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var LineSeriesLabel = /** @class */ (function (_super) {
    __extends$i(LineSeriesLabel, _super);
    function LineSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.formatter = undefined;
        return _this;
    }
    return LineSeriesLabel;
}(Label));
var LineSeriesTooltip = /** @class */ (function (_super) {
    __extends$i(LineSeriesTooltip, _super);
    function LineSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        _this.format = undefined;
        return _this;
    }
    return LineSeriesTooltip;
}(SeriesTooltip));
var LineSeries = /** @class */ (function (_super) {
    __extends$i(LineSeries, _super);
    function LineSeries() {
        var _this = _super.call(this, {
            pickGroupIncludes: ['markers'],
            features: ['markers'],
            pickModes: [
                SeriesNodePickMode.NEAREST_BY_MAIN_CATEGORY_AXIS_FIRST,
                SeriesNodePickMode.NEAREST_NODE,
                SeriesNodePickMode.EXACT_SHAPE_MATCH,
            ],
        }) || this;
        _this.xDomain = [];
        _this.yDomain = [];
        _this.xData = [];
        _this.yData = [];
        _this.marker = new CartesianSeriesMarker();
        _this.label = new LineSeriesLabel();
        _this.title = undefined;
        _this.stroke = '#874349';
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this.strokeWidth = 2;
        _this.strokeOpacity = 1;
        _this.tooltip = new LineSeriesTooltip();
        _this._xKey = '';
        _this.xName = '';
        _this._yKey = '';
        _this.yName = '';
        var _a = _this, marker = _a.marker, label = _a.label;
        marker.fill = '#c16068';
        marker.stroke = '#874349';
        label.enabled = false;
        return _this;
    }
    LineSeries.prototype.setColors = function (fills, strokes) {
        this.stroke = fills[0];
        this.marker.stroke = strokes[0];
        this.marker.fill = fills[0];
    };
    Object.defineProperty(LineSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            this._xKey = value;
            this.xData = [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSeries.prototype, "yKey", {
        get: function () {
            return this._yKey;
        },
        set: function (value) {
            this._yKey = value;
            this.yData = [];
        },
        enumerable: true,
        configurable: true
    });
    LineSeries.prototype.getDomain = function (direction) {
        if (direction === ChartAxisDirection.X) {
            return this.xDomain;
        }
        return this.yDomain;
    };
    LineSeries.prototype.processData = function () {
        var e_1, _a;
        var _b = this, xAxis = _b.xAxis, yAxis = _b.yAxis, xKey = _b.xKey, yKey = _b.yKey, xData = _b.xData, yData = _b.yData;
        var data = xKey && yKey && this.data ? this.data : [];
        if (!xAxis || !yAxis) {
            return false;
        }
        var isContinuousX = xAxis.scale instanceof ContinuousScale;
        var isContinuousY = yAxis.scale instanceof ContinuousScale;
        xData.length = 0;
        yData.length = 0;
        try {
            for (var data_1 = __values$6(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var datum = data_1_1.value;
                var x = datum[xKey];
                var y = datum[yKey];
                var xDatum = checkDatum(x, isContinuousX);
                if (isContinuousX && xDatum === undefined) {
                    continue;
                }
                else {
                    xData.push(xDatum);
                }
                var yDatum = checkDatum(y, isContinuousY);
                yData.push(yDatum);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.xDomain = isContinuousX ? this.fixNumericExtent(extent(xData, isContinuous), xAxis) : xData;
        this.yDomain = isContinuousY ? this.fixNumericExtent(extent(yData, isContinuous), yAxis) : yData;
        return true;
    };
    LineSeries.prototype.createNodeData = function () {
        var _a;
        var _b = this, data = _b.data, xAxis = _b.xAxis, yAxis = _b.yAxis, _c = _b.marker, markerEnabled = _c.enabled, markerSize = _c.size, strokeWidth = _c.strokeWidth;
        if (!data || !xAxis || !yAxis) {
            return [];
        }
        var _d = this, xData = _d.xData, yData = _d.yData, label = _d.label, xKey = _d.xKey, yKey = _d.yKey;
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var xOffset = (xScale.bandwidth || 0) / 2;
        var yOffset = (yScale.bandwidth || 0) / 2;
        var nodeData = new Array(data.length);
        var size = markerEnabled ? markerSize : 0;
        var moveTo = true;
        var prevXInRange = undefined;
        var nextXYDatums = undefined;
        var actualLength = 0;
        for (var i = 0; i < xData.length; i++) {
            var xyDatums = nextXYDatums || [xData[i], yData[i]];
            if (xyDatums[1] === undefined) {
                prevXInRange = undefined;
                moveTo = true;
            }
            else {
                var _e = __read$a(xyDatums, 2), xDatum = _e[0], yDatum = _e[1];
                var x = xScale.convert(xDatum) + xOffset;
                if (isNaN(x)) {
                    prevXInRange = undefined;
                    moveTo = true;
                    continue;
                }
                var tolerance = (xScale.bandwidth || markerSize * 0.5 + (strokeWidth || 0)) + 1;
                nextXYDatums = yData[i + 1] === undefined ? undefined : [xData[i + 1], yData[i + 1]];
                var xInRange = xAxis.inRangeEx(x, 0, tolerance);
                var nextXInRange = nextXYDatums && xAxis.inRangeEx(xScale.convert(nextXYDatums[0]) + xOffset, 0, tolerance);
                if (xInRange === -1 && nextXInRange === -1) {
                    moveTo = true;
                    continue;
                }
                if (xInRange === 1 && prevXInRange === 1) {
                    moveTo = true;
                    continue;
                }
                prevXInRange = xInRange;
                var y = yScale.convert(yDatum) + yOffset;
                var labelText = void 0;
                if (label.formatter) {
                    labelText = label.formatter({ value: yDatum });
                }
                else {
                    labelText =
                        typeof yDatum === 'number' && isFinite(yDatum)
                            ? yDatum.toFixed(2)
                            : yDatum
                                ? String(yDatum)
                                : '';
                }
                var seriesDatum = (_a = {}, _a[xKey] = xDatum, _a[yKey] = yDatum, _a);
                nodeData[actualLength++] = {
                    series: this,
                    datum: seriesDatum,
                    point: { x: x, y: y, moveTo: moveTo, size: size },
                    label: labelText
                        ? {
                            text: labelText,
                            fontStyle: label.fontStyle,
                            fontWeight: label.fontWeight,
                            fontSize: label.fontSize,
                            fontFamily: label.fontFamily,
                            textAlign: 'center',
                            textBaseline: 'bottom',
                            fill: label.color,
                        }
                        : undefined,
                };
                moveTo = false;
            }
        }
        nodeData.length = actualLength;
        return [{ itemId: yKey, nodeData: nodeData, labelData: nodeData }];
    };
    LineSeries.prototype.isPathOrSelectionDirty = function () {
        return this.marker.isDirty();
    };
    LineSeries.prototype.updatePaths = function (opts) {
        var e_2, _a;
        var nodeData = opts.contextData.nodeData, _b = __read$a(opts.paths, 1), lineNode = _b[0];
        var linePath = lineNode.path;
        lineNode.fill = undefined;
        lineNode.lineJoin = 'round';
        lineNode.pointerEvents = PointerEvents.None;
        linePath.clear({ trackChanges: true });
        try {
            for (var nodeData_1 = __values$6(nodeData), nodeData_1_1 = nodeData_1.next(); !nodeData_1_1.done; nodeData_1_1 = nodeData_1.next()) {
                var data = nodeData_1_1.value;
                if (data.point.moveTo) {
                    linePath.moveTo(data.point.x, data.point.y);
                }
                else {
                    linePath.lineTo(data.point.x, data.point.y);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodeData_1_1 && !nodeData_1_1.done && (_a = nodeData_1.return)) _a.call(nodeData_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        lineNode.checkPathDirty();
    };
    LineSeries.prototype.updatePathNodes = function (opts) {
        var _a = __read$a(opts.paths, 1), lineNode = _a[0];
        lineNode.stroke = this.stroke;
        lineNode.strokeWidth = this.getStrokeWidth(this.strokeWidth);
        lineNode.strokeOpacity = this.strokeOpacity;
        lineNode.lineDash = this.lineDash;
        lineNode.lineDashOffset = this.lineDashOffset;
    };
    LineSeries.prototype.updateMarkerSelection = function (opts) {
        var nodeData = opts.nodeData, markerSelection = opts.markerSelection;
        var _a = this.marker, shape = _a.shape, enabled = _a.enabled;
        nodeData = shape && enabled ? nodeData : [];
        var MarkerShape = getMarker(shape);
        if (this.marker.isDirty()) {
            markerSelection = markerSelection.setData([]);
            markerSelection.exit.remove();
        }
        var updateMarkerSelection = markerSelection.setData(nodeData);
        updateMarkerSelection.exit.remove();
        var enterDatumSelection = updateMarkerSelection.enter.append(MarkerShape);
        return updateMarkerSelection.merge(enterDatumSelection);
    };
    LineSeries.prototype.updateMarkerNodes = function (opts) {
        var markerSelection = opts.markerSelection, isDatumHighlighted = opts.isHighlight;
        var _a = this, marker = _a.marker, markerFillOpacity = _a.marker.fillOpacity, xKey = _a.xKey, yKey = _a.yKey, lineStroke = _a.stroke, strokeOpacity = _a.strokeOpacity, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.fillOpacity, highlightFillOpacity = _e === void 0 ? markerFillOpacity : _e, _f = _c.stroke, highlightedStroke = _f === void 0 ? deprecatedStroke : _f, _g = _c.strokeWidth, highlightedDatumStrokeWidth = _g === void 0 ? deprecatedStrokeWidth : _g;
        var size = marker.size, formatter = marker.formatter;
        var markerStrokeWidth = marker.strokeWidth !== undefined ? marker.strokeWidth : this.strokeWidth;
        markerSelection.each(function (node, datum) {
            var _a, _b;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : marker.fill;
            var fillOpacity = isDatumHighlighted ? highlightFillOpacity : markerFillOpacity;
            var stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : marker.stroke || lineStroke;
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : markerStrokeWidth;
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    xKey: xKey,
                    yKey: yKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    size: size,
                    highlighted: isDatumHighlighted,
                });
            }
            node.fill = (format && format.fill) || fill;
            node.stroke = (format && format.stroke) || stroke;
            node.strokeWidth = format && format.strokeWidth !== undefined ? format.strokeWidth : strokeWidth;
            node.fillOpacity = (fillOpacity !== null && fillOpacity !== void 0 ? fillOpacity : 1);
            node.strokeOpacity = (_b = (_a = marker.strokeOpacity, (_a !== null && _a !== void 0 ? _a : strokeOpacity)), (_b !== null && _b !== void 0 ? _b : 1));
            node.size = format && format.size !== undefined ? format.size : size;
            node.translationX = datum.point.x;
            node.translationY = datum.point.y;
            node.visible = node.size > 0;
        });
        if (!isDatumHighlighted) {
            this.marker.markClean();
        }
    };
    LineSeries.prototype.updateLabelSelection = function (opts) {
        var labelData = opts.labelData, labelSelection = opts.labelSelection;
        var _a = this.marker, shape = _a.shape, enabled = _a.enabled;
        labelData = shape && enabled ? labelData : [];
        var updateTextSelection = labelSelection.setData(labelData);
        updateTextSelection.exit.remove();
        var enterTextSelection = updateTextSelection.enter.append(Text);
        return updateTextSelection.merge(enterTextSelection);
    };
    LineSeries.prototype.updateLabelNodes = function (opts) {
        var labelSelection = opts.labelSelection;
        var _a = this.label, labelEnabled = _a.enabled, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily, color = _a.color;
        labelSelection.each(function (text, datum) {
            var point = datum.point, label = datum.label;
            if (datum && label && labelEnabled) {
                text.fontStyle = fontStyle;
                text.fontWeight = fontWeight;
                text.fontSize = fontSize;
                text.fontFamily = fontFamily;
                text.textAlign = label.textAlign;
                text.textBaseline = label.textBaseline;
                text.text = label.text;
                text.x = point.x;
                text.y = point.y - 10;
                text.fill = color;
                text.visible = true;
            }
            else {
                text.visible = false;
            }
        });
    };
    LineSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: this.yKey,
        });
    };
    LineSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!xKey || !yKey || !xAxis || !yAxis) {
            return '';
        }
        var _b = this, xName = _b.xName, yName = _b.yName, tooltip = _b.tooltip, marker = _b.marker;
        var tooltipRenderer = tooltip.renderer, tooltipFormat = tooltip.format;
        var datum = nodeDatum.datum;
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var xString = xAxis.formatDatum(xValue);
        var yString = yAxis.formatDatum(yValue);
        var title = sanitizeHtml(this.title || yName);
        var content = sanitizeHtml(xString + ': ' + yString);
        var markerFormatter = marker.formatter, fill = marker.fill, stroke = marker.stroke, markerStrokeWidth = marker.strokeWidth, size = marker.size;
        var strokeWidth = markerStrokeWidth !== undefined ? markerStrokeWidth : this.strokeWidth;
        var format = undefined;
        if (markerFormatter) {
            format = markerFormatter({
                datum: datum,
                xKey: xKey,
                yKey: yKey,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                size: size,
                highlighted: false,
            });
        }
        var color = (format && format.fill) || fill;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        if (tooltipFormat || tooltipRenderer) {
            var params = {
                datum: datum,
                xKey: xKey,
                xValue: xValue,
                xName: xName,
                yKey: yKey,
                yValue: yValue,
                yName: yName,
                title: title,
                color: color,
            };
            if (tooltipFormat) {
                return toTooltipHtml({
                    content: interpolate(tooltipFormat, params),
                }, defaults);
            }
            if (tooltipRenderer) {
                return toTooltipHtml(tooltipRenderer(params), defaults);
            }
        }
        return toTooltipHtml(defaults);
    };
    LineSeries.prototype.listSeriesItems = function (legendData) {
        var _a, _b, _c;
        var _d = this, id = _d.id, data = _d.data, xKey = _d.xKey, yKey = _d.yKey, yName = _d.yName, visible = _d.visible, title = _d.title, marker = _d.marker, stroke = _d.stroke, strokeOpacity = _d.strokeOpacity;
        if (data && data.length && xKey && yKey) {
            legendData.push({
                id: id,
                itemId: yKey,
                enabled: visible,
                label: {
                    text: title || yName || yKey,
                },
                marker: {
                    shape: marker.shape,
                    fill: marker.fill || 'rgba(0, 0, 0, 0)',
                    stroke: marker.stroke || stroke || 'rgba(0, 0, 0, 0)',
                    fillOpacity: (_a = marker.fillOpacity, (_a !== null && _a !== void 0 ? _a : 1)),
                    strokeOpacity: (_c = (_b = marker.strokeOpacity, (_b !== null && _b !== void 0 ? _b : strokeOpacity)), (_c !== null && _c !== void 0 ? _c : 1)),
                },
            });
        }
    };
    LineSeries.className = 'LineSeries';
    LineSeries.type = 'line';
    return LineSeries;
}(CartesianSeries));

var __extends$h = (undefined && undefined.__extends) || (function () {
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
var __assign$8 = (undefined && undefined.__assign) || function () {
    __assign$8 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$8.apply(this, arguments);
};
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ScatterSeriesTooltip = /** @class */ (function (_super) {
    __extends$h(ScatterSeriesTooltip, _super);
    function ScatterSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        return _this;
    }
    return ScatterSeriesTooltip;
}(SeriesTooltip));
var ScatterSeries = /** @class */ (function (_super) {
    __extends$h(ScatterSeries, _super);
    function ScatterSeries() {
        var _this = _super.call(this, {
            pickGroupIncludes: ['markers'],
            pickModes: [
                SeriesNodePickMode.NEAREST_BY_MAIN_CATEGORY_AXIS_FIRST,
                SeriesNodePickMode.NEAREST_NODE,
                SeriesNodePickMode.EXACT_SHAPE_MATCH,
            ],
            pathsPerSeries: 0,
            features: ['markers'],
        }) || this;
        _this.xDomain = [];
        _this.yDomain = [];
        _this.xData = [];
        _this.yData = [];
        _this.validData = [];
        _this.sizeData = [];
        _this.sizeScale = new LinearScale();
        _this.marker = new CartesianSeriesMarker();
        _this.label = new Label();
        /**
         * @deprecated Use {@link marker.fill} instead.
         */
        _this.fill = '#c16068';
        /**
         * @deprecated Use {@link marker.stroke} instead.
         */
        _this.stroke = '#874349';
        /**
         * @deprecated Use {@link marker.strokeWidth} instead.
         */
        _this.strokeWidth = 2;
        /**
         * @deprecated Use {@link marker.fillOpacity} instead.
         */
        _this.fillOpacity = 1;
        /**
         * @deprecated Use {@link marker.strokeOpacity} instead.
         */
        _this.strokeOpacity = 1;
        _this.title = undefined;
        _this.labelKey = undefined;
        _this.xName = '';
        _this.yName = '';
        _this.sizeName = 'Size';
        _this.labelName = 'Label';
        _this._xKey = '';
        _this._yKey = '';
        _this._sizeKey = undefined;
        _this.tooltip = new ScatterSeriesTooltip();
        var label = _this.label;
        label.enabled = false;
        return _this;
    }
    Object.defineProperty(ScatterSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            this._xKey = value;
            this.xData = [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "yKey", {
        get: function () {
            return this._yKey;
        },
        set: function (value) {
            this._yKey = value;
            this.yData = [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "sizeKey", {
        get: function () {
            return this._sizeKey;
        },
        set: function (value) {
            this._sizeKey = value;
            this.sizeData = [];
        },
        enumerable: true,
        configurable: true
    });
    ScatterSeries.prototype.setColors = function (fills, strokes) {
        this.marker.fill = fills[0];
        this.marker.stroke = strokes[0];
    };
    ScatterSeries.prototype.processData = function () {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, sizeKey = _a.sizeKey, xAxis = _a.xAxis, yAxis = _a.yAxis, marker = _a.marker;
        if (!xAxis || !yAxis) {
            return false;
        }
        var data = xKey && yKey && this.data ? this.data : [];
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var isContinuousX = xScale instanceof ContinuousScale;
        var isContinuousY = yScale instanceof ContinuousScale;
        this.validData = data.filter(function (d) { return checkDatum(d[xKey], isContinuousX) !== undefined && checkDatum(d[yKey], isContinuousY) !== undefined; });
        this.xData = this.validData.map(function (d) { return d[xKey]; });
        this.yData = this.validData.map(function (d) { return d[yKey]; });
        this.sizeData = sizeKey ? this.validData.map(function (d) { return d[sizeKey]; }) : [];
        this.sizeScale.domain = marker.domain ? marker.domain : extent(this.sizeData, isContinuous) || [1, 1];
        if (xAxis.scale instanceof ContinuousScale) {
            this.xDomain = this.fixNumericExtent(extent(this.xData, isContinuous), xAxis);
        }
        else {
            this.xDomain = this.xData;
        }
        if (yAxis.scale instanceof ContinuousScale) {
            this.yDomain = this.fixNumericExtent(extent(this.yData, isContinuous), yAxis);
        }
        else {
            this.yDomain = this.yData;
        }
        return true;
    };
    ScatterSeries.prototype.getDomain = function (direction) {
        if (direction === ChartAxisDirection.X) {
            return this.xDomain;
        }
        else {
            return this.yDomain;
        }
    };
    ScatterSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: this.yKey,
            sizeKey: this.sizeKey,
        });
    };
    ScatterSeries.prototype.createNodeData = function () {
        var _a = this, chart = _a.chart, data = _a.data, visible = _a.visible, xAxis = _a.xAxis, yAxis = _a.yAxis, yKey = _a.yKey, label = _a.label, labelKey = _a.labelKey;
        if (!(chart && data && visible && xAxis && yAxis)) {
            return [];
        }
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var isContinuousX = xScale instanceof ContinuousScale;
        var isContinuousY = yScale instanceof ContinuousScale;
        var xOffset = (xScale.bandwidth || 0) / 2;
        var yOffset = (yScale.bandwidth || 0) / 2;
        var _b = this, xData = _b.xData, yData = _b.yData, validData = _b.validData, sizeData = _b.sizeData, sizeScale = _b.sizeScale, marker = _b.marker;
        var nodeData = new Array(xData.length);
        sizeScale.range = [marker.size, marker.maxSize];
        var font = label.getFont();
        var actualLength = 0;
        for (var i = 0; i < xData.length; i++) {
            var xy = this.checkDomainXY(xData[i], yData[i], isContinuousX, isContinuousY);
            if (!xy) {
                continue;
            }
            var x = xScale.convert(xy[0]) + xOffset;
            var y = yScale.convert(xy[1]) + yOffset;
            if (!this.checkRangeXY(x, y, xAxis, yAxis)) {
                continue;
            }
            var text = labelKey ? String(validData[i][labelKey]) : '';
            var size = HdpiCanvas.getTextSize(text, font);
            var markerSize = sizeData.length ? sizeScale.convert(sizeData[i]) : marker.size;
            nodeData[actualLength++] = {
                series: this,
                itemId: yKey,
                datum: validData[i],
                point: { x: x, y: y, size: markerSize },
                label: __assign$8({ text: text }, size),
            };
        }
        nodeData.length = actualLength;
        return [{ itemId: this.yKey, nodeData: nodeData, labelData: nodeData }];
    };
    ScatterSeries.prototype.isPathOrSelectionDirty = function () {
        return this.marker.isDirty();
    };
    ScatterSeries.prototype.getLabelData = function () {
        var _a;
        return (_a = this.contextNodeData) === null || _a === void 0 ? void 0 : _a.reduce(function (r, n) { return r.concat(n.labelData); }, []);
    };
    ScatterSeries.prototype.updateMarkerSelection = function (opts) {
        var nodeData = opts.nodeData, markerSelection = opts.markerSelection;
        var _a = this.marker, enabled = _a.enabled, shape = _a.shape;
        var MarkerShape = getMarker(shape);
        if (this.marker.isDirty()) {
            markerSelection = markerSelection.setData([]);
            markerSelection.exit.remove();
        }
        var data = enabled ? nodeData : [];
        var updateMarkers = markerSelection.setData(data);
        updateMarkers.exit.remove();
        var enterMarkers = updateMarkers.enter.append(MarkerShape);
        return updateMarkers.merge(enterMarkers);
    };
    ScatterSeries.prototype.updateMarkerNodes = function (opts) {
        var markerSelection = opts.markerSelection, isDatumHighlighted = opts.isHighlight;
        var _a = this, marker = _a.marker, xKey = _a.xKey, yKey = _a.yKey, strokeWidth = _a.strokeWidth, seriesFillOpacity = _a.fillOpacity, seriesStrokeOpacity = _a.strokeOpacity, seriesFill = _a.fill, seriesStroke = _a.stroke, sizeScale = _a.sizeScale, _b = _a.marker, _c = _b.fillOpacity, markerFillOpacity = _c === void 0 ? seriesFillOpacity : _c, _d = _b.strokeOpacity, markerStrokeOpacity = _d === void 0 ? seriesStrokeOpacity : _d, _e = _a.highlightStyle, deprecatedFill = _e.fill, deprecatedStroke = _e.stroke, deprecatedStrokeWidth = _e.strokeWidth, _f = _e.item, _g = _f.fill, highlightedFill = _g === void 0 ? deprecatedFill : _g, _h = _f.fillOpacity, highlightFillOpacity = _h === void 0 ? markerFillOpacity : _h, _j = _f.stroke, highlightedStroke = _j === void 0 ? deprecatedStroke : _j, _k = _f.strokeWidth, highlightedDatumStrokeWidth = _k === void 0 ? deprecatedStrokeWidth : _k;
        var markerStrokeWidth = marker.strokeWidth !== undefined ? marker.strokeWidth : strokeWidth;
        var formatter = marker.formatter;
        sizeScale.range = [marker.size, marker.maxSize];
        markerSelection.each(function (node, datum) {
            var _a, _b, _c, _d, _e, _f;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : marker.fill || seriesFill;
            var fillOpacity = isDatumHighlighted ? highlightFillOpacity : markerFillOpacity;
            var stroke = isDatumHighlighted && highlightedStroke !== undefined
                ? highlightedStroke
                : marker.stroke || seriesStroke;
            var strokeOpacity = markerStrokeOpacity;
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : markerStrokeWidth;
            var size = (_b = (_a = datum.point) === null || _a === void 0 ? void 0 : _a.size, (_b !== null && _b !== void 0 ? _b : 0));
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    xKey: xKey,
                    yKey: yKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    size: size,
                    highlighted: isDatumHighlighted,
                });
            }
            node.fill = (format && format.fill) || fill;
            node.stroke = (format && format.stroke) || stroke;
            node.strokeWidth = format && format.strokeWidth !== undefined ? format.strokeWidth : strokeWidth;
            node.size = format && format.size !== undefined ? format.size : size;
            node.fillOpacity = (fillOpacity !== null && fillOpacity !== void 0 ? fillOpacity : 1);
            node.strokeOpacity = (strokeOpacity !== null && strokeOpacity !== void 0 ? strokeOpacity : 1);
            node.translationX = (_d = (_c = datum.point) === null || _c === void 0 ? void 0 : _c.x, (_d !== null && _d !== void 0 ? _d : 0));
            node.translationY = (_f = (_e = datum.point) === null || _e === void 0 ? void 0 : _e.y, (_f !== null && _f !== void 0 ? _f : 0));
            node.visible = node.size > 0;
        });
        if (!isDatumHighlighted) {
            this.marker.markClean();
        }
    };
    ScatterSeries.prototype.updateLabelSelection = function (opts) {
        var _a, _b;
        var labelSelection = opts.labelSelection;
        var placedLabels = (_b = (_a = this.chart) === null || _a === void 0 ? void 0 : _a.placeLabels().get(this), (_b !== null && _b !== void 0 ? _b : []));
        var placedNodeDatum = placedLabels.map(function (v) { return (__assign$8(__assign$8({}, v.datum), { point: {
                x: v.x,
                y: v.y,
                size: v.datum.point.size,
            } })); });
        var updateLabels = labelSelection.setData(placedNodeDatum);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text);
        return updateLabels.merge(enterLabels);
    };
    ScatterSeries.prototype.updateLabelNodes = function (opts) {
        var labelSelection = opts.labelSelection;
        var label = this.label;
        labelSelection.each(function (text, datum) {
            var _a, _b, _c, _d;
            text.text = datum.label.text;
            text.fill = label.color;
            text.x = (_b = (_a = datum.point) === null || _a === void 0 ? void 0 : _a.x, (_b !== null && _b !== void 0 ? _b : 0));
            text.y = (_d = (_c = datum.point) === null || _c === void 0 ? void 0 : _c.y, (_d !== null && _d !== void 0 ? _d : 0));
            text.fontStyle = label.fontStyle;
            text.fontWeight = label.fontWeight;
            text.fontSize = label.fontSize;
            text.fontFamily = label.fontFamily;
            text.textAlign = 'left';
            text.textBaseline = 'top';
        });
    };
    ScatterSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a, _b, _c, _d;
        var _e = this, xKey = _e.xKey, yKey = _e.yKey, xAxis = _e.xAxis, yAxis = _e.yAxis;
        if (!xKey || !yKey || !xAxis || !yAxis) {
            return '';
        }
        var _f = this, seriesFill = _f.fill, seriesStroke = _f.stroke, marker = _f.marker, tooltip = _f.tooltip, xName = _f.xName, yName = _f.yName, sizeKey = _f.sizeKey, sizeName = _f.sizeName, labelKey = _f.labelKey, labelName = _f.labelName;
        var fill = (_a = marker.fill, (_a !== null && _a !== void 0 ? _a : seriesFill));
        var stroke = (_b = marker.stroke, (_b !== null && _b !== void 0 ? _b : seriesStroke));
        var strokeWidth = this.getStrokeWidth(marker.strokeWidth || this.strokeWidth);
        var formatter = this.marker.formatter;
        var format = undefined;
        if (formatter) {
            format = formatter({
                datum: nodeDatum,
                xKey: xKey,
                yKey: yKey,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                size: (_d = (_c = nodeDatum.point) === null || _c === void 0 ? void 0 : _c.size, (_d !== null && _d !== void 0 ? _d : 0)),
                highlighted: false,
            });
        }
        var color = (format && format.fill) || fill || 'gray';
        var title = this.title || yName;
        var datum = nodeDatum.datum;
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var xString = sanitizeHtml(xAxis.formatDatum(xValue));
        var yString = sanitizeHtml(yAxis.formatDatum(yValue));
        var content = "<b>" + sanitizeHtml(xName || xKey) + "</b>: " + xString + "<br>" +
            ("<b>" + sanitizeHtml(yName || yKey) + "</b>: " + yString);
        if (sizeKey) {
            content += "<br><b>" + sanitizeHtml(sizeName || sizeKey) + "</b>: " + sanitizeHtml(datum[sizeKey]);
        }
        if (labelKey) {
            content = "<b>" + sanitizeHtml(labelName || labelKey) + "</b>: " + sanitizeHtml(datum[labelKey]) + "<br>" + content;
        }
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        var tooltipRenderer = tooltip.renderer;
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: datum,
                xKey: xKey,
                xValue: xValue,
                xName: xName,
                yKey: yKey,
                yValue: yValue,
                yName: yName,
                sizeKey: sizeKey,
                sizeName: sizeName,
                labelKey: labelKey,
                labelName: labelName,
                title: title,
                color: color,
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    ScatterSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, xKey = _a.xKey, yKey = _a.yKey, yName = _a.yName, title = _a.title, visible = _a.visible, marker = _a.marker, fill = _a.fill, stroke = _a.stroke, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity;
        if (data && data.length && xKey && yKey) {
            legendData.push({
                id: id,
                itemId: yKey,
                enabled: visible,
                label: {
                    text: title || yName || yKey,
                },
                marker: {
                    shape: marker.shape,
                    fill: marker.fill || fill || 'rgba(0, 0, 0, 0)',
                    stroke: marker.stroke || stroke || 'rgba(0, 0, 0, 0)',
                    fillOpacity: marker.fillOpacity !== undefined ? marker.fillOpacity : fillOpacity,
                    strokeOpacity: marker.strokeOpacity !== undefined ? marker.strokeOpacity : strokeOpacity,
                },
            });
        }
    };
    ScatterSeries.className = 'ScatterSeries';
    ScatterSeries.type = 'scatter';
    __decorate$2([
        Deprecated('Use marker.fill instead.', { default: '#c16068' })
    ], ScatterSeries.prototype, "fill", void 0);
    __decorate$2([
        Deprecated('Use marker.stroke instead.', { default: '#874349' })
    ], ScatterSeries.prototype, "stroke", void 0);
    __decorate$2([
        Deprecated('Use marker.strokeWidth instead.', { default: 2 })
    ], ScatterSeries.prototype, "strokeWidth", void 0);
    __decorate$2([
        Deprecated('Use marker.fillOpacity instead.', { default: 1 })
    ], ScatterSeries.prototype, "fillOpacity", void 0);
    __decorate$2([
        Deprecated('Use marker.strokeOpacity instead.', { default: 1 })
    ], ScatterSeries.prototype, "strokeOpacity", void 0);
    return ScatterSeries;
}(CartesianSeries));

var __extends$g = (undefined && undefined.__extends) || (function () {
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
var __read$9 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$6 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$9(arguments[i]));
    return ar;
};
var HistogramSeriesNodeTag;
(function (HistogramSeriesNodeTag) {
    HistogramSeriesNodeTag[HistogramSeriesNodeTag["Bin"] = 0] = "Bin";
    HistogramSeriesNodeTag[HistogramSeriesNodeTag["Label"] = 1] = "Label";
})(HistogramSeriesNodeTag || (HistogramSeriesNodeTag = {}));
var HistogramSeriesLabel = /** @class */ (function (_super) {
    __extends$g(HistogramSeriesLabel, _super);
    function HistogramSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.formatter = undefined;
        return _this;
    }
    return HistogramSeriesLabel;
}(Label));
var defaultBinCount = 10;
var aggregationFunctions = {
    count: function (bin) { return bin.data.length; },
    sum: function (bin, yKey) { return bin.data.reduce(function (acc, datum) { return acc + datum[yKey]; }, 0); },
    mean: function (bin, yKey) { return aggregationFunctions.sum(bin, yKey) / aggregationFunctions.count(bin, yKey); },
};
var HistogramBin = /** @class */ (function () {
    function HistogramBin(_a) {
        var _b = __read$9(_a, 2), domainMin = _b[0], domainMax = _b[1];
        this.data = [];
        this.aggregatedValue = 0;
        this.frequency = 0;
        this.domain = [domainMin, domainMax];
    }
    HistogramBin.prototype.addDatum = function (datum) {
        this.data.push(datum);
        this.frequency++;
    };
    Object.defineProperty(HistogramBin.prototype, "domainWidth", {
        get: function () {
            var _a = __read$9(this.domain, 2), domainMin = _a[0], domainMax = _a[1];
            return domainMax - domainMin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramBin.prototype, "relativeHeight", {
        get: function () {
            return this.aggregatedValue / this.domainWidth;
        },
        enumerable: true,
        configurable: true
    });
    HistogramBin.prototype.calculateAggregatedValue = function (aggregationName, yKey) {
        if (!yKey) {
            // not having a yKey forces us into a frequency plot
            aggregationName = 'count';
        }
        var aggregationFunction = aggregationFunctions[aggregationName];
        this.aggregatedValue = aggregationFunction(this, yKey);
    };
    HistogramBin.prototype.getY = function (areaPlot) {
        return areaPlot ? this.relativeHeight : this.aggregatedValue;
    };
    return HistogramBin;
}());
var HistogramSeriesTooltip = /** @class */ (function (_super) {
    __extends$g(HistogramSeriesTooltip, _super);
    function HistogramSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        return _this;
    }
    return HistogramSeriesTooltip;
}(SeriesTooltip));
var HistogramSeries = /** @class */ (function (_super) {
    __extends$g(HistogramSeries, _super);
    function HistogramSeries() {
        var _a;
        var _this = _super.call(this, { pickModes: [SeriesNodePickMode.EXACT_SHAPE_MATCH] }) || this;
        _this.binnedData = [];
        _this.xDomain = [];
        _this.yDomain = [];
        _this.label = new HistogramSeriesLabel();
        _this.tooltip = new HistogramSeriesTooltip();
        _this.fill = undefined;
        _this.stroke = undefined;
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this.directionKeys = (_a = {},
            _a[ChartAxisDirection.X] = ['xKey'],
            _a[ChartAxisDirection.Y] = ['yKey'],
            _a);
        _this.xKey = '';
        _this.areaPlot = false;
        _this.bins = undefined;
        _this.aggregation = 'count';
        _this.binCount = undefined;
        _this.xName = '';
        _this.yKey = '';
        _this.yName = '';
        _this.strokeWidth = 1;
        _this.shadow = undefined;
        _this.label.enabled = false;
        return _this;
    }
    HistogramSeries.prototype.getKeys = function (direction) {
        var _this = this;
        var directionKeys = this.directionKeys;
        var keys = directionKeys && directionKeys[direction];
        var values = [];
        if (keys) {
            keys.forEach(function (key) {
                var value = _this[key];
                if (value) {
                    if (Array.isArray(value)) {
                        values.push.apply(values, __spread$6(value));
                    }
                    else {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    };
    HistogramSeries.prototype.setColors = function (fills, strokes) {
        this.fill = fills[0];
        this.stroke = strokes[0];
    };
    // During processData phase, used to unify different ways of the user specifying
    // the bins. Returns bins in format[[min1, max1], [min2, max2], ... ].
    HistogramSeries.prototype.deriveBins = function () {
        var _this = this;
        var bins = this.bins;
        if (!this.data) {
            return [];
        }
        if (bins) {
            return bins;
        }
        var xData = this.data.map(function (datum) { return datum[_this.xKey]; });
        var xDomain = this.fixNumericExtent(extent(xData, isContinuous));
        if (this.binCount === undefined) {
            var binStarts = ticks(xDomain[0], xDomain[1], this.binCount || defaultBinCount);
            var binSize_1 = tickStep(xDomain[0], xDomain[1], this.binCount || defaultBinCount);
            var firstBinEnd = binStarts[0];
            var expandStartToBin = function (n) { return [n, n + binSize_1]; };
            return __spread$6([[firstBinEnd - binSize_1, firstBinEnd]], binStarts.map(expandStartToBin));
        }
        else {
            return this.calculateNiceBins(xDomain, this.binCount);
        }
    };
    HistogramSeries.prototype.calculateNiceBins = function (domain, binCount) {
        var _a;
        var start = Math.floor(domain[0]);
        var stop = domain[1];
        var binSize;
        var segments = binCount || 1;
        (_a = this.calculateNiceStart(start, stop, segments), start = _a.start, binSize = _a.binSize);
        return this.getBins(start, stop, binSize, segments);
    };
    HistogramSeries.prototype.getBins = function (start, stop, step, count) {
        var bins = [];
        for (var i = 0; i < count; i++) {
            var a = Math.round((start + i * step) * 10) / 10;
            var b = Math.round((start + (i + 1) * step) * 10) / 10;
            if (i === count - 1) {
                b = Math.max(b, stop);
            }
            bins[i] = [a, b];
        }
        return bins;
    };
    HistogramSeries.prototype.calculateNiceStart = function (a, b, segments) {
        var binSize = Math.abs(b - a) / segments;
        var order = Math.floor(Math.log10(binSize));
        var magnitude = Math.pow(10, order);
        var start = Math.floor(a / magnitude) * magnitude;
        return {
            start: start,
            binSize: binSize,
        };
    };
    HistogramSeries.prototype.placeDataInBins = function (data) {
        var _this = this;
        var xKey = this.xKey;
        var derivedBins = this.deriveBins();
        // creating a sorted copy allows binning in O(n) rather than O(n²)
        // but at the expense of more temporary memory
        var sortedData = data.slice().sort(function (a, b) {
            if (a[xKey] < b[xKey]) {
                return -1;
            }
            if (a[xKey] > b[xKey]) {
                return 1;
            }
            return 0;
        });
        var bins = [new HistogramBin(derivedBins[0])];
        var currentBin = 0;
        for (var i = 0; i < sortedData.length && currentBin < derivedBins.length; i++) {
            var datum = sortedData[i];
            while (datum[xKey] > derivedBins[currentBin][1] && currentBin < derivedBins.length) {
                currentBin++;
                bins.push(new HistogramBin(derivedBins[currentBin]));
            }
            if (currentBin < derivedBins.length) {
                bins[currentBin].addDatum(datum);
            }
        }
        bins.forEach(function (b) { return b.calculateAggregatedValue(_this.aggregation, _this.yKey); });
        return bins;
    };
    Object.defineProperty(HistogramSeries.prototype, "xMax", {
        get: function () {
            var _this = this;
            return (this.data &&
                this.data.reduce(function (acc, datum) {
                    return Math.max(acc, datum[_this.xKey]);
                }, Number.NEGATIVE_INFINITY));
        },
        enumerable: true,
        configurable: true
    });
    HistogramSeries.prototype.processData = function () {
        var _this = this;
        var _a = this, xKey = _a.xKey, data = _a.data;
        this.binnedData = this.placeDataInBins(xKey && data ? data : []);
        var yData = this.binnedData.map(function (b) { return b.getY(_this.areaPlot); });
        var yMinMax = extent(yData, isContinuous);
        this.yDomain = this.fixNumericExtent([0, yMinMax ? yMinMax[1] : 1]);
        var firstBin = this.binnedData[0];
        var lastBin = this.binnedData[this.binnedData.length - 1];
        var xMin = firstBin.domain[0];
        var xMax = lastBin.domain[1];
        this.xDomain = [xMin, xMax];
        return true;
    };
    HistogramSeries.prototype.getDomain = function (direction) {
        if (direction === ChartAxisDirection.X) {
            return this.xDomain;
        }
        else {
            return this.yDomain;
        }
    };
    HistogramSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
        });
    };
    HistogramSeries.prototype.createNodeData = function () {
        var _this = this;
        var _a = this, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!this.seriesItemEnabled || !xAxis || !yAxis) {
            return [];
        }
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var _b = this, fill = _b.fill, stroke = _b.stroke, strokeWidth = _b.strokeWidth;
        var nodeData = [];
        var defaultLabelFormatter = function (params) { return String(params.value); };
        var _c = this.label, _d = _c.formatter, labelFormatter = _d === void 0 ? defaultLabelFormatter : _d, labelFontStyle = _c.fontStyle, labelFontWeight = _c.fontWeight, labelFontSize = _c.fontSize, labelFontFamily = _c.fontFamily, labelColor = _c.color;
        this.binnedData.forEach(function (binOfData) {
            var total = binOfData.aggregatedValue, frequency = binOfData.frequency, _a = __read$9(binOfData.domain, 2), xDomainMin = _a[0], xDomainMax = _a[1], relativeHeight = binOfData.relativeHeight;
            var xMinPx = xScale.convert(xDomainMin), xMaxPx = xScale.convert(xDomainMax), 
            // note: assuming can't be negative:
            y = _this.areaPlot ? relativeHeight : _this.yKey ? total : frequency, yZeroPx = yScale.convert(0), yMaxPx = yScale.convert(y), w = xMaxPx - xMinPx, h = Math.abs(yMaxPx - yZeroPx);
            var selectionDatumLabel = y !== 0
                ? {
                    text: labelFormatter({ value: binOfData.aggregatedValue }),
                    fontStyle: labelFontStyle,
                    fontWeight: labelFontWeight,
                    fontSize: labelFontSize,
                    fontFamily: labelFontFamily,
                    fill: labelColor,
                    x: xMinPx + w / 2,
                    y: yMaxPx + h / 2,
                }
                : undefined;
            nodeData.push({
                series: _this,
                datum: binOfData,
                // since each selection is an aggregation of multiple data.
                x: xMinPx,
                y: yMaxPx,
                width: w,
                height: h,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                label: selectionDatumLabel,
            });
        });
        return [{ itemId: this.yKey, nodeData: nodeData, labelData: nodeData }];
    };
    HistogramSeries.prototype.updateDatumSelection = function (opts) {
        var nodeData = opts.nodeData, datumSelection = opts.datumSelection;
        var updateRects = datumSelection.setData(nodeData);
        updateRects.exit.remove();
        var enterRects = updateRects.enter.append(Rect).each(function (rect) {
            rect.tag = HistogramSeriesNodeTag.Bin;
            rect.crisp = true;
        });
        return updateRects.merge(enterRects);
    };
    HistogramSeries.prototype.updateDatumNodes = function (opts) {
        var _this = this;
        var datumSelection = opts.datumSelection, isDatumHighlighted = opts.isHighlight;
        var _a = this, seriesFillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity, shadow = _a.shadow, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.fillOpacity, highlightFillOpacity = _e === void 0 ? seriesFillOpacity : _e, _f = _c.stroke, highlightedStroke = _f === void 0 ? deprecatedStroke : _f, _g = _c.strokeWidth, highlightedDatumStrokeWidth = _g === void 0 ? deprecatedStrokeWidth : _g;
        datumSelection.each(function (rect, datum, index) {
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : datum.strokeWidth;
            var fillOpacity = isDatumHighlighted ? highlightFillOpacity : seriesFillOpacity;
            rect.x = datum.x;
            rect.y = datum.y;
            rect.width = datum.width;
            rect.height = datum.height;
            rect.fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : datum.fill;
            rect.stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : datum.stroke;
            rect.fillOpacity = fillOpacity;
            rect.strokeOpacity = strokeOpacity;
            rect.strokeWidth = strokeWidth;
            rect.lineDash = _this.lineDash;
            rect.lineDashOffset = _this.lineDashOffset;
            rect.fillShadow = shadow;
            rect.zIndex = isDatumHighlighted ? Series.highlightedZIndex : index;
            rect.visible = datum.height > 0; // prevent stroke from rendering for zero height columns
        });
    };
    HistogramSeries.prototype.updateLabelSelection = function (opts) {
        var labelData = opts.labelData, labelSelection = opts.labelSelection;
        var updateTexts = labelSelection.setData(labelData);
        updateTexts.exit.remove();
        var enterTexts = updateTexts.enter.append(Text).each(function (text) {
            text.tag = HistogramSeriesNodeTag.Label;
            text.pointerEvents = PointerEvents.None;
            text.textAlign = 'center';
            text.textBaseline = 'middle';
        });
        return updateTexts.merge(enterTexts);
    };
    HistogramSeries.prototype.updateLabelNodes = function (opts) {
        var labelSelection = opts.labelSelection;
        var labelEnabled = this.label.enabled;
        labelSelection.each(function (text, datum) {
            var label = datum.label;
            if (label && labelEnabled) {
                text.text = label.text;
                text.x = label.x;
                text.y = label.y;
                text.fontStyle = label.fontStyle;
                text.fontWeight = label.fontWeight;
                text.fontSize = label.fontSize;
                text.fontFamily = label.fontFamily;
                text.fill = label.fill;
                text.visible = true;
            }
            else {
                text.visible = false;
            }
        });
    };
    HistogramSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!xKey || !xAxis || !yAxis) {
            return '';
        }
        var _b = this, xName = _b.xName, yName = _b.yName, color = _b.fill, tooltip = _b.tooltip, aggregation = _b.aggregation;
        var tooltipRenderer = tooltip.renderer;
        var bin = nodeDatum.datum;
        var aggregatedValue = bin.aggregatedValue, frequency = bin.frequency, _c = __read$9(bin.domain, 2), rangeMin = _c[0], rangeMax = _c[1];
        var title = sanitizeHtml(xName || xKey) + ": " + xAxis.formatDatum(rangeMin) + " - " + xAxis.formatDatum(rangeMax);
        var content = yKey
            ? "<b>" + sanitizeHtml(yName || yKey) + " (" + aggregation + ")</b>: " + yAxis.formatDatum(aggregatedValue) + "<br>"
            : '';
        content += "<b>Frequency</b>: " + frequency;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: bin,
                xKey: xKey,
                xValue: bin.domain,
                xName: xName,
                yKey: yKey,
                yValue: bin.aggregatedValue,
                yName: yName,
                color: color,
                title: title,
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    HistogramSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, xKey = _a.xKey, yName = _a.yName, visible = _a.visible, fill = _a.fill, stroke = _a.stroke, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity;
        if (data && data.length) {
            legendData.push({
                id: id,
                itemId: xKey,
                enabled: visible,
                label: {
                    text: yName || xKey || 'Frequency',
                },
                marker: {
                    fill: fill || 'rgba(0, 0, 0, 0)',
                    stroke: stroke || 'rgba(0, 0, 0, 0)',
                    fillOpacity: fillOpacity,
                    strokeOpacity: strokeOpacity,
                },
            });
        }
    };
    HistogramSeries.className = 'HistogramSeries';
    HistogramSeries.type = 'histogram';
    return HistogramSeries;
}(CartesianSeries));

var __extends$f = (undefined && undefined.__extends) || (function () {
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
var HierarchySeries = /** @class */ (function (_super) {
    __extends$f(HierarchySeries, _super);
    function HierarchySeries() {
        return _super.call(this, { pickModes: [SeriesNodePickMode.EXACT_SHAPE_MATCH] }) || this;
    }
    HierarchySeries.prototype.getLabelData = function () {
        return [];
    };
    return HierarchySeries;
}(Series));

var __extends$e = (undefined && undefined.__extends) || (function () {
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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DropShadow = /** @class */ (function (_super) {
    __extends$e(DropShadow, _super);
    function DropShadow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        _this.color = 'rgba(0, 0, 0, 0.5)';
        _this.xOffset = 0;
        _this.yOffset = 0;
        _this.blur = 5;
        return _this;
    }
    __decorate$1([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], DropShadow.prototype, "enabled", void 0);
    __decorate$1([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], DropShadow.prototype, "color", void 0);
    __decorate$1([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], DropShadow.prototype, "xOffset", void 0);
    __decorate$1([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], DropShadow.prototype, "yOffset", void 0);
    __decorate$1([
        SceneChangeDetection({ redraw: RedrawType.MAJOR })
    ], DropShadow.prototype, "blur", void 0);
    return DropShadow;
}(ChangeDetectable));

function slice(parent, x0, y0, x1, y1) {
    var nodes = parent.children;
    var k = parent.value && (y1 - y0) / parent.value;
    nodes.forEach(function (node) {
        node.x0 = x0;
        node.x1 = x1;
        node.y0 = y0;
        node.y1 = y0 += node.value * k;
    });
}
function dice(parent, x0, y0, x1, y1) {
    var nodes = parent.children;
    var k = parent.value && (x1 - x0) / parent.value;
    nodes.forEach(function (node) {
        node.x0 = x0;
        node.x1 = x0 += node.value * k;
        node.y0 = y0;
        node.y1 = y1;
    });
}
function roundNode(node) {
    node.x0 = Math.round(node.x0);
    node.y0 = Math.round(node.y0);
    node.x1 = Math.round(node.x1);
    node.y1 = Math.round(node.y1);
}
function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
    var rows = [];
    var nodes = parent.children;
    var n = nodes.length;
    var value = parent.value;
    var i0 = 0;
    var i1 = 0;
    var dx;
    var dy;
    var nodeValue;
    var sumValue;
    var minValue;
    var maxValue;
    var newRatio;
    var minRatio;
    var alpha;
    var beta;
    while (i0 < n) {
        dx = x1 - x0;
        dy = y1 - y0;
        // Find the next non-empty node.
        do {
            sumValue = nodes[i1++].value;
        } while (!sumValue && i1 < n);
        minValue = maxValue = sumValue;
        alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = Math.max(maxValue / beta, beta / minValue);
        // Keep adding nodes while the aspect ratio maintains or improves.
        for (; i1 < n; ++i1) {
            nodeValue = nodes[i1].value;
            sumValue += nodeValue;
            if (nodeValue < minValue) {
                minValue = nodeValue;
            }
            if (nodeValue > maxValue) {
                maxValue = nodeValue;
            }
            beta = sumValue * sumValue * alpha;
            newRatio = Math.max(maxValue / beta, beta / minValue);
            if (newRatio > minRatio) {
                sumValue -= nodeValue;
                break;
            }
            minRatio = newRatio;
        }
        // Position and record the row orientation.
        var row = {
            value: sumValue,
            dice: dx < dy,
            children: nodes.slice(i0, i1),
        };
        rows.push(row);
        if (row.dice) {
            var oldy0 = y0;
            var newy1 = y1;
            if (value) {
                y0 += (dy * sumValue) / value;
                newy1 = y0;
            }
            dice(row, x0, oldy0, x1, newy1);
        }
        else {
            var oldx0 = x0;
            var newx1 = x1;
            if (value) {
                x0 += (dx * sumValue) / value;
                newx1 = x0;
            }
            slice(row, oldx0, y0, newx1, y1);
        }
        value -= sumValue;
        i0 = i1;
    }
    return rows;
}
var phi = (1 + Math.sqrt(5)) / 2;
var squarify = (function custom(ratio) {
    function squarify(parent, x0, y0, x1, y1) {
        squarifyRatio(ratio, parent, x0, y0, x1, y1);
    }
    squarify.ratio = function (x) { return custom((x = +x) > 1 ? x : 1); };
    return squarify;
})(phi);
var Treemap = /** @class */ (function () {
    function Treemap() {
        this.paddingStack = [0];
        this.dx = 1;
        this.dy = 1;
        this.round = true;
        this.tile = squarify;
        this.paddingInner = function (_) { return 0; };
        this.paddingTop = function (_) { return 0; };
        this.paddingRight = function (_) { return 0; };
        this.paddingBottom = function (_) { return 0; };
        this.paddingLeft = function (_) { return 0; };
    }
    Object.defineProperty(Treemap.prototype, "size", {
        get: function () {
            return [this.dx, this.dy];
        },
        set: function (size) {
            this.dx = size[0];
            this.dy = size[1];
        },
        enumerable: true,
        configurable: true
    });
    Treemap.prototype.processData = function (root) {
        root.x0 = 0;
        root.y0 = 0;
        root.x1 = this.dx;
        root.y1 = this.dy;
        root.eachBefore(this.positionNode.bind(this));
        this.paddingStack = [0];
        if (this.round) {
            root.eachBefore(roundNode);
        }
        return root;
    };
    Treemap.prototype.positionNode = function (node) {
        var p = this.paddingStack[node.depth];
        var x0 = node.x0 + p;
        var y0 = node.y0 + p;
        var x1 = node.x1 - p;
        var y1 = node.y1 - p;
        if (x1 < x0) {
            x0 = x1 = (x0 + x1) / 2;
        }
        if (y1 < y0) {
            y0 = y1 = (y0 + y1) / 2;
        }
        node.x0 = x0;
        node.y0 = y0;
        node.x1 = x1;
        node.y1 = y1;
        if (node.children) {
            p = this.paddingStack[node.depth + 1] = this.paddingInner(node) / 2;
            x0 += this.paddingLeft(node) - p;
            y0 += this.paddingTop(node) - p;
            x1 -= this.paddingRight(node) - p;
            y1 -= this.paddingBottom(node) - p;
            if (x1 < x0) {
                x0 = x1 = (x0 + x1) / 2;
            }
            if (y1 < y0) {
                y0 = y1 = (y0 + y1) / 2;
            }
            this.tile(node, x0, y0, x1, y1);
        }
    };
    return Treemap;
}());

var __values$5 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$8 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$5 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$8(arguments[i]));
    return ar;
};
var HierarchyNode = /** @class */ (function () {
    function HierarchyNode(datum) {
        this.value = 0;
        this.depth = 0;
        this.height = 0;
        this.parent = undefined;
        this.children = undefined;
        this.datum = datum;
    }
    HierarchyNode.prototype.countFn = function (node) {
        var sum = 0, children = node.children;
        if (!children || !children.length) {
            sum = 1;
        }
        else {
            var i = children.length;
            while (--i >= 0) {
                sum += children[i].value;
            }
        }
        node.value = sum;
    };
    HierarchyNode.prototype.count = function () {
        return this.eachAfter(this.countFn);
    };
    HierarchyNode.prototype.each = function (callback, scope) {
        var _this = this;
        var index = -1;
        this.iterator(function (node) {
            callback.call(scope, node, ++index, _this);
        });
        return this;
    };
    /**
     * Invokes the given callback for each node in post-order traversal.
     * @param callback
     * @param scope
     */
    HierarchyNode.prototype.eachAfter = function (callback, scope) {
        var node = this;
        var nodes = [node];
        var next = [];
        while ((node = nodes.pop())) {
            next.push(node);
            var children = node.children;
            if (children) {
                for (var i = 0, n = children.length; i < n; ++i) {
                    nodes.push(children[i]);
                }
            }
        }
        var index = -1;
        while ((node = next.pop())) {
            callback.call(scope, node, ++index, this);
        }
        return this;
    };
    /**
     * Invokes the given callback for each node in pre-order traversal.
     * @param callback
     * @param scope
     */
    HierarchyNode.prototype.eachBefore = function (callback, scope) {
        var node = this;
        var nodes = [node];
        var index = -1;
        while ((node = nodes.pop())) {
            callback.call(scope, node, ++index, this);
            var children = node.children;
            if (children) {
                for (var i = children.length - 1; i >= 0; --i) {
                    var child = children[i];
                    nodes.push(child);
                }
            }
        }
        return this;
    };
    HierarchyNode.prototype.find = function (callback, scope) {
        var _this = this;
        var index = -1;
        var result;
        this.iterator(function (node) {
            if (callback.call(scope, node, ++index, _this)) {
                result = node;
                return false;
            }
        });
        return result;
    };
    HierarchyNode.prototype.sum = function (value) {
        return this.eachAfter(function (node) {
            var sum = +value(node.datum) || 0;
            var children = node.children;
            if (children) {
                var i = children.length;
                while (--i >= 0) {
                    sum += children[i].value;
                }
            }
            node.value = sum;
        });
    };
    HierarchyNode.prototype.sort = function (compare) {
        return this.eachBefore(function (node) {
            if (node.children) {
                node.children.sort(compare);
            }
        });
    };
    HierarchyNode.prototype.path = function (end) {
        var start = this;
        var ancestor = leastCommonAncestor(start, end);
        var nodes = [start];
        while (start !== ancestor) {
            start = start.parent;
            nodes.push(start);
        }
        var k = nodes.length;
        while (end !== ancestor) {
            nodes.splice(k, 0, end);
            end = end.parent;
        }
        return nodes;
    };
    HierarchyNode.prototype.ancestors = function () {
        var node = this;
        var nodes = [node];
        while ((node = node.parent)) {
            nodes.push(node);
        }
        return nodes;
    };
    HierarchyNode.prototype.descendants = function () {
        var nodes = [];
        this.iterator(function (node) { return nodes.push(node); });
        return nodes;
    };
    HierarchyNode.prototype.leaves = function () {
        var leaves = [];
        this.eachBefore(function (node) {
            if (!node.children) {
                leaves.push(node);
            }
        });
        return leaves;
    };
    HierarchyNode.prototype.links = function () {
        var root = this;
        var links = [];
        root.each(function (node) {
            if (node !== root) {
                // Don’t include the root’s parent, if any.
                links.push({ source: node.parent, target: node });
            }
        });
        return links;
    };
    HierarchyNode.prototype.iterator = function (callback) {
        var e_1, _a;
        var _b = this.children, children = _b === void 0 ? [] : _b;
        if (callback(this) === false) {
            return false;
        }
        try {
            for (var children_1 = __values$5(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                if (child.iterator(callback) === false) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    return HierarchyNode;
}());
function hierarchy(data, children) {
    if (data instanceof Map) {
        data = [undefined, data];
        if (children === undefined) {
            children = mapChildren;
        }
    }
    else if (children === undefined) {
        children = objectChildren;
    }
    var root = new HierarchyNode(data);
    var nodes = [root];
    var _loop_1 = function () {
        var node = nodes.pop();
        var datumChildren = children(node.datum);
        if (!datumChildren) {
            return "continue";
        }
        var newNodes = Array.from(datumChildren).map(function (dc) { return new HierarchyNode(dc); });
        newNodes.forEach(function (child) {
            child.parent = node;
            child.depth = node.depth + 1;
        });
        node.children = newNodes;
        nodes.push.apply(nodes, __spread$5(newNodes));
    };
    while (nodes.length > 0) {
        _loop_1();
    }
    return root.eachBefore(computeHeight);
}
function computeHeight(node) {
    var height = 0;
    do {
        node.height = height;
        node = node.parent;
    } while (node && node.height < ++height);
}
function mapChildren(d) {
    return Array.isArray(d) ? d[1] : undefined;
}
function objectChildren(d) {
    return d.children;
}
function leastCommonAncestor(a, b) {
    if (!(a && b)) {
        return undefined;
    }
    if (a === b) {
        return a;
    }
    var aNodes = a.ancestors();
    var bNodes = b.ancestors();
    var c = undefined;
    a = aNodes.pop();
    b = bNodes.pop();
    while (a === b) {
        c = a;
        a = aNodes.pop();
        b = bNodes.pop();
    }
    return c;
}

var __extends$d = (undefined && undefined.__extends) || (function () {
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
var __values$4 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var TreemapSeriesTooltip = /** @class */ (function (_super) {
    __extends$d(TreemapSeriesTooltip, _super);
    function TreemapSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        return _this;
    }
    return TreemapSeriesTooltip;
}(SeriesTooltip));
var TreemapSeriesLabel = /** @class */ (function (_super) {
    __extends$d(TreemapSeriesLabel, _super);
    function TreemapSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.padding = 10;
        return _this;
    }
    return TreemapSeriesLabel;
}(Label));
var TextNodeTag;
(function (TextNodeTag) {
    TextNodeTag[TextNodeTag["Name"] = 0] = "Name";
    TextNodeTag[TextNodeTag["Value"] = 1] = "Value";
})(TextNodeTag || (TextNodeTag = {}));
var TreemapSeries = /** @class */ (function (_super) {
    __extends$d(TreemapSeries, _super);
    function TreemapSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.groupSelection = Selection.select(_this.pickGroup).selectAll();
        _this.highlightSelection = Selection.select(_this.highlightGroup).selectAll();
        _this.layout = new Treemap();
        _this.title = (function () {
            var label = new TreemapSeriesLabel();
            label.color = 'white';
            label.fontWeight = 'bold';
            label.fontSize = 12;
            label.fontFamily = 'Verdana, sans-serif';
            label.padding = 15;
            return label;
        })();
        _this.subtitle = (function () {
            var label = new TreemapSeriesLabel();
            label.color = 'white';
            label.fontSize = 9;
            label.fontFamily = 'Verdana, sans-serif';
            label.padding = 13;
            return label;
        })();
        _this.labels = {
            large: (function () {
                var label = new Label();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 18;
                return label;
            })(),
            medium: (function () {
                var label = new Label();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 14;
                return label;
            })(),
            small: (function () {
                var label = new Label();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 10;
                return label;
            })(),
            color: (function () {
                var label = new Label();
                label.color = 'white';
                return label;
            })(),
        };
        _this._nodePadding = 2;
        _this.labelKey = 'label';
        _this.sizeKey = 'size';
        _this.colorKey = 'color';
        _this.colorDomain = [-5, 5];
        _this.colorRange = ['#cb4b3f', '#6acb64'];
        _this.colorParents = false;
        _this.gradient = true;
        _this.colorName = 'Change';
        _this.rootName = 'Root';
        _this.shadow = (function () {
            var shadow = new DropShadow();
            shadow.color = 'rgba(0, 0, 0, 0.4)';
            shadow.xOffset = 1.5;
            shadow.yOffset = 1.5;
            return shadow;
        })();
        _this.tooltip = new TreemapSeriesTooltip();
        return _this;
    }
    Object.defineProperty(TreemapSeries.prototype, "nodePadding", {
        get: function () {
            return this._nodePadding;
        },
        set: function (value) {
            if (this._nodePadding !== value) {
                this._nodePadding = value;
                this.updateLayoutPadding();
            }
        },
        enumerable: true,
        configurable: true
    });
    TreemapSeries.prototype.updateLayoutPadding = function () {
        var _a = this, title = _a.title, subtitle = _a.subtitle, nodePadding = _a.nodePadding, labelKey = _a.labelKey;
        this.layout.paddingRight = function (_) { return nodePadding; };
        this.layout.paddingBottom = function (_) { return nodePadding; };
        this.layout.paddingLeft = function (_) { return nodePadding; };
        this.layout.paddingTop = function (node) {
            var name = node.datum[labelKey] || '';
            if (node.children) {
                name = name.toUpperCase();
            }
            var font = node.depth > 1 ? subtitle : title;
            var textSize = HdpiCanvas.getTextSize(name, [font.fontWeight, font.fontSize + 'px', font.fontFamily].join(' ').trim());
            var innerNodeWidth = node.x1 - node.x0 - nodePadding * 2;
            var hasTitle = node.depth > 0 && node.children && textSize.width <= innerNodeWidth;
            node.hasTitle = !!hasTitle;
            return hasTitle ? textSize.height + nodePadding * 2 : nodePadding;
        };
    };
    TreemapSeries.prototype.processData = function () {
        if (!this.data) {
            return false;
        }
        var _a = this, data = _a.data, sizeKey = _a.sizeKey, labelKey = _a.labelKey, colorKey = _a.colorKey, colorDomain = _a.colorDomain, colorRange = _a.colorRange, colorParents = _a.colorParents;
        var dataRoot;
        if (sizeKey) {
            dataRoot = hierarchy(data).sum(function (datum) { return (datum.children ? 1 : datum[sizeKey]); });
        }
        else {
            dataRoot = hierarchy(data).sum(function (datum) { return (datum.children ? 0 : 1); });
        }
        this.dataRoot = dataRoot;
        var colorScale = new LinearScale();
        colorScale.domain = colorDomain;
        colorScale.range = colorRange;
        var series = this;
        function traverse(root, depth) {
            if (depth === void 0) { depth = 0; }
            var children = root.children, datum = root.datum;
            var label = datum[labelKey];
            var colorValue = colorKey ? datum[colorKey] : depth;
            Object.assign(root, { series: series });
            root.fill = !children || colorParents ? colorScale.convert(colorValue) : '#272931';
            root.colorValue = colorValue;
            if (label) {
                root.label = children ? label.toUpperCase() : label;
            }
            else {
                root.label = '';
            }
            if (children) {
                children.forEach(function (child) { return traverse(child, depth + 1); });
            }
        }
        traverse(this.dataRoot);
        return true;
    };
    TreemapSeries.prototype.getLabelCenterX = function (datum) {
        return (datum.x0 + datum.x1) / 2;
    };
    TreemapSeries.prototype.getLabelCenterY = function (datum) {
        return (datum.y0 + datum.y1) / 2 + 2;
    };
    TreemapSeries.prototype.createNodeData = function () {
        return [];
    };
    TreemapSeries.prototype.update = function () {
        this.updateSelections();
        this.updateNodes();
    };
    TreemapSeries.prototype.updateSelections = function () {
        if (!this.nodeDataRefresh) {
            return;
        }
        this.nodeDataRefresh = false;
        var _a = this, chart = _a.chart, dataRoot = _a.dataRoot;
        if (!chart || !dataRoot) {
            return;
        }
        var seriesRect = chart.getSeriesRect();
        if (!seriesRect) {
            return;
        }
        this.layout.size = [seriesRect.width, seriesRect.height];
        this.updateLayoutPadding();
        var descendants = this.layout.processData(dataRoot).descendants();
        var _b = this, groupSelection = _b.groupSelection, highlightSelection = _b.highlightSelection;
        var update = function (selection) {
            var updateGroups = selection.setData(descendants);
            updateGroups.exit.remove();
            var enterGroups = updateGroups.enter.append(Group);
            enterGroups.append(Rect);
            enterGroups.append(Text).each(function (node) { return (node.tag = TextNodeTag.Name); });
            enterGroups.append(Text).each(function (node) { return (node.tag = TextNodeTag.Value); });
            return updateGroups.merge(enterGroups);
        };
        this.groupSelection = update(groupSelection);
        this.highlightSelection = update(highlightSelection);
    };
    TreemapSeries.prototype.updateNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, nodePadding = _a.nodePadding, labels = _a.labels, shadow = _a.shadow, gradient = _a.gradient, highlightedDatum = _a.chart.highlightedDatum, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, highlightedFillOpacity = _c.fillOpacity, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f;
        var labelMeta = this.buildLabelMeta(this.groupSelection.data);
        var updateRectFn = function (rect, datum, isDatumHighlighted) {
            var _a;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : datum.fill;
            var fillOpacity = (_a = (isDatumHighlighted ? highlightedFillOpacity : 1), (_a !== null && _a !== void 0 ? _a : 1));
            var stroke = isDatumHighlighted && highlightedStroke !== undefined
                ? highlightedStroke
                : datum.depth < 2
                    ? undefined
                    : 'black';
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined ? highlightedDatumStrokeWidth : 1;
            rect.fill = fill;
            rect.fillOpacity = fillOpacity;
            rect.stroke = stroke;
            rect.strokeWidth = strokeWidth;
            rect.crisp = true;
            rect.gradient = gradient;
            rect.x = datum.x0;
            rect.y = datum.y0;
            rect.width = datum.x1 - datum.x0;
            rect.height = datum.y1 - datum.y0;
            if (isDatumHighlighted && datum.children) {
                var x0 = datum.x0, x1 = datum.x1, y0 = datum.y0, y1 = datum.y1;
                var pLeft = _this.layout.paddingLeft(datum);
                var pRight = _this.layout.paddingRight(datum);
                var pTop = _this.layout.paddingTop(datum);
                var pBottom = _this.layout.paddingBottom(datum);
                if (rect.clipPath) {
                    rect.clipPath.clear();
                }
                else {
                    rect.clipPath = new Path2D();
                }
                rect.clipMode = 'punch-out';
                rect.clipPath.moveTo(x0 + pLeft, y0 + pTop);
                rect.clipPath.lineTo(x1 - pRight, y0 + pTop);
                rect.clipPath.lineTo(x1 - pRight, y1 - pBottom);
                rect.clipPath.lineTo(x0 + pLeft, y1 - pBottom);
                rect.clipPath.lineTo(x0 + pLeft, y0 + pTop);
                rect.clipPath.closePath();
            }
        };
        this.groupSelection.selectByClass(Rect).each(function (rect, datum) { return updateRectFn(rect, datum, false); });
        this.highlightSelection.selectByClass(Rect).each(function (rect, datum) {
            var isDatumHighlighted = datum === highlightedDatum;
            rect.visible = isDatumHighlighted;
            if (rect.visible) {
                updateRectFn(rect, datum, isDatumHighlighted);
            }
        });
        var updateNodeFn = function (text, datum, index, highlighted) {
            var _a;
            var hasTitle = datum.hasTitle;
            var _b = (_a = labelMeta[index], (_a !== null && _a !== void 0 ? _a : {})), label = _b.label, textBaseline = _b.nodeBaseline;
            if (label != null && textBaseline != null) {
                text.textBaseline = textBaseline;
                text.fontWeight = label.fontWeight;
                text.fontSize = label.fontSize;
                text.fontFamily = label.fontFamily;
                text.textAlign = hasTitle ? 'left' : 'center';
                text.text = datum.label;
                text.fill = highlighted ? 'black' : label.color;
                text.fillShadow = !highlighted ? shadow : undefined;
                text.visible = true;
            }
            else {
                text.visible = false;
            }
            if (hasTitle) {
                text.x = datum.x0 + nodePadding;
                text.y = datum.y0 + nodePadding;
            }
            else {
                text.x = _this.getLabelCenterX(datum);
                text.y = _this.getLabelCenterY(datum);
            }
        };
        this.groupSelection
            .selectByTag(TextNodeTag.Name)
            .each(function (text, datum, index) { return updateNodeFn(text, datum, index, false); });
        this.highlightSelection.selectByTag(TextNodeTag.Name).each(function (text, datum, index) {
            var isDatumHighlighted = datum === highlightedDatum;
            text.visible = isDatumHighlighted;
            if (text.visible) {
                updateNodeFn(text, datum, index, isDatumHighlighted);
            }
        });
        var updateValueFn = function (text, datum, index, highlighted) {
            var _a;
            var _b = (_a = labelMeta[index], (_a !== null && _a !== void 0 ? _a : {})), textBaseline = _b.valueBaseline, valueText = _b.valueText;
            var label = labels.color;
            if (label.enabled && textBaseline != null && valueText) {
                text.fontSize = label.fontSize;
                text.fontFamily = label.fontFamily;
                text.fontStyle = label.fontStyle;
                text.fontWeight = label.fontWeight;
                text.textBaseline = textBaseline;
                text.textAlign = 'center';
                text.text = valueText;
                text.fill = highlighted ? 'black' : label.color;
                text.fillShadow = highlighted ? undefined : shadow;
                text.visible = true;
                text.x = _this.getLabelCenterX(datum);
                text.y = _this.getLabelCenterY(datum);
            }
            else {
                text.visible = false;
            }
        };
        this.groupSelection
            .selectByTag(TextNodeTag.Value)
            .each(function (text, datum, index) { return updateValueFn(text, datum, index, false); });
        this.highlightSelection.selectByTag(TextNodeTag.Value).each(function (text, datum, index) {
            var isDatumHighlighted = datum === highlightedDatum;
            text.visible = isDatumHighlighted;
            if (text.visible) {
                updateValueFn(text, datum, index, isDatumHighlighted);
            }
        });
    };
    TreemapSeries.prototype.buildLabelMeta = function (data) {
        var e_1, _a;
        var _b = this, labels = _b.labels, title = _b.title, subtitle = _b.subtitle, nodePadding = _b.nodePadding, colorKey = _b.colorKey;
        var labelMeta = [];
        labelMeta.length = this.groupSelection.data.length;
        var text = new Text();
        var index = 0;
        try {
            for (var data_1 = __values$4(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var datum = data_1_1.value;
                var value = datum.value;
                var isLeaf = !datum.children;
                var innerNodeWidth = datum.x1 - datum.x0 - nodePadding * 2;
                var innerNodeHeight = datum.y1 - datum.y0 - nodePadding * 2;
                var hasTitle = datum.hasTitle;
                var label = void 0;
                if (isLeaf) {
                    if (innerNodeWidth > 40 && innerNodeHeight > 40) {
                        label = labels.large;
                    }
                    else if (innerNodeWidth > 20 && innerNodeHeight > 20) {
                        label = labels.medium;
                    }
                    else {
                        label = labels.small;
                    }
                }
                else if (datum.depth > 1) {
                    label = subtitle;
                }
                else {
                    label = title;
                }
                if (!label.enabled) {
                    labelMeta[index++] = undefined;
                    continue;
                }
                text.fontWeight = label.fontWeight;
                text.fontSize = label.fontSize;
                text.fontFamily = label.fontFamily;
                text.textAlign = hasTitle ? 'left' : 'center';
                text.text = datum.label;
                var nodeBBox = text.computeBBox();
                var hasNode = isLeaf && !!nodeBBox && nodeBBox.width <= innerNodeWidth && nodeBBox.height * 2 + 8 <= innerNodeHeight;
                var valueText = typeof value === 'number' && isFinite(value) ? String(toFixed(datum.colorValue)) + '%' : '';
                text.fontSize = labels.color.fontSize;
                text.fontFamily = labels.color.fontFamily;
                text.fontStyle = labels.color.fontStyle;
                text.fontWeight = labels.color.fontWeight;
                text.text = valueText;
                var valueBBox = text.computeBBox();
                var hasValue = isLeaf && !!colorKey && hasNode && !!valueBBox && valueBBox.width < innerNodeWidth;
                var nodeBaseline = hasValue ? 'bottom' : isLeaf ? 'middle' : hasTitle ? 'top' : 'middle';
                labelMeta[index++] = {
                    label: label,
                    nodeBaseline: hasTitle || hasNode ? nodeBaseline : undefined,
                    valueBaseline: hasValue ? 'top' : undefined,
                    valueText: valueText,
                };
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return labelMeta;
    };
    TreemapSeries.prototype.getDomain = function (_direction) {
        return [0, 1];
    };
    TreemapSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            labelKey: this.labelKey,
            sizeKey: this.sizeKey,
            colorKey: this.colorKey,
        });
    };
    TreemapSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, tooltip = _a.tooltip, sizeKey = _a.sizeKey, labelKey = _a.labelKey, colorKey = _a.colorKey, colorName = _a.colorName, rootName = _a.rootName;
        var datum = nodeDatum.datum;
        var tooltipRenderer = tooltip.renderer;
        var title = nodeDatum.depth ? datum[labelKey] : rootName || datum[labelKey];
        var content = undefined;
        var color = nodeDatum.fill || 'gray';
        if (colorKey && colorName) {
            var colorValue = datum[colorKey];
            if (typeof colorValue === 'number' && isFinite(colorValue)) {
                content = "<b>" + colorName + "</b>: " + toFixed(datum[colorKey]);
            }
        }
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: nodeDatum,
                sizeKey: sizeKey,
                labelKey: labelKey,
                colorKey: colorKey,
                title: title,
                color: color,
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    TreemapSeries.prototype.listSeriesItems = function (_legendData) {
        // Override point for subclasses.
    };
    TreemapSeries.className = 'TreemapSeries';
    TreemapSeries.type = 'treemap';
    return TreemapSeries;
}(HierarchySeries));

var __extends$c = (undefined && undefined.__extends) || (function () {
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
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Sector = /** @class */ (function (_super) {
    __extends$c(Sector, _super);
    function Sector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.centerX = 0;
        _this.centerY = 0;
        _this.centerOffset = 0;
        _this.innerRadius = 10;
        _this.outerRadius = 20;
        _this.startAngle = 0;
        _this.endAngle = Math.PI * 2;
        _this.angleOffset = 0;
        return _this;
    }
    Sector.prototype.computeBBox = function () {
        var radius = this.outerRadius;
        return new BBox(this.centerX - radius, this.centerY - radius, radius * 2, radius * 2);
    };
    Sector.prototype.isFullPie = function () {
        return isEqual(normalizeAngle360(this.startAngle), normalizeAngle360(this.endAngle));
    };
    Sector.prototype.updatePath = function () {
        var path = this.path;
        var angleOffset = this.angleOffset;
        var startAngle = Math.min(this.startAngle, this.endAngle) + angleOffset;
        var endAngle = Math.max(this.startAngle, this.endAngle) + angleOffset;
        var midAngle = (startAngle + endAngle) * 0.5;
        var innerRadius = Math.min(this.innerRadius, this.outerRadius);
        var outerRadius = Math.max(this.innerRadius, this.outerRadius);
        var centerOffset = this.centerOffset;
        var fullPie = this.isFullPie();
        var centerX = this.centerX;
        var centerY = this.centerY;
        path.clear();
        if (centerOffset) {
            centerX += centerOffset * Math.cos(midAngle);
            centerY += centerOffset * Math.sin(midAngle);
        }
        if (!fullPie) {
            path.moveTo(centerX + innerRadius * Math.cos(startAngle), centerY + innerRadius * Math.sin(startAngle));
            path.lineTo(centerX + outerRadius * Math.cos(startAngle), centerY + outerRadius * Math.sin(startAngle));
        }
        path.cubicArc(centerX, centerY, outerRadius, outerRadius, 0, startAngle, endAngle, 0);
        if (fullPie) {
            path.moveTo(centerX + innerRadius * Math.cos(endAngle), centerY + innerRadius * Math.sin(endAngle));
        }
        else {
            // Temp workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=993330
            // Revert this commit when fixed ^^.
            var x = centerX + innerRadius * Math.cos(endAngle);
            path.lineTo(Math.abs(x) < 1e-8 ? 0 : x, centerY + innerRadius * Math.sin(endAngle));
        }
        path.cubicArc(centerX, centerY, innerRadius, innerRadius, 0, endAngle, startAngle, 1);
        path.closePath();
        this.dirtyPath = false;
    };
    Sector.className = 'Sector';
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "centerX", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "centerY", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "centerOffset", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "innerRadius", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "outerRadius", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "startAngle", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "endAngle", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Sector.prototype, "angleOffset", void 0);
    return Sector;
}(Path));

var __extends$b = (undefined && undefined.__extends) || (function () {
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
var __read$7 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$4 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$7(arguments[i]));
    return ar;
};
var PieHighlightStyle = /** @class */ (function (_super) {
    __extends$b(PieHighlightStyle, _super);
    function PieHighlightStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PieHighlightStyle;
}(HighlightStyle));
var PieNodeTag;
(function (PieNodeTag) {
    PieNodeTag[PieNodeTag["Sector"] = 0] = "Sector";
    PieNodeTag[PieNodeTag["Callout"] = 1] = "Callout";
    PieNodeTag[PieNodeTag["Label"] = 2] = "Label";
})(PieNodeTag || (PieNodeTag = {}));
var PieSeriesLabel = /** @class */ (function (_super) {
    __extends$b(PieSeriesLabel, _super);
    function PieSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offset = 3; // from the callout line
        _this.minAngle = 20; // in degrees
        _this.formatter = undefined;
        return _this;
    }
    return PieSeriesLabel;
}(Label));
var PieSeriesCallout = /** @class */ (function (_super) {
    __extends$b(PieSeriesCallout, _super);
    function PieSeriesCallout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.colors = ['#874349', '#718661', '#a48f5f', '#5a7088', '#7f637a', '#5d8692'];
        _this.length = 10;
        _this.strokeWidth = 1;
        return _this;
    }
    return PieSeriesCallout;
}(Observable));
var PieSeriesTooltip = /** @class */ (function (_super) {
    __extends$b(PieSeriesTooltip, _super);
    function PieSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        return _this;
    }
    return PieSeriesTooltip;
}(SeriesTooltip));
var PieTitle = /** @class */ (function (_super) {
    __extends$b(PieTitle, _super);
    function PieTitle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.showInLegend = false;
        return _this;
    }
    return PieTitle;
}(Caption));
var PieSeries = /** @class */ (function (_super) {
    __extends$b(PieSeries, _super);
    function PieSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radiusScale = new LinearScale();
        _this.groupSelection = Selection.select(_this.pickGroup).selectAll();
        _this.highlightSelection = Selection.select(_this.highlightGroup).selectAll();
        /**
         * The processed data that gets visualized.
         */
        _this.groupSelectionData = [];
        _this.angleScale = (function () {
            var scale = new LinearScale();
            // Each slice is a ratio of the whole, where all ratios add up to 1.
            scale.domain = [0, 1];
            // Add 90 deg to start the first pie at 12 o'clock.
            scale.range = [-Math.PI, Math.PI].map(function (angle) { return angle + Math.PI / 2; });
            return scale;
        })();
        // When a user toggles a series item (e.g. from the legend), its boolean state is recorded here.
        _this.seriesItemEnabled = [];
        _this.label = new PieSeriesLabel();
        _this.callout = new PieSeriesCallout();
        _this.tooltip = new PieSeriesTooltip();
        /**
         * The key of the numeric field to use to determine the angle (for example,
         * a pie slice angle).
         */
        _this.angleKey = '';
        _this.angleName = '';
        /**
         * The key of the numeric field to use to determine the radii of pie slices.
         * The largest value will correspond to the full radius and smaller values to
         * proportionally smaller radii.
         */
        _this.radiusKey = undefined;
        _this.radiusName = undefined;
        _this.radiusMin = undefined;
        _this.radiusMax = undefined;
        _this.labelKey = undefined;
        _this.labelName = undefined;
        _this.fills = ['#c16068', '#a2bf8a', '#ebcc87', '#80a0c3', '#b58dae', '#85c0d1'];
        _this.strokes = ['#874349', '#718661', '#a48f5f', '#5a7088', '#7f637a', '#5d8692'];
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this.formatter = undefined;
        /**
         * The series rotation in degrees.
         */
        _this.rotation = 0;
        _this.outerRadiusOffset = 0;
        _this.innerRadiusOffset = 0;
        _this.strokeWidth = 1;
        _this.shadow = undefined;
        _this.highlightStyle = new PieHighlightStyle();
        return _this;
    }
    Object.defineProperty(PieSeries.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            var oldTitle = this._title;
            if (oldTitle !== value) {
                if (oldTitle) {
                    this.seriesGroup.removeChild(oldTitle.node);
                }
                if (value) {
                    value.node.textBaseline = 'bottom';
                    this.seriesGroup.appendChild(value.node);
                }
                this._title = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (input) {
            this._data = input;
            this.processSeriesItemEnabled();
        },
        enumerable: true,
        configurable: true
    });
    PieSeries.prototype.visibleChanged = function () {
        this.processSeriesItemEnabled();
    };
    PieSeries.prototype.processSeriesItemEnabled = function () {
        var _a;
        var _b = this, data = _b.data, visible = _b.visible;
        this.seriesItemEnabled = ((_a = data) === null || _a === void 0 ? void 0 : _a.map(function () { return visible; })) || [];
    };
    PieSeries.prototype.setColors = function (fills, strokes) {
        this.fills = fills;
        this.strokes = strokes;
        this.callout.colors = strokes;
    };
    PieSeries.prototype.getDomain = function (direction) {
        if (direction === ChartAxisDirection.X) {
            return this.angleScale.domain;
        }
        else {
            return this.radiusScale.domain;
        }
    };
    PieSeries.prototype.processData = function () {
        var _this = this;
        var _a = this, angleKey = _a.angleKey, radiusKey = _a.radiusKey, seriesItemEnabled = _a.seriesItemEnabled, angleScale = _a.angleScale, groupSelectionData = _a.groupSelectionData, label = _a.label;
        var data = angleKey && this.data ? this.data : [];
        var angleData = data.map(function (datum, index) { return (seriesItemEnabled[index] && Math.abs(+datum[angleKey])) || 0; });
        var angleDataTotal = angleData.reduce(function (a, b) { return a + b; }, 0);
        // The ratios (in [0, 1] interval) used to calculate the end angle value for every pie slice.
        // Each slice starts where the previous one ends, so we only keep the ratios for end angles.
        var angleDataRatios = (function () {
            var sum = 0;
            return angleData.map(function (datum) { return (sum += datum / angleDataTotal); });
        })();
        var labelFormatter = label.formatter;
        var labelKey = label.enabled && this.labelKey;
        var labelData = [];
        var radiusData = [];
        if (labelKey) {
            if (labelFormatter) {
                labelData = data.map(function (datum) { return labelFormatter({ value: datum[labelKey] }); });
            }
            else {
                labelData = data.map(function (datum) { return String(datum[labelKey]); });
            }
        }
        if (radiusKey) {
            var _b = this, radiusMin = _b.radiusMin, radiusMax = _b.radiusMax;
            var radii = data.map(function (datum) { return Math.abs(datum[radiusKey]); });
            var min_1 = (radiusMin !== null && radiusMin !== void 0 ? radiusMin : 0);
            var max = radiusMax ? radiusMax : Math.max.apply(Math, __spread$4(radii));
            var delta_1 = max - min_1;
            radiusData = radii.map(function (value) { return (delta_1 ? (value - min_1) / delta_1 : 1); });
        }
        groupSelectionData.length = 0;
        var rotation = toRadians(this.rotation);
        var halfPi = Math.PI / 2;
        var datumIndex = 0;
        var quadrantTextOpts = [
            { textAlign: 'center', textBaseline: 'bottom' },
            { textAlign: 'left', textBaseline: 'middle' },
            { textAlign: 'center', textBaseline: 'hanging' },
            { textAlign: 'right', textBaseline: 'middle' },
        ];
        // Process segments.
        var end = 0;
        angleDataRatios.forEach(function (start) {
            if (isNaN(start)) {
                return;
            } // No segments displayed - nothing to do.
            var radius = radiusKey ? radiusData[datumIndex] : 1;
            var startAngle = angleScale.convert(start) + rotation;
            var endAngle = angleScale.convert(end) + rotation;
            var midAngle = (startAngle + endAngle) / 2;
            var span = Math.abs(endAngle - startAngle);
            var midCos = Math.cos(midAngle);
            var midSin = Math.sin(midAngle);
            var labelMinAngle = toRadians(label.minAngle);
            var labelVisible = labelKey && span > labelMinAngle;
            var midAngle180 = normalizeAngle180(midAngle);
            // Split the circle into quadrants like so: ⊗
            var quadrantStart = (-3 * Math.PI) / 4; // same as `normalizeAngle180(toRadians(-135))`
            var quadrantOffset = midAngle180 - quadrantStart;
            var quadrant = Math.floor(quadrantOffset / halfPi);
            var quadrantIndex = mod(quadrant, quadrantTextOpts.length);
            var _a = quadrantTextOpts[quadrantIndex], textAlign = _a.textAlign, textBaseline = _a.textBaseline;
            groupSelectionData.push({
                series: _this,
                datum: data[datumIndex],
                itemId: datumIndex,
                index: datumIndex,
                radius: radius,
                startAngle: startAngle,
                endAngle: endAngle,
                midAngle: midAngle,
                midCos: midCos,
                midSin: midSin,
                label: labelVisible
                    ? {
                        text: labelData[datumIndex],
                        textAlign: textAlign,
                        textBaseline: textBaseline,
                    }
                    : undefined,
            });
            datumIndex++;
            end = start; // Update for next iteration.
        });
        return true;
    };
    PieSeries.prototype.createNodeData = function () {
        return [];
    };
    PieSeries.prototype.update = function () {
        var _a = this, radius = _a.radius, innerRadiusOffset = _a.innerRadiusOffset, outerRadiusOffset = _a.outerRadiusOffset, title = _a.title;
        this.radiusScale.range = [
            innerRadiusOffset ? radius + innerRadiusOffset : 0,
            radius + (outerRadiusOffset || 0),
        ];
        this.group.translationX = this.centerX;
        this.group.translationY = this.centerY;
        if (title) {
            var outerRadius = Math.max(0, this.radiusScale.range[1]);
            if (outerRadius === 0) {
                title.node.visible = false;
            }
            else {
                title.node.translationY = -radius - outerRadiusOffset - 2;
                title.node.visible = title.enabled;
            }
        }
        this.updateSelections();
        this.updateNodes();
    };
    PieSeries.prototype.updateSelections = function () {
        this.updateGroupSelection();
    };
    PieSeries.prototype.updateGroupSelection = function () {
        var _this = this;
        var _a = this, groupSelection = _a.groupSelection, highlightSelection = _a.highlightSelection;
        var update = function (selection, appendLabels) {
            var updateGroups = selection.setData(_this.groupSelectionData);
            updateGroups.exit.remove();
            var enterGroups = updateGroups.enter.append(Group);
            enterGroups.append(Sector).each(function (node) { return (node.tag = PieNodeTag.Sector); });
            if (appendLabels) {
                enterGroups.append(Line).each(function (node) {
                    node.tag = PieNodeTag.Callout;
                    node.pointerEvents = PointerEvents.None;
                });
                enterGroups.append(Text).each(function (node) {
                    node.tag = PieNodeTag.Label;
                    node.pointerEvents = PointerEvents.None;
                });
            }
            return updateGroups.merge(enterGroups);
        };
        this.groupSelection = update(groupSelection, true);
        this.highlightSelection = update(highlightSelection, false);
    };
    PieSeries.prototype.updateNodes = function () {
        var _this = this;
        var _a, _b;
        if (!this.chart) {
            return;
        }
        var isVisible = this.seriesItemEnabled.indexOf(true) >= 0;
        this.group.visible = isVisible;
        this.seriesGroup.visible = isVisible;
        this.highlightGroup.visible = isVisible && ((_b = (_a = this.chart) === null || _a === void 0 ? void 0 : _a.highlightedDatum) === null || _b === void 0 ? void 0 : _b.series) === this;
        this.seriesGroup.opacity = this.getOpacity();
        var _c = this, fills = _c.fills, strokes = _c.strokes, seriesFillOpacity = _c.fillOpacity, strokeOpacity = _c.strokeOpacity, radiusScale = _c.radiusScale, callout = _c.callout, shadow = _c.shadow, highlightedDatum = _c.chart.highlightedDatum, _d = _c.highlightStyle, deprecatedFill = _d.fill, deprecatedStroke = _d.stroke, deprecatedStrokeWidth = _d.strokeWidth, _e = _d.item, _f = _e.fill, highlightedFill = _f === void 0 ? deprecatedFill : _f, _g = _e.fillOpacity, highlightFillOpacity = _g === void 0 ? seriesFillOpacity : _g, _h = _e.stroke, highlightedStroke = _h === void 0 ? deprecatedStroke : _h, _j = _e.strokeWidth, highlightedDatumStrokeWidth = _j === void 0 ? deprecatedStrokeWidth : _j, angleKey = _c.angleKey, radiusKey = _c.radiusKey, formatter = _c.formatter;
        var centerOffsets = [];
        var innerRadius = radiusScale.convert(0);
        var updateSectorFn = function (sector, datum, index, isDatumHighlighted) {
            var radius = radiusScale.convert(datum.radius, clamper$1);
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : fills[index % fills.length];
            var fillOpacity = isDatumHighlighted ? highlightFillOpacity : seriesFillOpacity;
            var stroke = isDatumHighlighted && highlightedStroke !== undefined
                ? highlightedStroke
                : strokes[index % strokes.length];
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : _this.getStrokeWidth(_this.strokeWidth);
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    angleKey: angleKey,
                    radiusKey: radiusKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    highlighted: isDatumHighlighted,
                });
            }
            // Bring highlighted slice's parent group to front.
            var parent = sector.parent && sector.parent.parent;
            if (isDatumHighlighted && parent) {
                parent.removeChild(sector.parent);
                parent.appendChild(sector.parent);
            }
            sector.innerRadius = Math.max(0, innerRadius);
            sector.outerRadius = Math.max(0, radius);
            sector.startAngle = datum.startAngle;
            sector.endAngle = datum.endAngle;
            sector.fill = (format && format.fill) || fill;
            sector.stroke = (format && format.stroke) || stroke;
            sector.strokeWidth = format && format.strokeWidth !== undefined ? format.strokeWidth : strokeWidth;
            sector.fillOpacity = fillOpacity;
            sector.strokeOpacity = strokeOpacity;
            sector.lineDash = _this.lineDash;
            sector.lineDashOffset = _this.lineDashOffset;
            sector.fillShadow = shadow;
            sector.lineJoin = 'round';
            centerOffsets.push(sector.centerOffset);
        };
        this.groupSelection
            .selectByTag(PieNodeTag.Sector)
            .each(function (node, datum, index) { return updateSectorFn(node, datum, index, false); });
        this.highlightSelection.selectByTag(PieNodeTag.Sector).each(function (node, datum, index) {
            var isDatumHighlighted = !!highlightedDatum && highlightedDatum.series === _this && datum.itemId === highlightedDatum.itemId;
            node.visible = isDatumHighlighted;
            if (node.visible) {
                updateSectorFn(node, datum, index, isDatumHighlighted);
            }
        });
        var calloutColors = callout.colors, calloutLength = callout.length, calloutStrokeWidth = callout.strokeWidth;
        this.groupSelection.selectByTag(PieNodeTag.Callout).each(function (line, datum, index) {
            var radius = radiusScale.convert(datum.radius, clamper$1);
            var outerRadius = Math.max(0, radius);
            if (datum.label && outerRadius !== 0) {
                line.strokeWidth = calloutStrokeWidth;
                line.stroke = calloutColors[index % calloutColors.length];
                line.x1 = datum.midCos * outerRadius;
                line.y1 = datum.midSin * outerRadius;
                line.x2 = datum.midCos * (outerRadius + calloutLength);
                line.y2 = datum.midSin * (outerRadius + calloutLength);
            }
            else {
                line.stroke = undefined;
            }
        });
        {
            var _k = this.label, offset_1 = _k.offset, fontStyle_1 = _k.fontStyle, fontWeight_1 = _k.fontWeight, fontSize_1 = _k.fontSize, fontFamily_1 = _k.fontFamily, color_1 = _k.color;
            this.groupSelection.selectByTag(PieNodeTag.Label).each(function (text, datum, index) {
                var label = datum.label;
                var radius = radiusScale.convert(datum.radius, clamper$1);
                var outerRadius = Math.max(0, radius);
                if (label && outerRadius !== 0) {
                    var labelRadius = centerOffsets[index] + outerRadius + calloutLength + offset_1;
                    text.fontStyle = fontStyle_1;
                    text.fontWeight = fontWeight_1;
                    text.fontSize = fontSize_1;
                    text.fontFamily = fontFamily_1;
                    text.text = label.text;
                    text.x = datum.midCos * labelRadius;
                    text.y = datum.midSin * labelRadius;
                    text.fill = color_1;
                    text.textAlign = label.textAlign;
                    text.textBaseline = label.textBaseline;
                }
                else {
                    text.fill = undefined;
                }
            });
        }
    };
    PieSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            angleKey: this.angleKey,
            labelKey: this.labelKey,
            radiusKey: this.radiusKey,
        });
    };
    PieSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var angleKey = this.angleKey;
        if (!angleKey) {
            return '';
        }
        var _a = this, fills = _a.fills, tooltip = _a.tooltip, angleName = _a.angleName, radiusKey = _a.radiusKey, radiusName = _a.radiusName, labelKey = _a.labelKey, labelName = _a.labelName;
        var tooltipRenderer = tooltip.renderer;
        var color = fills[nodeDatum.index % fills.length];
        var datum = nodeDatum.datum;
        var label = labelKey ? datum[labelKey] + ": " : '';
        var angleValue = datum[angleKey];
        var formattedAngleValue = typeof angleValue === 'number' ? toFixed(angleValue) : angleValue.toString();
        var title = this.title ? this.title.text : undefined;
        var content = label + formattedAngleValue;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: datum,
                angleKey: angleKey,
                angleValue: angleValue,
                angleName: angleName,
                radiusKey: radiusKey,
                radiusValue: radiusKey ? datum[radiusKey] : undefined,
                radiusName: radiusName,
                labelKey: labelKey,
                labelName: labelName,
                title: title,
                color: color,
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    PieSeries.prototype.listSeriesItems = function (legendData) {
        var _this = this;
        var _a = this, labelKey = _a.labelKey, data = _a.data;
        if (data && data.length && labelKey) {
            var _b = this, fills_1 = _b.fills, strokes_1 = _b.strokes, id_1 = _b.id;
            var titleText_1 = this.title && this.title.showInLegend && this.title.text;
            data.forEach(function (datum, index) {
                var labelParts = [];
                titleText_1 && labelParts.push(titleText_1);
                labelParts.push(String(datum[labelKey]));
                legendData.push({
                    id: id_1,
                    itemId: index,
                    enabled: _this.seriesItemEnabled[index],
                    label: {
                        text: labelParts.join(' - '),
                    },
                    marker: {
                        fill: fills_1[index % fills_1.length],
                        stroke: strokes_1[index % strokes_1.length],
                        fillOpacity: _this.fillOpacity,
                        strokeOpacity: _this.strokeOpacity,
                    },
                });
            });
        }
    };
    PieSeries.prototype.toggleSeriesItem = function (itemId, enabled) {
        this.seriesItemEnabled[itemId] = enabled;
        this.nodeDataRefresh = true;
    };
    PieSeries.className = 'PieSeries';
    PieSeries.type = 'pie';
    return PieSeries;
}(PolarSeries));

function floor$2(date) {
    date.setUTCSeconds(0, 0);
}
function offset$2(date, minutes) {
    date.setTime(date.getTime() + minutes * durationMinute);
}
function count$2(start, end) {
    return (end.getTime() - start.getTime()) / durationMinute;
}
function field$2(date) {
    return date.getUTCMinutes();
}
var utcMinute = new CountableTimeInterval(floor$2, offset$2, count$2, field$2);

function floor$1(date) {
    date.setUTCMinutes(0, 0, 0);
}
function offset$1(date, hours) {
    date.setTime(date.getTime() + hours * durationHour);
}
function count$1(start, end) {
    return (end.getTime() - start.getTime()) / durationHour;
}
function field$1(date) {
    return date.getUTCHours();
}
var utcHour = new CountableTimeInterval(floor$1, offset$1, count$1, field$1);

function floor(date) {
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
}
function offset(date, months) {
    date.setUTCMonth(date.getUTCMonth() + months);
}
function count(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}
function field(date) {
    return date.getUTCMonth();
}
var utcMonth = new CountableTimeInterval(floor, offset, count, field);

var __assign$7 = (undefined && undefined.__assign) || function () {
    __assign$7 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$7.apply(this, arguments);
};
var __read$6 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var palette$8 = {
    fills: ['#f3622d', '#fba71b', '#57b757', '#41a9c9', '#4258c9', '#9a42c8', '#c84164', '#888888'],
    strokes: ['#aa4520', '#b07513', '#3d803d', '#2d768d', '#2e3e8d', '#6c2e8c', '#8c2d46', '#5f5f5f'],
};
function arrayMerge(_target, source, _options) {
    return source;
}
function isMergeableObject(value) {
    return defaultIsMergeableObject(value) && !(value instanceof TimeInterval);
}
var mergeOptions = { arrayMerge: arrayMerge, isMergeableObject: isMergeableObject };
var BOLD = 'bold';
var INSIDE = 'inside';
var RIGHT = 'right';
var ChartTheme = /** @class */ (function () {
    function ChartTheme(options) {
        options = deepMerge({}, options || {}, mergeOptions);
        var _a = options.overrides, overrides = _a === void 0 ? null : _a, _b = options.palette, palette = _b === void 0 ? null : _b;
        var defaults = this.createChartConfigPerSeries(this.getDefaults());
        if (overrides) {
            var common = overrides.common, cartesian = overrides.cartesian, polar = overrides.polar, hierarchy = overrides.hierarchy;
            var applyOverrides = function (type, seriesTypes, overrideOpts) {
                if (overrideOpts) {
                    defaults[type] = deepMerge(defaults[type], overrideOpts, mergeOptions);
                    seriesTypes.forEach(function (seriesType) {
                        defaults[seriesType] = deepMerge(defaults[seriesType], overrideOpts, mergeOptions);
                    });
                }
            };
            applyOverrides('common', Object.keys(defaults), common);
            applyOverrides('cartesian', ChartTheme.cartesianSeriesTypes, cartesian);
            applyOverrides('polar', ChartTheme.polarSeriesTypes, polar);
            applyOverrides('hierarchy', ChartTheme.hierarchySeriesTypes, hierarchy);
            var seriesOverridesMap_1 = {};
            ChartTheme.seriesTypes.forEach(function (seriesType) {
                var chartConfig = overrides[seriesType];
                if (chartConfig) {
                    if (chartConfig.series) {
                        seriesOverridesMap_1[seriesType] = chartConfig.series;
                        chartConfig.series = seriesOverridesMap_1;
                    }
                    defaults[seriesType] = deepMerge(defaults[seriesType], chartConfig, mergeOptions);
                }
            });
        }
        this.palette = (palette !== null && palette !== void 0 ? palette : this.getPalette());
        this.config = Object.freeze(defaults);
    }
    ChartTheme.prototype.getPalette = function () {
        return palette$8;
    };
    ChartTheme.getAxisDefaults = function () {
        return {
            top: {},
            right: {},
            bottom: {},
            left: {},
            thickness: 0,
            title: {
                enabled: false,
                text: 'Axis Title',
                fontStyle: undefined,
                fontWeight: BOLD,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)',
            },
            label: {
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                padding: 5,
                rotation: undefined,
                color: 'rgb(87, 87, 87)',
                formatter: undefined,
                autoRotate: false,
            },
            line: {
                width: 1,
                color: 'rgb(195, 195, 195)',
            },
            tick: {
                width: 1,
                size: 6,
                color: 'rgb(195, 195, 195)',
            },
            gridStyle: [
                {
                    stroke: 'rgb(219, 219, 219)',
                    lineDash: [4, 2],
                },
            ],
            crossLines: {
                enabled: false,
                fill: 'rgb(187,221,232)',
                stroke: 'rgb(70,162,192)',
                label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: this.fontFamily,
                    padding: 5,
                    color: 'rgb(87, 87, 87)',
                    rotation: undefined,
                },
            },
        };
    };
    ChartTheme.getSeriesDefaults = function () {
        return {
            tooltip: {
                enabled: true,
                renderer: undefined,
            },
            visible: true,
            showInLegend: true,
            cursor: 'default',
            highlightStyle: {
                item: {
                    fill: 'yellow',
                    fillOpacity: 1,
                },
                series: {
                    dimOpacity: 1,
                },
            },
        };
    };
    ChartTheme.getBarSeriesDefaults = function () {
        return __assign$7(__assign$7({}, this.getSeriesDefaults()), { flipXY: false, fillOpacity: 1, strokeOpacity: 1, xKey: '', xName: '', normalizedTo: undefined, strokeWidth: 1, lineDash: [0], lineDashOffset: 0, label: {
                enabled: false,
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)',
                formatter: undefined,
                placement: INSIDE,
            }, shadow: {
                enabled: false,
                color: 'rgba(0, 0, 0, 0.5)',
                xOffset: 3,
                yOffset: 3,
                blur: 5,
            } });
    };
    ChartTheme.getLineSeriesDefaults = function () {
        var seriesDefaults = this.getSeriesDefaults();
        return __assign$7(__assign$7({}, seriesDefaults), { tooltip: __assign$7(__assign$7({}, seriesDefaults.tooltip), { format: undefined }) });
    };
    ChartTheme.getCartesianSeriesMarkerDefaults = function () {
        return {
            enabled: true,
            shape: 'circle',
            size: 6,
            maxSize: 30,
            strokeWidth: 1,
            formatter: undefined,
        };
    };
    ChartTheme.getChartDefaults = function () {
        return {
            background: {
                visible: true,
                fill: 'white',
            },
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            },
            title: {
                enabled: false,
                text: 'Title',
                fontStyle: undefined,
                fontWeight: BOLD,
                fontSize: 16,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)',
            },
            subtitle: {
                enabled: false,
                text: 'Subtitle',
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(140, 140, 140)',
            },
            legend: {
                enabled: true,
                position: RIGHT,
                spacing: 20,
                item: {
                    paddingX: 16,
                    paddingY: 8,
                    marker: {
                        shape: undefined,
                        size: 15,
                        strokeWidth: 1,
                        padding: 8,
                    },
                    label: {
                        color: 'black',
                        fontStyle: undefined,
                        fontWeight: undefined,
                        fontSize: 12,
                        fontFamily: this.fontFamily,
                        formatter: undefined,
                    },
                },
                reverseOrder: false,
            },
            tooltip: {
                enabled: true,
                tracking: true,
                delay: 0,
                class: Chart.defaultTooltipClass,
            },
        };
    };
    ChartTheme.prototype.createChartConfigPerSeries = function (config) {
        var typeToAliases = {
            cartesian: ChartTheme.cartesianSeriesTypes,
            polar: ChartTheme.polarSeriesTypes,
            hierarchy: ChartTheme.hierarchySeriesTypes,
            groupedCategory: [],
        };
        Object.entries(typeToAliases).forEach(function (_a) {
            var _b = __read$6(_a, 2), type = _b[0], aliases = _b[1];
            aliases.forEach(function (alias) {
                if (!config[alias]) {
                    config[alias] = deepMerge({}, config[type], mergeOptions);
                }
            });
        });
        return config;
    };
    ChartTheme.prototype.getConfig = function (path, defaultValue) {
        var value = getValue(this.config, path, defaultValue);
        if (Array.isArray(value)) {
            return deepMerge([], value, mergeOptions);
        }
        if (isObject(value)) {
            return deepMerge({}, value, mergeOptions);
        }
        return value;
    };
    /**
     * Meant to be overridden in subclasses. For example:
     * ```
     *     getDefaults() {
     *         const subclassDefaults = { ... };
     *         return this.mergeWithParentDefaults(subclassDefaults);
     *     }
     * ```
     */
    ChartTheme.prototype.getDefaults = function () {
        return deepMerge({}, ChartTheme.defaults, mergeOptions);
    };
    ChartTheme.prototype.mergeWithParentDefaults = function (parentDefaults, defaults) {
        return deepMerge(parentDefaults, defaults, mergeOptions);
    };
    ChartTheme.fontFamily = 'Verdana, sans-serif';
    ChartTheme.cartesianDefaults = __assign$7(__assign$7({}, ChartTheme.getChartDefaults()), { axes: {
            number: __assign$7({}, ChartTheme.getAxisDefaults()),
            log: __assign$7(__assign$7({}, ChartTheme.getAxisDefaults()), { base: 10 }),
            category: __assign$7(__assign$7({}, ChartTheme.getAxisDefaults()), { label: __assign$7(__assign$7({}, ChartTheme.getAxisDefaults().label), { autoRotate: true }) }),
            groupedCategory: __assign$7({}, ChartTheme.getAxisDefaults()),
            time: __assign$7({}, ChartTheme.getAxisDefaults()),
        }, series: {
            column: __assign$7(__assign$7({}, ChartTheme.getBarSeriesDefaults()), { flipXY: false }),
            bar: __assign$7(__assign$7({}, ChartTheme.getBarSeriesDefaults()), { flipXY: true }),
            line: __assign$7(__assign$7({}, ChartTheme.getLineSeriesDefaults()), { title: undefined, xKey: '', xName: '', yKey: '', yName: '', strokeWidth: 2, strokeOpacity: 1, lineDash: [0], lineDashOffset: 0, marker: __assign$7(__assign$7({}, ChartTheme.getCartesianSeriesMarkerDefaults()), { fillOpacity: 1, strokeOpacity: 1 }), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined,
                } }),
            scatter: __assign$7(__assign$7({}, ChartTheme.getSeriesDefaults()), { title: undefined, xKey: '', yKey: '', sizeKey: undefined, labelKey: undefined, xName: '', yName: '', sizeName: 'Size', labelName: 'Label', strokeWidth: 2, fillOpacity: 1, strokeOpacity: 1, marker: __assign$7({}, ChartTheme.getCartesianSeriesMarkerDefaults()), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                } }),
            area: __assign$7(__assign$7({}, ChartTheme.getSeriesDefaults()), { xKey: '', xName: '', normalizedTo: undefined, fillOpacity: 0.8, strokeOpacity: 1, strokeWidth: 2, lineDash: [0], lineDashOffset: 0, shadow: {
                    enabled: false,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 3,
                    yOffset: 3,
                    blur: 5,
                }, marker: __assign$7(__assign$7({}, ChartTheme.getCartesianSeriesMarkerDefaults()), { fillOpacity: 1, strokeOpacity: 1, enabled: false }), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined,
                } }),
            histogram: __assign$7(__assign$7({}, ChartTheme.getSeriesDefaults()), { xKey: '', yKey: '', xName: '', yName: '', strokeWidth: 1, fillOpacity: 1, strokeOpacity: 1, lineDash: [0], lineDashOffset: 0, areaPlot: false, bins: undefined, aggregation: 'sum', label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined,
                }, shadow: {
                    enabled: true,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 0,
                    yOffset: 0,
                    blur: 5,
                } }),
        }, navigator: {
            enabled: false,
            height: 30,
            mask: {
                fill: '#999999',
                stroke: '#999999',
                strokeWidth: 1,
                fillOpacity: 0.2,
            },
            minHandle: {
                fill: '#f2f2f2',
                stroke: '#999999',
                strokeWidth: 1,
                width: 8,
                height: 16,
                gripLineGap: 2,
                gripLineLength: 8,
            },
            maxHandle: {
                fill: '#f2f2f2',
                stroke: '#999999',
                strokeWidth: 1,
                width: 8,
                height: 16,
                gripLineGap: 2,
                gripLineLength: 8,
            },
        } });
    ChartTheme.polarDefaults = __assign$7(__assign$7({}, ChartTheme.getChartDefaults()), { series: {
            pie: __assign$7(__assign$7({}, ChartTheme.getSeriesDefaults()), { title: {
                    enabled: true,
                    text: '',
                    fontStyle: undefined,
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                }, angleKey: '', angleName: '', radiusKey: undefined, radiusName: undefined, labelKey: undefined, labelName: undefined, label: {
                    enabled: true,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    offset: 3,
                    minAngle: 20,
                }, callout: {
                    length: 10,
                    strokeWidth: 2,
                }, fillOpacity: 1, strokeOpacity: 1, strokeWidth: 1, lineDash: [0], lineDashOffset: 0, rotation: 0, outerRadiusOffset: 0, innerRadiusOffset: 0, shadow: {
                    enabled: false,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 3,
                    yOffset: 3,
                    blur: 5,
                } }),
        } });
    ChartTheme.hierarchyDefaults = __assign$7(__assign$7({}, ChartTheme.getChartDefaults()), { series: {
            treemap: __assign$7(__assign$7({}, ChartTheme.getSeriesDefaults()), { showInLegend: false, labelKey: 'label', sizeKey: 'size', colorKey: 'color', colorDomain: [-5, 5], colorRange: ['#cb4b3f', '#6acb64'], colorParents: false, gradient: true, nodePadding: 2, title: {
                    enabled: true,
                    color: 'white',
                    fontStyle: undefined,
                    fontWeight: 'bold',
                    fontSize: 12,
                    fontFamily: 'Verdana, sans-serif',
                    padding: 15,
                }, subtitle: {
                    enabled: true,
                    color: 'white',
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 9,
                    fontFamily: 'Verdana, sans-serif',
                    padding: 13,
                }, labels: {
                    large: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 18,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                    medium: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                    small: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 10,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                    color: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: undefined,
                        fontSize: 12,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                } }),
        } });
    ChartTheme.defaults = {
        cartesian: ChartTheme.cartesianDefaults,
        groupedCategory: ChartTheme.cartesianDefaults,
        polar: ChartTheme.polarDefaults,
        hierarchy: ChartTheme.hierarchyDefaults,
    };
    ChartTheme.cartesianSeriesTypes = [
        'line',
        'area',
        'bar',
        'column',
        'scatter',
        'histogram',
    ];
    ChartTheme.polarSeriesTypes = ['pie'];
    ChartTheme.hierarchySeriesTypes = ['treemap'];
    ChartTheme.seriesTypes = ChartTheme.cartesianSeriesTypes
        .concat(ChartTheme.polarSeriesTypes)
        .concat(ChartTheme.hierarchySeriesTypes);
    return ChartTheme;
}());

var __extends$a = (undefined && undefined.__extends) || (function () {
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
var __assign$6 = (undefined && undefined.__assign) || function () {
    __assign$6 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$6.apply(this, arguments);
};
var DarkTheme = /** @class */ (function (_super) {
    __extends$a(DarkTheme, _super);
    function DarkTheme(options) {
        return _super.call(this, options) || this;
    }
    DarkTheme.prototype.getDefaults = function () {
        var fontColor = 'rgb(200, 200, 200)';
        var mutedFontColor = 'rgb(150, 150, 150)';
        var axisDefaults = {
            title: {
                color: fontColor,
            },
            label: {
                color: fontColor,
            },
            gridStyle: [
                {
                    stroke: 'rgb(88, 88, 88)',
                    lineDash: [4, 2],
                },
            ],
        };
        var seriesLabelDefaults = {
            label: {
                color: fontColor,
            },
        };
        var chartAxesDefaults = {
            axes: {
                number: __assign$6({}, axisDefaults),
                category: __assign$6({}, axisDefaults),
                time: __assign$6({}, axisDefaults),
            },
        };
        var chartDefaults = {
            background: {
                fill: 'rgb(34, 38, 41)',
            },
            title: {
                color: fontColor,
            },
            subtitle: {
                color: mutedFontColor,
            },
            legend: {
                item: {
                    label: {
                        color: fontColor,
                    },
                },
            },
        };
        return this.mergeWithParentDefaults(_super.prototype.getDefaults.call(this), {
            cartesian: __assign$6(__assign$6(__assign$6({}, chartDefaults), chartAxesDefaults), { series: {
                    bar: __assign$6({}, seriesLabelDefaults),
                    column: __assign$6({}, seriesLabelDefaults),
                    histogram: __assign$6({}, seriesLabelDefaults),
                } }),
            groupedCategory: __assign$6(__assign$6(__assign$6({}, chartDefaults), chartAxesDefaults), { series: {
                    bar: __assign$6({}, seriesLabelDefaults),
                    column: __assign$6({}, seriesLabelDefaults),
                    histogram: __assign$6({}, seriesLabelDefaults),
                } }),
            polar: __assign$6(__assign$6({}, chartDefaults), { series: {
                    pie: __assign$6(__assign$6({}, seriesLabelDefaults), { title: {
                            color: fontColor,
                        } }),
                } }),
            hierarchy: __assign$6(__assign$6({}, chartDefaults), { series: {
                    treemap: {
                        title: {
                            color: fontColor,
                        },
                        subtitle: {
                            color: mutedFontColor,
                        },
                        labels: {
                            large: {
                                color: fontColor,
                            },
                            medium: {
                                color: fontColor,
                            },
                            small: {
                                color: fontColor,
                            },
                            color: {
                                color: fontColor,
                            },
                        },
                    },
                } }),
        });
    };
    return DarkTheme;
}(ChartTheme));

var __extends$9 = (undefined && undefined.__extends) || (function () {
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
var palette$7 = {
    fills: [
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722',
    ],
    strokes: [
        '#ab2f26',
        '#a31545',
        '#6d1b7b',
        '#482980',
        '#2c397f',
        '#1769aa',
        '#0276ab',
        '#008494',
        '#00695f',
        '#357a38',
        '#618834',
        '#909a28',
        '#b3a429',
        '#b38705',
        '#b36a00',
        '#b33d18',
    ],
};
var MaterialLight = /** @class */ (function (_super) {
    __extends$9(MaterialLight, _super);
    function MaterialLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterialLight.prototype.getPalette = function () {
        return palette$7;
    };
    return MaterialLight;
}(ChartTheme));

var __extends$8 = (undefined && undefined.__extends) || (function () {
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
var palette$6 = {
    fills: [
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722',
    ],
    strokes: [
        '#ab2f26',
        '#a31545',
        '#6d1b7b',
        '#482980',
        '#2c397f',
        '#1769aa',
        '#0276ab',
        '#008494',
        '#00695f',
        '#357a38',
        '#618834',
        '#909a28',
        '#b3a429',
        '#b38705',
        '#b36a00',
        '#b33d18',
    ],
};
var MaterialDark = /** @class */ (function (_super) {
    __extends$8(MaterialDark, _super);
    function MaterialDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterialDark.prototype.getPalette = function () {
        return palette$6;
    };
    return MaterialDark;
}(DarkTheme));

var __extends$7 = (undefined && undefined.__extends) || (function () {
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
var palette$5 = {
    fills: ['#c16068', '#a2bf8a', '#ebcc87', '#80a0c3', '#b58dae', '#85c0d1'],
    strokes: ['#874349', '#718661', '#a48f5f', '#5a7088', '#7f637a', '#5d8692'],
};
var PastelLight = /** @class */ (function (_super) {
    __extends$7(PastelLight, _super);
    function PastelLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PastelLight.prototype.getPalette = function () {
        return palette$5;
    };
    return PastelLight;
}(ChartTheme));

var __extends$6 = (undefined && undefined.__extends) || (function () {
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
var palette$4 = {
    fills: ['#c16068', '#a2bf8a', '#ebcc87', '#80a0c3', '#b58dae', '#85c0d1'],
    strokes: ['#874349', '#718661', '#a48f5f', '#5a7088', '#7f637a', '#5d8692'],
};
var PastelDark = /** @class */ (function (_super) {
    __extends$6(PastelDark, _super);
    function PastelDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PastelDark.prototype.getPalette = function () {
        return palette$4;
    };
    return PastelDark;
}(DarkTheme));

var __extends$5 = (undefined && undefined.__extends) || (function () {
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
var palette$3 = {
    fills: [
        '#febe76',
        '#ff7979',
        '#badc58',
        '#f9ca23',
        '#f0932b',
        '#eb4c4b',
        '#6ab04c',
        '#7ed6df',
        '#e056fd',
        '#686de0',
    ],
    strokes: [
        '#b28553',
        '#b35555',
        '#829a3e',
        '#ae8d19',
        '#a8671e',
        '#a43535',
        '#4a7b35',
        '#58969c',
        '#9d3cb1',
        '#494c9d',
    ],
};
var SolarLight = /** @class */ (function (_super) {
    __extends$5(SolarLight, _super);
    function SolarLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SolarLight.prototype.getPalette = function () {
        return palette$3;
    };
    return SolarLight;
}(ChartTheme));

var __extends$4 = (undefined && undefined.__extends) || (function () {
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
var palette$2 = {
    fills: [
        '#febe76',
        '#ff7979',
        '#badc58',
        '#f9ca23',
        '#f0932b',
        '#eb4c4b',
        '#6ab04c',
        '#7ed6df',
        '#e056fd',
        '#686de0',
    ],
    strokes: [
        '#b28553',
        '#b35555',
        '#829a3e',
        '#ae8d19',
        '#a8671e',
        '#a43535',
        '#4a7b35',
        '#58969c',
        '#9d3cb1',
        '#494c9d',
    ],
};
var SolarDark = /** @class */ (function (_super) {
    __extends$4(SolarDark, _super);
    function SolarDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SolarDark.prototype.getPalette = function () {
        return palette$2;
    };
    return SolarDark;
}(DarkTheme));

var __extends$3 = (undefined && undefined.__extends) || (function () {
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
var palette$1 = {
    fills: ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921', '#fa3081'],
    strokes: ['#4086a4', '#b1a235', '#6c8a2b', '#a03e24', '#af5517', '#af225a'],
};
var VividLight = /** @class */ (function (_super) {
    __extends$3(VividLight, _super);
    function VividLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VividLight.prototype.getPalette = function () {
        return palette$1;
    };
    return VividLight;
}(ChartTheme));

var __extends$2 = (undefined && undefined.__extends) || (function () {
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
var palette = {
    fills: ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921', '#fa3081'],
    strokes: ['#4086a4', '#b1a235', '#6c8a2b', '#a03e24', '#af5517', '#af225a'],
};
var VividDark = /** @class */ (function (_super) {
    __extends$2(VividDark, _super);
    function VividDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VividDark.prototype.getPalette = function () {
        return palette;
    };
    return VividDark;
}(DarkTheme));

var __assign$5 = (undefined && undefined.__assign) || function () {
    __assign$5 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$5.apply(this, arguments);
};
var lightTheme = new ChartTheme();
var darkTheme = new DarkTheme();
var lightThemes = {
    undefined: lightTheme,
    null: lightTheme,
    'ag-default': lightTheme,
    'ag-material': new MaterialLight(),
    'ag-pastel': new PastelLight(),
    'ag-solar': new SolarLight(),
    'ag-vivid': new VividLight(),
};
var darkThemes = {
    undefined: darkTheme,
    null: darkTheme,
    'ag-default-dark': darkTheme,
    'ag-material-dark': new MaterialDark(),
    'ag-pastel-dark': new PastelDark(),
    'ag-solar-dark': new SolarDark(),
    'ag-vivid-dark': new VividDark(),
};
var themes = __assign$5(__assign$5({}, darkThemes), lightThemes);
function getChartTheme(value) {
    if (value instanceof ChartTheme) {
        return value;
    }
    var stockTheme = themes[value];
    if (stockTheme) {
        return stockTheme;
    }
    value = value;
    if (value.baseTheme || value.overrides || value.palette) {
        var baseTheme = getChartTheme(value.baseTheme);
        return new baseTheme.constructor(value);
    }
    return lightTheme;
}
function getIntegratedChartTheme(value) {
    var theme = getChartTheme(value);
    var themeConfig = theme.config;
    for (var chartType in themeConfig) {
        var axes = themeConfig[chartType].axes;
        for (var axis in axes) {
            delete axes[axis].crossLines;
        }
    }
    return theme;
}

var __extends$1 = (undefined && undefined.__extends) || (function () {
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
var __read$5 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var identity = function (x) { return x; };
var LogScale = /** @class */ (function (_super) {
    __extends$1(LogScale, _super);
    function LogScale() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'log';
        _this._domain = [1, 10];
        _this.baseLog = identity; // takes a log with base `base` of `x`
        _this.basePow = identity; // raises `base` to the power of `x`
        _this._base = 10;
        return _this;
    }
    LogScale.prototype.setDomain = function (values) {
        var df = values[0];
        var dl = values[values.length - 1];
        if (df === 0 || dl === 0 || (df < 0 && dl > 0) || (df > 0 && dl < 0)) {
            console.warn('Log scale domain should not start at, end at or cross zero.');
            if (df === 0 && dl > 0) {
                df = Number.EPSILON;
            }
            else if (dl === 0 && df < 0) {
                dl = -Number.EPSILON;
            }
            else if (df < 0 && dl > 0) {
                if (Math.abs(dl) >= Math.abs(df)) {
                    df = Number.EPSILON;
                }
                else {
                    dl = -Number.EPSILON;
                }
            }
            else if (df > 0 && dl < 0) {
                if (Math.abs(dl) >= Math.abs(df)) {
                    df = -Number.EPSILON;
                }
                else {
                    dl = Number.EPSILON;
                }
            }
            values = values.slice();
            values[0] = df;
            values[values.length - 1] = dl;
        }
        _super.prototype.setDomain.call(this, values);
    };
    LogScale.prototype.getDomain = function () {
        return _super.prototype.getDomain.call(this);
    };
    Object.defineProperty(LogScale.prototype, "base", {
        get: function () {
            return this._base;
        },
        set: function (value) {
            if (this._base !== value) {
                this._base = value;
                this.rescale();
            }
        },
        enumerable: true,
        configurable: true
    });
    LogScale.prototype.rescale = function () {
        var base = this.base;
        var baseLog = LogScale.makeLogFn(base);
        var basePow = LogScale.makePowFn(base);
        if (this.domain[0] < 0) {
            baseLog = this.reflect(baseLog);
            basePow = this.reflect(basePow);
            this.transform = function (x) { return -Math.log(-x); };
            this.untransform = function (x) { return -Math.exp(-x); };
        }
        else {
            this.transform = function (x) { return Math.log(x); };
            this.untransform = function (x) { return Math.exp(x); };
        }
        this.baseLog = baseLog;
        this.basePow = basePow;
        _super.prototype.rescale.call(this);
    };
    /**
     * For example, if `f` is `Math.log10`, we have
     *
     *     f(100) == 2
     *     f(-100) == NaN
     *     rf = reflect(f)
     *     rf(-100) == -2
     *
     * @param f
     */
    LogScale.prototype.reflect = function (f) {
        return function (x) { return -f(-x); };
    };
    LogScale.prototype.nice = function () {
        var _a, _b;
        var domain = this.domain;
        var i0 = 0;
        var i1 = domain.length - 1;
        var x0 = domain[i0];
        var x1 = domain[i1];
        if (x1 < x0) {
            _a = __read$5([i1, i0], 2), i0 = _a[0], i1 = _a[1];
            _b = __read$5([x1, x0], 2), x0 = _b[0], x1 = _b[1];
        }
        // For example, for base == 10:
        // [ 50, 900] becomes [ 10, 1000 ]
        domain[i0] = this.basePow(Math.floor(this.baseLog(x0)));
        domain[i1] = this.basePow(Math.ceil(this.baseLog(x1)));
        this.domain = domain;
    };
    LogScale.pow10 = function (x) {
        return isFinite(x)
            ? +('1e' + x) // to avoid precision issues, e.g. Math.pow(10, -4) is not 0.0001
            : x < 0
                ? 0
                : x;
    };
    LogScale.makePowFn = function (base) {
        if (base === 10) {
            return LogScale.pow10;
        }
        if (base === Math.E) {
            return Math.exp;
        }
        return function (x) { return Math.pow(base, x); };
    };
    // Make a log function witn an arbitrary base or return a native function if exists.
    LogScale.makeLogFn = function (base) {
        if (base === Math.E) {
            return Math.log;
        }
        if (base === 10) {
            return Math.log10;
        }
        if (base === 2) {
            return Math.log2;
        }
        var logBase = Math.log(base);
        return function (x) { return Math.log(x) / logBase; };
    };
    LogScale.prototype.ticks = function (count) {
        var _a;
        if (count === void 0) { count = 10; }
        var n = count == null ? 10 : +count;
        var base = this.base;
        var domain = this.domain;
        var d0 = domain[0];
        var d1 = domain[domain.length - 1];
        var isReversed = d1 < d0;
        if (isReversed) {
            _a = __read$5([d1, d0], 2), d0 = _a[0], d1 = _a[1];
        }
        var p0 = this.baseLog(d0);
        var p1 = this.baseLog(d1);
        var z = [];
        // if `base` is an integer and delta in order of magnitudes is less than n
        if (!(base % 1) && p1 - p0 < n) {
            // For example, if n == 10, base == 10 and domain == [10^2, 10^6]
            // then p1 - p0 < n == true.
            p0 = Math.round(p0) - 1;
            p1 = Math.round(p1) + 1;
            if (d0 > 0) {
                for (; p0 < p1; ++p0) {
                    for (var k = 1, p = this.basePow(p0); k < base; ++k) {
                        var t = p * k;
                        // The `t` checks are needed because we expanded the [p0, p1] by 1 in each direction.
                        if (t < d0)
                            continue;
                        if (t > d1)
                            break;
                        z.push(t);
                    }
                }
            }
            else {
                for (; p0 < p1; ++p0) {
                    for (var k = base - 1, p = this.basePow(p0); k >= 1; --k) {
                        var t = p * k;
                        if (t < d0)
                            continue;
                        if (t > d1)
                            break;
                        z.push(t);
                    }
                }
            }
            if (z.length * 2 < n) {
                z = ticks(d0, d1, n);
            }
        }
        else {
            // For example, if n == 4, base == 10 and domain == [10^2, 10^6]
            // then p1 - p0 < n == false.
            // `ticks` return [2, 3, 4, 5, 6], then mapped to [10^2, 10^3, 10^4, 10^5, 10^6].
            z = ticks(p0, p1, Math.min(p1 - p0, n)).map(this.basePow);
        }
        return isReversed ? z.reverse() : z;
    };
    LogScale.prototype.tickFormat = function (_a) {
        var _this = this;
        var count = _a.count, specifier = _a.specifier;
        var base = this.base;
        if (specifier == null) {
            specifier = (base === 10 ? '.0e' : ',');
        }
        if (typeof specifier !== 'function') {
            specifier = format(specifier);
        }
        if (count === Infinity) {
            return specifier;
        }
        if (count == null) {
            count = 10;
        }
        var k = Math.max(1, (base * count) / this.ticks().length);
        return function (d) {
            var i = d / _this.basePow(Math.round(_this.baseLog(d)));
            if (i * base < base - 0.5) {
                i *= base;
            }
            return i <= k ? specifier(d) : '';
        };
    };
    return LogScale;
}(ContinuousScale));

var __extends = (undefined && undefined.__extends) || (function () {
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
var LogAxis = /** @class */ (function (_super) {
    __extends(LogAxis, _super);
    function LogAxis() {
        var _this = _super.call(this) || this;
        _this.scale = new LogScale();
        _this.scale.clamper = clamper;
        return _this;
    }
    Object.defineProperty(LogAxis.prototype, "base", {
        get: function () {
            return this.scale.base;
        },
        set: function (value) {
            this.scale.base = value;
        },
        enumerable: true,
        configurable: true
    });
    LogAxis.className = 'LogAxis';
    LogAxis.type = 'log';
    return LogAxis;
}(NumberAxis));

var __assign$4 = (undefined && undefined.__assign) || function () {
    __assign$4 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$4.apply(this, arguments);
};
var __read$4 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$3 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$4(arguments[i]));
    return ar;
};
var __values$3 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/**
 * Performs a JSON-diff between a source and target JSON structure.
 *
 * On a per property basis, takes the target property value where:
 * - types are different.
 * - type is primitive.
 * - type is array and length or content have changed.
 *
 * Recurses for object types.
 *
 * @param source starting point for diff
 * @param target target for diff vs. source
 * @param opts.stringify properties to stringify for comparison purposes
 *
 * @returns `null` if no differences, or an object with the subset of properties that have changed.
 */
function jsonDiff(source, target, opts) {
    var e_1, _a;
    var _b = (opts || {}).stringify, stringify = _b === void 0 ? [] : _b;
    var sourceType = classify(source);
    var targetType = classify(target);
    if (targetType === 'array') {
        if (sourceType !== 'array' || source.length !== target.length) {
            return __spread$3(target);
        }
        if (target.some(function (targetElement, i) { var _a; return jsonDiff((_a = source) === null || _a === void 0 ? void 0 : _a[i], targetElement) != null; })) {
            return __spread$3(target);
        }
        return null;
    }
    if (targetType === 'primitive') {
        if (sourceType !== 'primitive') {
            return __assign$4({}, target);
        }
        if (source !== target) {
            return target;
        }
        return null;
    }
    var lhs = source || {};
    var rhs = target || {};
    var allProps = new Set(__spread$3(Object.keys(lhs), Object.keys(rhs)));
    var propsChangedCount = 0;
    var result = {};
    var _loop_1 = function (prop) {
        // Cheap-and-easy equality check.
        if (lhs[prop] === rhs[prop]) {
            return "continue";
        }
        var take = function (v) {
            result[prop] = v;
            propsChangedCount++;
        };
        if (stringify.includes(prop)) {
            if (JSON.stringify(lhs[prop] !== JSON.stringify(rhs[prop]))) {
                take(rhs[prop]);
            }
            return "continue";
        }
        var lhsType = classify(lhs[prop]);
        var rhsType = classify(rhs[prop]);
        if (lhsType !== rhsType) {
            // Types changed, just take RHS.
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'primitive' || rhsType === null) {
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'array' && lhs[prop].length !== rhs[prop].length) {
            // Arrays are different sizes, so just take target array.
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'class-instance') {
            // Don't try to do anything tricky with array diffs!
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'function' && lhs[prop] !== rhs[prop]) {
            take(rhs[prop]);
            return "continue";
        }
        var diff = jsonDiff(lhs[prop], rhs[prop], { stringify: stringify });
        if (diff !== null) {
            take(diff);
        }
    };
    try {
        for (var allProps_1 = __values$3(allProps), allProps_1_1 = allProps_1.next(); !allProps_1_1.done; allProps_1_1 = allProps_1.next()) {
            var prop = allProps_1_1.value;
            _loop_1(prop);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (allProps_1_1 && !allProps_1_1.done && (_a = allProps_1.return)) _a.call(allProps_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return propsChangedCount === 0 ? null : result;
}
/**
 * Special value used by `jsonMerge` to signal that a property should be removed from the merged
 * output.
 */
var DELETE = Symbol('<delete-property>');
var NOT_SPECIFIED = Symbol('<unspecified-property>');
/**
 * Merge together the provide JSON object structures, with the precedence of application running
 * from higher indexes to lower indexes.
 *
 * Deep-clones all objects to avoid mutation of the inputs changing the output object. For arrays,
 * just performs a deep-clone of the entire array, no merging of elements attempted.
 *
 * @param json all json objects to merge
 *
 * @returns the combination of all of the json inputs
 */
function jsonMerge() {
    var e_2, _a;
    var json = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        json[_i] = arguments[_i];
    }
    var jsonTypes = json.map(function (v) { return classify(v); });
    if (jsonTypes.some(function (v) { return v === 'array'; })) {
        // Clone final array.
        var finalValue = json[json.length - 1];
        if (finalValue instanceof Array) {
            return finalValue.map(function (v) {
                var type = classify(v);
                return type === 'array' ? jsonMerge([], v) : type === 'object' ? jsonMerge({}, v) : v;
            });
        }
        return finalValue;
    }
    var result = {};
    var props = new Set(json.map(function (v) { return (v != null ? Object.keys(v) : []); }).reduce(function (r, n) { return r.concat(n); }, []));
    var _loop_2 = function (nextProp) {
        var values = json
            .map(function (j) { return (j != null && nextProp in j ? j[nextProp] : NOT_SPECIFIED); })
            .filter(function (v) { return v !== NOT_SPECIFIED; });
        if (values.length === 0) {
            return "continue";
        }
        var lastValue = values[values.length - 1];
        if (lastValue === DELETE) {
            return "continue";
        }
        var types = values.map(function (v) { return classify(v); });
        var type = types[0];
        if (types.some(function (t) { return t !== type && t !== null; })) {
            // Short-circuit if mismatching types.
            result[nextProp] = lastValue;
            return "continue";
        }
        if (type === 'array' || type === 'object') {
            result[nextProp] = jsonMerge.apply(void 0, __spread$3(values));
        }
        else {
            // Just directly assign/overwrite.
            result[nextProp] = lastValue;
        }
    };
    try {
        for (var props_1 = __values$3(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
            var nextProp = props_1_1.value;
            _loop_2(nextProp);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
/**
 * Recursively apply a JSON object into a class-hierarchy, optionally instantiating certain classes
 * by property name.
 *
 * @param target to apply source JSON properties into
 * @param source to be applied
 * @param params.path path for logging/error purposes, to aid with pinpointing problems
 * @param params.matcherPath path for pattern matching, to lookup allowedTypes override.
 * @param params.skip property names to skip from the source
 * @param params.constructors dictionary of property name to class constructors for properties that
 *                            require object construction
 * @param params.allowedTypes overrides by path for allowed property types
 */
function jsonApply(target, source, params) {
    if (params === void 0) { params = {}; }
    var _a, _b, _c, _d;
    var _e = params.path, path = _e === void 0 ? undefined : _e, _f = params.matcherPath, matcherPath = _f === void 0 ? path ? path.replace(/(\[[0-9+]{1,}\])/i, '[]') : undefined : _f, _g = params.skip, skip = _g === void 0 ? [] : _g, _h = params.constructors, constructors = _h === void 0 ? {} : _h, _j = params.allowedTypes, allowedTypes = _j === void 0 ? {} : _j;
    if (target == null) {
        throw new Error("AG Charts - target is uninitialised: " + (path || '<root>'));
    }
    if (source == null) {
        return target;
    }
    var targetType = classify(target);
    var _loop_3 = function (property) {
        var propertyMatcherPath = "" + (matcherPath ? matcherPath + '.' : '') + property;
        if (skip.indexOf(propertyMatcherPath) >= 0) {
            return "continue";
        }
        var newValue = source[property];
        var propertyPath = "" + (path ? path + '.' : '') + property;
        var targetAny = target;
        var targetClass = targetAny.constructor;
        var currentValue = targetAny[property];
        var ctr = (_a = constructors[property], (_a !== null && _a !== void 0 ? _a : constructors[propertyMatcherPath]));
        try {
            var currentValueType = classify(currentValue);
            var newValueType = classify(newValue);
            if (targetType === 'class-instance' && !(property in target || targetAny.hasOwnProperty(property))) {
                console.warn("AG Charts - unable to set [" + propertyPath + "] in " + ((_b = targetClass) === null || _b === void 0 ? void 0 : _b.name) + " - property is unknown");
                return "continue";
            }
            var allowableTypes = allowedTypes[propertyMatcherPath] || [currentValueType];
            if (currentValueType === 'class-instance' && newValueType === 'object') {
                // Allowed, this is the common case! - do not error.
            }
            else if (currentValueType != null && newValueType != null && !allowableTypes.includes(newValueType)) {
                console.warn("AG Charts - unable to set [" + propertyPath + "] in " + ((_c = targetClass) === null || _c === void 0 ? void 0 : _c.name) + " - can't apply type of [" + newValueType + "], allowed types are: [" + allowableTypes + "]");
                return "continue";
            }
            if (newValueType === 'array') {
                ctr = (ctr !== null && ctr !== void 0 ? ctr : constructors[propertyMatcherPath + "[]"]);
                if (ctr != null) {
                    var newValueArray = newValue;
                    targetAny[property] = newValueArray.map(function (v) {
                        return jsonApply(new ctr(), v, __assign$4(__assign$4({}, params), { path: propertyPath, matcherPath: propertyMatcherPath + '[]' }));
                    });
                }
                else {
                    targetAny[property] = newValue;
                }
            }
            else if (newValueType === 'class-instance') {
                targetAny[property] = newValue;
            }
            else if (newValueType === 'object') {
                if (currentValue != null) {
                    jsonApply(currentValue, newValue, __assign$4(__assign$4({}, params), { path: propertyPath, matcherPath: propertyMatcherPath }));
                }
                else if (ctr != null) {
                    targetAny[property] = jsonApply(new ctr(), newValue, __assign$4(__assign$4({}, params), { path: propertyPath, matcherPath: propertyMatcherPath }));
                }
                else {
                    targetAny[property] = newValue;
                }
            }
            else {
                targetAny[property] = newValue;
            }
        }
        catch (error) {
            console.warn("AG Charts - unable to set [" + propertyPath + "] in [" + ((_d = targetClass) === null || _d === void 0 ? void 0 : _d.name) + "]; nested error is: " + error.message);
            return "continue";
        }
    };
    for (var property in source) {
        _loop_3(property);
    }
    return target;
}
/**
 * Walk the given JSON object graphs, invoking the visit() callback for every object encountered.
 * Arrays are descended into without a callback, however their elements will have the visit()
 * callback invoked if they are objects.
 *
 * @param json to traverse
 * @param visit callback for each non-primitive and non-array object found
 * @param opts.skip property names to skip when walking
 * @param jsons to traverse in parallel
 */
function jsonWalk(json, visit, opts) {
    var jsons = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        jsons[_i - 3] = arguments[_i];
    }
    var _a;
    var jsonType = classify(json);
    var skip = opts.skip || [];
    if (jsonType === 'array') {
        json.forEach(function (element, index) {
            var _a;
            jsonWalk.apply(void 0, __spread$3([element, visit, opts], (_a = jsons) === null || _a === void 0 ? void 0 : _a.map(function (o) { var _a; return (_a = o) === null || _a === void 0 ? void 0 : _a[index]; })));
        });
        return;
    }
    else if (jsonType !== 'object') {
        return;
    }
    visit.apply(void 0, __spread$3([jsonType, json], jsons));
    var _loop_4 = function (property) {
        if (skip.indexOf(property) >= 0) {
            return "continue";
        }
        var value = json[property];
        var otherValues = (_a = jsons) === null || _a === void 0 ? void 0 : _a.map(function (o) { var _a; return (_a = o) === null || _a === void 0 ? void 0 : _a[property]; });
        var valueType = classify(value);
        if (valueType === 'object' || valueType === 'array') {
            jsonWalk.apply(void 0, __spread$3([value, visit, opts], otherValues));
        }
    };
    for (var property in json) {
        _loop_4(property);
    }
}
/**
 * Classify the type of a value to assist with handling for merge purposes.
 */
function classify(value) {
    if (value == null) {
        return null;
    }
    else if (value instanceof HTMLElement) {
        return 'primitive';
    }
    else if (value instanceof Array) {
        return 'array';
    }
    else if (value instanceof Date) {
        return 'primitive';
    }
    else if (typeof value === 'object' && value.constructor === Object) {
        return 'object';
    }
    else if (typeof value === 'function') {
        return 'function';
    }
    else if (typeof value === 'object' && value.constructor != null) {
        return 'class-instance';
    }
    return 'primitive';
}

var DEFAULT_CARTESIAN_CHART_OVERRIDES = {
    type: 'cartesian',
    axes: [
        {
            type: NumberAxis.type,
            position: ChartAxisPosition.Left,
        },
        {
            type: CategoryAxis.type,
            position: ChartAxisPosition.Bottom,
        },
    ],
};
var DEFAULT_BAR_CHART_OVERRIDES = {
    axes: [
        {
            type: 'number',
            position: ChartAxisPosition.Bottom,
        },
        {
            type: 'category',
            position: ChartAxisPosition.Left,
        },
    ],
};
var DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES = {
    axes: [
        {
            type: 'number',
            position: ChartAxisPosition.Bottom,
        },
        {
            type: 'number',
            position: ChartAxisPosition.Left,
        },
    ],
};

var __assign$3 = (undefined && undefined.__assign) || function () {
    __assign$3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$3.apply(this, arguments);
};
function transform(input, transforms) {
    var result = {};
    for (var p in input) {
        var t = transforms[p] || (function (x) { return x; });
        result[p] = t(input[p], input);
    }
    return result;
}
function is2dArray(input) {
    return input != null && input instanceof Array && input[0] instanceof Array;
}
function yNamesMapping(p, src) {
    if (p == null) {
        return {};
    }
    if (!(p instanceof Array)) {
        return p;
    }
    var yKeys = src.yKeys;
    if (yKeys == null || is2dArray(yKeys)) {
        throw new Error('AG Charts - yNames and yKeys mismatching configuration.');
    }
    var result = {};
    yKeys.forEach(function (k, i) {
        result[k] = p[i];
    });
    return result;
}
function yKeysMapping(p, src) {
    if (p == null) {
        return [[]];
    }
    if (is2dArray(p)) {
        return p;
    }
    return src.grouped ? p.map(function (v) { return [v]; }) : [p];
}
function labelMapping(p) {
    if (p == null) {
        return undefined;
    }
    var placement = p.placement;
    return __assign$3(__assign$3({}, p), { placement: placement === 'inside'
            ? BarLabelPlacement.Inside
            : placement === 'outside'
                ? BarLabelPlacement.Outside
                : undefined });
}
function barSeriesTransform(options) {
    var result = __assign$3(__assign$3({}, options), { yKeys: options.yKeys || [options.yKey] });
    delete result['yKey'];
    return transform(result, {
        yNames: yNamesMapping,
        yKeys: yKeysMapping,
        label: labelMapping,
    });
}
function identityTransform(input) {
    return input;
}
var SERIES_TRANSFORMS = {
    area: identityTransform,
    bar: barSeriesTransform,
    column: barSeriesTransform,
    histogram: identityTransform,
    line: identityTransform,
    pie: identityTransform,
    scatter: identityTransform,
    treemap: identityTransform,
};
function applySeriesTransform(options) {
    var type = options.type;
    var transform = SERIES_TRANSFORMS[type || 'line'];
    return transform(options);
}

var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
var __values$2 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$3 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$2 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$3(arguments[i]));
    return ar;
};
/**
 * Groups the series options objects if they are of type `column` or `bar` and places them in an array at the index where the first instance of this series type was found.
 * Returns an array of arrays containing the ordered and grouped series options objects.
 */
function groupSeriesByType(seriesOptions) {
    var e_1, _a;
    var indexMap = {};
    var result = [];
    try {
        for (var seriesOptions_1 = __values$2(seriesOptions), seriesOptions_1_1 = seriesOptions_1.next(); !seriesOptions_1_1.done; seriesOptions_1_1 = seriesOptions_1.next()) {
            var s = seriesOptions_1_1.value;
            if (s.type !== 'column' && s.type !== 'bar' && (s.type !== 'area' || s.stacked !== true)) {
                // No need to use index for these cases.
                result.push([s]);
                continue;
            }
            var seriesType = s.type || 'line';
            var groupingKey = s.stacked
                ? 'stacked'
                : s.grouped
                    ? 'grouped'
                    : s.yKeys
                        ? 'stacked'
                        : 'grouped';
            var indexKey = seriesType + "-" + s.xKey + "-" + groupingKey;
            if (indexMap[indexKey] == null) {
                // Add indexed array to result on first addition.
                indexMap[indexKey] = [];
                result.push(indexMap[indexKey]);
            }
            indexMap[indexKey].push(s);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (seriesOptions_1_1 && !seriesOptions_1_1.done && (_a = seriesOptions_1.return)) _a.call(seriesOptions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
var FAIL = Symbol();
var SKIP = Symbol();
var ARRAY_REDUCER = function (prop) { return function (result, next) {
    var _a;
    return result.concat.apply(result, __spread$2((_a = next[prop], (_a !== null && _a !== void 0 ? _a : []))));
}; };
var BOOLEAN_OR_REDUCER = function (prop, defaultValue) { return function (result, next) {
    if (typeof next[prop] === 'boolean') {
        return ((result !== null && result !== void 0 ? result : false)) || next[prop];
    }
    return (result !== null && result !== void 0 ? result : defaultValue);
}; };
var DEFAULTING_ARRAY_REDUCER = function (prop, defaultValue) { return function (result, next, idx, length) {
    var _a;
    var sparse = defaultValue === SKIP || defaultValue === FAIL;
    var nextValue = (_a = next[prop], (_a !== null && _a !== void 0 ? _a : defaultValue));
    if (nextValue === FAIL) {
        throw new Error("AG Charts - missing value for property [" + prop + "] on series config.");
    }
    else if (nextValue === SKIP) {
        return result;
    }
    if (result.length === 0 && !sparse) {
        // Pre-populate values on first invocation as we will only be invoked for series with a
        // value specified.
        while (result.length < length) {
            result = result.concat(defaultValue);
        }
    }
    if (!sparse) {
        result[idx] = nextValue;
        return result;
    }
    return result.concat(nextValue);
}; };
var YKEYS_REDUCER = function (prop, activationValue) { return function (result, next) {
    if (next[prop] === activationValue) {
        return result.concat.apply(result, __spread$2((next.yKey ? [next.yKey] : next.yKeys)));
    }
    return result;
}; };
var REDUCE_CONFIG = {
    yKeys: { outputProp: 'yKeys', reducer: ARRAY_REDUCER('yKeys'), start: [] },
    fills: { outputProp: 'fills', reducer: ARRAY_REDUCER('fills'), start: [] },
    strokes: { outputProp: 'strokes', reducer: ARRAY_REDUCER('strokes'), start: [] },
    yNames: { outputProp: 'yNames', reducer: ARRAY_REDUCER('yNames'), start: [] },
    hideInChart: { outputProp: 'hideInChart', reducer: ARRAY_REDUCER('hideInChart'), start: [] },
    hideInLegend: { outputProp: 'hideInLegend', reducer: ARRAY_REDUCER('hideInLegend'), start: [] },
    yKey: { outputProp: 'yKeys', reducer: DEFAULTING_ARRAY_REDUCER('yKey', SKIP), start: [] },
    fill: { outputProp: 'fills', reducer: DEFAULTING_ARRAY_REDUCER('fill', SKIP), start: [] },
    stroke: { outputProp: 'strokes', reducer: DEFAULTING_ARRAY_REDUCER('stroke', SKIP), start: [] },
    yName: { outputProp: 'yNames', reducer: DEFAULTING_ARRAY_REDUCER('yName', SKIP), start: [] },
    visible: { outputProp: 'visibles', reducer: DEFAULTING_ARRAY_REDUCER('visible', true), start: [] },
    grouped: {
        outputProp: 'grouped',
        reducer: BOOLEAN_OR_REDUCER('grouped'),
        seriesType: ['bar', 'column'],
        start: undefined,
    },
    showInLegend: {
        outputProp: 'hideInLegend',
        reducer: YKEYS_REDUCER('showInLegend', false),
        seriesType: ['bar', 'column'],
        start: [],
    },
};
/**
 * Takes an array of bar or area series options objects and returns a single object with the combined area series options.
 */
function reduceSeries(series) {
    var options = {};
    series.forEach(function (s, idx) {
        Object.keys(s).forEach(function (prop) {
            var _a;
            var reducerConfig = REDUCE_CONFIG[prop];
            var defaultReduce = function () {
                var _a, _b;
                options[prop] = (_b = (_a = s[prop], (_a !== null && _a !== void 0 ? _a : options[prop])), (_b !== null && _b !== void 0 ? _b : undefined));
            };
            if (!reducerConfig) {
                defaultReduce();
                return;
            }
            var outputProp = reducerConfig.outputProp, reducer = reducerConfig.reducer, _b = reducerConfig.start, start = _b === void 0 ? undefined : _b, _c = reducerConfig.seriesType, seriesType = _c === void 0 ? [s.type] : _c;
            if (!seriesType.includes(s.type)) {
                defaultReduce();
                return;
            }
            var result = reducer((_a = options[outputProp], (_a !== null && _a !== void 0 ? _a : start)), s, idx, series.length);
            if (result !== undefined) {
                options[outputProp] = result;
            }
        });
    });
    return options;
}
/**
 * Transforms provided series options array into an array containing series options which are compatible with standalone charts series options.
 */
function processSeriesOptions(seriesOptions) {
    var e_2, _a;
    var result = [];
    var preprocessed = seriesOptions.map(function (series) {
        // Change the default for bar/columns when yKey is used to be grouped rather than stacked.
        if ((series.type === 'bar' || series.type === 'column') && series.yKey != null && !series.stacked) {
            return __assign$2(__assign$2({}, series), { grouped: series.grouped != null ? series.grouped : true });
        }
        return series;
    });
    try {
        for (var _b = __values$2(groupSeriesByType(preprocessed)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var series = _c.value;
            switch (series[0].type) {
                case 'column':
                case 'bar':
                case 'area':
                    result.push(reduceSeries(series));
                    break;
                case 'line':
                default:
                    if (series.length > 1) {
                        console.warn('AG Charts - unexpected grouping of series type: ' + series[0].type);
                    }
                    result.push(series[0]);
                    break;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var __values$1 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$2 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$1 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$2(arguments[i]));
    return ar;
};
function optionsType(input) {
    var _a, _b, _c, _d;
    return _d = (_a = input.type, (_a !== null && _a !== void 0 ? _a : (_c = (_b = input.series) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.type)), (_d !== null && _d !== void 0 ? _d : 'line');
}
function isAgCartesianChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return true;
    }
    switch (specifiedType) {
        case 'cartesian':
        case 'area':
        case 'bar':
        case 'column':
        case 'groupedCategory':
        case 'histogram':
        case 'line':
        case 'scatter':
            return true;
        default:
            return false;
    }
}
function isAgHierarchyChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return false;
    }
    switch (input.type) {
        case 'hierarchy':
        // fall-through - hierarchy and treemap are synonyms.
        case 'treemap':
            return true;
        default:
            return false;
    }
}
function isAgPolarChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return false;
    }
    switch (input.type) {
        case 'polar':
        // fall-through - polar and pie are synonyms.
        case 'pie':
            return true;
        default:
            return false;
    }
}
function isSeriesOptionType(input) {
    if (input == null) {
        return false;
    }
    return ['line', 'bar', 'column', 'histogram', 'scatter', 'area', 'pie', 'treemap'].indexOf(input) >= 0;
}
function countArrayElements(input) {
    var e_1, _a;
    var count = 0;
    try {
        for (var input_1 = __values$1(input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
            var next = input_1_1.value;
            if (next instanceof Array) {
                count += countArrayElements(next);
            }
            if (next != null) {
                count++;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (input_1_1 && !input_1_1.done && (_a = input_1.return)) _a.call(input_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return count;
}
function takeColours(context, colours, maxCount) {
    var result = [];
    for (var count = 0; count < maxCount; count++) {
        result.push(colours[(count + context.colourIndex) % colours.length]);
    }
    return result;
}
function prepareOptions(newOptions) {
    var fallbackOptions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fallbackOptions[_i - 1] = arguments[_i];
    }
    var _a;
    var options = fallbackOptions == null ? newOptions : jsonMerge.apply(void 0, __spread$1(fallbackOptions, [newOptions]));
    sanityCheckOptions(options);
    // Determine type and ensure it's explicit in the options config.
    var userSuppliedOptionsType = options.type;
    var type = optionsType(options);
    options = __assign$1(__assign$1({}, options), { type: type });
    var defaultSeriesType = isAgCartesianChartOptions(options)
        ? 'line'
        : isAgHierarchyChartOptions(options)
            ? 'treemap'
            : isAgPolarChartOptions(options)
                ? 'pie'
                : 'line';
    var defaultOverrides = type === 'bar'
        ? DEFAULT_BAR_CHART_OVERRIDES
        : type === 'scatter'
            ? DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES
            : type === 'histogram'
                ? DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES
                : isAgCartesianChartOptions(options)
                    ? DEFAULT_CARTESIAN_CHART_OVERRIDES
                    : {};
    var _b = prepareMainOptions(defaultOverrides, options), context = _b.context, mergedOptions = _b.mergedOptions, axesThemes = _b.axesThemes, seriesThemes = _b.seriesThemes;
    // Special cases where we have arrays of elements which need their own defaults.
    // Apply series themes before calling processSeriesOptions() as it reduces and renames some
    // properties, and in that case then cannot correctly have themes applied.
    mergedOptions.series = processSeriesOptions((mergedOptions.series || []).map(function (s) {
        var type = s.type
            ? s.type
            : isSeriesOptionType(userSuppliedOptionsType)
                ? userSuppliedOptionsType
                : defaultSeriesType;
        return jsonMerge(seriesThemes[type] || {}, __assign$1(__assign$1({}, s), { type: type }));
    })).map(function (s) { return prepareSeries(context, s); });
    if (isAgCartesianChartOptions(mergedOptions)) {
        mergedOptions.axes = (_a = mergedOptions.axes) === null || _a === void 0 ? void 0 : _a.map(function (a) {
            var type = a.type || 'number';
            var axis = __assign$1(__assign$1({}, a), { type: type });
            var axesTheme = jsonMerge(axesThemes[type], axesThemes[type][a.position || 'unknown'] || {});
            return prepareAxis(axis, axesTheme);
        });
    }
    prepareEnabledOptions(options, mergedOptions);
    return mergedOptions;
}
function sanityCheckOptions(options) {
    var _a, _b;
    if ((_a = options.series) === null || _a === void 0 ? void 0 : _a.some(function (s) { return s.yKeys != null && s.yKey != null; })) {
        console.warn('AG Charts - series options yKeys and yKey are mutually exclusive, please only use yKey for future compatibility.');
    }
    if ((_b = options.series) === null || _b === void 0 ? void 0 : _b.some(function (s) { return s.yNames != null && s.yName != null; })) {
        console.warn('AG Charts - series options yNames and yName are mutually exclusive, please only use yName for future compatibility.');
    }
}
function prepareMainOptions(defaultOverrides, options) {
    var _a = prepareTheme(options), theme = _a.theme, cleanedTheme = _a.cleanedTheme, axesThemes = _a.axesThemes, seriesThemes = _a.seriesThemes;
    var context = { colourIndex: 0, palette: theme.palette };
    var mergedOptions = jsonMerge(defaultOverrides, cleanedTheme, options);
    return { context: context, mergedOptions: mergedOptions, axesThemes: axesThemes, seriesThemes: seriesThemes };
}
function prepareTheme(options) {
    var theme = getChartTheme(options.theme);
    var themeConfig = theme.getConfig(optionsType(options) || 'cartesian');
    return {
        theme: theme,
        axesThemes: themeConfig['axes'] || {},
        seriesThemes: themeConfig['series'] || {},
        cleanedTheme: jsonMerge(themeConfig, { axes: DELETE, series: DELETE }),
    };
}
function prepareSeries(context, input) {
    var defaults = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        defaults[_i - 2] = arguments[_i];
    }
    var paletteOptions = calculateSeriesPalette(context, input);
    // Part of the options interface, but not directly consumed by the series implementations.
    var removeOptions = { stacked: DELETE };
    var mergedResult = jsonMerge.apply(void 0, __spread$1(defaults, [paletteOptions, input, removeOptions]));
    return applySeriesTransform(mergedResult);
}
function calculateSeriesPalette(context, input) {
    var paletteOptions = {};
    var _a = context.palette, fills = _a.fills, strokes = _a.strokes;
    var inputAny = input;
    var colourCount = countArrayElements(inputAny['yKeys'] || []) || 1; // Defaults to 1 if no yKeys.
    switch (input.type) {
        case 'pie':
            colourCount = Math.max(fills.length, strokes.length);
        // fall-through - only colourCount varies for `pie`.
        case 'area':
        case 'bar':
        case 'column':
            paletteOptions.fills = takeColours(context, fills, colourCount);
            paletteOptions.strokes = takeColours(context, strokes, colourCount);
            break;
        case 'histogram':
            paletteOptions.fill = takeColours(context, fills, 1)[0];
            paletteOptions.stroke = takeColours(context, strokes, 1)[0];
            break;
        case 'scatter':
            paletteOptions.marker = {
                stroke: takeColours(context, strokes, 1)[0],
                fill: takeColours(context, fills, 1)[0],
            };
            break;
        case 'line':
            paletteOptions.stroke = takeColours(context, fills, 1)[0];
            paletteOptions.marker = {
                stroke: takeColours(context, strokes, 1)[0],
                fill: takeColours(context, fills, 1)[0],
            };
            break;
        case 'treemap':
            break;
        default:
            throw new Error('AG Charts - unknown series type: ' + input.type);
    }
    context.colourIndex += colourCount;
    return paletteOptions;
}
function prepareAxis(axis, axisTheme) {
    // Remove redundant theme overload keys.
    var removeOptions = { top: DELETE, bottom: DELETE, left: DELETE, right: DELETE };
    // Special cross lines case where we have an arrays of cross line elements which need their own defaults.
    if (axis.crossLines) {
        if (!Array.isArray(axis.crossLines)) {
            console.warn('AG Charts - axis[].crossLines should be an array.');
            axis.crossLines = [];
        }
        var crossLinesTheme_1 = axisTheme.crossLines;
        axis.crossLines = axis.crossLines.map(function (crossLine) { return jsonMerge(crossLinesTheme_1, crossLine); });
    }
    var cleanTheme = { crossLines: DELETE };
    return jsonMerge(axisTheme, cleanTheme, axis, removeOptions);
}
function prepareEnabledOptions(options, mergedOptions) {
    // Set `enabled: true` for all option objects where the user has provided values.
    jsonWalk(options, function (_, userOpts, mergedOpts) {
        if (!mergedOpts) {
            return;
        }
        if ('enabled' in mergedOpts && userOpts.enabled == null) {
            mergedOpts.enabled = true;
        }
    }, { skip: ['data'] }, mergedOptions);
}

var horizontalCrosslineTranslationDirections = {
    top: { xTranslationDirection: 0, yTranslationDirection: -1 },
    bottom: { xTranslationDirection: 0, yTranslationDirection: 1 },
    left: { xTranslationDirection: -1, yTranslationDirection: 0 },
    right: { xTranslationDirection: 1, yTranslationDirection: 0 },
    topLeft: { xTranslationDirection: 1, yTranslationDirection: -1 },
    topRight: { xTranslationDirection: -1, yTranslationDirection: -1 },
    bottomLeft: { xTranslationDirection: 1, yTranslationDirection: 1 },
    bottomRight: { xTranslationDirection: -1, yTranslationDirection: 1 },
    inside: { xTranslationDirection: 0, yTranslationDirection: 0 },
    insideLeft: { xTranslationDirection: 1, yTranslationDirection: 0 },
    insideRight: { xTranslationDirection: -1, yTranslationDirection: 0 },
    insideTop: { xTranslationDirection: 0, yTranslationDirection: 1 },
    insideBottom: { xTranslationDirection: 0, yTranslationDirection: -1 },
    insideTopLeft: { xTranslationDirection: 1, yTranslationDirection: 1 },
    insideBottomLeft: { xTranslationDirection: 1, yTranslationDirection: -1 },
    insideTopRight: { xTranslationDirection: -1, yTranslationDirection: 1 },
    insideBottomRight: { xTranslationDirection: -1, yTranslationDirection: -1 },
};
var verticalCrossLineTranslationDirections = {
    top: { xTranslationDirection: 1, yTranslationDirection: 0 },
    bottom: { xTranslationDirection: -1, yTranslationDirection: 0 },
    left: { xTranslationDirection: 0, yTranslationDirection: -1 },
    right: { xTranslationDirection: 0, yTranslationDirection: 1 },
    topLeft: { xTranslationDirection: -1, yTranslationDirection: -1 },
    topRight: { xTranslationDirection: -1, yTranslationDirection: 1 },
    bottomLeft: { xTranslationDirection: 1, yTranslationDirection: -1 },
    bottomRight: { xTranslationDirection: 1, yTranslationDirection: 1 },
    inside: { xTranslationDirection: 0, yTranslationDirection: 0 },
    insideLeft: { xTranslationDirection: 0, yTranslationDirection: 1 },
    insideRight: { xTranslationDirection: 0, yTranslationDirection: -1 },
    insideTop: { xTranslationDirection: -1, yTranslationDirection: 0 },
    insideBottom: { xTranslationDirection: 1, yTranslationDirection: 0 },
    insideTopLeft: { xTranslationDirection: -1, yTranslationDirection: 1 },
    insideBottomLeft: { xTranslationDirection: 1, yTranslationDirection: 1 },
    insideTopRight: { xTranslationDirection: -1, yTranslationDirection: -1 },
    insideBottomRight: { xTranslationDirection: 1, yTranslationDirection: -1 },
};
var calculateLabelTranslation = function (_a) {
    var yDirection = _a.yDirection, _b = _a.padding, padding = _b === void 0 ? 0 : _b, position = _a.position, bbox = _a.bbox;
    var _c;
    var crossLineTranslationDirections = yDirection
        ? horizontalCrosslineTranslationDirections
        : verticalCrossLineTranslationDirections;
    var _d = (_c = crossLineTranslationDirections[position], (_c !== null && _c !== void 0 ? _c : crossLineTranslationDirections['top'])), xTranslationDirection = _d.xTranslationDirection, yTranslationDirection = _d.yTranslationDirection;
    var w = yDirection ? bbox.width : bbox.height;
    var h = yDirection ? bbox.height : bbox.width;
    var xTranslation = xTranslationDirection * (padding + w / 2);
    var yTranslation = yTranslationDirection * (padding + h / 2);
    return {
        xTranslation: xTranslation,
        yTranslation: yTranslation,
    };
};
var POSITION_TOP_COORDINATES = function (_a) {
    var yDirection = _a.yDirection, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    if (yDirection) {
        return { x: xEnd / 2, y: !isNaN(yEnd) ? yEnd : yStart };
    }
    else {
        return { x: xEnd, y: !isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart };
    }
};
var POSITION_LEFT_COORDINATES = function (_a) {
    var yDirection = _a.yDirection, xStart = _a.xStart, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    if (yDirection) {
        return { x: xStart, y: !isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart };
    }
    else {
        return { x: xEnd / 2, y: yStart };
    }
};
var POSITION_RIGHT_COORDINATES = function (_a) {
    var yDirection = _a.yDirection, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    if (yDirection) {
        return { x: xEnd, y: !isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart };
    }
    else {
        return { x: xEnd / 2, y: !isNaN(yEnd) ? yEnd : yStart };
    }
};
var POSITION_BOTTOM_COORDINATES = function (_a) {
    var yDirection = _a.yDirection, xStart = _a.xStart, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    if (yDirection) {
        return { x: xEnd / 2, y: yStart };
    }
    else {
        return { x: xStart, y: !isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart };
    }
};
var POSITION_INSIDE_COORDINATES = function (_a) {
    var xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    return { x: xEnd / 2, y: !isNaN(yEnd) ? (yStart + yEnd) / 2 : yStart };
};
var POSITION_TOP_LEFT_COORDINATES = function (_a) {
    var yDirection = _a.yDirection, xStart = _a.xStart, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    if (yDirection) {
        return { x: xStart / 2, y: !isNaN(yEnd) ? yEnd : yStart };
    }
    else {
        return { x: xEnd, y: yStart };
    }
};
var POSITION_BOTTOM_LEFT_COORDINATES = function (_a) {
    var xStart = _a.xStart, yStart = _a.yStart;
    return { x: xStart, y: yStart };
};
var POSITION_TOP_RIGHT_COORDINATES = function (_a) {
    var xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    return { x: xEnd, y: !isNaN(yEnd) ? yEnd : yStart };
};
var POSITION_BOTTOM_RIGHT_COORDINATES = function (_a) {
    var yDirection = _a.yDirection, xStart = _a.xStart, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
    if (yDirection) {
        return { x: xEnd, y: yStart };
    }
    else {
        return { x: xStart, y: !isNaN(yEnd) ? yEnd : yStart };
    }
};
var labeldDirectionHandling = {
    top: { c: POSITION_TOP_COORDINATES },
    bottom: { c: POSITION_BOTTOM_COORDINATES },
    left: { c: POSITION_LEFT_COORDINATES },
    right: { c: POSITION_RIGHT_COORDINATES },
    topLeft: { c: POSITION_TOP_LEFT_COORDINATES },
    topRight: { c: POSITION_TOP_RIGHT_COORDINATES },
    bottomLeft: { c: POSITION_BOTTOM_LEFT_COORDINATES },
    bottomRight: { c: POSITION_BOTTOM_RIGHT_COORDINATES },
    inside: { c: POSITION_INSIDE_COORDINATES },
    insideLeft: { c: POSITION_LEFT_COORDINATES },
    insideRight: { c: POSITION_RIGHT_COORDINATES },
    insideTop: { c: POSITION_TOP_COORDINATES },
    insideBottom: { c: POSITION_BOTTOM_COORDINATES },
    insideTopLeft: { c: POSITION_TOP_LEFT_COORDINATES },
    insideBottomLeft: { c: POSITION_BOTTOM_LEFT_COORDINATES },
    insideTopRight: { c: POSITION_TOP_RIGHT_COORDINATES },
    insideBottomRight: { c: POSITION_BOTTOM_RIGHT_COORDINATES },
};

var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var CrossLineLabel = /** @class */ (function () {
    function CrossLineLabel() {
        this.enabled = undefined;
        this.text = undefined;
        this.fontStyle = undefined;
        this.fontWeight = undefined;
        this.fontSize = 14;
        this.fontFamily = 'Verdana, sans-serif';
        /**
         * The padding between the label and the line.
         */
        this.padding = 5;
        /**
         * The color of the labels.
         */
        this.color = 'rgba(87, 87, 87, 1)';
        this.position = undefined;
        this.rotation = undefined;
        this.parallel = undefined;
    }
    return CrossLineLabel;
}());
var CrossLine = /** @class */ (function () {
    function CrossLine() {
        this.id = createId(this);
        this.enabled = undefined;
        this.type = undefined;
        this.range = undefined;
        this.value = undefined;
        this.fill = undefined;
        this.fillOpacity = undefined;
        this.stroke = undefined;
        this.strokeWidth = undefined;
        this.strokeOpacity = undefined;
        this.lineDash = undefined;
        this.label = new CrossLineLabel();
        this.scale = undefined;
        this.gridLength = 0;
        this.sideFlag = -1;
        this.parallelFlipRotation = 0;
        this.regularFlipRotation = 0;
        this.direction = ChartAxisDirection.X;
        this.group = new Group({ name: "" + this.id, layer: true, zIndex: CrossLine.LINE_LAYER_ZINDEX });
        this.crossLineLabel = new Text();
        this.crossLineLine = new Path();
        this.crossLineRange = new Path();
        this.labelPoint = undefined;
        this.fillData = undefined;
        this.strokeData = undefined;
        var _a = this, group = _a.group, crossLineLine = _a.crossLineLine, crossLineRange = _a.crossLineRange, crossLineLabel = _a.crossLineLabel;
        group.append([crossLineRange, crossLineLine, crossLineLabel]);
        crossLineLine.fill = undefined;
        crossLineLine.pointerEvents = PointerEvents.None;
        crossLineRange.pointerEvents = PointerEvents.None;
    }
    CrossLine.prototype.getZIndex = function (type) {
        if (type === void 0) { type = 'line'; }
        if (type === 'range') {
            return CrossLine.RANGE_LAYER_ZINDEX;
        }
        return CrossLine.LINE_LAYER_ZINDEX;
    };
    CrossLine.prototype.update = function (visible) {
        if (!this.enabled || !this.type) {
            return;
        }
        this.group.visible = visible;
        if (!visible) {
            return;
        }
        this.group.zIndex = this.getZIndex(this.type);
        var dataCreated = this.createNodeData();
        if (!dataCreated) {
            this.group.visible = false;
            return;
        }
        this.updatePaths();
    };
    CrossLine.prototype.updatePaths = function () {
        this.updateLinePath();
        this.updateLineNode();
        if (this.type === 'range') {
            this.updateRangePath();
            this.updateRangeNode();
        }
        if (this.label.enabled) {
            this.updateLabel();
            this.positionLabel();
        }
    };
    CrossLine.prototype.createNodeData = function () {
        var _a, _b, _c, _d;
        var _e, _f;
        var _g = this, scale = _g.scale, gridLength = _g.gridLength, sideFlag = _g.sideFlag, direction = _g.direction, _h = _g.label.position, position = _h === void 0 ? 'top' : _h;
        if (!scale) {
            return false;
        }
        var isContinuous = scale instanceof ContinuousScale;
        var bandwidth = (_e = scale.bandwidth, (_e !== null && _e !== void 0 ? _e : 0));
        var xStart, xEnd, yStart, yEnd, clampedYStart, clampedYEnd;
        this.fillData = { points: [] };
        this.strokeData = { points: [] };
        _a = __read$1([0, sideFlag * gridLength], 2), xStart = _a[0], xEnd = _a[1];
        _b = __read$1(this.getRange(), 2), yStart = _b[0], yEnd = _b[1];
        var isLine = false;
        if (yStart === undefined) {
            return false;
        }
        else if (yEnd === undefined) {
            isLine = true;
        }
        _c = __read$1([
            Number(scale.convert(yStart, isContinuous ? clamper$1 : undefined)),
            scale.convert(yEnd, isContinuous ? clamper$1 : undefined) + bandwidth,
        ], 2), clampedYStart = _c[0], clampedYEnd = _c[1];
        _d = __read$1([Number(scale.convert(yStart)), scale.convert(yEnd) + bandwidth], 2), yStart = _d[0], yEnd = _d[1];
        var isValidLine = yStart === clampedYStart;
        var isValidRange = yStart === clampedYStart || yEnd === clampedYEnd || clampedYStart !== clampedYEnd;
        if ((isLine && !isValidLine) || (!isLine && !isValidRange)) {
            return false;
        }
        this.strokeData.points.push({
            x: xStart,
            y: yStart,
        }, {
            x: xEnd,
            y: yStart,
        }, {
            x: xEnd,
            y: yEnd,
        }, {
            x: xStart,
            y: yEnd,
        });
        this.fillData.points.push({
            x: xStart,
            y: clampedYStart,
        }, {
            x: xEnd,
            y: clampedYStart,
        }, {
            x: xEnd,
            y: clampedYEnd,
        }, {
            x: xStart,
            y: clampedYEnd,
        });
        if (this.label.enabled) {
            var yDirection = direction === ChartAxisDirection.Y;
            var _j = (_f = labeldDirectionHandling[position], (_f !== null && _f !== void 0 ? _f : {})).c, c = _j === void 0 ? POSITION_TOP_COORDINATES : _j;
            var _k = c({ yDirection: yDirection, xStart: xStart, xEnd: xEnd, yStart: clampedYStart, yEnd: clampedYEnd }), labelX = _k.x, labelY = _k.y;
            this.labelPoint = {
                x: labelX,
                y: labelY,
            };
        }
        return true;
    };
    CrossLine.prototype.updateLinePath = function () {
        var _a = this, crossLineLine = _a.crossLineLine, _b = _a.strokeData, strokeData = _b === void 0 ? { points: [] } : _b;
        var pathMethods = ['moveTo', 'lineTo', 'moveTo', 'lineTo'];
        var points = strokeData.points;
        var path = crossLineLine.path;
        path.clear({ trackChanges: true });
        pathMethods.forEach(function (method, i) {
            var _a = points[i], x = _a.x, y = _a.y;
            path[method](x, y);
        });
        crossLineLine.checkPathDirty();
    };
    CrossLine.prototype.updateLineNode = function () {
        var _a;
        var _b = this, crossLineLine = _b.crossLineLine, stroke = _b.stroke, strokeWidth = _b.strokeWidth, lineDash = _b.lineDash;
        crossLineLine.stroke = stroke;
        crossLineLine.strokeWidth = (strokeWidth !== null && strokeWidth !== void 0 ? strokeWidth : 1);
        crossLineLine.opacity = (_a = this.strokeOpacity, (_a !== null && _a !== void 0 ? _a : 1));
        crossLineLine.lineDash = lineDash;
    };
    CrossLine.prototype.updateRangeNode = function () {
        var _a = this, crossLineRange = _a.crossLineRange, fill = _a.fill, fillOpacity = _a.fillOpacity;
        crossLineRange.fill = fill;
        crossLineRange.opacity = (fillOpacity !== null && fillOpacity !== void 0 ? fillOpacity : 1);
    };
    CrossLine.prototype.updateRangePath = function () {
        var _a = this, crossLineRange = _a.crossLineRange, _b = _a.fillData, fillData = _b === void 0 ? { points: [] } : _b;
        var points = fillData.points;
        var path = crossLineRange.path;
        path.clear({ trackChanges: true });
        points.forEach(function (point, i) {
            var x = point.x, y = point.y;
            path[i > 0 ? 'lineTo' : 'moveTo'](x, y);
        });
        path.closePath();
        crossLineRange.checkPathDirty();
    };
    CrossLine.prototype.updateLabel = function () {
        var _a = this, crossLineLabel = _a.crossLineLabel, label = _a.label;
        if (!label.text) {
            return;
        }
        crossLineLabel.fontStyle = label.fontStyle;
        crossLineLabel.fontWeight = label.fontWeight;
        crossLineLabel.fontSize = label.fontSize;
        crossLineLabel.fontFamily = label.fontFamily;
        crossLineLabel.fill = label.color;
        crossLineLabel.text = label.text;
    };
    CrossLine.prototype.positionLabel = function () {
        var _a = this, crossLineLabel = _a.crossLineLabel, _b = _a.labelPoint, _c = _b === void 0 ? {} : _b, _d = _c.x, x = _d === void 0 ? undefined : _d, _e = _c.y, y = _e === void 0 ? undefined : _e, _f = _a.label, parallel = _f.parallel, rotation = _f.rotation, _g = _f.position, position = _g === void 0 ? 'top' : _g, _h = _f.padding, padding = _h === void 0 ? 0 : _h, direction = _a.direction, parallelFlipRotation = _a.parallelFlipRotation, regularFlipRotation = _a.regularFlipRotation;
        if (x === undefined || y === undefined) {
            return;
        }
        var labelRotation = rotation ? normalizeAngle360(toRadians(rotation)) : 0;
        var parallelFlipFlag = !labelRotation && parallelFlipRotation >= 0 && parallelFlipRotation <= Math.PI ? -1 : 1;
        var regularFlipFlag = !labelRotation && regularFlipRotation >= 0 && regularFlipRotation <= Math.PI ? -1 : 1;
        var autoRotation = parallel ? (parallelFlipFlag * Math.PI) / 2 : regularFlipFlag === -1 ? Math.PI : 0;
        crossLineLabel.rotation = autoRotation + labelRotation;
        crossLineLabel.textBaseline = 'middle';
        crossLineLabel.textAlign = 'center';
        var bbox = this.computeLabelBBox();
        if (!bbox) {
            return;
        }
        var yDirection = direction === ChartAxisDirection.Y;
        var _j = calculateLabelTranslation({ yDirection: yDirection, padding: padding, position: position, bbox: bbox }), xTranslation = _j.xTranslation, yTranslation = _j.yTranslation;
        crossLineLabel.translationX = x + xTranslation;
        crossLineLabel.translationY = y + yTranslation;
    };
    CrossLine.prototype.getRange = function () {
        var _a;
        var _b = this, value = _b.value, range = _b.range, scale = _b.scale;
        var isContinuous = scale instanceof ContinuousScale;
        var _c = __read$1((range !== null && range !== void 0 ? range : [value, undefined]), 2), start = _c[0], end = _c[1];
        if (!isContinuous && end === undefined) {
            end = start;
        }
        _a = __read$1([checkDatum(start, isContinuous), checkDatum(end, isContinuous)], 2), start = _a[0], end = _a[1];
        if (isContinuous && start === end) {
            end = undefined;
        }
        if (start === undefined && end !== undefined) {
            start = end;
            end = undefined;
        }
        return [start, end];
    };
    CrossLine.prototype.computeLabelBBox = function () {
        return this.crossLineLabel.computeTransformedBBox();
    };
    CrossLine.prototype.calculatePadding = function (padding, seriesRect) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var crossLineLabelBBox = this.computeLabelBBox();
        var labelX = (_a = crossLineLabelBBox) === null || _a === void 0 ? void 0 : _a.x;
        var labelY = (_b = crossLineLabelBBox) === null || _b === void 0 ? void 0 : _b.y;
        if (labelX == undefined || labelY == undefined) {
            return;
        }
        var labelWidth = (_d = (_c = crossLineLabelBBox) === null || _c === void 0 ? void 0 : _c.width, (_d !== null && _d !== void 0 ? _d : 0));
        var labelHeight = (_f = (_e = crossLineLabelBBox) === null || _e === void 0 ? void 0 : _e.height, (_f !== null && _f !== void 0 ? _f : 0));
        if (labelX + labelWidth >= seriesRect.x + seriesRect.width) {
            var paddingRight = labelX + labelWidth - (seriesRect.x + seriesRect.width);
            padding.right = (_g = padding.right, (_g !== null && _g !== void 0 ? _g : 0)) >= paddingRight ? padding.right : paddingRight;
        }
        else if (labelX <= seriesRect.x) {
            var paddingLeft = seriesRect.x - labelX;
            padding.left = (_h = padding.left, (_h !== null && _h !== void 0 ? _h : 0)) >= paddingLeft ? padding.left : paddingLeft;
        }
        if (labelY + labelHeight >= seriesRect.y + seriesRect.height) {
            var paddingbottom = labelY + labelHeight - (seriesRect.y + seriesRect.height);
            padding.bottom = (_j = padding.bottom, (_j !== null && _j !== void 0 ? _j : 0)) >= paddingbottom ? padding.bottom : paddingbottom;
        }
        else if (labelY <= seriesRect.y) {
            var paddingTop = seriesRect.y - labelY;
            padding.top = (_k = padding.top, (_k !== null && _k !== void 0 ? _k : 0)) >= paddingTop ? padding.top : paddingTop;
        }
    };
    CrossLine.LINE_LAYER_ZINDEX = Layers.SERIES_CROSSLINE_LINE_ZINDEX;
    CrossLine.RANGE_LAYER_ZINDEX = Layers.SERIES_CROSSLINE_RANGE_ZINDEX;
    CrossLine.className = 'CrossLine';
    return CrossLine;
}());

var __assign = (undefined && undefined.__assign) || function () {
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
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function chartType(options) {
    if (isAgCartesianChartOptions(options)) {
        return 'cartesian';
    }
    else if (isAgPolarChartOptions(options)) {
        return 'polar';
    }
    else if (isAgHierarchyChartOptions(options)) {
        return 'hierarchy';
    }
    throw new Error('AG Chart - unknown type of chart for options with type: ' + options.type);
}
// Backwards-compatibility layer.
var AgChart = /** @class */ (function () {
    function AgChart() {
    }
    /** @deprecated use AgChart.create() or AgChart.update() instead. */
    AgChart.createComponent = function (options, type) {
        // console.warn('AG Charts - createComponent should no longer be used, use AgChart.update() instead.')
        if (type.indexOf('.series') >= 0) {
            var optionsWithType = __assign(__assign({}, options), { type: options.type || type.split('.')[0] });
            return createSeries([optionsWithType])[0];
        }
        return null;
    };
    AgChart.create = function (options, _container, _data) {
        return AgChartV2.create(options);
    };
    AgChart.update = function (chart, options, _container, _data) {
        return AgChartV2.update(chart, options);
    };
    return AgChart;
}());
var AgChartV2 = /** @class */ (function () {
    function AgChartV2() {
    }
    AgChartV2.create = function (userOptions) {
        debug('user options', userOptions);
        var mixinOpts = {};
        if (AgChartV2.DEBUG()) {
            mixinOpts['debug'] = true;
        }
        var mergedOptions = prepareOptions(userOptions, mixinOpts);
        var chart = isAgCartesianChartOptions(mergedOptions)
            ? mergedOptions.type === 'groupedCategory'
                ? new GroupedCategoryChart(document)
                : new CartesianChart(document)
            : isAgHierarchyChartOptions(mergedOptions)
                ? new HierarchyChart(document)
                : isAgPolarChartOptions(mergedOptions)
                    ? new PolarChart(document)
                    : undefined;
        if (!chart) {
            throw new Error("AG Charts - couldn't apply configuration, check type of options: " + mergedOptions['type']);
        }
        AgChartV2.updateDelta(chart, mergedOptions, userOptions);
        return chart;
    };
    AgChartV2.update = function (chart, userOptions) {
        debug('user options', userOptions);
        var mixinOpts = {};
        if (AgChartV2.DEBUG()) {
            mixinOpts['debug'] = true;
        }
        var mergedOptions = prepareOptions(userOptions, chart.userOptions, mixinOpts);
        if (chartType(mergedOptions) !== chartType(chart.options)) {
            chart.destroy();
            console.warn('AG Charts - options supplied require a different type of chart, please recreate the chart.');
            return;
        }
        var deltaOptions = jsonDiff(chart.options, mergedOptions, {
            stringify: ['data'],
        });
        if (deltaOptions == null) {
            return;
        }
        AgChartV2.updateDelta(chart, deltaOptions, userOptions);
    };
    AgChartV2.updateDelta = function (chart, update, userOptions) {
        if (update.type == null) {
            update = __assign(__assign({}, update), { type: chart.options.type || optionsType(update) });
        }
        debug('delta update', update);
        applyChartOptions(chart, update, userOptions);
    };
    AgChartV2.DEBUG = function () { var _a; return _a = windowValue('agChartsDebug'), (_a !== null && _a !== void 0 ? _a : false); };
    return AgChartV2;
}());
function debug(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (AgChartV2.DEBUG()) {
        console.log.apply(console, __spread([message], optionalParams));
    }
}
function applyChartOptions(chart, options, userOptions) {
    var _a, _b;
    if (isAgCartesianChartOptions(options)) {
        applyOptionValues(chart, options, {
            skip: ['type', 'data', 'series', 'axes', 'autoSize', 'listeners', 'theme'],
        });
    }
    else if (isAgPolarChartOptions(options)) {
        applyOptionValues(chart, options, { skip: ['type', 'data', 'series', 'autoSize', 'listeners', 'theme'] });
    }
    else if (isAgHierarchyChartOptions(options)) {
        applyOptionValues(chart, options, { skip: ['type', 'data', 'series', 'autoSize', 'listeners', 'theme'] });
    }
    else {
        throw new Error("AG Charts - couldn't apply configuration, check type of options and chart: " + options['type']);
    }
    var updateType = ChartUpdateType.PERFORM_LAYOUT;
    if (options.series && options.series.length > 0) {
        applySeries(chart, options);
    }
    if (isAgCartesianChartOptions(options) && options.axes) {
        var axesPresent = applyAxes(chart, options);
        if (axesPresent) {
            updateType = ChartUpdateType.PROCESS_DATA;
        }
    }
    var seriesOpts = options.series;
    if (options.data) {
        chart.data = options.data;
        updateType = ChartUpdateType.PROCESS_DATA;
    }
    else if ((_a = seriesOpts) === null || _a === void 0 ? void 0 : _a.some(function (s) { return s.data != null; })) {
        updateType = ChartUpdateType.PROCESS_DATA;
    }
    // Needs to be done last to avoid overrides by width/height properties.
    if (options.autoSize != null) {
        chart.autoSize = options.autoSize;
    }
    if (options.listeners) {
        registerListeners(chart, options.listeners);
    }
    if ((_b = options.legend) === null || _b === void 0 ? void 0 : _b.listeners) {
        Object.assign(chart.legend.listeners, options.legend.listeners);
    }
    chart.options = jsonMerge(chart.options || {}, options);
    chart.userOptions = jsonMerge(chart.userOptions || {}, userOptions);
    chart.update(updateType);
}
function applySeries(chart, options) {
    var optSeries = options.series;
    if (!optSeries) {
        return;
    }
    var matchingTypes = chart.series.length === optSeries.length && chart.series.every(function (s, i) { var _a; return s.type === ((_a = optSeries[i]) === null || _a === void 0 ? void 0 : _a.type); });
    // Try to optimise series updates if series count and types didn't change.
    if (matchingTypes) {
        chart.series.forEach(function (s, i) {
            var _a, _b;
            var previousOpts = ((_b = (_a = chart.options) === null || _a === void 0 ? void 0 : _a.series) === null || _b === void 0 ? void 0 : _b[i]) || {};
            var seriesDiff = jsonDiff(previousOpts, optSeries[i] || {});
            if (!seriesDiff) {
                return;
            }
            debug("applying series diff idx " + i, seriesDiff);
            applySeriesValues(s, seriesDiff, { path: "series[" + i + "]" });
            s.markNodeDataDirty();
        });
        return;
    }
    chart.series = createSeries(optSeries);
}
function applyAxes(chart, options) {
    var optAxes = options.axes;
    if (!optAxes) {
        return false;
    }
    var matchingTypes = chart.axes.length === optAxes.length && chart.axes.every(function (a, i) { return a.type === optAxes[i].type; });
    // Try to optimise series updates if series count and types didn't change.
    if (matchingTypes) {
        var oldOpts_1 = chart.options;
        if (isAgCartesianChartOptions(oldOpts_1)) {
            chart.axes.forEach(function (a, i) {
                var _a;
                var previousOpts = ((_a = oldOpts_1.axes) === null || _a === void 0 ? void 0 : _a[i]) || {};
                var axisDiff = jsonDiff(previousOpts, optAxes[i]);
                debug("applying axis diff idx " + i, axisDiff);
                var path = "axes[" + i + "]";
                var skip = ['axes[].type'];
                applyOptionValues(a, axisDiff, { path: path, skip: skip });
            });
            return true;
        }
    }
    chart.axes = createAxis(optAxes);
    return true;
}
function createSeries(options) {
    var e_1, _a;
    var series = [];
    var index = 0;
    try {
        for (var _b = __values(options || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var seriesOptions = _c.value;
            var path = "series[" + index++ + "]";
            switch (seriesOptions.type) {
                case 'area':
                    series.push(applySeriesValues(new AreaSeries(), seriesOptions, { path: path }));
                    break;
                case 'bar':
                // fall-through - bar and column are synonyms.
                case 'column':
                    series.push(applySeriesValues(new BarSeries(), seriesOptions, { path: path }));
                    break;
                case 'histogram':
                    series.push(applySeriesValues(new HistogramSeries(), seriesOptions, { path: path }));
                    break;
                case 'line':
                    series.push(applySeriesValues(new LineSeries(), seriesOptions, { path: path }));
                    break;
                case 'scatter':
                    series.push(applySeriesValues(new ScatterSeries(), seriesOptions, { path: path }));
                    break;
                case 'pie':
                    series.push(applySeriesValues(new PieSeries(), seriesOptions, { path: path }));
                    break;
                case 'treemap':
                    series.push(applySeriesValues(new TreemapSeries(), seriesOptions, { path: path }));
                    break;
                default:
                    throw new Error('AG Charts - unknown series type: ' + seriesOptions.type);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return series;
}
function createAxis(options) {
    var e_2, _a;
    var axes = [];
    var index = 0;
    try {
        for (var _b = __values(options || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var axisOptions = _c.value;
            var path = "axes[" + index++ + "]";
            var skip = ['axes[].type'];
            switch (axisOptions.type) {
                case 'number':
                    axes.push(applyOptionValues(new NumberAxis(), axisOptions, { path: path, skip: skip }));
                    break;
                case LogAxis.type:
                    axes.push(applyOptionValues(new LogAxis(), axisOptions, { path: path, skip: skip }));
                    break;
                case CategoryAxis.type:
                    axes.push(applyOptionValues(new CategoryAxis(), axisOptions, { path: path, skip: skip }));
                    break;
                case GroupedCategoryAxis.type:
                    axes.push(applyOptionValues(new GroupedCategoryAxis(), axisOptions, { path: path, skip: skip }));
                    break;
                case TimeAxis.type:
                    axes.push(applyOptionValues(new TimeAxis(), axisOptions, { path: path, skip: skip }));
                    break;
                default:
                    throw new Error('AG Charts - unknown axis type: ' + axisOptions['type']);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return axes;
}
function registerListeners(source, listeners) {
    source.clearEventListeners();
    for (var property in listeners) {
        source.addEventListener(property, listeners[property]);
    }
}
var JSON_APPLY_OPTIONS = {
    constructors: {
        title: Caption,
        subtitle: Caption,
        shadow: DropShadow,
        'axes[].crossLines[]': CrossLine,
    },
    allowedTypes: {
        'series[].marker.shape': ['primitive', 'function'],
        'axis[].tick.count': ['primitive', 'class-instance'],
    },
};
function applyOptionValues(target, options, _a) {
    var _b = _a === void 0 ? {} : _a, skip = _b.skip, path = _b.path;
    var applyOpts = __assign(__assign(__assign({}, JSON_APPLY_OPTIONS), { skip: skip }), (path ? { path: path } : {}));
    return jsonApply(target, options, applyOpts);
}
function applySeriesValues(target, options, _a) {
    var path = (_a === void 0 ? {} : _a).path;
    var _b, _c;
    var skip = ['series[].listeners'];
    var ctrs = ((_b = JSON_APPLY_OPTIONS) === null || _b === void 0 ? void 0 : _b.constructors) || {};
    var seriesTypeOverrides = {
        constructors: __assign(__assign({}, ctrs), { title: target.type === 'pie' ? PieTitle : ctrs['title'] }),
    };
    var applyOpts = __assign(__assign(__assign(__assign({}, JSON_APPLY_OPTIONS), seriesTypeOverrides), { skip: __spread(['series[].type'], (skip || [])) }), (path ? { path: path } : {}));
    var result = jsonApply(target, options, applyOpts);
    var listeners = (_c = options) === null || _c === void 0 ? void 0 : _c.listeners;
    if (listeners != null) {
        registerListeners(target, listeners);
    }
    return result;
}

var time = {
    millisecond: millisecond,
    second: second,
    minute: minute,
    hour: hour,
    day: day,
    sunday: sunday,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    month: month,
    year: year,
    utcMinute: utcMinute,
    utcHour: utcHour,
    utcDay: utcDay,
    utcMonth: utcMonth,
    utcYear: utcYear,
};

export { AgChart, AgChartV2, Arc, ArcType, AreaSeries, AreaSeriesTooltip, BandScale, BarLabelPlacement, BarSeries, BarSeriesLabel, BarSeriesTooltip, Caption, CartesianChart, CategoryAxis, Chart, ChartAxis, ChartAxisDirection, ChartAxisPosition, ChartTheme, ChartTooltip, ChartUpdateType, ClipRect, DropShadow, Group, GroupedCategoryAxis, GroupedCategoryChart, HierarchyChart, HistogramBin, HistogramSeries, HistogramSeriesTooltip, Legend, LegendItem, LegendLabel, LegendListeners, LegendMarker, LegendOrientation, LegendPosition, Line, LineSeries, LineSeriesTooltip, LinearScale, Marker, NumberAxis, Padding, Path, PieSeries, PieSeriesTooltip, PieTitle, PolarChart, Rect, RectSizing, ScatterSeries, ScatterSeriesTooltip, Scene, ScenePathChangeDetection, Sector, Shape, TimeAxis, TreemapSeries, TreemapSeriesLabel, TreemapSeriesTooltip, clamper, copy, extent, find, findIndex, findMinMax, flipChartAxisDirection, getChartTheme, getIntegratedChartTheme, mergeOptions, normalizeAngle180, normalizeAngle360, normalizeAngle360Inclusive, themes, time, toDegrees, toRadians, toTooltipHtml };
