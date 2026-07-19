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
import GetDepth from "../../src/application/usecase/GetDepth.ts";


let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let orderRepository: OrderRepository;
let tradeRepository: TradeRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
    orderRepository = new OrderRepositoryDatabase(databaseConnection);
    tradeRepository = new TradeRepositoryDatabase(databaseConnection);
}); 

test("Deve retornar a profundidade do mercado com precisão de 10000", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const signup = new Signup(accountRepository);
    const executeOrder = new ExecuteOrder(orderRepository, tradeRepository);
    const mediator = new Mediator();
    mediator.register("orderPlaced", async (event: any) => {
        await executeOrder.execute(event.marketId);
    });
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getDepth = new GetDepth(orderRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 60000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 61000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 62000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 70000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 72000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 72000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 73000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 74000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 82000
    });
    const outputGetDepth = await getDepth.execute(marketId, 10000);
    expect(outputGetDepth.buys).toHaveLength(2);
    expect(outputGetDepth.buys[0]!.price).toBe(70000);
    expect(outputGetDepth.buys[0]!.quantity).toBe(1);
    expect(outputGetDepth.buys[1]!.price).toBe(60000);
    expect(outputGetDepth.buys[1]!.quantity).toBe(3);
    expect(outputGetDepth.sells).toHaveLength(2);
    expect(outputGetDepth.sells[0]!.price).toBe(70000);
    expect(outputGetDepth.sells[0]!.quantity).toBe(4);
    expect(outputGetDepth.sells[1]!.price).toBe(80000);
    expect(outputGetDepth.sells[1]!.quantity).toBe(1);
});

test("Deve retornar a profundidade do mercado com precisão de 1", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const signup = new Signup(accountRepository);
    const executeOrder = new ExecuteOrder(orderRepository, tradeRepository);
    const mediator = new Mediator();
    mediator.register("orderPlaced", async (event: any) => {
        await executeOrder.execute(event.marketId);
    });
    const placeOrder = new PlaceOrder(accountRepository, orderRepository, mediator);
    const getDepth = new GetDepth(orderRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 60000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 61000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 62000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 70000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 72000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 72000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 73000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 74000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 82000
    });
    const outputGetDepth = await getDepth.execute(marketId);
    expect(outputGetDepth.buys).toHaveLength(4);
    expect(outputGetDepth.buys[0]!.price).toBe(70000);
    expect(outputGetDepth.buys[0]!.quantity).toBe(1);
    expect(outputGetDepth.buys[1]!.price).toBe(62000);
    expect(outputGetDepth.buys[1]!.quantity).toBe(1);
    expect(outputGetDepth.buys[2]!.price).toBe(61000);
    expect(outputGetDepth.buys[2]!.quantity).toBe(1);
    expect(outputGetDepth.buys[3]!.price).toBe(60000);
    expect(outputGetDepth.buys[3]!.quantity).toBe(1);
    expect(outputGetDepth.sells).toHaveLength(4);
    expect(outputGetDepth.sells[0]!.price).toBe(72000);
    expect(outputGetDepth.sells[0]!.quantity).toBe(2);
    expect(outputGetDepth.sells[1]!.price).toBe(73000);
    expect(outputGetDepth.sells[1]!.quantity).toBe(1);
    expect(outputGetDepth.sells[2]!.price).toBe(74000);
    expect(outputGetDepth.sells[2]!.quantity).toBe(1);
    expect(outputGetDepth.sells[3]!.price).toBe(82000);
    expect(outputGetDepth.sells[3]!.quantity).toBe(1);
});

afterEach(async () => {
    await databaseConnection.close(); 
});
