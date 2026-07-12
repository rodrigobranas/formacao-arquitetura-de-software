import crypto from "crypto";
import Name from "./Name.ts";
import Email from "./Email.ts";
import Cpf from "./Cpf.ts";
import Password from "./Password.ts";

export default class Account {
    private name: Name;
    private email: Email;
    private document: Cpf;
    private password: Password;

    constructor (readonly accountId: string, name: string, email: string, document: string, password: string, readonly balances: Balance[]) {
        this.name = new Name(name);
        this.email = new Email(email);
        this.document = new Cpf(document);
        this.password = new Password(password);
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
        this.name = new Name(name);
    }

    getName () {
        return this.name.getValue();
    }

    getEmail () {
        return this.email.getValue();
    }

    getDocument () {
        return this.document.getValue();
    }

    getPassword () {
        return this.password.getValue();
    }
}

export type Balance = {
    assetId: string,
    quantity: number
}