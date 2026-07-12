import Account, { type Balance } from "../../domain/Account.ts";
import type DatabaseConnection from "../database/DatabaseConnection.ts";

export default interface AccountRepository {
    save (account: Account): Promise<void>;
    update (account: Account): Promise<void>;
    getById (accountId: string): Promise<Account>;
    list (): Promise<Account[]>;
}

export class AccountRepositoryDatabase implements AccountRepository {

    constructor (readonly databaseConnection: DatabaseConnection) {
    }

    async save (account: Account): Promise<void> {
        await this.databaseConnection.query("insert into app.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.getAccountId(), account.getName(), account.getEmail(), account.getDocument(), account.getPassword()]);
        for (const balance of account.balances) {
            await this.databaseConnection.query("insert into app.balance (account_id, asset_id, quantity) values ($1, $2, $3) on conflict (account_id, asset_id) do update set quantity = excluded.quantity", [account.getAccountId(), balance.assetId, balance.quantity]);
        }
    }

    async update (account: Account): Promise<void> {
        await this.databaseConnection.query("update app.account set name = $1, email = $2, document = $3, password = $4 where account_id = $5", [account.getName(), account.getEmail(), account.getDocument(), account.getPassword(), account.getAccountId()]);
        for (const balance of account.balances) {
            await this.databaseConnection.query("insert into app.balance (account_id, asset_id, quantity) values ($1, $2, $3) on conflict (account_id, asset_id) do update set quantity = excluded.quantity", [account.getAccountId(), balance.assetId, balance.quantity]);
        }
    }

    async getById (accountId: string): Promise<Account> {
        const [accountData] = await this.databaseConnection.query("select * from app.account where account_id = $1", [accountId]);
        if (!accountData) throw new Error("Account not found");
        const balancesData = await this.databaseConnection.query("select * from app.balance where account_id = $1", [accountId]);
        const balances: Balance[] = [];
        for (const balanceData of balancesData) {
            balances.push({
                assetId: balanceData.asset_id,
                quantity: parseFloat(balanceData.quantity)
            })
        }
        const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password, balances);
        return account;
    }

    async list (): Promise<Account[]> {
        const accountsData = await this.databaseConnection.query("select * from app.account", []);
        const accounts: Account[] = [];
        for (const accountData of accountsData) {
            const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password, []);
            accounts.push(account);
        }
        
        return accounts;
    }
}

export class AccountRepositoryFake implements AccountRepository {
    accounts: Account[] = [];

    async save(account: Account): Promise<void> {
        this.accounts.push(account);
    }

    async update(account: Account): Promise<void> {
    }

    async getById(accountId: string): Promise<Account> {
        const account = this.accounts.find((account: Account) => account.getAccountId() === accountId);
        if (!account) throw new Error("Account not found");
        return account;
    }

    async list(): Promise<Account[]> {
        return this.accounts;
    }
}
