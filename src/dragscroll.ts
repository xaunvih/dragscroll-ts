import './polyfill'
import { DragScrollOptions, DragScrollState, ObjectType, Corrdinate } from './types'

class DragScroll {
    options: DragScrollOptions
    $container: HTMLElement
    $wrapper: HTMLDivElement
    rafID: number
    valueInRange: Corrdinate

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
        limit: {
            x: 0,
            y: 0,
        },
        move: {
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

    MOUSE_TYPE: ObjectType = {
        SCROLL: 1,
        RIGHT: 2,
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
                speed: 1.5,
                gapSide: 0,
                direction: DragScroll.DIRECTION.HORIZONTAL,
                allowInputFocus: true,
                onDragStart: null,
                onDragging: null,
                onDragEnd: null,
            },
            options,
        )

        this.$container = this.options.$container
        this.onClick = this.onClick.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDraging = this.onDraging.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.doAnimate = this.doAnimate.bind(this)

        this.initDom()
        this.setOrUpdateLimit()
        this.bindEvents()
    }

    initDom(): void {
        this.$container.classList.add('drag-scroll')
        this.$wrapper = this.createEleFromHTML('<div class="drag-scroll-wrapper"></div>')

        Array.from(this.$container.children).forEach(($child: Node) => {
            this.$container.removeChild($child)
            this.$wrapper.appendChild($child)
        })

        // set gap space on left & right
        const { style } = this.$wrapper
        style.paddingLeft = this.options.gapSide + 'px'
        this.$container.appendChild(this.$wrapper)
    }

    setOrUpdateLimit(): void {
        let widthTotal = this.options.gapSide + this.$wrapper.offsetWidth
        let heightTotal = this.$wrapper.offsetHeight
        widthTotal = this.$container.offsetWidth > widthTotal ? 0 : widthTotal - this.$container.offsetWidth
        heightTotal = this.$container.offsetHeight > heightTotal ? 0 : heightTotal - this.$container.offsetHeight

        this.state.limit = {
            x: widthTotal,
            y: heightTotal,
        }
    }

    bindEvents(): void {
        this.$wrapper.addEventListener('click', this.onClick, true)
        this.$wrapper.addEventListener('mousedown', this.onDragStart, true)
        this.$wrapper.addEventListener('touchstart', this.onDragStart)
        window.addEventListener('mousemove', this.onDraging)
        window.addEventListener('mouseup', this.onDragEnd)
        window.addEventListener('touchmove', this.onDraging)
        window.addEventListener('touchend', this.onDragEnd)
    }

    onClick(evt: MouseEvent): void {
        if (this.state.mouse.clickEnabled) return
        evt.preventDefault()
        evt.stopPropagation()
    }

    onDragStart(event: MouseEvent | TouchEvent): void {
        const evt: Touch | MouseEvent = event instanceof TouchEvent ? event.touches[0] : event

        if (evt instanceof MouseEvent) {
            if (evt.button === this.MOUSE_TYPE.RIGHT || evt.button === this.MOUSE_TYPE.SCROLL) {
                return
            }

            evt.preventDefault()
            evt.stopPropagation()
        }

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

        this.state.previous = this.getValueInRange()
    }

    onDragEnd(): void {
        this.state.isDragging = false
        if (!this.state.mouse.isMoving) {
            this.state.mouse.clickEnabled = true
        }

        this.state.mouse.isMoving = false
    }

    onDraging(event: MouseEvent | TouchEvent): void {
        if (!this.state.isDragging) return
        const evt: Touch | MouseEvent = event instanceof TouchEvent ? event.touches[0] : event

        if (!this.state.mouse.movingTimeoutId) {
            this.state.mouse.movingTimeoutId = setTimeout(() => {
                this.state.mouse.isMoving = true
            }, 70)
        }

        const { start } = this.state
        const { speed } = this.options

        this.state.distance = {
            x: (evt.clientX - start.x) * speed,
            y: (evt.clientY - start.y) * speed,
        }

        this.state.move = this.getValueInRange()
        this.startAnimationLoop()
    }

    adaptContentPosition(): void {
        const { x: moveX, y: moveY } = this.state.move
        this.$wrapper.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`
    }

    getValueInRange(): Corrdinate {
        const { previous, distance, limit } = this.state
        let valueInRangeX = previous.x + distance.x
        let valueInRangeY = previous.y + distance.y

        this.valueInRange = {
            x: valueInRangeX,
            y: valueInRangeY,
        }

        if (valueInRangeX >= 0) {
            valueInRangeX = 0
        }

        if (valueInRangeX <= -limit.x) {
            valueInRangeX = -limit.x
        }

        if (valueInRangeY >= 0) {
            valueInRangeY = 0
        }

        if (valueInRangeY <= -limit.y) {
            valueInRangeY = -limit.y
        }

        return {
            x: valueInRangeX,
            y: valueInRangeY,
        }
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

    createEleFromHTML(html: string): HTMLDivElement {
        let $el = document.createElement('div')
        $el.innerHTML = html
        return <HTMLDivElement>$el.firstChild
    }
}

export default DragScroll
