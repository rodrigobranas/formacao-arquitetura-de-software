import { test, expect } from "vitest";
import Trade from "../../src/domain/Trade.ts";
import UUID from "../../src/domain/UUID.ts";

test("Deve criar uma negociação", () => {
    const buyOrderId = UUID.create().getValue();
    const sellOrderId = UUID.create().getValue();
    const trade = Trade.create("BTC-USD", buyOrderId, sellOrderId, "buy", 1, 60000);
    expect(trade).toBeDefined();
    expect(trade.marketId).toBe("BTC-USD");
    expect(trade.getBuyOrderId()).toBe(buyOrderId);
    expect(trade.getSellOrderId()).toBe(sellOrderId);
    expect(trade.side).toBe("buy"),
    expect(trade.quantity).toBe(1);
    expect(trade.price).toBe(60000);
});
