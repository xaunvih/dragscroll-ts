import './polyfill';
import { DragScrollOptions, DragScrollState, ObjectType } from './@types';
declare class DragScroll {
    options: DragScrollOptions;
    $container: HTMLElement;
    $content: HTMLElement;
    rafID: number;
    state: DragScrollState;
    static get DIRECTION(): ObjectType;
    constructor(options: DragScrollOptions);
    initDom(): void;
    bindEvents(): void;
    onClick(evt: MouseEvent): void;
    onDragStart(evt: MouseEvent): void;
    onDraging(evt: MouseEvent): void;
    onDragEnd(): void;
    adaptContentPosition(): void;
    doAnimate(): void;
    startAnimationLoop(): void;
}
export default DragScroll;
