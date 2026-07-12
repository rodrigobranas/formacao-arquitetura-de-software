import { test, expect } from "vitest";
import Trade from "../../src/domain/Trade.ts";

test("Deve criar uma negociação", () => {
    const buyOrderId = crypto.randomUUID();
    const sellOrderId = crypto.randomUUID();
    const trade = Trade.create("BTC-USD", buyOrderId, sellOrderId, "buy", 1, 60000);
    expect(trade).toBeDefined();
    expect(trade.marketId).toBe("BTC-USD");
    expect(trade.buyOrderId).toBe(buyOrderId);
    expect(trade.sellOrderId).toBe(sellOrderId);
    expect(trade.side).toBe("buy"),
    expect(trade.quantity).toBe(1);
    expect(trade.price).toBe(60000);
});
