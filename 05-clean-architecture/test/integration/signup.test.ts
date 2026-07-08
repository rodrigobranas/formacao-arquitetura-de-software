import { test, expect, beforeEach, afterEach } from "vitest";
import { AccountRepositoryDatabase, AccountRepositoryFake } from "../../src/AccountRepository.ts";
import { Signup } from "../../src/Signup.ts";
import { GetAccount } from "../../src/GetAccount.ts";
import type AccountRepository from "../../src/AccountRepository.ts";
import type DatabaseConnection from "../../src/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/DatabaseConnection.ts";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
}); 

test("Deve criar uma conta", async () => {
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository);
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});

afterEach(async () => {
    await databaseConnection.close(); 
});
