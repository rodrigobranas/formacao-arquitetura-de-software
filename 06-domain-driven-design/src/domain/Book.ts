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

    insert (order: Order) {
        order.register("orderFilled", (orderFilled: OrderFilled) => {
            this.notifyAll(orderFilled);
        });
        if (order.side === "buy") {
            this.buys.push(order);
            this.buys.sort((a, b) => b.price - a.price);
        }
        if (order.side === "sell") {
            this.sells.push(order);
            this.sells.sort((a, b) => a.price - b.price);
        }
        this.execute();
    }

    execute () {
        while (true) {
            const [highestBuy] = this.buys;
            const [lowestSell] = this.sells;
            if (!highestBuy || !lowestSell || highestBuy.price < lowestSell.price) break;
            const quantity = Math.min(highestBuy.getAvailableQuantity(), lowestSell.getAvailableQuantity());
            const price = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
            const side = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? "buy" : "sell";
            highestBuy.fill(quantity, price);
            lowestSell.fill(quantity, price);
            if (highestBuy.status === "closed") this.buys.splice(this.buys.indexOf(highestBuy), 1);
            if (lowestSell.status === "closed") this.sells.splice(this.buys.indexOf(lowestSell), 1);
            this.notifyAll(new TradeCreated(highestBuy.getOrderId(), lowestSell.getOrderId(), side, quantity, price));
        }
    }
}