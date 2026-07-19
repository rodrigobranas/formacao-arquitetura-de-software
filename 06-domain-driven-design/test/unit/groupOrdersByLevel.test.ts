import { test, expect } from "vitest";
import Order from "../../src/domain/Order.ts";
import UUID from "../../src/domain/UUID.ts";
import groupOrdersByLevel from "../../src/domain/groupOrdersByLevel.ts";

test("Deve agrupar as ordens por precisão 1", async () => {
    const marketId = "BTC-USD";
    const accountId = UUID.create().getValue();
    const orders = [
        Order.create(accountId, marketId, "buy", 1, 60000),
        Order.create(accountId, marketId, "buy", 1, 60000),
        Order.create(accountId, marketId, "buy", 1, 60000),
        Order.create(accountId, marketId, "buy", 1, 60000)
    ];
    const groupedOrdersByLevel = groupOrdersByLevel(orders, 1);
    expect(groupedOrdersByLevel.buys).toHaveLength(1);
    expect(groupedOrdersByLevel.buys[0]!.price).toBe(60000);
    expect(groupedOrdersByLevel.buys[0]!.quantity).toBe(4);
});

test("Deve agrupar as ordens por precisão 100", async () => {
    const marketId = "BTC-USD";
    const accountId = UUID.create().getValue();
    const orders = [
        Order.create(accountId, marketId, "buy", 1, 60010),
        Order.create(accountId, marketId, "buy", 1, 60020),
        Order.create(accountId, marketId, "buy", 1, 60030),
        Order.create(accountId, marketId, "buy", 1, 60040)
    ];
    const groupedOrdersByLevel = groupOrdersByLevel(orders, 100);
    expect(groupedOrdersByLevel.buys).toHaveLength(1);
    expect(groupedOrdersByLevel.buys[0]!.price).toBe(60000);
    expect(groupedOrdersByLevel.buys[0]!.quantity).toBe(4);
});

test("Deve agrupar as ordens por precisão 1000", async () => {
    const marketId = "BTC-USD";
    const accountId = UUID.create().getValue();
    const orders = [
        Order.create(accountId, marketId, "buy", 1, 60210),
        Order.create(accountId, marketId, "buy", 1, 60320),
        Order.create(accountId, marketId, "buy", 1, 60430),
        Order.create(accountId, marketId, "buy", 1, 60540)
    ];
    const groupedOrdersByLevel = groupOrdersByLevel(orders, 1000);
    expect(groupedOrdersByLevel.buys).toHaveLength(1);
    expect(groupedOrdersByLevel.buys[0]!.price).toBe(60000);
    expect(groupedOrdersByLevel.buys[0]!.quantity).toBe(4);
});

test("Deve agrupar as ordens por precisão 10000", async () => {
    const marketId = "BTC-USD";
    const accountId = UUID.create().getValue();
    const orders = [
        Order.create(accountId, marketId, "buy", 1, 61210),
        Order.create(accountId, marketId, "buy", 1, 62320),
        Order.create(accountId, marketId, "buy", 1, 63430),
        Order.create(accountId, marketId, "buy", 1, 64540)
    ];
    const groupedOrdersByLevel = groupOrdersByLevel(orders, 10000);
    expect(groupedOrdersByLevel.buys).toHaveLength(1);
    expect(groupedOrdersByLevel.buys[0]!.price).toBe(60000);
    expect(groupedOrdersByLevel.buys[0]!.quantity).toBe(4);
});

test("Deve agrupar as ordens de compra e venda por precisão 10000", async () => {
    const marketId = "BTC-USD";
    const accountId = UUID.create().getValue();
    const orders = [
        Order.create(accountId, marketId, "buy", 1, 61210),
        Order.create(accountId, marketId, "buy", 1, 62320),
        Order.create(accountId, marketId, "buy", 1, 63430),
        Order.create(accountId, marketId, "buy", 1, 64540),
        Order.create(accountId, marketId, "sell", 1, 71210),
        Order.create(accountId, marketId, "sell", 1, 72320),
        Order.create(accountId, marketId, "sell", 1, 73430),
        Order.create(accountId, marketId, "sell", 1, 74540)
    ];
    const groupedOrdersByLevel = groupOrdersByLevel(orders, 10000);
    expect(groupedOrdersByLevel.buys).toHaveLength(1);
    expect(groupedOrdersByLevel.buys[0]!.price).toBe(60000);
    expect(groupedOrdersByLevel.buys[0]!.quantity).toBe(4);
    expect(groupedOrdersByLevel.sells).toHaveLength(1);
    expect(groupedOrdersByLevel.sells[0]!.price).toBe(70000);
    expect(groupedOrdersByLevel.sells[0]!.quantity).toBe(4);
});

test("Deve agrupar as ordens de compra e venda por precisão 1000 e verificar a ordem", async () => {
    const marketId = "BTC-USD";
    const accountId = UUID.create().getValue();
    const orders = [
        Order.create(accountId, marketId, "buy", 1, 61210),
        Order.create(accountId, marketId, "buy", 1, 62320),
        Order.create(accountId, marketId, "buy", 1, 63430),
        Order.create(accountId, marketId, "buy", 1, 64540),
        Order.create(accountId, marketId, "sell", 1, 71210),
        Order.create(accountId, marketId, "sell", 1, 72320),
        Order.create(accountId, marketId, "sell", 1, 73430),
        Order.create(accountId, marketId, "sell", 1, 74540)
    ];
    const groupedOrdersByLevel = groupOrdersByLevel(orders, 1000);
    expect(groupedOrdersByLevel.buys).toHaveLength(4);
    expect(groupedOrdersByLevel.buys[0]!.price).toBe(64000);
    expect(groupedOrdersByLevel.buys[0]!.quantity).toBe(1);
    expect(groupedOrdersByLevel.buys[1]!.price).toBe(63000);
    expect(groupedOrdersByLevel.buys[1]!.quantity).toBe(1);
    expect(groupedOrdersByLevel.buys[2]!.price).toBe(62000);
    expect(groupedOrdersByLevel.buys[2]!.quantity).toBe(1);
    expect(groupedOrdersByLevel.buys[3]!.price).toBe(61000);
    expect(groupedOrdersByLevel.buys[3]!.quantity).toBe(1);
    expect(groupedOrdersByLevel.sells).toHaveLength(4);
    expect(groupedOrdersByLevel.sells[0]!.price).toBe(71000);
    expect(groupedOrdersByLevel.sells[0]!.quantity).toBe(1);
    expect(groupedOrdersByLevel.sells[1]!.price).toBe(72000);
    expect(groupedOrdersByLevel.sells[1]!.quantity).toBe(1);
    expect(groupedOrdersByLevel.sells[2]!.price).toBe(73000);
    expect(groupedOrdersByLevel.sells[2]!.quantity).toBe(1);
    expect(groupedOrdersByLevel.sells[3]!.price).toBe(74000);
    expect(groupedOrdersByLevel.sells[3]!.quantity).toBe(1);
});
