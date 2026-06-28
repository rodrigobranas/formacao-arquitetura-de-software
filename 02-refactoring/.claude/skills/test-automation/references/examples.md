# Test Templates

Copy-ready scaffolds matching this project's conventions. Adjust names and paths;
keep the structure, the `.ts` import extensions, the `test` keyword, and the
Portuguese `Deve…/Não deve…` descriptions.

## Unit test (`test/unit/<module>.test.ts`)

Pure domain logic, no I/O. Use Arrange / Act / Assert.

```ts
import { expect, test } from "vitest";
import { calculateDiscount } from "../../src/calculateDiscount.ts";

test("Deve aplicar um desconto de 10%", () => {
	// Arrange
	const price = 100;
	// Act
	const result = calculateDiscount(price, 10);
	// Assert
	expect(result).toBe(90);
});

test("Não deve aceitar um percentual inválido", () => {
	expect(() => calculateDiscount(100, 150)).toThrow("Invalid percentage");
});
```

### Data-driven cases with `test.each`

The established pattern for families of valid/invalid inputs
(see `test/unit/validateCpf.test.ts`):

```ts
import { expect, test } from "vitest";
import { validateCpf } from "../../src/validateCpf.ts";

test.each([
	"97456321558",
	"71428793860",
])("Deve verificar um cpf válido: %s", (cpf: string) => {
	expect(validateCpf(cpf)).toBe(true);
});

test.each([
	"11111111111",
	null,
	undefined,
])("Deve verificar um cpf inválido: %s", (cpf: any) => {
	expect(validateCpf(cpf)).toBe(false);
});
```

## Integration test (`test/integration/<feature>.test.ts`)

Crosses layers by calling the running API on `:3000`. Needs the backend + database up
(`npm run compose:up`, then `node src/index.ts`). Assert each relevant field explicitly.

```ts
import { expect, test } from "vitest";

test("Deve criar uma conta", async () => {
	const input = {
		name: "John Doe",
		email: "john.doe@gmail.com",
		document: "97456321558",
		password: "asdQWE123",
	};
	const responseSignup = await fetch("http://localhost:3000/signup", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(input),
	});
	const outputSignup = await responseSignup.json();
	expect(outputSignup.accountId).toBeDefined();

	const responseGetAccount = await fetch(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	const outputGetAccount = await responseGetAccount.json();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
});

test("Não deve criar uma conta com email inválido", async () => {
	const input = {
		name: "John Doe",
		email: "john.doe@gmail",
		document: "97456321558",
		password: "asdQWE123",
	};
	const response = await fetch("http://localhost:3000/signup", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(input),
	});
	const output = await response.json();
	expect(output.error).toBe("Invalid email");
});
```

Each test builds its own input so the suite stays independent and order-agnostic.

## E2E test (`e2e/tests/<feature>.spec.js`)

Full flow through the React frontend on `:5173`. Needs backend, DB, and frontend
running. Run with `cd e2e && npx playwright test`.

```js
import { test, expect } from "@playwright/test";

test("Deve criar uma conta", async ({ page }) => {
	const input = {
		name: "John Doe",
		email: "john.doe@gmail.com",
		document: "97456321558",
		password: "asdQWE123",
	};
	await page.goto("http://localhost:5173");
	await page.locator(".input-name").fill(input.name);
	await page.locator(".input-email").fill(input.email);
	await page.locator(".input-document").fill(input.document);
	await page.locator(".input-password").fill(input.password);
	await page.locator(".button-signup").click();
	await expect(page.locator(".span-message")).toHaveText("success");
});
```

## Test doubles with Sinon

Sinon isn't installed yet — run `npm i -D sinon @types/sinon` before using it. Use
doubles to make tests repeatable and to isolate the unit from external systems.

```ts
import { expect, test, afterEach } from "vitest";
import sinon from "sinon";

afterEach(() => {
	sinon.restore(); // undo stubs/spies so tests stay independent
});

// Stub — replace a dependency's return value (no live exchange rate)
test("Deve converter o preço para BRL", async () => {
	const gateway = { getRate: sinon.stub().resolves(5) };
	const total = await convertToBRL(gateway, 10);
	expect(total).toBe(50);
});

// Spy — assert an interaction happened
test("Deve notificar o usuário uma única vez", () => {
	const notifier = { send: sinon.spy() };
	greetUser(notifier, "Ana");
	expect(notifier.send.calledOnce).toBe(true);
	expect(notifier.send.calledWith("Hello, Ana")).toBe(true);
});
```

Vitest's built-ins are a fine alternative for simple cases: `vi.fn()`, `vi.spyOn()`,
with `vi.restoreAllMocks()` in `afterEach`.

## Shared setup / teardown

```ts
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("AccountRepository", () => {
	let connection: DatabaseConnection;

	beforeEach(() => {
		connection = new PgPromiseConnection();
	});

	afterEach(async () => {
		await connection.close(); // release external resources
	});

	test("Deve persistir uma conta", async () => {
		const repository = new AccountRepository(connection);
		await repository.save(new Account({ name: "Ana" }));
		expect(await repository.count()).toBe(1);
	});
});
```
