import './polyfill';
import { DragScrollOptions, DragScrollState, ObjectType } from './types';
declare class DragScroll {
    options: DragScrollOptions;
    $container: HTMLElement;
    $wrapper: HTMLDivElement;
    rafID: number;
    state: DragScrollState;
    MOUSE_TYPE: ObjectType;
    MOUSE_EVENT_NAME: ObjectType;
    static get DIRECTION(): ObjectType;
    static get SCROLL_MODE(): ObjectType;
    constructor(options: DragScrollOptions);
    initDom(): void;
    setLimit(): void;
    bindEvents(): void;
    onClick(evt: MouseEvent): void;
    onDragStart(event: MouseEvent | TouchEvent): void;
    onDragEnd(evt: MouseEvent | TouchEvent): void;
    onDraging(event: MouseEvent | TouchEvent): void;
    adaptContentPosition(): void;
    getValueInRange(): number;
    animate(): void;
    startAnimationLoop(): void;
    createEleFromHTML(html: string): HTMLDivElement;
}
export default DragScroll;
