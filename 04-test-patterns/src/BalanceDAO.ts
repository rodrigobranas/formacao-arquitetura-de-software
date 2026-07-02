import pgp from "pg-promise";

export default interface BalanceDAO {
    upsert (balance: Balance): Promise<void>;
    listByAccountId (accountId: string): Promise<Balance[]>
}

export class BalanceDAODatabase implements BalanceDAO {

    async upsert (balance: Balance): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into app.balance (account_id, asset_id, quantity) values ($1, $2, $3) on conflict (account_id, asset_id) do update set quantity = excluded.quantity", [balance.accountId, balance.assetId, balance.quantity]);
        await connection.$pool.end();
    }

    async listByAccountId (accountId: string): Promise<Balance[]> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const balancesData = await connection.query("select * from app.balance where account_id = $1", [accountId]);
        const balances: Balance[] = [];
        for (const balanceData of balancesData) {
            balances.push({
                accountId: balanceData.account_id,
                assetId: balanceData.asset_id,
                quantity: parseFloat(balanceData.quantity)
            })
        }
        await connection.$pool.end();
        return balances;
    }
}

export class BalanceDAOFake implements BalanceDAO {
    balances: Balance[] = [];

    async upsert(balance: Balance): Promise<void> {
        const existingBalance = this.balances.find((b: Balance) => b.accountId === balance.accountId && b.assetId === balance.assetId);
        if (existingBalance) {
            existingBalance.quantity = balance.quantity;
        } else {
            this.balances.push(balance);
        }
    }

    async listByAccountId(accountId: string): Promise<Balance[]> {
        const balances = this.balances.filter((balance: Balance) => balance.accountId === accountId);
        return balances;
    }

}

type Balance = {
    accountId: string,
    assetId: string,
    quantity: number
}
