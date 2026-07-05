import type AccountRepository from "./AccountRepository.ts";
import type PaymentGateway from "./PaymentGateway.ts";
import type Usecase from "./Usecase.ts";

export class Deposit implements Usecase {

    constructor (
        readonly accountRepository: AccountRepository, 
        readonly paymentGateway: PaymentGateway
    ) {
    }

    async execute (input: DepositInput): Promise<void> {
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

type DepositInput = {
    accountId: string,
    assetId: string,
    quantity: number,
    creditCardHolder: string,
    creditCardNumber: string,
    creditCardExpDate: string,
    creditCardCvv: string
}
