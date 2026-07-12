import { expect, test } from "vitest";
import Password from "../../src/domain/Password.ts";

test("Deve validar a senha", () => {
    const password = "asdQWE123";
    expect(new Password(password)).toBeDefined();
});

test.each([
    "asd",
    "asdQWE",
    "asdQWE1",
])("Não deve ser um senha válido: %s", (password: string) => {
    expect(() => new Password(password)).toThrow(new Error("Invalid password"));
});