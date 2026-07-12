export default class Cpf {
    VALID_CPF_LENGTH = 11;
    WEIGHT_FIRST_DIGIT = 10;
    WEIGHT_SECOND_DIGIT = 11;

    private value: string;

    constructor (cpf: string) {
        if (!cpf || !this.validateCpf(cpf)) throw new Error("Invalid document");
        this.value = cpf;
    }

    validateCpf (cpf: string) {
        if (!cpf) return false;
        cpf = this.removeNonDigits(cpf);
        if (cpf.length !== this.VALID_CPF_LENGTH) return false;
        if (this.areAllDigitsTheSame(cpf)) return false;
        const digit1 = this.calculateDigit(cpf, this.WEIGHT_FIRST_DIGIT);
        const digit2 = this.calculateDigit(cpf, this.WEIGHT_SECOND_DIGIT);
        let checkDigit = this.extractCheckDigit(cpf);
        return checkDigit === `${digit1}${digit2}`;
    }

    removeNonDigits (cpf: string) {
        return cpf.replace(/\D/g,'');
    }

    areAllDigitsTheSame (cpf: string) {
        const [firstDigit] = cpf;
        return [...cpf].every((digit: string) => digit === firstDigit);
    }

    calculateDigit (cpf: string, weight: number) {
        let sum = 0;
        for (const digit of cpf) {
            if (weight < 2) break;
            sum += parseInt(digit) * weight--;
        }
        const remainder = sum%11;
        return (remainder < 2) ? 0 : 11 - remainder;
    }

    extractCheckDigit (cpf: string) {
        return cpf.slice(9);
    }

    getValue () {
        return this.value;
    }

}
