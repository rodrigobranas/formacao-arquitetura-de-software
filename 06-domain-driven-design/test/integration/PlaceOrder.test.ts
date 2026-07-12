import { beforeEach, test, expect, afterEach } from "vitest";
import ExecuteOrder from "../../src/application/usecase/ExecuteOrder.ts";
import GetOrder from "../../src/application/usecase/GetOrder.ts";
import PlaceOrder from "../../src/application/usecase/PlaceOrder.ts";
import { Signup } from "../../src/application/usecase/Signup.ts";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import Mediator from "../../src/infra/handler/Mediator.ts";
import type AccountRepository from "../../src/infra/repository/AccountRepository.ts";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository.ts";
import type OrderRepository from "../../src/infra/repository/OrderRepository.ts";
import { OrderRepositoryDatabase } from "../../src/infra/repository/OrderRepository.ts";
import type TradeRepository from "../../src/infra/repository/TradeRepository.ts";
import { TradeRepositoryDatabase } from "../../src/infra/repository/TradeRepository.ts";
import GetTrade from "../../src/application/usecase/GetTrade.ts";


let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let orderRepository: OrderRepository;
let tradeRepository: TradeRepository;

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
    orderRepository = new OrderRepositoryDatabase(databaseConnection);
    tradeRepository = new TradeRepositoryDatabase(databaseConnection);
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
    const executeOrder = new ExecuteOrder(orderRepository, tradeRepository);
    const mediator = new Mediator();
    mediator.register("orderPlaced", async (event: any) => {
        await executeOrder.execute(event.marketId);
    });
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getOrder = new GetOrder(orderRepository);
    const getTrade = new GetTrade(tradeRepository);
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
    const inputGetTrade = {
        buyOrderId: outputPlaceOrderBuy.orderId,
        sellOrderId: outputPlaceOrderSell.orderId
    }
    const outputGetTrade = await getTrade.execute(inputGetTrade);
    expect(outputGetTrade.side).toBe("sell");
    expect(outputGetTrade.quantity).toBe(1);
    expect(outputGetTrade.price).toBe(60000);
});

test("Deve executar uma ordem de compra com duas ordens de venda", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const signup = new Signup(accountRepository);
    const executeOrder = new ExecuteOrder(orderRepository, tradeRepository);
    const mediator = new Mediator();
    mediator.register("orderPlaced", async (event: any) => {
        await executeOrder.execute(event.marketId);
    });
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getOrder = new GetOrder(orderRepository);
    const getTrade = new GetTrade(tradeRepository);
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
    const outputTrade1 = await getTrade.execute({ buyOrderId: outputPlaceOrderBuy.orderId, sellOrderId: outputPlaceOrderSell1.orderId });
    const outputTrade2 = await getTrade.execute({ buyOrderId: outputPlaceOrderBuy.orderId, sellOrderId: outputPlaceOrderSell2.orderId });
    expect(outputTrade1.side).toBe("sell");
    expect(outputTrade1.quantity).toBe(1);
    expect(outputTrade1.price).toBe(60000);
    expect(outputTrade2.side).toBe("sell");
    expect(outputTrade2.quantity).toBe(1);
    expect(outputTrade2.price).toBe(60000);
});

test("Deve executar uma ordem de compra com duas ordens de venda com preços diferentes", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const signup = new Signup(accountRepository);
    const executeOrder = new ExecuteOrder(orderRepository, tradeRepository);
    const mediator = new Mediator();
    mediator.register("orderPlaced", async (event: any) => {
        await executeOrder.execute(event.marketId);
    });
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getOrder = new GetOrder(orderRepository);
    const getTrade = new GetTrade(tradeRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrderSell1 = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 60000
    }
    await sleep(100);
    const outputPlaceOrderSell1 = await placeOrder.execute(inputPlaceOrderSell1);
    const inputPlaceOrderSell2 = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 62000
    }
    await sleep(100);
    const outputPlaceOrderSell2 = await placeOrder.execute(inputPlaceOrderSell2);
    const inputPlaceOrderBuy = {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 2,
        price: 63000
    }
    await sleep(100);
    const outputPlaceOrderBuy = await placeOrder.execute(inputPlaceOrderBuy);
    const outputGetOrderSell1 = await getOrder.execute(outputPlaceOrderSell1.orderId);
    const outputGetOrderSell2 = await getOrder.execute(outputPlaceOrderSell2.orderId);
    const outputGetOrderBuy = await getOrder.execute(outputPlaceOrderBuy.orderId);
    expect(outputGetOrderBuy.fillQuantity).toBe(2);
    expect(outputGetOrderBuy.fillPrice).toBe(61000);
    expect(outputGetOrderSell1.fillQuantity).toBe(1);
    expect(outputGetOrderSell1.fillPrice).toBe(60000);
    expect(outputGetOrderSell2.fillQuantity).toBe(1);
    expect(outputGetOrderSell2.fillPrice).toBe(62000);
    const outputTrade1 = await getTrade.execute({ buyOrderId: outputPlaceOrderBuy.orderId, sellOrderId: outputPlaceOrderSell1.orderId });
    const outputTrade2 = await getTrade.execute({ buyOrderId: outputPlaceOrderBuy.orderId, sellOrderId: outputPlaceOrderSell2.orderId });
    expect(outputTrade1.side).toBe("buy");
    expect(outputTrade1.quantity).toBe(1);
    expect(outputTrade1.price).toBe(60000);
    expect(outputTrade2.side).toBe("buy");
    expect(outputTrade2.quantity).toBe(1);
    expect(outputTrade2.price).toBe(62000);
});

afterEach(async () => {
    await databaseConnection.close(); 
});
