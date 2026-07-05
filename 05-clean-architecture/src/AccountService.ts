import type AccountRepository from "./AccountRepository.ts";
import type PaymentGateway from "./PaymentGateway.ts";
import Account from "./Account.ts";

export default interface AccountService {
    signup (input: SignupInput): Promise<SignupOutput>;
    getAccount (accountId: string): Promise<GetAccountOutput>;
    deposit (input: DepositInput): Promise<void>;
}

export class AccountServiceImpl {

    constructor (
        readonly accountRepository: AccountRepository, 
        readonly paymentGateway: PaymentGateway
    ) {
    }

    async signup (input: SignupInput): Promise<SignupOutput> {
        const account = Account.create(input.name, input.email, input.document, input.password);
        await this.accountRepository.save(account);
        return {
            accountId: account.accountId
        };
    }

    async getAccount (accountId: string): Promise<GetAccountOutput> {
        const account = await this.accountRepository.getById(accountId);
        const output = {
            accountId: account.accountId,
            name: account.getName(),
            email: account.email,
            document: account.document,
            password: account.password,
            balances: account.balances.map((balance) => ({ assetId: balance.assetId, quantity: balance.quantity }))
        }
        return output;
    }

    async deposit (input: DepositInput): Promise<void> {
        const account = await this.accountRepository.getById(input.accountId);
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
                account.deposit(input.assetId, input.quantity);
                await this.accountRepository.update(account);
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
