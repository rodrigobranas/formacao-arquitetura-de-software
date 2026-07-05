import { expect, test } from "vitest";
import { validateEmail } from "../../src/validateEmail.ts";
import { validatePassword } from "../../src/validatePassword.ts";

test("Deve validar a senha", () => {
    const password = "asdQWE123";
    const isValid = validatePassword(password);
    expect(isValid).toBe(true);
});

test.each([
    "asd",
    "asdQWE",
    "asdQWE1",
])("Não deve ser um senha válido: %s", (password: string) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(false);
});