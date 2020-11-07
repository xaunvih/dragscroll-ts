export interface DragScrollOptions {
    $container: HTMLElement
    speed?: number
    gapSide?: number
    direction?: string
    scrollMode?: string
}

export interface Corrdinate {
    x: number
    y: number
}

export interface DragScrollState {
    start: Corrdinate
    previous: Corrdinate
    distance: Corrdinate
    limit: Corrdinate
    move: Corrdinate
    isDown: boolean
    isDragging: boolean
    isRunning: boolean
    mouse: {
        clickEnabled: boolean
        isMoving: boolean
        movingTimeoutId: ReturnType<typeof setTimeout>
    }
}

export interface ObjectType {
    [key: string]: number | string
}
