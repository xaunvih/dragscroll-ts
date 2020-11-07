'use strict';

window.requestAnimationFrame =
    window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 16);
        };

var MOUSE_TYPE = {
    LEFT: 0,
    SCROLL: 1,
    RIGHT: 2,
};
var MOUSE_EVENT_NAME = {
    MOUSE_LEAVE: 'mouseleave',
};
var DIRECTION = {
    ALL: 'ALL',
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
};
var SCROLL_MODE = {
    NATIVE: 'NATIVE',
    TRANSFORM: 'TRANSFORM',
};

var DragScroll = /** @class */ (function () {
    function DragScroll(options) {
        this.state = {
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
        };
        this.options = Object.assign({
            speed: 1.5,
            gapSide: 30,
            direction: DIRECTION.ALL,
            scrollMode: SCROLL_MODE.TRANSFORM,
        }, options);
        this.$container = this.options.$container;
        this.onClick = this.onClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDraging = this.onDraging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.initDom();
        this.setLimit();
        this.bindEvents();
    }
    Object.defineProperty(DragScroll, "DIRECTION", {
        get: function () {
            return DIRECTION;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragScroll, "SCROLL_MODE", {
        get: function () {
            return SCROLL_MODE;
        },
        enumerable: false,
        configurable: true
    });
    DragScroll.prototype.initDom = function () {
        var _this = this;
        this.$container.classList.add('drag-scroll');
        this.$wrapper = this.createEleFromHTML('<div class="drag-scroll-wrapper"></div>');
        Array.from(this.$container.children).forEach(function ($child) {
            _this.$container.removeChild($child);
            _this.$wrapper.appendChild($child);
        });
        this.$wrapper.style.paddingLeft = this.options.gapSide + 'px';
        this.$container.appendChild(this.$wrapper);
    };
    DragScroll.prototype.setLimit = function () {
        var widthTotal = this.options.gapSide + this.$wrapper.offsetWidth;
        widthTotal = this.$container.offsetWidth > widthTotal ? this.$container.offsetWidth : widthTotal;
        this.state.limit = widthTotal - this.$container.offsetWidth;
    };
    DragScroll.prototype.bindEvents = function () {
        this.$wrapper.addEventListener('click', this.onClick, true);
        this.$wrapper.addEventListener('mousedown', this.onDragStart, true);
        this.$wrapper.addEventListener('mousemove', this.onDraging);
        this.$wrapper.addEventListener('mouseup', this.onDragEnd);
        this.$wrapper.addEventListener('mouseleave', this.onDragEnd);
        this.$wrapper.addEventListener('touchstart', this.onDragStart);
        this.$wrapper.addEventListener('touchmove', this.onDraging);
        this.$wrapper.addEventListener('touchend', this.onDragEnd);
    };
    DragScroll.prototype.onClick = function (evt) {
        if (this.state.mouse.clickEnabled)
            return;
        evt.preventDefault();
        evt.stopPropagation();
    };
    DragScroll.prototype.onDragStart = function (event) {
        var evt = event instanceof TouchEvent ? event.touches[0] : event;
        if (evt instanceof MouseEvent) {
            if (evt.button === MOUSE_TYPE.RIGHT || evt.button === MOUSE_TYPE.SCROLL) {
                return;
            }
            evt.preventDefault();
            evt.stopPropagation();
        }
        var mouseState = this.state.mouse;
        mouseState.clickEnabled = false;
        mouseState.isMoving = false;
        mouseState.movingTimeoutId = null;
        this.state.isDown = true;
        this.state.start = evt.clientX;
        this.state.previous = this.getValueInRange();
    };
    DragScroll.prototype.onDragEnd = function (evt) {
        this.state.isDown = false;
        if (evt.type === MOUSE_EVENT_NAME.MOUSE_LEAVE)
            return;
        if (!this.state.mouse.isMoving) {
            this.state.mouse.clickEnabled = true;
        }
        this.state.mouse.isMoving = false;
    };
    DragScroll.prototype.onDraging = function (event) {
        var _this = this;
        if (!this.state.isDown)
            return;
        var evt = event instanceof TouchEvent ? event.touches[0] : event;
        var clientX = evt.clientX;
        if (!this.state.mouse.movingTimeoutId) {
            this.state.mouse.movingTimeoutId = setTimeout(function () {
                _this.state.mouse.isMoving = true;
            }, 70);
        }
        this.state.distance = (clientX - this.state.start) * this.options.speed;
        this.state.move = this.getValueInRange();
        this.startAnimationLoop();
    };
    DragScroll.prototype.adaptContentPosition = function () {
        this.$wrapper.style.transform = "translate3d(" + this.state.move + "px, 0, 0)";
    };
    DragScroll.prototype.getValueInRange = function () {
        var valueInRange = this.state.previous + this.state.distance;
        if (valueInRange >= 0) {
            valueInRange = 0;
        }
        if (valueInRange <= -this.state.limit) {
            valueInRange = -this.state.limit;
        }
        return valueInRange;
    };
    DragScroll.prototype.animate = function () {
        var _this = this;
        if (!this.state.isRunning)
            return;
        if (!this.state.mouse.isMoving) {
            this.state.isRunning = false;
        }
        this.adaptContentPosition();
        this.rafID = window.requestAnimationFrame(function () { return _this.animate(); });
    };
    DragScroll.prototype.startAnimationLoop = function () {
        var _this = this;
        this.state.isRunning = true;
        window.cancelAnimationFrame(this.rafID);
        this.rafID = window.requestAnimationFrame(function () { return _this.animate(); });
    };
    DragScroll.prototype.createEleFromHTML = function (html) {
        var $el = document.createElement('div');
        $el.innerHTML = html;
        return $el.firstChild;
    };
    return DragScroll;
}());

module.exports = DragScroll;
