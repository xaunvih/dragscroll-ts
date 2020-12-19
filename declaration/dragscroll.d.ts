import './polyfill';
import { IDragScrollOptions, IDragScrollState, ICoordinate } from './@types';
import EventEmitter from './emitter';
declare class DragScroll extends EventEmitter {
    $container: HTMLElement;
    $content: HTMLElement;
    rafID: number;
    options: IDragScrollOptions;
    state: IDragScrollState;
    constructor(options: IDragScrollOptions);
    bindEvents(): void;
    destroy(): void;
    update(): void;
    applyForce(force: ICoordinate): void;
    applyTargetForce(): void;
    applyDragForce(): void;
    applyAllBoundForce(): void;
    applyBoundForce({ bound, isForward, axis }: {
        bound: number;
        isForward?: boolean;
        axis: string;
    }): void;
    onClick(evt: MouseEvent): void;
    onDragStart(evt: MouseEvent | TouchEvent): void;
    onDraging(evt: MouseEvent | TouchEvent): void;
    onDragEnd(evt: MouseEvent | TouchEvent): void;
    setDragPosition({ x, y }: ICoordinate): void;
    setInputCanBeFocused(focused?: boolean): void;
    scrollTo(targetPosition: ICoordinate): void;
    adaptContentPosition(): void;
    isMoving(): boolean;
    animate(): void;
    startAnimation(): void;
}
export default DragScroll;
