import type AccountRepository from "./AccountRepository.ts";
import Account from "./Account.ts";
import type UseCase from "./UseCase.ts";

export class Signup implements UseCase {

    constructor (
        readonly accountRepository: AccountRepository
    ) {
    }

    async execute (input: Input): Promise<Output> {
        const account = Account.create(input.name, input.email, input.document, input.password);
        await this.accountRepository.save(account);
        return {
            accountId: account.accountId
        };
    }
}

type Input = {
    name: string,
    email: string,
    document: string,
    password: string
}

type Output = {
    accountId: string
}
