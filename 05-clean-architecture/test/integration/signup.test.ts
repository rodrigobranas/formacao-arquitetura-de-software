import { test, expect } from "vitest";
import { AccountRepositoryDatabase, AccountRepositoryFake } from "../../src/AccountRepository.ts";
import { Signup } from "../../src/Signup.ts";
import { GetAccount } from "../../src/GetAccount.ts";

test("Deve criar uma conta", async () => {
    const accountRepository = new AccountRepositoryDatabase();
    const signup = new Signup(accountRepository);
    const getAccount = new GetAccount(accountRepository);
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});
