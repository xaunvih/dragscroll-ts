import './polyfill';
import './dragscroll.scss';
import { DragScrollOptions, DragScrollState } from './types';
declare class DragScroll {
    options: DragScrollOptions;
    $container: HTMLElement;
    $wrapper: HTMLDivElement;
    rafID: number;
    state: DragScrollState;
    get MOUSE(): {
        SCROLL: number;
        RIGHT: number;
    };
    get MOUSE_EVENT_TYPE(): {
        MOUSE_LEAVE: string;
    };
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
