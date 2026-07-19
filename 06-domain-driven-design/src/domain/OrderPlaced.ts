import type DomainEvent from "./DomainEvent.ts";

export default class OrderPlaced implements DomainEvent {
    eventName = "orderPlaced";

    constructor (readonly orderId: string, readonly marketId: string) {
    }

}
