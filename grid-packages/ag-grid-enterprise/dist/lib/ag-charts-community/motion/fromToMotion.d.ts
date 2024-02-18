import type { ProcessedOutputDiff } from '../chart/data/dataModel';
import type { AnimationManager } from '../chart/interaction/animationManager';
import type { Node } from '../scene/node';
import type { Selection } from '../scene/selection';
import type { AnimationPhase, AnimationValue } from './animation';
export type NodeUpdateState = 'unknown' | 'added' | 'removed' | 'updated';
export declare const NODE_UPDATE_PHASES: NodeUpdateState[];
export type FromToMotionPropFnContext<T> = {
    last: boolean;
    lastLive: boolean;
    prev?: T;
    prevFromProps?: Partial<T>;
    next?: T;
    prevLive?: T;
    nextLive?: T;
};
export type ExtraOpts<T> = {
    phase: AnimationPhase;
    delay?: number;
    duration?: number;
    start?: Partial<T>;
    finish?: Partial<T>;
};
export type FromToMotionPropFn<N extends Node, T extends Record<string, string | number | undefined> & Partial<N>, D> = (node: N, datum: D, state: NodeUpdateState, ctx: FromToMotionPropFnContext<N>) => T & Partial<ExtraOpts<N>>;
type IntermediateFn<N extends Node, D> = (node: N, datum: D, state: NodeUpdateState, ctx: FromToMotionPropFnContext<N>) => Partial<N>;
export declare const NODE_UPDATE_STATE_TO_PHASE_MAPPING: Record<NodeUpdateState, AnimationPhase>;
export type FromToDiff = Pick<ProcessedOutputDiff, 'added' | 'removed'>;
export interface FromToFns<N extends Node, T extends Record<string, string | number | undefined> & Partial<N>, D> {
    fromFn: FromToMotionPropFn<N, T, D>;
    toFn: FromToMotionPropFn<N, T, D>;
    intermediateFn?: IntermediateFn<N, D>;
}
/**
 * Implements a per-node "to/from" animation, with support for detection of added/moved/removed
 * nodes.
 *
 * @param id prefix for all animation ids generated by this call
 * @param animationManager used to schedule generated animations
 * @param selections contains nodes to be animated
 * @param fromFn callback to determine per-node starting properties
 * @param toFn callback to determine per-node final properties
 * @param extraOpts optional additional animation properties to pass to AnimationManager#animate.
 * @param getDatumId optional per-datum 'id' generation function for diff calculation - must be
 *                   specified iff diff is specified
 * @param diff optional diff from a DataModel to use to detect added/moved/removed cases
 */
export declare function fromToMotion<N extends Node, T extends Record<string, string | number | undefined> & Partial<N>, D>(groupId: string, subId: string, animationManager: AnimationManager, selectionsOrNodes: Selection<N, D>[] | N[], fns: FromToFns<N, T, D>, getDatumId?: (node: N, datum: D) => string, diff?: FromToDiff): void;
/**
 * Implements a batch "to/from" animation.
 *
 * @param id prefix for all animation ids generated by this call
 * @param animationManager used to schedule generated animations
 * @param selectionsOrNodes contains nodes to be animated
 * @param from node starting properties
 * @param to node final properties
 * @param extraOpts optional additional animation properties to pass to AnimationManager#animate.
 */
export declare function staticFromToMotion<N extends Node, T extends AnimationValue & Partial<N> & object, D>(groupId: string, subId: string, animationManager: AnimationManager, selectionsOrNodes: Selection<N, D>[] | N[], from: T, to: T, extraOpts: ExtraOpts<N>): void;
export {};
