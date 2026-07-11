import { expect, test } from "vitest";

test("Deve criar uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await fetch(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = await responseGetAccount.json();
    expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});

test("Não deve criar uma conta com nome inválido", async () => {
    const input = {
        name: "John",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    expect(outputSignup.error).toBe("Invalid name");
});

test("Não deve criar uma conta com email inválido", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    expect(outputSignup.error).toBe("Invalid email");
});

test("Não deve criar uma conta com documento inválido", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "974563215",
        password: "asdQWE123"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    expect(outputSignup.error).toBe("Invalid document");
});

test("Não deve criar uma conta com senha inválida", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWERTY"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    expect(outputSignup.error).toBe("Invalid password");
});

test("Deve executar uma ordem de compra com uma ordem de venda", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    const inputPlaceOrderBuy = {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 60000
    }
    const responsePlaceOrderBuy = await fetch("http://localhost:3000/place_order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(inputPlaceOrderBuy)
    });
    const outputPlaceOrderBuy = await responsePlaceOrderBuy.json();
    const inputPlaceOrderSell = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 60000
    }
    const responsePlaceOrderSell = await fetch("http://localhost:3000/place_order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(inputPlaceOrderSell)
    });
    const outputPlaceOrderSell = await responsePlaceOrderSell.json();
    const responseGetOrderBuy = await fetch(`http://localhost:3000/orders/${outputPlaceOrderBuy.orderId}`);
    const outputGetOrderBuy = await responseGetOrderBuy.json();
    const responseGetOrderSell = await fetch(`http://localhost:3000/orders/${outputPlaceOrderSell.orderId}`);
    const outputGetOrderSell = await responseGetOrderSell.json();
    expect(outputGetOrderBuy.fillQuantity).toBe(1);
    expect(outputGetOrderBuy.fillPrice).toBe(60000);
    expect(outputGetOrderBuy.status).toBe("closed");
    expect(outputGetOrderSell.fillQuantity).toBe(1);
    expect(outputGetOrderSell.fillPrice).toBe(60000);
    expect(outputGetOrderSell.status).toBe("closed");
});