import type DatabaseConnection from "./DatabaseConnection.ts";
import Order from "./Order.ts";

export default interface OrderRepository {
    save (order: Order): Promise<void>;
    update (order: Order): Promise<void>;
    getById (orderId: string): Promise<Order>;
    listByMarketIdAndStatus (marketId: string, status: string): Promise<Order[]>;
}

export class OrderRepositoryDatabase implements OrderRepository {

    constructor (readonly databaseConnection: DatabaseConnection) {
    }

    async save (order: Order): Promise<void> {
        await this.databaseConnection.query("insert into app.order (order_id, account_id, market_id, side, quantity, price, status, fill_quantity, fill_price, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [order.orderId, order.accountId, order.marketId, order.side, order.quantity, order.price, order.status, order.fillQuantity, order.fillPrice, order.timestamp]);
    }

    async update (order: Order): Promise<void> {
        await this.databaseConnection.query("update app.order set status = $1, fill_quantity = $2, fill_price = $3 where order_id = $4", [order.status, order.fillQuantity, order.fillPrice, order.orderId]);
    }

    async getById (orderId: string): Promise<Order> {
        const [orderData] = await this.databaseConnection.query("select * from app.order where order_id = $1", [orderId]);
        const order = new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price), orderData.status, orderData.timestamp);
        return order;
    }

    async listByMarketIdAndStatus (marketId: string, status: string): Promise<Order[]> {
        const ordersData = await this.databaseConnection.query("select * from app.order where market_id = $1 and status = $2", [marketId, status]);
        const orders: Order[] = [];
        for (const orderData of ordersData) {
            const order = new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price), orderData.status, orderData.timestamp);
            orders.push(order);
        }
        return orders;
    }

}
