import crypto from "crypto";

export default class Trade {

    constructor (readonly tradeId: string, readonly marketId: string, readonly buyOrderId: string, readonly sellOrderId: string, readonly side: string, readonly quantity: number, readonly price: number, readonly timestamp: Date) {
    }

    static create (marketId: string, buyOrderId: string, sellOrderId: string, side: string, quantity: number, price: number) {
        const tradeId = crypto.randomUUID();
        const timestamp = new Date();
        return new Trade(tradeId, marketId, buyOrderId, sellOrderId, side, quantity, price, timestamp);
    }

}
