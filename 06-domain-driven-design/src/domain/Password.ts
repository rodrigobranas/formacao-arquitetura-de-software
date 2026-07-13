export default abstract class Password {
    protected value: string;

    constructor (password: string) {
        if (!this.validatePassword(password)) throw new Error("Invalid password");
        this.value = password;
    }

    check (password: string) {
        return password === this.value;
    }

    abstract validatePassword (password: string): boolean;

    getValue () {
        return this.value;
    }
}

export class WeakPassword extends Password {

    validatePassword(password: string): boolean {
        return !!password;
    }
    
}

export class MediumPassword extends Password {

    validatePassword(password: string): boolean {
        if (!password) return false;
        if (password.length < 8) return false;
        if (!password.match(/[a-z]/)) return false;
        if (!password.match(/[A-Z]/)) return false;
        if (!password.match(/[0-9]/)) return false;
        return true;
    }
}

export class StrongPassword extends Password {

    validatePassword(password: string): boolean {
        if (!password) return false;
        if (password.length < 12) return false;
        if (!password.match(/[a-z]/)) return false;
        if (!password.match(/[A-Z]/)) return false;
        if (!password.match(/[0-9]/)) return false;
        if (!password.match(/[^a-zA-Z0-9]/)) return false;
        return true;
    }
}

export class PasswordFactory {

    static create (password: string, strength: string) {
        if (strength === "weak") return new WeakPassword(password);
        if (strength === "medium") return new MediumPassword(password);
        if (strength === "strong") return new StrongPassword(password);
        throw new Error("Invalid password strength");
    }
}
