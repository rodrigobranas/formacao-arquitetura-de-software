import { beforeEach, test, expect, afterEach } from "vitest";
import { GetAccount } from "../../src/application/usecase/GetAccount.ts";
import { Signup } from "../../src/application/usecase/Signup.ts";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import type AccountRepository from "../../src/infra/repository/AccountRepository.ts";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository.ts";
import type WalletRepository from "../../src/infra/repository/WalletRepository.ts";
import { WalletRepositoryDatabase } from "../../src/infra/repository/WalletRepository.ts";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let walletRepository: WalletRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
    walletRepository = new WalletRepositoryDatabase(databaseConnection);
}); 

test("Deve criar uma conta", async () => {
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository, walletRepository);
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
