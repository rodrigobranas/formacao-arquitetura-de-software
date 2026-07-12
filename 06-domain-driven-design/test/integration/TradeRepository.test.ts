import { test, expect } from "vitest";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import crypto from "crypto";
import Trade from "../../src/domain/Trade.ts";
import { TradeRepositoryDatabase } from "../../src/infra/repository/TradeRepository.ts";

test("Deve persistir uma negociação", async () => {
    const databaseConnection = new PgPromiseAdapter();
    const tradeRepository = new TradeRepositoryDatabase(databaseConnection);
    const buyOrderId = crypto.randomUUID();
    const sellOrderId = crypto.randomUUID();
    const trade = Trade.create("BTC-USD", buyOrderId, sellOrderId, "buy", 1, 60000);
    await tradeRepository.save(trade);
    const savedTrade = await tradeRepository.getById(trade.tradeId);
    expect(savedTrade.tradeId).toBe(trade.tradeId);
    expect(savedTrade.buyOrderId).toBe(trade.buyOrderId);
    expect(savedTrade.sellOrderId).toBe(trade.sellOrderId);
    expect(savedTrade.side).toBe("buy");
    expect(savedTrade.quantity).toBe(trade.quantity);
    expect(savedTrade.price).toBe(trade.price);
    await databaseConnection.close();
});
