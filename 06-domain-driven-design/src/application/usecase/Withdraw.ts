import type AccountRepository from "../../infra/repository/AccountRepository.ts";
import type WalletRepository from "../../infra/repository/WalletRepository.ts";
import type UseCase from "./UseCase.ts";

export class Withdraw implements UseCase {

    constructor (
        readonly accountRepository: AccountRepository,
        readonly walletRepository: WalletRepository
    ) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getById(input.accountId);
        const wallet = await this.walletRepository.getByAccountId(account.getAccountId());
        wallet.withdraw(input.assetId, input.quantity);
        await this.walletRepository.update(wallet);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
