import { test, expect, beforeEach, afterEach } from "vitest";
import { AccountRepositoryDatabase } from "../../src/AccountRepository.ts";
import { Signup } from "../../src/Signup.ts";
import { OrderRepositoryDatabase } from "../../src/OrderRepository.ts";
import PlaceOrder from "../../src/PlaceOrder.ts";
import GetOrder from "../../src/GetOrder.ts";
import Mediator from "../../src/Mediator.ts";
import ExecuteOrder from "../../src/ExecuteOrder.ts";
import type AccountRepository from "../../src/AccountRepository.ts";
import type DatabaseConnection from "../../src/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/DatabaseConnection.ts";
import type OrderRepository from "../../src/OrderRepository.ts";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let orderRepository: OrderRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
    orderRepository = new OrderRepositoryDatabase(databaseConnection);
}); 

test("Deve criar uma ordem de compra", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const signup = new Signup(accountRepository);
    const mediator = new Mediator();
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getOrder = new GetOrder(orderRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrder = {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 60000
    }
    const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);
    expect(outputPlaceOrder.orderId).toBeDefined();
    const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);
    expect(outputGetOrder.accountId).toBe(outputSignup.accountId);
    expect(outputGetOrder.side).toBe("buy");
    expect(outputGetOrder.quantity).toBe(1);
    expect(outputGetOrder.price).toBe(60000);
    expect(outputGetOrder.status).toBe("open");
});

test("Deve executar uma ordem de compra com uma ordem de venda", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const signup = new Signup(accountRepository);
    const executeOrder = new ExecuteOrder(orderRepository);
    const mediator = new Mediator();
    mediator.register("orderPlaced", async (event: any) => {
        await executeOrder.execute(event.marketId);
    });
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getOrder = new GetOrder(orderRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrderBuy = {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 60000
    }
    const outputPlaceOrderBuy = await placeOrder.execute(inputPlaceOrderBuy);
    const inputPlaceOrderSell = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 60000
    }
    const outputPlaceOrderSell = await placeOrder.execute(inputPlaceOrderSell);
    const outputGetOrderBuy = await getOrder.execute(outputPlaceOrderBuy.orderId);
    const outputGetOrderSell = await getOrder.execute(outputPlaceOrderSell.orderId);
    expect(outputGetOrderBuy.fillQuantity).toBe(1);
    expect(outputGetOrderBuy.fillPrice).toBe(60000);
    expect(outputGetOrderBuy.status).toBe("closed");
    expect(outputGetOrderSell.fillQuantity).toBe(1);
    expect(outputGetOrderSell.fillPrice).toBe(60000);
    expect(outputGetOrderSell.status).toBe("closed");
});

test("Deve executar uma ordem de compra com duas ordens de venda", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const signup = new Signup(accountRepository);
    const executeOrder = new ExecuteOrder(orderRepository);
    const mediator = new Mediator();
    mediator.register("orderPlaced", async (event: any) => {
        await executeOrder.execute(event.marketId);
    });
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getOrder = new GetOrder(orderRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrderBuy = {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 2,
        price: 60000
    }
    const outputPlaceOrderBuy = await placeOrder.execute(inputPlaceOrderBuy);
    const inputPlaceOrderSell1 = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 60000
    }
    const outputPlaceOrderSell1 = await placeOrder.execute(inputPlaceOrderSell1);
    const inputPlaceOrderSell2 = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 60000
    }
    const outputPlaceOrderSell2 = await placeOrder.execute(inputPlaceOrderSell2);
    const outputGetOrderBuy = await getOrder.execute(outputPlaceOrderBuy.orderId);
    const outputGetOrderSell1 = await getOrder.execute(outputPlaceOrderSell1.orderId);
    const outputGetOrderSell2 = await getOrder.execute(outputPlaceOrderSell2.orderId);
    expect(outputGetOrderBuy.fillQuantity).toBe(2);
    expect(outputGetOrderBuy.fillPrice).toBe(60000);
    expect(outputGetOrderBuy.status).toBe("closed");
    expect(outputGetOrderSell1.fillQuantity).toBe(1);
    expect(outputGetOrderSell1.fillPrice).toBe(60000);
    expect(outputGetOrderSell1.status).toBe("closed");
    expect(outputGetOrderSell2.fillQuantity).toBe(1);
    expect(outputGetOrderSell2.fillPrice).toBe(60000);
    expect(outputGetOrderSell2.status).toBe("closed");
});

afterEach(async () => {
    await databaseConnection.close(); 
});
