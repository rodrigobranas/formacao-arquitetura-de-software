import { test, expect } from "vitest";
import Order from "../../src/Order.ts";
import { OrderRepositoryDatabase } from "../../src/OrderRepository.ts";

test("Deve persistir uma ordem", async () => {
    const orderRepository = new OrderRepositoryDatabase();
    const accountId = crypto.randomUUID();
    const order = Order.create(accountId, "BTC-USD", "buy", 1, 60000);
    await orderRepository.save(order);
    const savedOrder = await orderRepository.getById(order.orderId);
    expect(savedOrder.orderId).toBe(order.orderId);
    expect(savedOrder.accountId).toBe(order.accountId);
    expect(savedOrder.marketId).toBe(order.marketId);
    expect(savedOrder.side).toBe(order.side);
    expect(savedOrder.quantity).toBe(order.quantity);
    expect(savedOrder.price).toBe(order.price);
    expect(savedOrder.status).toBe(order.status);
    expect(savedOrder.fillQuantity).toBe(order.fillQuantity);
    expect(savedOrder.fillPrice).toBe(order.fillPrice);
});
