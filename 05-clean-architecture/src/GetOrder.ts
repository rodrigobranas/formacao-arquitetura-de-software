import type OrderRepository from "./OrderRepository.ts";
import type UseCase from "./UseCase.ts";

export default class GetOrder implements UseCase {

    constructor (readonly orderRepository: OrderRepository) {
    }

    async execute (orderId: string): Promise<Output> {
        const order = await this.orderRepository.getById(orderId);
        return {
            orderId: order.orderId,
            accountId: order.accountId,
            marketId: order.marketId,
            side: order.side,
            quantity: order.quantity,
            price: order.price,
            status: order.status,
            fillQuantity: order.fillQuantity,
            fillPrice: order.fillPrice,
            timestamp: order.timestamp
        };
    }
}

type Output = {
    orderId: string,
    accountId: string,
    marketId: string,
    side: string,
    quantity: number,
    price: number,
    status: string,
    fillQuantity: number,
    fillPrice: number,
    timestamp: Date
}
