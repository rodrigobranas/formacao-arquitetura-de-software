import { expect, test } from "vitest";
import { AccountDataDatabase } from "../../src/AccountData.ts";
import crypto from "crypto";

test("Deve persistir uma conta", async () => {
    const accountData = new AccountDataDatabase();
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    await accountData.save(account);
    const savedAccount = await accountData.getById(account.accountId);
    expect(savedAccount.accountId).toBe(account.accountId);
    expect(savedAccount.name).toBe(account.name);
    expect(savedAccount.email).toBe(account.email);
    expect(savedAccount.document).toBe(account.document);
    expect(savedAccount.password).toBe(account.password);
});
