import { expect, test } from "vitest";
import { validateEmail } from "../../src/domain/validateEmail.ts";
import Email from "../../src/domain/Email.ts";

test("Deve validar o email", () => {
    const email = new Email("john.doe@gmail.com");
    expect(email).toBeDefined();
});

test.each([
    "john",
    "john.doe",
    "john.doe@",
    "john.doe@gmail"
])("Não deve ser um email válido: %s", (email: string) => {
    expect(() => new Email(email)).toThrow(new Error("Invalid email"));
});
