import { test, expect } from "vitest";
import Account, { type Balance } from "../../src/Account.ts";

test("Deve criar uma conta", () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "71428793860", "asdQWE123");
    expect(account).toBeDefined();
    expect(account.accountId).toBeDefined();
    expect(account.getName()).toBe("John Doe");
    expect(account.email).toBe("john.doe@gmail.com");
    expect(account.document).toBe("71428793860");
    expect(account.password).toBe("asdQWE123");
    expect(account.balances).toEqual([]);
});

test("Deve restaurar o estado de uma conta", () => {
    const accountId = crypto.randomUUID();
    const balances: Balance[] = [];
    const account = new Account(accountId, "John Doe", "john.doe@gmail.com", "71428793860", "asdQWE123", balances);
    expect(account).toBeDefined();
    expect(account.accountId).toBeDefined();
    expect(account.getName()).toBe("John Doe");
    expect(account.email).toBe("john.doe@gmail.com");
    expect(account.document).toBe("71428793860");
    expect(account.password).toBe("asdQWE123");
    expect(account.balances).toEqual([]);
});

test("Não deve criar uma conta com nome inválido", () => {
    expect(() => Account.create("John", "john.doe@gmail.com", "71428793860", "asdQWE123")).toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta com email inválido", () => {
    expect(() => Account.create("John Doe", "john.doe", "71428793860", "asdQWE123")).toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta com documento inválido", () => {
    expect(() => Account.create("John Doe", "john.doe@gmail.com", "714287938", "asdQWE123")).toThrow(new Error("Invalid document"));
});

test("Não deve criar uma conta com senha inválida", () => {
    expect(() => Account.create("John Doe", "john.doe@gmail.com", "71428793860", "asdQWE")).toThrow(new Error("Invalid password"));
});

test("Deve depositar em uma conta", () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "71428793860", "asdQWE123");
    account.deposit("USD", 1000);
    expect(account.getBalance("USD")).toBe(1000);
});

test("Deve fazer dois depósitos em uma conta", () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "71428793860", "asdQWE123");
    account.deposit("USD", 1000);
    account.deposit("USD", 1000);
    expect(account.getBalance("USD")).toBe(2000);
});
