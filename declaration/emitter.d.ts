import { Emitter, Handler, EventType } from 'mitt';
declare class EventEmitter {
    emitter: Emitter;
    constructor();
    on(eventName: EventType, handler: Handler): void;
    off(eventName: EventType, handler: Handler): void;
    trigger(eventName: EventType, data: any): void;
}
export default EventEmitter;
