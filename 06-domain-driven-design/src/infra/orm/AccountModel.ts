import Account from "../../domain/Account.ts";
import { column, model, Model } from "./ORM.ts";

@model({ schema: "app", table: "account" })
export default class AccountModel extends Model {
    @column({ name: "account_id", pk: true })
    accountId: string;
    @column({ name: "name" })
    name: string;
    @column({ name: "email" })
    email: string;
    @column({ name: "document" })
    document: string;
    @column({ name: "password" })
    password: string;

    constructor (accountId: string, name: string, email: string, document: string, password: string) {
        super();
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.document = document;
        this.password = password;
    }

    static from (account: Account) {
        return new AccountModel(account.getAccountId(), account.getName(), account.getEmail(), account.getDocument(), account.getPassword());
    }

    toEntity () {
        return new Account(this.accountId, this.name, this.email, this.document, this.password);
    }

}
