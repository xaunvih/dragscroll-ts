export interface DragScrollOptions {
    $container: HTMLElement
    $content: HTMLElement
    hideScroll: boolean
    allowInputFocus: boolean
}

export interface Corrdinate {
    x: number
    y: number
}

export interface DragScrollState {
    start: Corrdinate
    previous: Corrdinate
    distance: Corrdinate
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
