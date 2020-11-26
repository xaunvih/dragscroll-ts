import './polyfill'
import { DragScrollOptions, DragScrollState, ObjectType, Corrdinate } from './@types'

class DragScroll {
    options: DragScrollOptions
    $container: HTMLElement
    $content: HTMLElement
    rafID: number

    state: DragScrollState = {
        start: {
            x: 0,
            y: 0,
        },
        previous: {
            x: 0,
            y: 0,
        },
        distance: {
            x: 0,
            y: 0,
        },
        isDown: false,
        isDragging: false,
        isRunning: false,
        mouse: {
            clickEnabled: false,
            isMoving: false,
            movingTimeoutId: null,
        },
    }

    static get DIRECTION(): ObjectType {
        return {
            ALL: 'ALL',
            HORIZONTAL: 'HORIZONTAL',
            VERTICAL: 'VERTICAL',
        }
    }

    constructor(options: DragScrollOptions) {
        this.options = Object.assign(
            {
                direction: DragScroll.DIRECTION.HORIZONTAL,
                allowInputFocus: true,
                onDragStart: null,
                onDragging: null,
                onDragEnd: null,
            },
            options,
        )

        this.$container = this.options.$container
        this.$content = this.options.$content
        this.onClick = this.onClick.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDraging = this.onDraging.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.doAnimate = this.doAnimate.bind(this)
        this.initDom()
        this.bindEvents()
    }

    initDom(): void {
        this.$container.classList.add('drag-scroll')
    }

    bindEvents(): void {
        this.$content.addEventListener('click', this.onClick, true)
        this.$content.addEventListener('mousedown', this.onDragStart, true)
        window.addEventListener('mousemove', this.onDraging)
        window.addEventListener('mouseup', this.onDragEnd)
    }

    onClick(evt: MouseEvent): void {
        if (this.state.mouse.clickEnabled) return
        evt.preventDefault()
        evt.stopPropagation()
    }

    onDragStart(evt: MouseEvent): void {
        const mouseTypes: ObjectType = {
            SCROLL: 1,
            RIGHT: 2,
        }

        if (evt.button === mouseTypes.RIGHT || evt.button === mouseTypes.SCROLL) {
            return
        }

        evt.preventDefault()
        evt.stopPropagation()

        // focus on form input elements
        const formNodes = ['input', 'textarea', 'button', 'select', 'label']
        if (this.options.allowInputFocus && formNodes.indexOf((<HTMLElement>evt.target).nodeName.toLowerCase()) > -1) {
            return
        }

        const { mouse: mouseState } = this.state
        mouseState.clickEnabled = false
        mouseState.isMoving = false
        mouseState.movingTimeoutId = null

        this.state.isDragging = true
        this.state.start = {
            x: evt.clientX,
            y: evt.clientY,
        }

        this.state.previous = {
            x: this.$container.scrollLeft,
            y: this.$container.scrollTop,
        }
    }

    onDraging(evt: MouseEvent): void {
        if (!this.state.isDragging) return
        if (!this.state.mouse.movingTimeoutId) {
            this.state.mouse.movingTimeoutId = setTimeout(() => {
                this.state.mouse.isMoving = true
            }, 70)
        }

        const { start } = this.state
        this.state.distance = {
            x: (evt.clientX - start.x) * 2,
            y: (evt.clientY - start.y) * 2,
        }

        this.startAnimationLoop()
    }

    onDragEnd(): void {
        this.state.isDragging = false
        const { mouse } = this.state
        if (!mouse.isMoving) {
            mouse.clickEnabled = true
        }

        mouse.isMoving = false
    }

    adaptContentPosition(): void {
        const { x: moveX, y: moveY } = this.state.distance
        const { x: previousX, y: previousY } = this.state.previous
        this.$container.scrollLeft = -moveX + previousX
        this.$container.scrollTop = -moveY + previousY
    }

    doAnimate(): void {
        if (!this.state.isRunning) return
        if (!this.state.mouse.isMoving) {
            this.state.isRunning = false
        }

        this.adaptContentPosition()
        this.rafID = window.requestAnimationFrame(this.doAnimate)
    }

    startAnimationLoop(): void {
        this.state.isRunning = true
        window.cancelAnimationFrame(this.rafID)
        this.rafID = window.requestAnimationFrame(this.doAnimate)
    }
}

export default DragScroll
