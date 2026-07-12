import type TradeRepository from "../../infra/repository/TradeRepository.ts";

export default class GetTrade {

    constructor (readonly tradeRepository: TradeRepository) {
    }

    async execute (input: Input): Promise<Output> {
        const trade = await this.tradeRepository.getByBuyOrderIdAndSellOrderId(input.buyOrderId, input.sellOrderId);
        return {
            tradeId: trade.tradeId,
            marketId: trade.marketId,
            buyOrderId: trade.buyOrderId,
            sellOrderId: trade.sellOrderId,
            side: trade.side,
            quantity: trade.quantity,
            price: trade.price,
            timestamp: trade.timestamp
        }
    }
}

type Input = {
    buyOrderId: string,
    sellOrderId: string
}

type Output = {
    tradeId: string,
    marketId: string,
    buyOrderId: string,
    sellOrderId: string,
    side: string,
    quantity: number,
    price: number,
    timestamp: Date
}
