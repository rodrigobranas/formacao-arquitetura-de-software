import { test, expect } from "vitest";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import crypto from "crypto";
import Trade from "../../src/domain/Trade.ts";
import { TradeRepositoryDatabase } from "../../src/infra/repository/TradeRepository.ts";
import UUID from "../../src/domain/UUID.ts";

test("Deve persistir uma negociação", async () => {
    const databaseConnection = new PgPromiseAdapter();
    const tradeRepository = new TradeRepositoryDatabase(databaseConnection);
    const buyOrderId = UUID.create().getValue();
    const sellOrderId = UUID.create().getValue();
    const trade = Trade.create("BTC-USD", buyOrderId, sellOrderId, "buy", 1, 60000);
    await tradeRepository.save(trade);
    const savedTrade = await tradeRepository.getById(trade.getTradeId());
    expect(savedTrade.getTradeId()).toBe(trade.getTradeId());
    expect(savedTrade.getBuyOrderId()).toBe(trade.getBuyOrderId());
    expect(savedTrade.getSellOrderId()).toBe(trade.getSellOrderId());
    expect(savedTrade.side).toBe("buy");
    expect(savedTrade.quantity).toBe(trade.quantity);
    expect(savedTrade.price).toBe(trade.price);
    await databaseConnection.close();
});
