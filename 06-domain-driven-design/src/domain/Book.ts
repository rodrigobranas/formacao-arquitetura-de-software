import Observable from "../infra/handler/Observable.ts";
import type Order from "./Order.ts";
import OrderFilled from "./OrderFilled.ts";
import TradeCreated from "./TradeCreated.ts";

export default class Book extends Observable {
    private buys: Order[] = [];
    private sells: Order[] = [];

    constructor (readonly marketId: string) {
        super();
    }

    async insert (order: Order) {
        order.register("orderFilled", async (orderFilled: OrderFilled) => {
            await this.notifyAll(orderFilled);
        });
        if (order.side === "buy") {
            this.buys.push(order);
            this.buys.sort((a, b) => b.price - a.price);
        }
        if (order.side === "sell") {
            this.sells.push(order);
            this.sells.sort((a, b) => a.price - b.price);
        }
        await this.execute();
    }

    async execute () {
        while (true) {
            const [highestBuy] = this.buys;
            const [lowestSell] = this.sells;
            if (!highestBuy || !lowestSell || highestBuy.price < lowestSell.price) break;
            const quantity = Math.min(highestBuy.getAvailableQuantity(), lowestSell.getAvailableQuantity());
            const price = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
            const side = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? "buy" : "sell";
            await highestBuy.fill(quantity, price);
            await lowestSell.fill(quantity, price);
            if (highestBuy.status === "closed") this.buys.splice(this.buys.indexOf(highestBuy), 1);
            if (lowestSell.status === "closed") this.sells.splice(this.sells.indexOf(lowestSell), 1);
            await this.notifyAll(new TradeCreated(this.marketId, highestBuy.getOrderId(), lowestSell.getOrderId(), side, quantity, price));
        }
    }
}