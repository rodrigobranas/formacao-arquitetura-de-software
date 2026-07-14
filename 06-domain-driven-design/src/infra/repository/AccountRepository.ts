import Account from "../../domain/Account.ts";
import type DatabaseConnection from "../database/DatabaseConnection.ts";
import AccountModel from "../orm/AccountModel.ts";
import type ORM from "../orm/ORM.ts";

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
    }

    async update (account: Account): Promise<void> {
        await this.databaseConnection.query("update app.account set name = $1, email = $2, document = $3, password = $4 where account_id = $5", [account.getName(), account.getEmail(), account.getDocument(), account.getPassword(), account.getAccountId()]);
    }

    async getById (accountId: string): Promise<Account> {
        const [accountData] = await this.databaseConnection.query("select * from app.account where account_id = $1", [accountId]);
        if (!accountData) throw new Error("Account not found");
        const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password);
        return account;
    }

    async list (): Promise<Account[]> {
        const accountsData = await this.databaseConnection.query("select * from app.account", []);
        const accounts: Account[] = [];
        for (const accountData of accountsData) {
            const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password);
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

export class AccountRepositoryORM implements AccountRepository {

    constructor (readonly orm: ORM) {
    }

    async save(account: Account): Promise<void> {
        const accountModel = AccountModel.from(account);
        await this.orm.save(accountModel);
    }

    async update(account: Account): Promise<void> {
        const accountModel = AccountModel.from(account);
        await this.orm.update(accountModel);
    }

    async getById(accountId: string): Promise<Account> {
        const accountModel = await this.orm.get(AccountModel, "account_id", accountId);
        return accountModel.toEntity();
    }

    async list(): Promise<Account[]> {
        return [];
    }

}
