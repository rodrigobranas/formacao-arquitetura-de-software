import { test, expect } from "vitest";
import { AccountDataDatabase, AccountDataFake } from "../../src/AccountData.ts";
import { AccountServiceImpl } from "../../src/AccountService.ts";

test("Deve criar uma conta", async () => {
    const accountData = new AccountDataDatabase();
    // const accountData = new AccountDataFake();
    const accountService = new AccountServiceImpl(accountData);
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(input);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});
