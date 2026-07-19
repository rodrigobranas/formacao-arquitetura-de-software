import { test, expect } from "vitest";
import Order from "../../src/domain/Order.ts";
import UUID from "../../src/domain/UUID.ts";
import type OrderPlaced from "../../src/domain/OrderPlaced.ts";

test("Deve criar uma ordem", () => {
    const accountId = UUID.create().getValue();
    const order = Order.create(accountId, "BTC-USD", "buy", 1, 60000);
    expect(order).toBeDefined();
    expect(order.marketId).toBe("BTC-USD");
    expect(order.side).toBe("buy");
    expect(order.quantity).toBe(1);
    expect(order.price).toBe(60000);
    expect(order.status).toBe("open");
    expect(order.fillQuantity).toBe(0);
    expect(order.fillPrice).toBe(0);
    expect(order.timestamp).toBeDefined();
    expect(order.getEvents()).toHaveLength(1);
    const events = order.getEvents() as OrderPlaced[];
    expect(events[0]?.eventName).toBe("orderPlaced");
    expect(events[0]?.orderId).toBe(order.getOrderId());
    expect(events[0]?.marketId).toBe(order.marketId);
});
