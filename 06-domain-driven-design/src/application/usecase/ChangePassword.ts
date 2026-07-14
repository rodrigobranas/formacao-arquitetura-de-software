import type AccountRepository from "../../infra/repository/AccountRepository.ts";
import type UseCase from "./UseCase.ts";

export class ChangePassword implements UseCase {

    constructor (
        readonly accountRepository: AccountRepository
    ) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getById(input.accountId);
        account.setPassword(input.newPassword);
        await this.accountRepository.update(account);
    }
}

type Input = {
    accountId: string,
    newPassword: string
}
