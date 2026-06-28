# Coding Standards — Worked Examples

A bad/good pair for each rule in [`../SKILL.md`](../SKILL.md). Use them as concrete
models when applying or explaining a rule.

## 1. Methods under ~30 lines

Break a long method into smaller, well-named pieces that each do one thing.

```ts
// Bad: one method doing parsing, validation, calculation and persistence
async function processOrder(input: OrderInput) {
	// ...30+ lines mixing many responsibilities...
}

// Good
async function processOrder(input: OrderInput) {
	const order = parseOrder(input);
	validateOrder(order);
	const total = calculateTotal(order);
	await orderRepository.save({ ...order, total });
}
```

## 2. At most 3 parameters; prefer an object

```ts
// Bad
function createAccount(name: string, email: string, cpf: string, password: string, isAdmin: boolean) {
	// ...
}

// Good
type CreateAccountInput = {
	name: string;
	email: string;
	cpf: string;
	password: string;
	isAdmin: boolean;
};

function createAccount(input: CreateAccountInput) {
	// ...
}
```

## 3. Declare variables close to first use

```ts
// Bad
function getDiscount(order: Order) {
	const discount = 0.1;
	// ...many lines that don't use discount...
	return order.total * discount;
}

// Good
function getDiscount(order: Order) {
	// ...many lines...
	const discount = 0.1;
	return order.total * discount;
}
```

## 4. Never an empty `catch`

```ts
// Bad
try {
	await paymentGateway.charge(order);
} catch (error) {
}

// Good
try {
	await paymentGateway.charge(order);
} catch (error) {
	logger.error("Failed to charge order", { orderId: order.id, error });
	throw new PaymentFailedError(order.id);
}
```

## 5. No blank lines inside a method body

```ts
// Bad
function calculateTotal(order: Order) {
	const subtotal = sumItems(order.items);

	const tax = subtotal * 0.1;

	return subtotal + tax;
}

// Good
function calculateTotal(order: Order) {
	const subtotal = sumItems(order.items);
	const tax = subtotal * 0.1;
	return subtotal + tax;
}
```

## 6. Avoid unnecessary comments

The code should express its intent clearly and objectively.

```ts
// Bad: the comment just repeats what the code says
// increment the counter by one
counter = counter + 1;

// Good: a clear name removes the need for the comment
retryCount = retryCount + 1;
```

## 7. Name meaningful literals

```ts
// Bad
if (account.failedLoginAttempts > 3) {
	lockAccount(account);
}

// Good
const MAX_LOGIN_ATTEMPTS = 3;
if (account.failedLoginAttempts > MAX_LOGIN_ATTEMPTS) {
	lockAccount(account);
}
```

## 8. At most 2 levels of `if`/`else`; prefer early returns

```ts
// Bad
function getShippingCost(order: Order) {
	if (order.items.length > 0) {
		if (order.total > 100) {
			return 0;
		} else {
			return 10;
		}
	} else {
		throw new Error("Empty order");
	}
}

// Good
function getShippingCost(order: Order) {
	if (order.items.length === 0) throw new Error("Empty order");
	if (order.total > 100) return 0;
	return 10;
}
```

## 9. No nested ternaries

```ts
// Bad
const label = status === "paid" ? "Paid" : status === "pending" ? "Pending" : "Cancelled";

// Good
function getStatusLabel(status: OrderStatus) {
	if (status === "paid") return "Paid";
	if (status === "pending") return "Pending";
	return "Cancelled";
}
```
