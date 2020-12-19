import './polyfill'
import { IDragScrollOptions, IDragScrollState, ICoordinate } from './@types'
import EventEmitter from './emitter'
import { hasTextSelectFromPoint } from './utils'

/**
 * Todo:
 * 1. Update Readme.md
 * - Example of using Js, CommonJs, Ejs, Ts
 * - API: scrollTo, scrollToCenter, setInputCanBeFocused, setTextCanBeSelected, destroy
 * - Options
 * 2. Change some methods to be priavte
 * 3. Banner lisence
 * 4. Publish to NPM
 */

class DragScroll extends EventEmitter {
    $container: HTMLElement
    $content: HTMLElement
    rafID: number
    options: IDragScrollOptions
    state: IDragScrollState

    constructor(options: IDragScrollOptions) {
        super()
        this.options = Object.assign(
            {
                friction: 0.95,
                axis: 'x',
                allowInputFocus: true,
                allowSelectText: true,
            },
            options,
        )

        const initialCoordinate = {
            x: 0,
            y: 0,
        }

        this.state = {
            startPosition: { ...initialCoordinate },
            previousPosition: { ...initialCoordinate },
            position: { ...initialCoordinate },
            dragPosition: { ...initialCoordinate },
            velocity: { ...initialCoordinate },
            dragOffset: { ...initialCoordinate },
            targetPosition: { ...initialCoordinate },
            isRunning: false,
            isDragging: false,
            isScrollToRunning: false,
        }

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
        // Mouse events
        this.$content.addEventListener('click', this.onClick)
        this.$content.addEventListener('mousedown', this.onDragStart)
        window.addEventListener('mousemove', this.onDraging)
        window.addEventListener('mouseup', this.onDragEnd)

        // Touch events
        this.$content.addEventListener('touchstart', this.onDragStart)
        window.addEventListener('touchmove', this.onDraging)
        window.addEventListener('touchend', this.onDragEnd)
    }

    destroy(): void {
        // Mouse events
        this.$content.removeEventListener('click', this.onClick)
        this.$content.removeEventListener('mousedown', this.onDragStart)
        window.removeEventListener('mousemove', this.onDraging)
        window.removeEventListener('mouseup', this.onDragEnd)

        // Touch events
        this.$content.removeEventListener('touchstart', this.onDragStart)
        window.removeEventListener('touchmove', this.onDraging)
        window.removeEventListener('touchend', this.onDragEnd)
    }

    update(): void {
        const { isDragging, isScrollToRunning } = this.state
        this.applyDragForce()

        if (!isDragging) {
            this.applyAllBoundForce()
        }

        if (isScrollToRunning) {
            this.applyTargetForce()
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

    applyTargetForce(): void {
        const { position, velocity, targetPosition } = this.state
        this.applyForce({
            x: (targetPosition.x - position.x) * 0.08 - velocity.x,
            y: (targetPosition.y - position.y) * 0.08 - velocity.y,
        })
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

    onDragStart(evt: MouseEvent | TouchEvent): void {
        const $ele = <HTMLElement>evt.target

        // allow inputs can be focused by clicking
        const formNodes = ['input', 'textarea', 'button', 'select', 'label']
        if (this.options.allowInputFocus && formNodes.indexOf($ele.nodeName.toLowerCase()) > -1) {
            return
        }

        const isTouchEvent = evt instanceof TouchEvent
        const { clientX, clientY } = isTouchEvent ? (<TouchEvent>evt).targetTouches[0] : <MouseEvent>evt

        // case select text content
        if (this.options.allowSelectText && hasTextSelectFromPoint($ele, clientX, clientY)) return

        evt.preventDefault()
        evt.stopPropagation()

        // trigger drag start event
        this.trigger('dragstart', evt)

        this.state.isDragging = true
        this.state.startPosition = {
            x: clientX,
            y: clientY,
        }

        // keep previous position before starting drag
        this.state.previousPosition = {
            ...this.state.position,
        }

        this.setDragPosition(this.state.startPosition)
        this.startAnimation()
    }

    onDraging(evt: MouseEvent | TouchEvent): void {
        if (!this.state.isDragging) return

        const isTouchEvent = evt instanceof TouchEvent
        const { clientX, clientY } = isTouchEvent ? (<TouchEvent>evt).targetTouches[0] : <MouseEvent>evt

        this.setDragPosition({
            x: clientX,
            y: clientY,
        })

        // trigger dragging event
        this.trigger('dragging', evt)
    }

    onDragEnd(evt: MouseEvent | TouchEvent): void {
        if (this.state.isDragging) {
            // trigger drag end event
            this.trigger('dragend', evt)
        }

        this.state.isDragging = false
    }

    setDragPosition({ x, y }: ICoordinate): void {
        const { startPosition, dragPosition, previousPosition, dragOffset } = this.state
        dragOffset.x = x - startPosition.x
        dragOffset.y = y - startPosition.y
        dragPosition.x = previousPosition.x + dragOffset.x
        dragPosition.y = previousPosition.y + dragOffset.y
    }

    setInputCanBeFocused(focused: boolean = false): void {
        this.options.allowInputFocus = focused
    }

    scrollTo(targetPosition: ICoordinate): void {
        const position = {
            x: 0,
            y: 0,
            ...targetPosition,
        }

        this.state.isScrollToRunning = true
        this.state.targetPosition = position
        this.startAnimation()
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
            this.state.isScrollToRunning = false
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
