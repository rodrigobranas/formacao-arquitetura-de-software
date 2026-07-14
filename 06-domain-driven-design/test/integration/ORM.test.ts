import { test, expect } from "vitest";
import Account from "../../src/domain/Account.ts";
import AccountModel from "../../src/infra/orm/AccountModel.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import ORM from "../../src/infra/orm/ORM.ts";

test("Deve persistir uma conta usando o ORM", async () => {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    const accountModel = AccountModel.from(account);
    expect(accountModel.accountId).toBe(account.getAccountId());
    expect(accountModel.name).toBe(account.getName());
    expect(accountModel.email).toBe(account.getEmail());
    expect(accountModel.document).toBe(account.getDocument());
    expect(accountModel.password).toBe(account.getPassword());
    const databaseConnection = new PgPromiseAdapter();
    const orm = new ORM(databaseConnection);
    await orm.save(accountModel);
    const savedAccountModel = await orm.get(AccountModel, "account_id", accountModel.accountId);
    expect(savedAccountModel.accountId).toBe(accountModel.accountId);
    expect(savedAccountModel.name).toBe(accountModel.name);
    expect(savedAccountModel.email).toBe(accountModel.email);
    expect(savedAccountModel.document).toBe(accountModel.document);
    expect(savedAccountModel.password).toBe(accountModel.password);
    savedAccountModel.name = "Bob Martin";
    await orm.update(savedAccountModel);
    const updatedAccountModel = await orm.get(AccountModel, "account_id", savedAccountModel.accountId);
    expect(updatedAccountModel.name).toBe(savedAccountModel.name);
});
