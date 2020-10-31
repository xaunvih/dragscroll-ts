import './polyfill'
import './dragscroll.scss'
import { DragScrollOptions, DragScrollState } from './types'

class DragScroll {
    options: DragScrollOptions
    $container: HTMLElement
    $wrapper: HTMLDivElement = null
    rafID: number = null
    state: DragScrollState = {
        start: 0,
        previous: 0,
        distance: 0,
        limit: 0,
        isDown: false,
        isDragging: false,
        isRunning: false,
        move: 0,
        mouse: {
            clickEnabled: false,
            isMoving: false,
            movingTimeoutId: null,
        },
    }

    get MOUSE() {
        return {
            SCROLL: 1,
            RIGHT: 2,
        }
    }

    get MOUSE_EVENT_TYPE() {
        return {
            MOUSE_LEAVE: 'mouseleave',
        }
    }

    constructor(options: DragScrollOptions) {
        this.options = Object.assign(
            {
                speed: 1.5,
                gapSide: 30,
            },
            options,
        )

        this.$container = this.options.$container
        this.onClick = this.onClick.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDraging = this.onDraging.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)

        this.initDom()
        this.setLimit()
        this.bindEvents()
    }

    initDom() {
        this.$container.classList.add('drag-scroll')
        this.$wrapper = this.createEleFromHTML('<div class="drag-scroll-wrapper"></div>')

        Array.from(this.$container.children).forEach(($child: Node) => {
            this.$container.removeChild($child)
            this.$wrapper.appendChild($child)
        })

        this.$wrapper.style.paddingLeft = this.options.gapSide + 'px'
        this.$container.appendChild(this.$wrapper)
    }

    setLimit() {
        let widthTotal: number = this.options.gapSide + this.$wrapper.offsetWidth
        widthTotal = this.$container.offsetWidth > widthTotal ? this.$container.offsetWidth : widthTotal

        this.state.limit = widthTotal - this.$container.offsetWidth
    }

    bindEvents() {
        this.$wrapper.addEventListener('click', this.onClick, true)
        this.$wrapper.addEventListener('mousedown', this.onDragStart, true)
        this.$wrapper.addEventListener('mousemove', this.onDraging)
        this.$wrapper.addEventListener('mouseup', this.onDragEnd)
        this.$wrapper.addEventListener('mouseleave', this.onDragEnd)
        this.$wrapper.addEventListener('touchstart', this.onDragStart)
        this.$wrapper.addEventListener('touchmove', this.onDraging)
        this.$wrapper.addEventListener('touchend', this.onDragEnd)
    }

    onClick(evt: MouseEvent) {
        if (this.state.mouse.clickEnabled) return
        evt.preventDefault()
        evt.stopPropagation()
    }

    onDragStart(event: MouseEvent | TouchEvent) {
        const evt: Touch | MouseEvent = event instanceof TouchEvent ? event.touches[0] : event

        if (evt instanceof MouseEvent) {
            if (evt.button === this.MOUSE.RIGHT || evt.button === this.MOUSE.SCROLL) {
                return
            }

            evt.preventDefault()
            evt.stopPropagation()
        }

        const { mouse: mouseState } = this.state
        mouseState.clickEnabled = false
        mouseState.isMoving = false
        mouseState.movingTimeoutId = null

        this.state.isDown = true
        this.state.start = evt.clientX
        this.state.previous = this.getValueInRange()
    }

    onDragEnd(evt: MouseEvent | TouchEvent) {
        this.state.isDown = false

        if (evt.type === this.MOUSE_EVENT_TYPE.MOUSE_LEAVE) return
        if (!this.state.mouse.isMoving) {
            this.state.mouse.clickEnabled = true
        }

        this.state.mouse.isMoving = false
    }

    onDraging(event: MouseEvent | TouchEvent) {
        if (!this.state.isDown) return

        const evt: Touch | MouseEvent = event instanceof TouchEvent ? event.touches[0] : event
        const clientX = evt.clientX

        if (!this.state.mouse.movingTimeoutId) {
            this.state.mouse.movingTimeoutId = setTimeout(() => {
                this.state.mouse.isMoving = true
            }, 70)
        }

        this.state.distance = (clientX - this.state.start) * this.options.speed
        this.state.move = this.getValueInRange()
        this.startAnimationLoop()
    }

    adaptContentPosition() {
        this.$wrapper.style.transform = `translate3d(${this.state.move}px, 0, 0)`
    }

    getValueInRange() {
        let valueInRange = this.state.previous + this.state.distance
        if (valueInRange >= 0) {
            valueInRange = 0
        }

        if (valueInRange <= -this.state.limit) {
            valueInRange = -this.state.limit
        }

        return valueInRange
    }

    animate() {
        if (!this.state.isRunning) return
        if (!this.state.mouse.isMoving) {
            this.state.isRunning = false
        }

        this.adaptContentPosition()
        this.rafID = window.requestAnimationFrame(() => this.animate())
    }

    startAnimationLoop() {
        this.state.isRunning = true

        window.cancelAnimationFrame(this.rafID)
        this.rafID = window.requestAnimationFrame(() => this.animate())
    }

    createEleFromHTML(html: string) {
        let $el: HTMLDivElement = document.createElement('div')
        $el.innerHTML = html
        return <HTMLDivElement>$el.firstChild
    }
}

export default DragScroll
