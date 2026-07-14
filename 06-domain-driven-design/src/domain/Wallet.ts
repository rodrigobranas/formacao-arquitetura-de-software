import UUID from "./UUID.ts";

export default class Wallet {
    private accountId: UUID;

    constructor (accountId: string, readonly balances: Balance[]) {
        this.accountId = new UUID(accountId);
    }

    static create (accountId: string) {
        const balances: Balance[] = [];
        return new Wallet(accountId, balances);
    }

    deposit (assetId: string, quantity: number) {
        const balance = this.balances.find((balance) => balance.assetId === assetId);
        if (balance) {
            balance.quantity += quantity;
        } else {
            this.balances.push({ assetId, quantity });
        }
    }

    withdraw (assetId: string, quantity: number) {
        const balance = this.balances.find((balance) => balance.assetId === assetId);
        if (!balance || balance.quantity < quantity) throw new Error("No balance");
        if (balance) {
            balance.quantity -= quantity;
        }
    }

    getBalance (assetId: string) {
        const balance = this.balances.find((balance) => balance.assetId === assetId);
        if (!balance) return 0;
        return balance.quantity;
    }

    getAccountId () {
        return this.accountId.getValue();
    }
}

export type Balance = {
    assetId: string,
    quantity: number
}