const VALID_CPF_LENGTH = 11;
const WEIGHT_FIRST_DIGIT = 10;
const WEIGHT_SECOND_DIGIT = 11;

export function validateCpf (cpf: string) {
	if (!cpf) return false;
	cpf = removeNonDigits(cpf);
	if (cpf.length !== VALID_CPF_LENGTH) return false;
	if (areAllDigitsTheSame(cpf)) return false;
	const digit1 = calculateDigit(cpf, WEIGHT_FIRST_DIGIT);
	const digit2 = calculateDigit(cpf, WEIGHT_SECOND_DIGIT);
	let checkDigit = extractCheckDigit(cpf);
	return checkDigit === `${digit1}${digit2}`;
}

function removeNonDigits (cpf: string) {
	return cpf.replace(/\D/g,'');
}

function areAllDigitsTheSame (cpf: string) {
	const [firstDigit] = cpf;
	return [...cpf].every((digit: string) => digit === firstDigit);
}

function calculateDigit (cpf: string, weight: number) {
	let sum = 0;
	for (const digit of cpf) {
		if (weight < 2) break;
		sum += parseInt(digit) * weight--;
	}
	const remainder = sum%11;
	return (remainder < 2) ? 0 : 11 - remainder;
}

function extractCheckDigit (cpf: string) {
	return cpf.slice(9);
}
