import { beforeEach, test, expect, afterEach } from "vitest";
import Account from "../../src/domain/Account.ts";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import type AccountRepository from "../../src/infra/repository/AccountRepository.ts";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository.ts";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
}); 

test("Deve persistir uma conta", async () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    await accountRepository.save(account);
    const savedAccount = await accountRepository.getById(account.getAccountId());
    expect(savedAccount.getAccountId()).toBe(account.getAccountId());
    expect(savedAccount.getName()).toBe(account.getName());
    expect(savedAccount.getEmail()).toBe(account.getEmail());
    expect(savedAccount.getDocument()).toBe(account.getDocument());
    expect(savedAccount.getPassword()).toBe(account.getPassword());
});

afterEach(async () => {
    await databaseConnection.close(); 
});
