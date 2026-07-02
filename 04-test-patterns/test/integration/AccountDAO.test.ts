import { expect, test } from "vitest";
import crypto from "crypto";
import { AccountDAODatabase } from "../../src/AccountDAO.ts";

test("Deve persistir uma conta", async () => {
    const accountDAO = new AccountDAODatabase();
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    await accountDAO.save(account);
    const savedAccount = await accountDAO.getById(account.accountId);
    expect(savedAccount.accountId).toBe(account.accountId);
    expect(savedAccount.name).toBe(account.name);
    expect(savedAccount.email).toBe(account.email);
    expect(savedAccount.document).toBe(account.document);
    expect(savedAccount.password).toBe(account.password);
});
