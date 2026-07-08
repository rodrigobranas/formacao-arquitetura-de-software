import { test, expect, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import { PaymentGatewayFake, PaymentGatewayHttp } from "../../src/PaymentGateway.ts";
import { AccountRepositoryDatabase, AccountRepositoryFake } from "../../src/AccountRepository.ts";
import Account from "../../src/Account.ts";
import { Signup } from "../../src/Signup.ts";
import { GetAccount } from "../../src/GetAccount.ts";
import { Deposit } from "../../src/Deposit.ts";
import type DatabaseConnection from "../../src/DatabaseConnection.ts";
import type AccountRepository from "../../src/AccountRepository.ts";
import { PgPromiseAdapter } from "../../src/DatabaseConnection.ts";
import { AxiosAdapter } from "../../src/HttpClient.ts";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(databaseConnection);
}); 

test("Deve fazer dois depósitos do mesmo tipo de recurso em uma conta", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository);
    const deposit = new Deposit(accountRepository, paymentGateway);
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
    await deposit.execute(inputDeposit);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(200);
});

test("Deve fazer um depósito em uma conta spy", async () => {
    const httpClient = new AxiosAdapter();
    const paymentGateway = new PaymentGatewayHttp(httpClient);
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository);
    const deposit = new Deposit(accountRepository, paymentGateway);
    const processTransactionSpy = sinon.spy(PaymentGatewayHttp.prototype, "processTransaction");
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
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
    expect(processTransactionSpy.calledOnce).toBe(true);
    expect(processTransactionSpy.calledWith({ 
        creditCardHolder: inputDeposit.creditCardHolder,
        creditCardNumber: inputDeposit.creditCardNumber,
        creditCardExpDate: inputDeposit.creditCardExpDate,
        creditCardCvv: inputDeposit.creditCardCvv,
        amount: inputDeposit.quantity
    })).toBe(true);
    processTransactionSpy.restore();
});

test("Deve fazer um depósito em uma conta mock", async () => {
    const httpClient = new AxiosAdapter();
    const paymentGateway = new PaymentGatewayHttp(httpClient);
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository);
    const deposit = new Deposit(accountRepository, paymentGateway);
    const accountRepositoryMock = sinon.mock(AccountRepositoryDatabase.prototype);
    const paymentGatewayMock = sinon.mock(PaymentGatewayHttp.prototype);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    accountRepositoryMock.expects("save").once().resolves();
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
    const mockedAccount = new Account(outputSignup.accountId, inputSignup.name, inputSignup.email, inputSignup.document, inputSignup.password, []);
    accountRepositoryMock.expects("update").once().resolves();
    accountRepositoryMock.expects("getById").twice().resolves(mockedAccount);
    paymentGatewayMock.expects("processTransaction").once().withArgs({ 
        creditCardHolder: inputDeposit.creditCardHolder,
        creditCardNumber: inputDeposit.creditCardNumber,
        creditCardExpDate: inputDeposit.creditCardExpDate,
        creditCardCvv: inputDeposit.creditCardCvv,
        amount: inputDeposit.quantity
    }).resolves({
        autorizada: "1"
    });
    await deposit.execute(inputDeposit);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
    accountRepositoryMock.verify();
    accountRepositoryMock.restore();
    paymentGatewayMock.verify();
    paymentGatewayMock.restore();
});

test("Deve fazer um depósito em uma conta com fake", async () => {
    const accountRepository = new AccountRepositoryFake();
    const paymentGateway = new PaymentGatewayFake();
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository);
    const deposit = new Deposit(accountRepository, paymentGateway);
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
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
});

test("Não deve fazer depósito em uma conta que não existe", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository);
    const deposit = new Deposit(accountRepository, paymentGateway);
    const inputDeposit = {
        accountId: crypto.randomUUID(),
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(new Error("Account not found"));
});

afterEach(async () => {
    await databaseConnection.close(); 
});
