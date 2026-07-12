import Trade from "../../domain/Trade.ts";
import type DatabaseConnection from "../database/DatabaseConnection.ts";

export default interface TradeRepository {
    save (trade: Trade): Promise<void>;
    getById (tradeId: string): Promise<Trade>;
    getByBuyOrderIdAndSellOrderId (buyOrderId: string, sellOrderId: string): Promise<Trade>;
}

export class TradeRepositoryDatabase implements TradeRepository {
    
    constructor (readonly databaseConnection: DatabaseConnection) {
    }

    async save(trade: Trade): Promise<void> {
        await this.databaseConnection.query("insert into app.trade (trade_id, market_id, buy_order_id, sell_order_id, side, quantity, price, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8)", [trade.tradeId, trade.marketId, trade.buyOrderId, trade.sellOrderId, trade.side, trade.quantity, trade.price, trade.timestamp]);
    }

    async getById(tradeId: string): Promise<Trade> {
        const [tradeData] = await this.databaseConnection.query("select * from app.trade where trade_id = $1", [tradeId]);
        if (!tradeData) throw new Error("Trade not found");
        const trade = new Trade(tradeData.trade_id, tradeData.market_id, tradeData.buy_order_id, tradeData.sell_order_id, tradeData.side, parseFloat(tradeData.quantity), parseFloat(tradeData.price), tradeData.timestamp);
        return trade;
    }

    async getByBuyOrderIdAndSellOrderId(buyOrderId: string, sellOrderId: string): Promise<Trade> {
        const [tradeData] = await this.databaseConnection.query("select * from app.trade where buy_order_id = $1 and sell_order_id = $2", [buyOrderId, sellOrderId]);
        if (!tradeData) throw new Error("Trade not found");
        const trade = new Trade(tradeData.trade_id, tradeData.market_id, tradeData.buy_order_id, tradeData.sell_order_id, tradeData.side, parseFloat(tradeData.quantity), parseFloat(tradeData.price), tradeData.timestamp);
        return trade;
    }

}