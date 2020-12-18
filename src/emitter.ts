import mitt, { Emitter, Handler, EventType } from 'mitt'

class EventEmiter {
    emitter: Emitter

    constructor() {
        this.emitter = mitt()
    }

    on(eventName: EventType, handler: Handler): void {
        this.emitter.on(eventName, handler)
    }

    off(eventName: EventType, handler: Handler): void {
        this.emitter.off(eventName, handler)
    }

    trigger(eventName: EventType, handler: Handler): void {
        this.emitter.emit(eventName, handler)
    }
}

export default EventEmiter
