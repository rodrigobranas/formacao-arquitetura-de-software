import { beforeEach, test, expect, afterEach } from "vitest";
import { Deposit } from "../../src/application/usecase/Deposit.ts";
import { GetAccount } from "../../src/application/usecase/GetAccount.ts";
import { Signup } from "../../src/application/usecase/Signup.ts";
import { Withdraw } from "../../src/application/usecase/Withdraw.ts";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import { PaymentGatewayFake } from "../../src/infra/gateway/PaymentGateway.ts";
import type AccountRepository from "../../src/infra/repository/AccountRepository.ts";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository.ts";
import UUID from "../../src/domain/UUID.ts";
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

test("Deve fazer um saque na conta", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository, walletRepository);
    const deposit = new Deposit(accountRepository, walletRepository, paymentGateway);
    const withdraw = new Withdraw(accountRepository, walletRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 50
    }
    await withdraw.execute(inputWithdraw);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(50);
});

test("Não deve fazer um saque em uma conta que não existe", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository, walletRepository);
    const deposit = new Deposit(accountRepository, walletRepository, paymentGateway);
    const withdraw = new Withdraw(accountRepository, walletRepository);
    const inputWithdraw = {
        accountId: UUID.create().getValue(),
        assetId: "USD",
        quantity: 50
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Account not found"));
});

test("Não deve fazer um saque de uma conta sem saldo suficiente", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository, walletRepository);
    const deposit = new Deposit(accountRepository, walletRepository, paymentGateway);
    const withdraw = new Withdraw(accountRepository, walletRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 50,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("No balance"));
});

afterEach(async () => {
    await databaseConnection.close(); 
});
