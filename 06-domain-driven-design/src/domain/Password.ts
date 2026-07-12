export default class Password {
    private value: string;

    constructor (password: string) {
        if (!this.validatePassword(password)) throw new Error("Invalid password");
        this.value = password;
    }

    private validatePassword (password: string) {
        if (!password) return false;
        if (password.length < 8) return false;
        if (!password.match(/[a-z]/)) return false;
        if (!password.match(/[A-Z]/)) return false;
        if (!password.match(/[0-9]/)) return false;
        return true;
    }

    getValue () {
        return this.value;
    }
}