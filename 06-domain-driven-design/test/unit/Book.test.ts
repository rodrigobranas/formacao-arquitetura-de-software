import { test, expect } from "vitest";
import Book from "../../src/domain/Book.ts";
import type OrderFilled from "../../src/domain/OrderFilled.ts";
import type TradeCreated from "../../src/domain/TradeCreated.ts";
import Order from "../../src/domain/Order.ts";
import UUID from "../../src/domain/UUID.ts";
import type DomainEvent from "../../src/domain/DomainEvent.ts";

test("Deve executar uma ordem de compra e de venda", async () => {
    const marketId = "BTC-USD";
    const accountId = UUID.create().getValue();
    const book = new Book(marketId);
    const events: DomainEvent[] = [];
    book.register("orderFilled", (orderFilled: OrderFilled) => {
        events.push(orderFilled);
    });
    book.register("tradeCreated", (tradeCreated: TradeCreated) => {
        events.push(tradeCreated);
    });
    await book.insert(Order.create(accountId, marketId, "buy", 1, 60000));
    await book.insert(Order.create(accountId, marketId, "sell", 1, 58000));
    expect(events).toHaveLength(3);
    const orderFilled1 = events[0] as OrderFilled;
    const orderFilled2 = events[1] as OrderFilled;
    const tradeCreated = events[2] as TradeCreated;
    expect(orderFilled1.eventName).toBe("orderFilled");
    expect(orderFilled1.fillQuantity).toBe(1);
    expect(orderFilled1.fillPrice).toBe(60000);
    expect(orderFilled2.eventName).toBe("orderFilled");
    expect(orderFilled2.fillQuantity).toBe(1);
    expect(orderFilled2.fillPrice).toBe(60000);
    expect(tradeCreated.eventName).toBe("tradeCreated");
    expect(tradeCreated.side).toBe("sell");
    expect(tradeCreated.quantity).toBe(1);
    expect(tradeCreated.price).toBe(60000);
});