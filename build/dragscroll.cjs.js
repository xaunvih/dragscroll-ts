/* 
    Copyright (c) 2020 XuanVinh
    name: @springjs/dragscroll
    license: MIT
    author: vinhmai <vinhmai079@gmail.com>
    repository: git@github.com:xaunvih/dragscroll.git
    version: 1.0.0 */
'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

window.requestAnimationFrame =
    window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 16);
        };

function mitt(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i&&i.push(e)||n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&i.splice(i.indexOf(e)>>>0,1);},emit:function(t,e){(n.get(t)||[]).slice().map(function(n){n(e);}),(n.get("*")||[]).slice().map(function(n){n(t,e);});}}}

var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.emitter = mitt();
    }
    EventEmitter.prototype.on = function (eventName, handler) {
        this.emitter.on(eventName, handler);
    };
    EventEmitter.prototype.off = function (eventName, handler) {
        this.emitter.off(eventName, handler);
    };
    EventEmitter.prototype.trigger = function (eventName, data) {
        this.emitter.emit(eventName, data);
    };
    return EventEmitter;
}());

function hasTextSelectFromPoint($ele, x, y) {
    var nodes = $ele.childNodes;
    var range = document.createRange();
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.nodeType !== 3) {
            continue;
        }
        range.selectNodeContents(node);
        var rect = range.getBoundingClientRect();
        if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) {
            return true;
        }
    }
    return false;
}

var DragScroll = /** @class */ (function (_super) {
    __extends(DragScroll, _super);
    function DragScroll(options) {
        var _this = _super.call(this) || this;
        _this.options = Object.assign({
            friction: 0.95,
            axis: 'x',
            allowInputFocus: true,
            allowSelectText: true,
        }, options);
        var initialCoordinate = {
            x: 0,
            y: 0,
        };
        _this.state = {
            startPosition: __assign({}, initialCoordinate),
            previousPosition: __assign({}, initialCoordinate),
            position: __assign({}, initialCoordinate),
            dragPosition: __assign({}, initialCoordinate),
            velocity: __assign({}, initialCoordinate),
            dragOffset: __assign({}, initialCoordinate),
            targetPosition: __assign({}, initialCoordinate),
            isRunning: false,
            isDragging: false,
            isScrollToRunning: false,
        };
        _this.$container = _this.options.$container;
        _this.$content = _this.options.$content;
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDraging = _this.onDraging.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.animate = _this.animate.bind(_this);
        _this.bindEvents();
        return _this;
    }
    DragScroll.prototype.bindEvents = function () {
        // Mouse events
        this.$content.addEventListener('click', this.onClick);
        this.$content.addEventListener('mousedown', this.onDragStart);
        window.addEventListener('mousemove', this.onDraging);
        window.addEventListener('mouseup', this.onDragEnd);
        // Touch events
        this.$content.addEventListener('touchstart', this.onDragStart);
        window.addEventListener('touchmove', this.onDraging);
        window.addEventListener('touchend', this.onDragEnd);
    };
    DragScroll.prototype.destroy = function () {
        // Mouse events
        this.$content.removeEventListener('click', this.onClick);
        this.$content.removeEventListener('mousedown', this.onDragStart);
        window.removeEventListener('mousemove', this.onDraging);
        window.removeEventListener('mouseup', this.onDragEnd);
        // Touch events
        this.$content.removeEventListener('touchstart', this.onDragStart);
        window.removeEventListener('touchmove', this.onDraging);
        window.removeEventListener('touchend', this.onDragEnd);
    };
    DragScroll.prototype.update = function () {
        var _a = this.state, isDragging = _a.isDragging, isScrollToRunning = _a.isScrollToRunning;
        this.applyDragForce();
        if (!isDragging) {
            this.applyAllBoundForce();
        }
        if (isScrollToRunning) {
            this.applyTargetForce();
        }
        var _b = this.state, position = _b.position, velocity = _b.velocity;
        var _c = this.options, friction = _c.friction, axis = _c.axis;
        velocity.x *= friction;
        velocity.y *= friction;
        if (axis !== 'y') {
            position.x += velocity.x;
        }
        if (axis !== 'x') {
            position.y += velocity.y;
        }
    };
    DragScroll.prototype.applyForce = function (force) {
        var velocity = this.state.velocity;
        velocity.x += force.x;
        velocity.y += force.y;
    };
    DragScroll.prototype.applyTargetForce = function () {
        var _a = this.state, position = _a.position, velocity = _a.velocity, targetPosition = _a.targetPosition;
        this.applyForce({
            x: (targetPosition.x - position.x) * 0.08 - velocity.x,
            y: (targetPosition.y - position.y) * 0.08 - velocity.y,
        });
    };
    DragScroll.prototype.applyDragForce = function () {
        if (!this.state.isDragging)
            return;
        // change the position to drag position by applying force to velocity
        var _a = this.state, position = _a.position, dragPosition = _a.dragPosition, velocity = _a.velocity;
        var dragForce = {
            x: dragPosition.x - position.x - velocity.x,
            y: dragPosition.y - position.y - velocity.y,
        };
        this.applyForce(dragForce);
    };
    DragScroll.prototype.applyAllBoundForce = function () {
        var _this = this;
        [
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
        ].forEach(function (edge) { return _this.applyBoundForce(edge); });
    };
    DragScroll.prototype.applyBoundForce = function (_a) {
        var _b;
        var bound = _a.bound, _c = _a.isForward, isForward = _c === void 0 ? false : _c, axis = _a.axis;
        var friction = this.options.friction;
        var _d = this.state, currentVelocity = _d.velocity, currentPosition = _d.position;
        var position = currentPosition[axis];
        var velocity = currentVelocity[axis];
        var isInside = isForward ? position < bound : position > bound;
        if (isInside) {
            return;
        }
        // bouncing past bound
        var distance = bound - position;
        var force = distance * 0.1;
        var restPosition = position + ((velocity + force) * friction) / (1 - friction);
        var isRestOutside = isForward ? restPosition > bound : restPosition < bound;
        if (!isRestOutside) {
            // bounce back
            force = distance * 0.1 - velocity;
        }
        this.applyForce((_b = { x: 0, y: 0 }, _b[axis] = force, _b));
    };
    DragScroll.prototype.onClick = function (evt) {
        var dragOffset = this.state.dragOffset;
        var clickThreshol = 5;
        // detect a clicking or dragging by measuring the distance
        if (Math.abs(dragOffset.x) > clickThreshol || Math.abs(dragOffset.y) > clickThreshol) {
            evt.preventDefault();
            evt.stopPropagation();
        }
    };
    DragScroll.prototype.onDragStart = function (evt) {
        var $ele = evt.target;
        // allow inputs can be focused by clicking
        var formNodes = ['input', 'textarea', 'button', 'select', 'label'];
        if (this.options.allowInputFocus && formNodes.indexOf($ele.nodeName.toLowerCase()) > -1) {
            return;
        }
        var isTouchEvent = evt instanceof TouchEvent;
        var _a = isTouchEvent ? evt.targetTouches[0] : evt, clientX = _a.clientX, clientY = _a.clientY;
        // case select text content
        if (this.options.allowSelectText && hasTextSelectFromPoint($ele, clientX, clientY))
            return;
        evt.preventDefault();
        evt.stopPropagation();
        // trigger drag start event
        this.trigger('dragstart', evt);
        this.state.isDragging = true;
        this.state.startPosition = {
            x: clientX,
            y: clientY,
        };
        // keep previous position before starting drag
        this.state.previousPosition = __assign({}, this.state.position);
        this.setDragPosition(this.state.startPosition);
        this.startAnimation();
    };
    DragScroll.prototype.onDraging = function (evt) {
        if (!this.state.isDragging)
            return;
        var isTouchEvent = evt instanceof TouchEvent;
        var _a = isTouchEvent ? evt.targetTouches[0] : evt, clientX = _a.clientX, clientY = _a.clientY;
        this.setDragPosition({
            x: clientX,
            y: clientY,
        });
        // trigger dragging event
        this.trigger('dragging', evt);
    };
    DragScroll.prototype.onDragEnd = function (evt) {
        if (this.state.isDragging) {
            // trigger drag end event
            this.trigger('dragend', evt);
        }
        this.state.isDragging = false;
    };
    DragScroll.prototype.setDragPosition = function (_a) {
        var x = _a.x, y = _a.y;
        var _b = this.state, startPosition = _b.startPosition, dragPosition = _b.dragPosition, previousPosition = _b.previousPosition, dragOffset = _b.dragOffset;
        dragOffset.x = x - startPosition.x;
        dragOffset.y = y - startPosition.y;
        dragPosition.x = previousPosition.x + dragOffset.x;
        dragPosition.y = previousPosition.y + dragOffset.y;
    };
    DragScroll.prototype.setInputCanBeFocused = function (focused) {
        if (focused === void 0) { focused = false; }
        this.options.allowInputFocus = focused;
    };
    DragScroll.prototype.scrollTo = function (targetPosition) {
        var position = __assign({ x: 0, y: 0 }, targetPosition);
        this.state.isScrollToRunning = true;
        this.state.targetPosition = position;
        this.startAnimation();
    };
    DragScroll.prototype.adaptContentPosition = function () {
        var position = this.state.position;
        this.$content.style.transform = "translate(" + position.x + "px," + position.y + "px)";
    };
    DragScroll.prototype.isMoving = function () {
        var _a = this.state, isDragging = _a.isDragging, velocity = _a.velocity;
        return isDragging || Math.abs(velocity.x) >= 0.01 || Math.abs(velocity.y) >= 0.01;
    };
    DragScroll.prototype.animate = function () {
        if (!this.state.isRunning)
            return;
        this.update();
        if (!this.isMoving()) {
            this.state.isRunning = false;
            this.state.isScrollToRunning = false;
        }
        this.adaptContentPosition();
        this.rafID = window.requestAnimationFrame(this.animate);
    };
    DragScroll.prototype.startAnimation = function () {
        this.state.isRunning = true;
        window.cancelAnimationFrame(this.rafID);
        this.rafID = window.requestAnimationFrame(this.animate);
    };
    return DragScroll;
}(EventEmitter));

module.exports = DragScroll;
