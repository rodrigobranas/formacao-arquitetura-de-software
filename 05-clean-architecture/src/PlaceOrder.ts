import type AccountRepository from "./AccountRepository.ts";
import Order from "./Order.ts";
import type OrderRepository from "./OrderRepository.ts";
import type UseCase from "./UseCase.ts";

export default class PlaceOrder implements UseCase {

    constructor (readonly accountRepository: AccountRepository, readonly orderRepository: OrderRepository) {
    }

    async execute (input: Input): Promise<Output> {
        const account = await this.accountRepository.getById(input.accountId);
        const order = Order.create(input.accountId, input.marketId, input.side, input.quantity, input.price);
        await this.orderRepository.save(order);
        // execute order
        while (true) {
            const orders = await this.orderRepository.listByMarketIdAndStatus(input.marketId, "open");
            const [highestBuy] = orders.filter((order: Order) => order.side === "buy").sort((a, b) => b.price - a.price);
            const [lowestSell] = orders.filter((order: Order) => order.side === "sell").sort((a, b) => a.price - b.price);
            if (!highestBuy || !lowestSell || highestBuy.price < lowestSell.price) break;
            console.log("match");
            const quantity = Math.min(highestBuy.quantity, lowestSell.quantity);
            const price = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
            highestBuy.fill(quantity, price);
            lowestSell.fill(quantity, price);
            await this.orderRepository.update(highestBuy);
            await this.orderRepository.update(lowestSell);
        }
        //
        return {
            orderId: order.orderId
        }
    }
}

type Input = {
    accountId: string,
    marketId: string,
    side: string,
    quantity: number,
    price: number
}

type Output = {
    orderId: string
}
