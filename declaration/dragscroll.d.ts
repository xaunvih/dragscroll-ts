import './polyfill';
import { DragScrollOptions, DragScrollState } from './types';
declare class DragScroll {
    options: DragScrollOptions;
    $container: HTMLElement;
    $wrapper: HTMLDivElement;
    rafID: number;
    state: DragScrollState;
    static get DIRECTION(): {
        ALL: string;
        HORIZONTAL: string;
        VERTICAL: string;
    };
    static get SCROLL_MODE(): {
        NATIVE: string;
        TRANSFORM: string;
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
