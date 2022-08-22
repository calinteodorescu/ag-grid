import { Path } from '../../scene/shape/path';
import { BBox } from '../../scene/bbox';
export declare class RangeMask extends Path {
    static className: string;
    protected _stroke: string;
    protected _strokeWidth: number;
    protected _fill: string;
    protected _fillOpacity: number;
    protected _lineCap: CanvasLineCap;
    protected _x: number;
    set x(value: number);
    get x(): number;
    protected _y: number;
    set y(value: number);
    get y(): number;
    protected _width: number;
    set width(value: number);
    get width(): number;
    protected _height: number;
    set height(value: number);
    get height(): number;
    minRange: number;
    protected _min: number;
    set min(value: number);
    get min(): number;
    protected _max: number;
    set max(value: number);
    get max(): number;
    onRangeChange?: (min: number, max: number) => any;
    computeBBox(): BBox;
    computeVisibleRangeBBox(): BBox;
    updatePath(): void;
}
