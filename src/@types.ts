export { Emitter, Handler, EventType } from 'mitt'

export interface IDragScrollOptions {
    $container: HTMLElement
    $content: HTMLElement
    axis: string
    friction?: number
    allowInputFocus?: false
}

export interface ICoordinate {
    x: number
    y: number
}

export interface IDragScrollState {
    startPosition: ICoordinate
    previousPosition: ICoordinate
    position: ICoordinate
    dragPosition: ICoordinate
    velocity: ICoordinate
    dragOffset: ICoordinate
    isDragging: boolean
    isRunning: boolean
}

export interface IObject {
    [key: string]: number | string
}
