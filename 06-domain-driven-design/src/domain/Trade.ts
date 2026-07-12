import UUID from "./UUID.ts";

export default class Trade {
    private tradeId: UUID;
    private buyOrderId: UUID;
    private sellOrderId: UUID;

    constructor (tradeId: string, readonly marketId: string, buyOrderId: string, sellOrderId: string, readonly side: string, readonly quantity: number, readonly price: number, readonly timestamp: Date) {
        this.tradeId = new UUID(tradeId);
        this.buyOrderId = new UUID(buyOrderId);
        this.sellOrderId = new UUID(sellOrderId);
    }

    static create (marketId: string, buyOrderId: string, sellOrderId: string, side: string, quantity: number, price: number) {
        const tradeId = UUID.create();
        const timestamp = new Date();
        return new Trade(tradeId.getValue(), marketId, buyOrderId, sellOrderId, side, quantity, price, timestamp);
    }

    getTradeId () {
        return this.tradeId.getValue();
    }

    getBuyOrderId () {
        return this.buyOrderId.getValue();
    }

    getSellOrderId () {
        return this.sellOrderId.getValue();
    }

}
