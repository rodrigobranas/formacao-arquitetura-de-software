import type DomainEvent from "./DomainEvent.ts";

export default class OrderFilled implements DomainEvent {
    eventName = "orderFilled";

    constructor (readonly orderId: string, readonly fillQuantity: number, readonly fillPrice: number) {
    }

}
