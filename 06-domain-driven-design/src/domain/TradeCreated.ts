import type DomainEvent from "./DomainEvent.ts";

export default class TradeCreated implements DomainEvent {
    eventName = "tradeCreated";

    constructor (readonly marketId: string, readonly buyOrderId: string, readonly sellOrderId: string, readonly side: string, readonly quantity: number, readonly price: number) {
    }

}
