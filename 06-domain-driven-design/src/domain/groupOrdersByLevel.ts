import type Order from "./Order.ts";

export default function groupOrdersByLevel (orders: Order[], precision: number): Output {
    const index: Levels = {
        buy: {},
        sell: {}
    }
    for (const order of orders) {
        if (order.side !== "buy" && order.side !== "sell") continue;
        const price = Math.trunc(order.price/precision) * precision;
        const level = index[order.side][price] || { price, quantity: 0 };
        index[order.side][price] = level;
        level.quantity += order.getAvailableQuantity();
    }
    const output: Output = {
        buys: Object.values(index.buy).sort((a, b) => b.price - a.price),
        sells: Object.values(index.sell).sort((a, b) => a.price - b.price)
    }
    return output;
}

type Level = { price: number, quantity: number };

type Levels = {
    buy: { [price: number]: Level },
    sell: { [price: number]: Level}
}

type Output = {
    buys: { price: number, quantity: number }[],
    sells: { price: number, quantity: number }[]
}
