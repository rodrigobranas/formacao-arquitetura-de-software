import { expect, test } from "vitest";
import { validateEmail } from "../../src/domain/validateEmail.ts";

test("Deve validar o email", () => {
    const email = "john.doe@gmail.com";
    const isValid = validateEmail(email);
    expect(isValid).toBe(true);
});

test.each([
    "john",
    "john.doe",
    "john.doe@",
    "john.doe@gmail"
])("Não deve ser um email válido: %s", (email: string) => {
    const isValid = validateEmail(email);
    expect(isValid).toBe(false);
});
