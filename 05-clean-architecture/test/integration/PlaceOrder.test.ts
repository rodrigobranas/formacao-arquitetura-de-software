import { test, expect } from "vitest";
import { AccountRepositoryDatabase } from "../../src/AccountRepository.ts";
import { Signup } from "../../src/Signup.ts";
import { OrderRepositoryDatabase } from "../../src/OrderRepository.ts";
import PlaceOrder from "../../src/PlaceOrder.ts";
import GetOrder from "../../src/GetOrder.ts";

test("Deve criar uma ordem de compra", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const accountRepository = new AccountRepositoryDatabase();
    const orderRepository = new OrderRepositoryDatabase();
    const signup = new Signup(accountRepository);
    const placeOrder = new PlaceOrder(accountRepository, orderRepository);
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
