import crypto from "crypto";
import { validateCpf } from "./validateCpf.ts";
import { validateName } from "./validateName.ts";
import type BalanceDAO from "./BalanceDAO.ts";
import type AccountDAO from "./AccountDAO.ts";
import type PaymentGateway from "./PaymentGateway.ts";

export default interface AccountService {
    signup (input: SignupInput): Promise<SignupOutput>;
    getAccount (accountId: string): Promise<GetAccountOutput>;
    deposit (input: DepositInput): Promise<void>;
}

export class AccountServiceImpl {

    constructor (
        readonly accountDAO: AccountDAO, 
        readonly balanceDAO: BalanceDAO, 
        readonly paymentGateway: PaymentGateway
    ) {
    }

    async signup (input: SignupInput): Promise<SignupOutput> {
        if (!validateName(input.name)) {
            throw new Error("Invalid name");
        }
        if (!input.email.match(/.+@.+\..+/)) {
            throw new Error("Invalid email");
        }
        if (!validateCpf(input.document)) {
            throw new Error("Invalid document");
        }
        if (
            input.password.length < 8 || 
            !input.password.match(/[a-z]/) || 
            !input.password.match(/[A-Z]/) || 
            !input.password.match(/[0-9]/)
        ) {
            throw new Error("Invalid password");
        }
        const account = {
            accountId: crypto.randomUUID(),
            name: input.name,
            email: input.email,
            document: input.document,
            password: input.password
        }
        await this.accountDAO.save(account);
        return {
            accountId: account.accountId
        };
    }

    async getAccount (accountId: string): Promise<GetAccountOutput> {
        const account = await this.accountDAO.getById(accountId);
        const balances = await this.balanceDAO.listByAccountId(accountId);
        const output = {
            accountId: account.accountId,
            name: account.name,
            email: account.email,
            document: account.document,
            password: account.password,
            balances: balances.map((balance) => ({ assetId: balance.assetId, quantity: balance.quantity }))
        }
        return output;
    }

    async deposit (input: DepositInput): Promise<void> {
        const account = await this.accountDAO.getById(input.accountId);
        if (account) {
            const inputProcessTransaction = {
                creditCardHolder: input.creditCardHolder,
                creditCardNumber: input.creditCardNumber,
                creditCardExpDate: input.creditCardExpDate,
                creditCardCvv: input.creditCardCvv,
                amount: input.quantity
            }
            const outputProcessTransaction = await this.paymentGateway.processTransaction(inputProcessTransaction);
            if (outputProcessTransaction.autorizada === "1") {
                const balances = await this.balanceDAO.listByAccountId(input.accountId);
                const existingBalance = balances.find(balance => balance.assetId === input.assetId);
                const existingQuantity = (existingBalance) ? existingBalance.quantity : 0;
                const balance = {
                    accountId: input.accountId,
                    assetId: input.assetId,
                    quantity: existingQuantity + input.quantity
                }
                await this.balanceDAO.upsert(balance);
            }
        }
    }
}

export class AccountServiceFake implements AccountService {

    async signup(input: SignupInput): Promise<SignupOutput> {
        return {
            accountId: "1"
        }
    }

    async getAccount(accountId: string): Promise<GetAccountOutput> {
        return {
            accountId: "1",
            name: "a",
            email: "b",
            document: "c",
            password: "d",
            balances: []
        }
    }

    async deposit (input: DepositInput): Promise<void> {
    }

}

type SignupInput = {
    name: string,
    email: string,
    document: string,
    password: string
}

type SignupOutput = {
    accountId: string
}

type DepositInput = {
    accountId: string,
    assetId: string,
    quantity: number,
    creditCardHolder: string,
    creditCardNumber: string,
    creditCardExpDate: string,
    creditCardCvv: string
}

type GetAccountOutput = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string,
    balances: { assetId: string, quantity: number}[]
}
