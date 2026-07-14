import { test, expect } from "vitest";
import Account from "../../src/domain/Account.ts";
import UUID from "../../src/domain/UUID.ts";

test("Deve criar uma conta", () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "71428793860", "asdQWE123");
    expect(account).toBeDefined();
    expect(account.getAccountId()).toBeDefined();
    expect(account.getName()).toBe("John Doe");
    expect(account.getEmail()).toBe("john.doe@gmail.com");
    expect(account.getDocument()).toBe("71428793860");
    expect(account.getPassword()).toBe("asdQWE123");
    expect(account.checkPassword("asdQWE123")).toBe(true);
});

test("Deve restaurar o estado de uma conta", () => {
    const accountId = UUID.create().getValue();
    const account = new Account(accountId, "John Doe", "john.doe@gmail.com", "71428793860", "asdQWE123");
    expect(account).toBeDefined();
    expect(account.getAccountId()).toBeDefined();
    expect(account.getName()).toBe("John Doe");
    expect(account.getEmail()).toBe("john.doe@gmail.com");
    expect(account.getDocument()).toBe("71428793860");
    expect(account.getPassword()).toBe("asdQWE123");
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
