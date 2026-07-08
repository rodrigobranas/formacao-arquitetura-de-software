import { afterEach, beforeEach, expect, test } from "vitest";
import Account from "../../src/Account.ts";
import { AccountRepositoryDatabase } from "../../src/AccountRepository.ts";
import { PgPromiseAdapter } from "../../src/DatabaseConnection.ts";
import type AccountRepository from "../../src/AccountRepository.ts";
import type DatabaseConnection from "../../src/DatabaseConnection.ts";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
}); 

test("Deve persistir uma conta", async () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    await accountRepository.save(account);
    const savedAccount = await accountRepository.getById(account.accountId);
    expect(savedAccount.accountId).toBe(account.accountId);
    expect(savedAccount.getName()).toBe(account.getName());
    expect(savedAccount.email).toBe(account.email);
    expect(savedAccount.document).toBe(account.document);
    expect(savedAccount.password).toBe(account.password);
});

test("Deve persistir uma conta com recursos", async () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    account.deposit("USD", 1000);
    await accountRepository.save(account);
    const savedAccount = await accountRepository.getById(account.accountId);
    expect(savedAccount.balances[0]?.assetId).toBe("USD");
    expect(savedAccount.balances[0]?.quantity).toBe(1000);
});

test("Deve atualizar uma conta com recursos", async () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    account.deposit("USD", 1000);
    await accountRepository.save(account);
    const savedAccount = await accountRepository.getById(account.accountId);
    savedAccount.setName("John Cooper");
    savedAccount.deposit("USD", 1000);
    await accountRepository.update(savedAccount);
    const updatedAccount = await accountRepository.getById(account.accountId);
    expect(updatedAccount.getName()).toBe("John Cooper");
    expect(updatedAccount.balances[0]?.assetId).toBe("USD");
    expect(updatedAccount.balances[0]?.quantity).toBe(2000);
});

afterEach(async () => {
    await databaseConnection.close(); 
});
