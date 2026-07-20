import Trade from "../../domain/Trade.ts";
import type TradeRepository from "../../infra/repository/TradeRepository.ts";

export default class CreateTrade {

    constructor (readonly tradeRepository: TradeRepository) {
    }

    async execute (input: Input): Promise<void> {
        const trade = Trade.create(input.marketId, input.buyOrderId, input.sellOrderId, input.side, input.quantity, input.price);
        await this.tradeRepository.save(trade);
    }
}

type Input = {
    marketId: string,
    buyOrderId: string,
    sellOrderId: string,
    side: string,
    quantity: number,
    price: number
}
