import './polyfill'
import { IDragScrollOptions, IDragScrollState, ICoordinate } from './@types'
import EventEmiter from './emitter'

class DragScroll extends EventEmiter {
    $container: HTMLElement
    $content: HTMLElement
    rafID: number
    options: IDragScrollOptions
    state: IDragScrollState = {
        startPosition: {
            x: 0,
            y: 0,
        },
        previousPosition: {
            x: 0,
            y: 0,
        },
        position: {
            x: 0,
            y: 0,
        },
        dragPosition: {
            x: 0,
            y: 0,
        },
        velocity: {
            x: 0,
            y: 0,
        },
        dragOffset: {
            x: 0,
            y: 0,
        },
        isRunning: false,
        isDragging: false,
    }

    constructor(options: IDragScrollOptions) {
        super()
        this.options = Object.assign(
            {
                friction: 0.95,
                axis: 'x',
                allowInputFocus: false,
            },
            options,
        )

        this.$container = this.options.$container
        this.$content = this.options.$content

        this.onDragStart = this.onDragStart.bind(this)
        this.onDraging = this.onDraging.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.onClick = this.onClick.bind(this)
        this.animate = this.animate.bind(this)

        this.bindEvents()
    }

    bindEvents(): void {
        this.$content.addEventListener('click', this.onClick)
        this.$content.addEventListener('mousedown', this.onDragStart)
        window.addEventListener('mousemove', this.onDraging)
        window.addEventListener('mouseup', this.onDragEnd)
    }

    update(): void {
        this.applyDragForce()

        if (!this.state.isDragging) {
            this.applyAllBoundForce()
        }

        const { position, velocity } = this.state
        const { friction, axis } = this.options
        velocity.x *= friction
        velocity.y *= friction

        if (axis !== 'y') {
            position.x += velocity.x
        }

        if (axis !== 'x') {
            position.y += velocity.y
        }
    }

    applyForce(force: ICoordinate): void {
        const { velocity } = this.state
        velocity.x += force.x
        velocity.y += force.y
    }

    applyDragForce(): void {
        if (!this.state.isDragging) return

        // change the position to drag position by applying force to velocity
        const { position, dragPosition, velocity } = this.state
        const dragForce = {
            x: dragPosition.x - position.x - velocity.x,
            y: dragPosition.y - position.y - velocity.y,
        }

        this.applyForce(dragForce)
    }

    applyAllBoundForce(): void {
        // left right top bottom bounds
        ;[
            {
                bound: this.$container.clientWidth - this.$content.clientWidth,
                axis: 'x',
            },
            {
                bound: 0,
                isForward: true,
                axis: 'x',
            },
            {
                bound: this.$container.clientHeight - this.$content.clientHeight,
                axis: 'y',
            },
            {
                bound: 0,
                isForward: true,
                axis: 'y',
            },
        ].forEach((edge) => this.applyBoundForce(edge))
    }

    applyBoundForce({ bound, isForward = false, axis }: { bound: number; isForward?: boolean; axis: string }): void {
        const { friction } = this.options
        const { velocity: currentVelocity, position: currentPosition } = this.state
        const position = currentPosition[axis]
        const velocity = currentVelocity[axis]
        const isInside = isForward ? position < bound : position > bound
        if (isInside) {
            return
        }

        // bouncing past bound
        const distance = bound - position
        let force = distance * 0.1
        const restPosition = position + ((velocity + force) * friction) / (1 - friction)
        const isRestOutside = isForward ? restPosition > bound : restPosition < bound
        if (!isRestOutside) {
            // bounce back
            force = distance * 0.1 - velocity
        }

        this.applyForce({ x: 0, y: 0, [axis]: force })
    }

    onClick(evt: MouseEvent): void {
        const { dragOffset } = this.state
        const clickThreshol = 5

        // detect a clicking or dragging by measuring the distance
        if (Math.abs(dragOffset.x) > clickThreshol || Math.abs(dragOffset.y) > clickThreshol) {
            evt.preventDefault()
            evt.stopPropagation()
        }
    }

    onDragStart(evt: MouseEvent): void {
        evt.preventDefault()
        evt.stopPropagation()

        // allow inputs can be focused by clicking
        const formNodes = ['input', 'textarea', 'button', 'select', 'label']
        if (this.options.allowInputFocus && formNodes.indexOf((<HTMLElement>evt.target).nodeName.toLowerCase()) > -1) {
            return
        }

        this.state.isDragging = true
        this.state.startPosition = {
            x: evt.clientX,
            y: evt.clientY,
        }

        // keep previous position before starting drag
        this.state.previousPosition = {
            ...this.state.position,
        }

        this.setDragPosition(evt)
        this.startAnimation()
    }

    onDraging(evt: MouseEvent): void {
        if (!this.state.isDragging) return
        this.setDragPosition(evt)
    }

    onDragEnd(): void {
        this.state.isDragging = false
    }

    setDragPosition(evt: MouseEvent): void {
        const { startPosition, dragPosition, previousPosition, dragOffset } = this.state

        dragOffset.x = evt.clientX - startPosition.x
        dragOffset.y = evt.clientY - startPosition.y
        dragPosition.x = previousPosition.x + dragOffset.x
        dragPosition.y = previousPosition.y + dragOffset.y
    }

    adaptContentPosition(): void {
        const { position } = this.state
        this.$content.style.transform = `translate(${position.x}px,${position.y}px)`
    }

    isMoving(): boolean {
        const { isDragging, velocity } = this.state
        return isDragging || Math.abs(velocity.x) >= 0.01 || Math.abs(velocity.y) >= 0.01
    }

    animate(): void {
        if (!this.state.isRunning) return

        this.update()

        if (!this.isMoving()) {
            this.state.isRunning = false
        }

        this.adaptContentPosition()
        this.rafID = window.requestAnimationFrame(this.animate)
    }

    startAnimation(): void {
        this.state.isRunning = true
        window.cancelAnimationFrame(this.rafID)
        this.rafID = window.requestAnimationFrame(this.animate)
    }
}

export default DragScroll
