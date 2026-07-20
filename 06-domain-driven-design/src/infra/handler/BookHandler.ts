import type CreateTrade from "../../application/usecase/CreateTrade.ts";
import type FillOrder from "../../application/usecase/FillOrder.ts";
import type Book from "../../domain/Book.ts";
import type OrderFilled from "../../domain/OrderFilled.ts";
import Trade from "../../domain/Trade.ts";
import type TradeCreated from "../../domain/TradeCreated.ts";
import type OrderRepository from "../repository/OrderRepository.ts";
import type TradeRepository from "../repository/TradeRepository.ts";

export default class BookHandler {

    constructor (readonly book: Book, readonly fillOrder: FillOrder, readonly createTrade: CreateTrade) {
        book.register("orderFilled", async (orderFilled: OrderFilled) => {
            await fillOrder.execute(orderFilled);
        });
        book.register("tradeCreated", async (tradeCreated: TradeCreated) => {
            await createTrade.execute(tradeCreated);
        });
    }
}