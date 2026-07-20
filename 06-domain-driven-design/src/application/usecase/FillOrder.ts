import type OrderRepository from "../../infra/repository/OrderRepository.ts";

export default class FillOrder {

    constructor (readonly orderRepository: OrderRepository) {
    }

    async execute (input: Input): Promise<void> {
        const order = await this.orderRepository.getById(input.orderId);
        await order.fill(input.fillQuantity, input.fillPrice);
        await this.orderRepository.update(order);
    }
}

type Input = {
    orderId: string,
    fillQuantity: number,
    fillPrice: number
}