'use strict';

window.requestAnimationFrame =
    window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 16);
        };

var DragScroll = /** @class */ (function () {
    function DragScroll(options) {
        this.state = {
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
        };
        this.options = Object.assign({
            allowInputFocus: true,
            hideScroll: true,
            onDragStart: null,
            onDragging: null,
            onDragEnd: null,
        }, options);
        this.$container = this.options.$container;
        this.$content = this.options.$content;
        this.onClick = this.onClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDraging = this.onDraging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.doAnimate = this.doAnimate.bind(this);
        this.initDom();
        this.bindEvents();
    }
    Object.defineProperty(DragScroll, "DIRECTION", {
        get: function () {
            return {
                ALL: 'ALL',
                HORIZONTAL: 'HORIZONTAL',
                VERTICAL: 'VERTICAL',
            };
        },
        enumerable: false,
        configurable: true
    });
    DragScroll.prototype.initDom = function () {
        if (this.options.hideScroll) {
            this.$container.classList.add('drag-scroll');
        }
    };
    DragScroll.prototype.bindEvents = function () {
        this.$content.addEventListener('click', this.onClick, true);
        this.$content.addEventListener('mousedown', this.onDragStart, true);
        window.addEventListener('mousemove', this.onDraging);
        window.addEventListener('mouseup', this.onDragEnd);
    };
    DragScroll.prototype.onClick = function (evt) {
        if (this.state.mouse.clickEnabled)
            return;
        evt.preventDefault();
        evt.stopPropagation();
    };
    DragScroll.prototype.onDragStart = function (evt) {
        var mouseTypes = {
            SCROLL: 1,
            RIGHT: 2,
        };
        if (evt.button === mouseTypes.RIGHT || evt.button === mouseTypes.SCROLL) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        // focus on form input elements
        var formNodes = ['input', 'textarea', 'button', 'select', 'label'];
        if (this.options.allowInputFocus && formNodes.indexOf(evt.target.nodeName.toLowerCase()) > -1) {
            return;
        }
        var mouseState = this.state.mouse;
        mouseState.clickEnabled = false;
        mouseState.isMoving = false;
        mouseState.movingTimeoutId = null;
        this.state.isDragging = true;
        this.state.start = {
            x: evt.clientX,
            y: evt.clientY,
        };
        this.state.previous = {
            x: this.$container.scrollLeft,
            y: this.$container.scrollTop,
        };
    };
    DragScroll.prototype.onDraging = function (evt) {
        var _this = this;
        if (!this.state.isDragging)
            return;
        if (!this.state.mouse.movingTimeoutId) {
            this.state.mouse.movingTimeoutId = setTimeout(function () {
                _this.state.mouse.isMoving = true;
            }, 70);
        }
        var start = this.state.start;
        this.state.distance = {
            x: (evt.clientX - start.x) * 2,
            y: (evt.clientY - start.y) * 2,
        };
        this.startAnimationLoop();
    };
    DragScroll.prototype.onDragEnd = function () {
        this.state.isDragging = false;
        var mouse = this.state.mouse;
        if (!mouse.isMoving) {
            mouse.clickEnabled = true;
        }
        mouse.isMoving = false;
    };
    DragScroll.prototype.adaptContentPosition = function () {
        var _a = this.state.distance, moveX = _a.x, moveY = _a.y;
        var _b = this.state.previous, previousX = _b.x, previousY = _b.y;
        this.$container.scrollLeft = -moveX + previousX;
        this.$container.scrollTop = -moveY + previousY;
    };
    DragScroll.prototype.doAnimate = function () {
        if (!this.state.isRunning)
            return;
        if (!this.state.mouse.isMoving) {
            this.state.isRunning = false;
        }
        this.adaptContentPosition();
        this.rafID = window.requestAnimationFrame(this.doAnimate);
    };
    DragScroll.prototype.startAnimationLoop = function () {
        this.state.isRunning = true;
        window.cancelAnimationFrame(this.rafID);
        this.rafID = window.requestAnimationFrame(this.doAnimate);
    };
    return DragScroll;
}());

module.exports = DragScroll;
