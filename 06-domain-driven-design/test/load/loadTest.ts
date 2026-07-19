import { sleep } from "../../src/infra/util/sleep.ts";

async function main () {
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
    while (true) {
        const inputPlaceOrder = {
            accountId: outputSignup.accountId,
            marketId,
            side: (Math.random() > 0.5) ? "buy" : "sell",
            quantity: Math.floor(Math.random() * 10) + 1,
            price: Math.floor(60000 + ((Math.random() * 1000) * ((Math.random() > 0.5) ? 1 : -1)))
        }
        await fetch("http://localhost:3000/place_order", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(inputPlaceOrder)
        });
        // await sleep(10);
    }
    
}
main();
