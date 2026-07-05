import type AccountRepository from "./AccountRepository.ts";
import Account from "./Account.ts";
import type Usecase from "./Usecase.ts";

export class Signup implements Usecase {

    constructor (
        readonly accountRepository: AccountRepository
    ) {
    }

    async execute (input: SignupInput): Promise<SignupOutput> {
        const account = Account.create(input.name, input.email, input.document, input.password);
        await this.accountRepository.save(account);
        return {
            accountId: account.accountId
        };
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
