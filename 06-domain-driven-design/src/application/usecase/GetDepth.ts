import type Order from "../../domain/Order.ts";
import type OrderRepository from "../../infra/repository/OrderRepository.ts";

export default class GetDepth {

    constructor (readonly orderRepository: OrderRepository) {
    }

    async execute (marketId: string): Promise<Output> {
        const orders = await this.orderRepository.listByMarketIdAndStatus(marketId, "open");
        const buys = orders.filter((order: Order) => order.side === "buy").map((order: Order) => ({ price: order.price, quantity: order.quantity }));
        const sells = orders.filter((order: Order) => order.side === "sell").map((order: Order) => ({ price: order.price, quantity: order.quantity }));
        const output: Output = {
            buys,
            sells
        }
        return output;
    }
}

type Output = {
    buys: { price: number, quantity: number }[],
    sells: { price: number, quantity: number }[]
}