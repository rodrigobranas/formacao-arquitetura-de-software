import UUID from "./UUID.ts";

export default class Order {
    private orderId: UUID;
    private accountId: UUID;

    constructor (orderId: string, accountId: string, readonly marketId: string, readonly side: string, readonly quantity: number, readonly price: number, public fillQuantity: number, public fillPrice: number, public status: string, readonly timestamp: Date) {
        this.orderId = new UUID(orderId);
        this.accountId = new UUID(accountId);
    }

    static create (accountId: string, marketId: string, side: string, quantity: number, price: number) {
        const orderId = UUID.create();
        const status = "open";
        const timestamp = new Date();
        const fillQuantity = 0;
        const fillPrice = 0;
        return new Order(orderId.getValue(), accountId, marketId, side, quantity, price, fillQuantity, fillPrice, status, timestamp);
    }

    fill (quantity: number, price: number) {
        const actualAmount = this.fillQuantity * this.fillPrice;
        const newAmount = quantity * price;
        this.fillQuantity += quantity;
        this.fillPrice = (actualAmount + newAmount)/this.fillQuantity;
        if (this.getAvailableQuantity() === 0) {
            this.status = "closed";
        }
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

}
