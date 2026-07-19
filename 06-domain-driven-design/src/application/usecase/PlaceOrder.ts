import Order from "../../domain/Order.ts";
import OrderPlaced from "../../domain/OrderPlaced.ts";
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
        const domainEvents = order.getEvents();
        for (const domainEvent of domainEvents) {
            await this.mediator.notifyAll(domainEvent);
        }
        return {
            orderId: order.getOrderId()
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
