export interface IDragScrollOptions {
    $container: HTMLElement
    $content: HTMLElement
    axis: string
    allowInputFocus?: boolean
    allowSelectText?: boolean
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
    targetPosition: ICoordinate
    isDragging: boolean
    isRunning: boolean
    isScrollToRunning: boolean
}

export interface IMetaData {
    containerWidth: number
    containerHeight: number
    contentWidth: number
    contentHeight: number
}

export interface IObject {
    [key: string]: number | string
}
