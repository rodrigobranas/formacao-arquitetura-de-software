import Name from "./Name.ts";
import Email from "./Email.ts";
import Cpf from "./Cpf.ts";
import Password, { MediumPassword, PasswordFactory } from "./Password.ts";
import UUID from "./UUID.ts";

export default class Account {
    private accountId: UUID;
    private name: Name;
    private email: Email;
    private document: Cpf;
    private password: Password;

    constructor (accountId: string, name: string, email: string, document: string, password: string) {
        this.accountId = new UUID(accountId);
        this.name = new Name(name);
        this.email = new Email(email);
        this.document = new Cpf(document);
        this.password = new MediumPassword(password);
    }

    static create (name: string, email: string, document: string, password: string) {
        const accountId = UUID.create();
        return new Account(accountId.getValue(), name, email, document, password);
    }

    checkPassword (password: string) {
        return this.password.check(password);
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

    setPassword (password: string) {
        this.password = PasswordFactory.create(password, "medium");
    }

    getAccountId () {
        return this.accountId.getValue();
    }
}
