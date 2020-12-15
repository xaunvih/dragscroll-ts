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
        this.animate()
    }

    bindEvents(): void {
        this.$content.addEventListener('mousedown', this.onDragStart)
        window.addEventListener('mousemove', this.onDraging)
        window.addEventListener('mouseup', this.onDragEnd)
    }

    update() {
        this.applyDragForce()
        this.applyBoundForce()

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

    applyBoundForce() {}

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
