import type DomainEvent from "../../domain/DomainEvent.ts";

export default class Mediator {
    handlers: { event: string, callback: Function }[] = [];

    register (event: string, callback: Function) {
        this.handlers.push({ event, callback });
    }

    async notifyAll (event: DomainEvent) {
        for (const handler of this.handlers) {
            if (handler.event === event.eventName) {
                await handler.callback(event);
            }
        }
    }

}
