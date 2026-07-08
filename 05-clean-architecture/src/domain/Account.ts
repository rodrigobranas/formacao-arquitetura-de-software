import crypto from "crypto";
import { validateName } from "./validateName.ts";
import { validateCpf } from "./validateCpf.ts";
import { validateEmail } from "./validateEmail.ts";
import { validatePassword } from "./validatePassword.ts";

export default class Account {

    constructor (readonly accountId: string, private name: string, readonly email: string, readonly document: string, readonly password: string, readonly balances: Balance[]) {
        if (!validateName(name)) throw new Error("Invalid name");
        if (!validateEmail(email)) throw new Error("Invalid email");
        if (!validateCpf(document)) throw new Error("Invalid document");
        if (!validatePassword(password)) throw new Error("Invalid password");
    }

    static create (name: string, email: string, document: string, password: string) {
        const accountId = crypto.randomUUID();
        const balances: Balance[] = [];
        return new Account(accountId, name, email, document, password, balances);
    }

    deposit (assetId: string, quantity: number) {
        const balance = this.balances.find((balance) => balance.assetId === assetId);
        if (balance) {
            balance.quantity += quantity;
        } else {
            this.balances.push({ assetId, quantity });
        }
    }

    withdraw (assetId: string, quantity: number) {
        const balance = this.balances.find((balance) => balance.assetId === assetId);
        if (!balance || balance.quantity < quantity) throw new Error("Out of balance");
        if (balance) {
            balance.quantity -= quantity;
        }
    }

    getBalance (assetId: string) {
        const balance = this.balances.find((balance) => balance.assetId === assetId);
        if (!balance) return 0;
        return balance.quantity;
    }

    setName (name: string) {
        if (!validateName(name)) throw new Error("Invalid name");
        this.name = name;
    }

    getName () {
        return this.name;
    }
}

export type Balance = {
    assetId: string,
    quantity: number
}