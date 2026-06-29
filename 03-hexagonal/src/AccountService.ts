import crypto from "crypto";
import { validateCpf } from "./validateCpf.ts";
import { validateName } from "./validateName.ts";

// Driver Port
export default interface AccountService {
    signup (input: SignupInput): Promise<SignupOutput>;
    getAccount (accountId: string): Promise<GetAccountOutput>;
}

// Driven Port
export interface AccountServiceAccountData {
    save (account: Account): Promise<void>;
    getById (accountId: string): Promise<Account>;
}

type Account = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string
}

export class AccountServiceImpl {

    constructor (readonly accountData: AccountServiceAccountData) {
    }

    async signup (input: SignupInput): Promise<SignupOutput> {
        if (!validateName(input.name)) {
            throw new Error("Invalid name");
        }
        if (!input.email.match(/.+@.+\..+/)) {
            throw new Error("Invalid email");
        }
        if (!validateCpf(input.document)) {
            throw new Error("Invalid document");
        }
        if (
            input.password.length < 8 || 
            !input.password.match(/[a-z]/) || 
            !input.password.match(/[A-Z]/) || 
            !input.password.match(/[0-9]/)
        ) {
            throw new Error("Invalid password");
        }
        const account = {
            accountId: crypto.randomUUID(),
            name: input.name,
            email: input.email,
            document: input.document,
            password: input.password
        }
        await this.accountData.save(account);
        return {
            accountId: account.accountId
        };
    }

    async getAccount (accountId: string): Promise<GetAccountOutput> {
        const output = await this.accountData.getById(accountId);
        return output;
    }
}

export class AccountServiceFake implements AccountService {

    async signup(input: SignupInput): Promise<SignupOutput> {
        return {
            accountId: "1"
        }
    }

    async getAccount(accountId: string): Promise<GetAccountOutput> {
        return {
            accountId: "1",
            name: "a",
            email: "b",
            document: "c",
            password: "d"
        }
    }

}

type SignupInput = {
    name: string,
    email: string,
    document: string,
    password: string
}

type SignupOutput = {
    accountId: string
}

type GetAccountOutput = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string
}
