import Order from "../../domain/Order.ts";
import type Mediator from "../../infra/handler/Mediator.ts";
import type AccountRepository from "../../infra/repository/AccountRepository.ts";
import type OrderRepository from "../../infra/repository/OrderRepository.ts";
import type UseCase from "./UseCase.ts";

export default class PlaceOrder implements UseCase {

    constructor (readonly accountRepository: AccountRepository, readonly orderRepository: OrderRepository, readonly mediator: Mediator) {
    }

    async execute (input: Input): Promise<Output> {
        const account = await this.accountRepository.getById(input.accountId);
        const order = Order.create(input.accountId, input.marketId, input.side, input.quantity, input.price);
        await this.orderRepository.save(order);
        await this.mediator.notifyAll("orderPlaced", { orderId: order.orderId, marketId: order.marketId });
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
