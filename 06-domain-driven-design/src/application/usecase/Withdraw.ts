import type AccountRepository from "../../infra/repository/AccountRepository.ts";
import type UseCase from "./UseCase.ts";

export class Withdraw implements UseCase {

    constructor (
        readonly accountRepository: AccountRepository
    ) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getById(input.accountId);
        account.withdraw(input.assetId, input.quantity);
        await this.accountRepository.update(account);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
