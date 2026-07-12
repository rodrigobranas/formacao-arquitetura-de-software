import { test, expect, beforeEach, afterEach } from "vitest";
import Order from "../../src/domain/Order.ts";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import type OrderRepository from "../../src/infra/repository/OrderRepository.ts";
import { OrderRepositoryDatabase } from "../../src/infra/repository/OrderRepository.ts";
import UUID from "../../src/domain/UUID.ts";

let databaseConnection: DatabaseConnection;
let orderRepository: OrderRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    orderRepository = new OrderRepositoryDatabase(databaseConnection);
});

test("Deve persistir uma ordem", async () => {
    const accountId = UUID.create().getValue();
    const order = Order.create(accountId, "BTC-USD", "buy", 1, 60000);
    await orderRepository.save(order);
    const savedOrder = await orderRepository.getById(order.getOrderId());
    expect(savedOrder.getOrderId()).toBe(order.getOrderId());
    expect(savedOrder.getAccountId()).toBe(order.getAccountId());
    expect(savedOrder.marketId).toBe(order.marketId);
    expect(savedOrder.side).toBe(order.side);
    expect(savedOrder.quantity).toBe(order.quantity);
    expect(savedOrder.price).toBe(order.price);
    expect(savedOrder.status).toBe(order.status);
    expect(savedOrder.fillQuantity).toBe(order.fillQuantity);
    expect(savedOrder.fillPrice).toBe(order.fillPrice);
});

test("Deve listar orders por marketId e status", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const accountId = UUID.create().getValue();
    const orderBuy = Order.create(accountId, marketId, "buy", 1, 60000);
    await orderRepository.save(orderBuy);
    const orderSell = Order.create(accountId, marketId, "sell", 1, 60000);
    await orderRepository.save(orderSell);
    const orders = await orderRepository.listByMarketIdAndStatus(marketId, "open");
    expect(orders).toHaveLength(2);
});

afterEach(async () => {
    await databaseConnection.close();
});
