import './polyfill'
import { DragScrollOptions } from './@types'

class DragScroll {
    options: any
    $container: HTMLElement
    $content: HTMLElement
    rafID: number
    state: any = {
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
        isDragging: false,
    }

    constructor(options: DragScrollOptions) {
        this.options = Object.assign(
            {
                friction: 0.95,
            },
            options,
        )

        this.$container = this.options.$container
        this.$content = this.options.$content

        this.onDragStart = this.onDragStart.bind(this)
        this.onDraging = this.onDraging.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.animate = this.animate.bind(this)
        this.bindEvents()
    }

    bindEvents(): void {
        this.$content.addEventListener('mousedown', this.onDragStart)
        window.addEventListener('mousemove', this.onDraging)
        window.addEventListener('mouseup', this.onDragEnd)
    }

    update() {
        this.applyDragForce()
        this.applyLeftBoundForce()
        this.applyRightBoundForce()
        this.applyTopBoundForce()
        this.applyBottomBoundForce()

        const { position, velocity } = this.state
        const { friction } = this.options

        velocity.x *= friction
        velocity.y *= friction

        position.x += velocity.x
        position.y += velocity.y
    }

    applyForce(force: any) {
        const { velocity } = this.state
        velocity.x += force.x
        velocity.y += force.y
    }

    applyDragForce() {
        if (!this.state.isDragging) return

        // change the position to drag position by applying force to velocity
        const { position, dragPosition, velocity } = this.state
        const dragForce = {
            x: dragPosition.x - position.x - velocity.x,
            y: dragPosition.y - position.y - velocity.y,
        }

        this.applyForce(dragForce)
    }

    applyLeftBoundForce() {
        const { velocity, position, isDragging } = this.state
        const { friction } = this.options
        const leftBound = 0
        const isInside = position.x > leftBound
        if (isDragging || isInside) {
            return
        }

        // bouncing past bound
        const distance = leftBound - position.x
        let force = distance * 0.1
        const restX = position.x + ((velocity.x + force) * friction) / (1 - friction)
        const isRestOutside = restX < leftBound
        if (isRestOutside) {
            this.applyForce({
                x: force,
                y: 0
            })

            return
        }

        // bounce back
        this.applyForce({
            x: distance * 0.1 - velocity.x,
            y: 0
        })
    }

    applyRightBoundForce() {
        const { velocity, position, isDragging } = this.state
        const { friction } = this.options
        const rightBound = this.$container.clientWidth - this.$content.clientWidth - 40
        const isInside = position.x < rightBound
        if (isDragging || isInside) {
            return
        }

        // bouncing past bound
        const distance = rightBound - position.x
        let force = distance * 0.1
        const restX = position.x + ((velocity.x + force) * friction) / (1 - friction)
        const isRestOutside = restX > rightBound
        if (isRestOutside) {
            this.applyForce({
                x: force,
                y: 0
            })

            return
        }

        // bounce back
        this.applyForce({
            x: distance * 0.1 - velocity.x,
            y: 0
        })
    }

    applyTopBoundForce() {
        const { velocity, position, isDragging } = this.state
        const { friction } = this.options
        const topBound = 0
        const isInside = position.y < topBound
        if (isDragging || isInside) {
            return
        }

        // bouncing past bound
        const distance = topBound - position.y
        let force = distance * 0.1
        const restY = position.y + ((velocity.y + force) * friction) / (1 - friction)
        const isRestOutside = restY > topBound
        if (isRestOutside) {
            this.applyForce({
                x: 0,
                y: force
            })

            return
        }

        // bounce back
        this.applyForce({
            x: 0,
            y: distance * 0.1 - velocity.y
        })
    }

    applyBottomBoundForce() {
        const { velocity, position, isDragging } = this.state
        const { friction } = this.options
        const bottomBound = 0
        const isInside = position.y > bottomBound
        if (isDragging || isInside) {
            return
        }

        // bouncing past bound
        const distance = bottomBound - position.y
        let force = distance * 0.1
        const restY = position.y + ((velocity.y + force) * friction) / (1 - friction)
        const isRestOutside = restY < bottomBound
        if (isRestOutside) {
            this.applyForce({
                x: 0,
                y: force
            })

            return
        }

        // bounce back
        this.applyForce({
            x: 0,
            y: distance * 0.1 - velocity.y
        })
    }

    onDragStart(evt: MouseEvent): void {
        evt.preventDefault()
        evt.stopPropagation()

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

    setDragPosition(evt: MouseEvent) {
        const { startPosition, dragPosition, previousPosition } = this.state
        dragPosition.x = previousPosition.x + evt.clientX - startPosition.x
        dragPosition.y = previousPosition.y + evt.clientY - startPosition.y
    }

    adaptContentPosition(): void {
        const { position } = this.state
        this.$content.style.transform = `translate(${position.x}px,${position.y}px)`
    }

    animate(): void {
        this.update()
        this.adaptContentPosition()
        this.rafID = window.requestAnimationFrame(this.animate)
    }

    startAnimation(): void {
        window.cancelAnimationFrame(this.rafID)
        this.rafID = window.requestAnimationFrame(this.animate)
    }
}

export default DragScroll
