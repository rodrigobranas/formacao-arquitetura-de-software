import Observable from "../infra/handler/Observable.ts";
import type DomainEvent from "./DomainEvent.ts";
import OrderFilled from "./OrderFilled.ts";
import OrderPlaced from "./OrderPlaced.ts";
import UUID from "./UUID.ts";

export default class Order extends Observable {
    private orderId: UUID;
    private accountId: UUID;

    constructor (orderId: string, accountId: string, readonly marketId: string, readonly side: string, readonly quantity: number, readonly price: number, public fillQuantity: number, public fillPrice: number, public status: string, readonly timestamp: Date, private events: DomainEvent[] = []) {
        super();
        this.orderId = new UUID(orderId);
        this.accountId = new UUID(accountId);
    }

    static create (accountId: string, marketId: string, side: string, quantity: number, price: number) {
        const orderId = UUID.create().getValue();
        const status = "open";
        const timestamp = new Date();
        const fillQuantity = 0;
        const fillPrice = 0;
        const events = [
            new OrderPlaced(orderId, marketId)
        ]
        return new Order(orderId, accountId, marketId, side, quantity, price, fillQuantity, fillPrice, status, timestamp, events);
    }

    async fill (quantity: number, price: number) {
        const actualAmount = this.fillQuantity * this.fillPrice;
        const newAmount = quantity * price;
        this.fillQuantity += quantity;
        this.fillPrice = (actualAmount + newAmount)/this.fillQuantity;
        if (this.getAvailableQuantity() === 0) {
            this.status = "closed";
        }
        await this.notifyAll(new OrderFilled(this.getOrderId(), quantity, price));
    }

    getAvailableQuantity () {
        return this.quantity - this.fillQuantity;
    }

    getOrderId () {
        return this.orderId.getValue();
    }

    getAccountId () {
        return this.accountId.getValue();
    }

    getEvents () {
        return this.events;
    }

}
