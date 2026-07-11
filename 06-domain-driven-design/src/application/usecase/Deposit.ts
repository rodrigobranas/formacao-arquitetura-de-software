import type PaymentGateway from "../../infra/gateway/PaymentGateway.ts";
import type AccountRepository from "../../infra/repository/AccountRepository.ts";
import type UseCase from "./UseCase.ts";

export class Deposit implements UseCase {

    constructor (
        readonly accountRepository: AccountRepository, 
        readonly paymentGateway: PaymentGateway
    ) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getById(input.accountId);
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

type Input = {
    accountId: string,
    assetId: string,
    quantity: number,
    creditCardHolder: string,
    creditCardNumber: string,
    creditCardExpDate: string,
    creditCardCvv: string
}
