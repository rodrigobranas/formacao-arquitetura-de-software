import type AccountRepository from "./AccountRepository.ts";
import type Usecase from "./Usecase.ts";

export class GetAccount implements Usecase {

    constructor (
        readonly accountRepository: AccountRepository
    ) {
    }

    async execute (accountId: string): Promise<GetAccountOutput> {
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
}

type GetAccountOutput = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string,
    balances: { assetId: string, quantity: number}[]
}
