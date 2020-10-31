export interface DragScrollOptions {
    $container: HTMLElement;
    speed?: number;
    gapSide?: number;
}
export interface DragScrollState {
    start: number;
    previous: number;
    distance: number;
    limit: number;
    isDown: boolean;
    isDragging: boolean;
    isRunning: boolean;
    move: number;
    mouse: {
        clickEnabled: boolean;
        isMoving: boolean;
        movingTimeoutId: ReturnType<typeof setTimeout>;
    };
}
