import type { Balance } from "../../domain/Wallet.ts";
import Wallet from "../../domain/Wallet.ts";
import type DatabaseConnection from "../database/DatabaseConnection.ts";

export default interface WalletRepository {
    update (wallet: Wallet): Promise<void>;
    getByAccountId (accountId: string): Promise<Wallet>;
}

export class WalletRepositoryDatabase implements WalletRepository {

    constructor (readonly databaseConnection: DatabaseConnection) {
    }

    async update (wallet: Wallet): Promise<void> {
        for (const balance of wallet.balances) {
            await this.databaseConnection.query("insert into app.balance (account_id, asset_id, quantity) values ($1, $2, $3) on conflict (account_id, asset_id) do update set quantity = excluded.quantity", [wallet.getAccountId(), balance.assetId, balance.quantity]);
        }
    }

    async getByAccountId (accountId: string): Promise<Wallet> {
        const balancesData = await this.databaseConnection.query("select * from app.balance where account_id = $1", [accountId]);
        const balances: Balance[] = [];
        for (const balanceData of balancesData) {
            balances.push({
                assetId: balanceData.asset_id,
                quantity: parseFloat(balanceData.quantity)
            })
        }
        const wallet = new Wallet(accountId, balances);
        return wallet;
    }
}
