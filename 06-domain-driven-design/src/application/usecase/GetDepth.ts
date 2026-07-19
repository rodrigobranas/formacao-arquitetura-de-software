import groupOrdersByLevel from "../../domain/groupOrdersByLevel.ts";
import type OrderRepository from "../../infra/repository/OrderRepository.ts";

export default class GetDepth {

    constructor (readonly orderRepository: OrderRepository) {
    }

    async execute (marketId: string, precision: number = 1): Promise<Output> {
        const orders = await this.orderRepository.listByMarketIdAndStatus(marketId, "open");
        const groupedOrdersByLevel = groupOrdersByLevel(orders, precision);
        const output = {
            marketId,
            buys: groupedOrdersByLevel.buys,
            sells: groupedOrdersByLevel.sells
        }
        return output;
    }
}

type Output = {
    marketId: string,
    buys: { price: number, quantity: number }[],
    sells: { price: number, quantity: number }[]
}