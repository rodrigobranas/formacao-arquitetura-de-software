import { test, expect } from "vitest";
import { AccountServiceImpl } from "../../src/AccountService.ts";
import sinon from "sinon";
import { AccountDAODatabase, AccountDAOFake } from "../../src/AccountDAO.ts";
import { BalanceDAODatabase, BalanceDAOFake } from "../../src/BalanceDAO.ts";
import { PaymentGatewayFake, PaymentGatewayHttp } from "../../src/PaymentGateway.ts";

test("Deve criar uma conta", async () => {
    const accountDAO = new AccountDAODatabase();
    const balanceDAO = new BalanceDAOFake();
    const paymentGateway = new PaymentGatewayFake();
    const accountService = new AccountServiceImpl(accountDAO, balanceDAO, paymentGateway);
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(input);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});


test("Deve fazer um depósito em uma conta com stub", async () => {
    const accountDAO = new AccountDAODatabase();
    const balanceDAO = new BalanceDAODatabase();
    const paymentGateway = new PaymentGatewayFake();
    const accountService = new AccountServiceImpl(accountDAO, balanceDAO, paymentGateway);
    const upsertStub = sinon.stub(BalanceDAODatabase.prototype, "upsert").resolves();
    const listByAccountIdStub = sinon.stub(BalanceDAODatabase.prototype, "listByAccountId").resolves([
        {
            accountId: "",
            assetId: "USD",
            quantity: 100
        }
    ]);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await accountService.deposit(inputDeposit);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
    upsertStub.restore();
    listByAccountIdStub.restore();
});

test("Deve fazer dois depósitos do mesmo tipo de recurso em uma conta", async () => {
    const accountDAO = new AccountDAODatabase();
    const balanceDAO = new BalanceDAODatabase();
    const paymentGateway = new PaymentGatewayFake();
    const accountService = new AccountServiceImpl(accountDAO, balanceDAO, paymentGateway);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await accountService.deposit(inputDeposit);
    await accountService.deposit(inputDeposit);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(200);
});

test("Deve fazer um depósito em uma conta spy", async () => {
    const accountDAO = new AccountDAODatabase();
    const balanceDAO = new BalanceDAODatabase();
    const paymentGateway = new PaymentGatewayHttp();
    const accountService = new AccountServiceImpl(accountDAO, balanceDAO, paymentGateway);
    const processTransactionSpy = sinon.spy(PaymentGatewayHttp.prototype, "processTransaction");
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await accountService.deposit(inputDeposit);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
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
    const accountDAO = new AccountDAODatabase();
    const balanceDAO = new BalanceDAODatabase();
    const paymentGateway = new PaymentGatewayHttp();
    const accountService = new AccountServiceImpl(accountDAO, balanceDAO, paymentGateway);
    const balanceDataMock = sinon.mock(BalanceDAODatabase.prototype);
    const paymentGatewayMock = sinon.mock(PaymentGatewayHttp.prototype);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    balanceDataMock.expects("upsert").once().resolves();
    balanceDataMock.expects("listByAccountId").twice().resolves([
        {
            accountId: "",
            assetId: "USD",
            quantity: 100
        }
    ]);
    paymentGatewayMock.expects("processTransaction").once().withArgs({ 
        creditCardHolder: inputDeposit.creditCardHolder,
        creditCardNumber: inputDeposit.creditCardNumber,
        creditCardExpDate: inputDeposit.creditCardExpDate,
        creditCardCvv: inputDeposit.creditCardCvv,
        amount: inputDeposit.quantity
    }).resolves({
        autorizada: "1"
    });
    await accountService.deposit(inputDeposit);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
    balanceDataMock.verify();
    balanceDataMock.restore();
    paymentGatewayMock.verify();
    paymentGatewayMock.restore();
});

test("Deve fazer um depósito em uma conta com fake", async () => {
    const accountDAO = new AccountDAOFake();
    const balanceDAO = new BalanceDAOFake();
    const paymentGateway = new PaymentGatewayFake();
    const accountService = new AccountServiceImpl(accountDAO, balanceDAO, paymentGateway);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await accountService.deposit(inputDeposit);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
});