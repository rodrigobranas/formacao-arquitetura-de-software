import Order from "./Order.ts";
import type OrderRepository from "./OrderRepository.ts";
import type UseCase from "./UseCase.ts";

export default class ExecuteOrder implements UseCase {

    constructor (readonly orderRepository: OrderRepository) {
    }

    async execute (marketId: string): Promise<void> {
        while (true) {
            const orders = await this.orderRepository.listByMarketIdAndStatus(marketId, "open");
            const [highestBuy] = orders.filter((order: Order) => order.side === "buy").sort((a, b) => b.price - a.price);
            const [lowestSell] = orders.filter((order: Order) => order.side === "sell").sort((a, b) => a.price - b.price);
            if (!highestBuy || !lowestSell || highestBuy.price < lowestSell.price) break;
            const quantity = Math.min(highestBuy.quantity, lowestSell.quantity);
            const price = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
            highestBuy.fill(quantity, price);
            lowestSell.fill(quantity, price);
            await this.orderRepository.update(highestBuy);
            await this.orderRepository.update(lowestSell);
        }
    }
}
