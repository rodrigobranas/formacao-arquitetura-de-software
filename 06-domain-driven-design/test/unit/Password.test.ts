import { expect, test } from "vitest";
import { MediumPassword, PasswordFactory, StrongPassword, WeakPassword } from "../../src/domain/Password.ts";

test("Deve validar a senha fraca", () => {
    const password = "1";
    expect(PasswordFactory.create(password, "weak")).toBeDefined();
});

test("Deve validar a senha média", () => {
    const password = "asdQWE123";
    expect(PasswordFactory.create(password, "medium")).toBeDefined();
});

test("Deve validar a senha forte", () => {
    const password = "asdQWEQab123!";
    expect(PasswordFactory.create(password, "strong")).toBeDefined();
});

test.each([
    "asd",
    "asdQWE",
    "asdQWE1",
])("Não deve ser um senha válido: %s", (password: string) => {
    expect(() => PasswordFactory.create(password, "medium")).toThrow(new Error("Invalid password"));
});

test("Deve verificar a senha", () => {
    const password = new WeakPassword("asdQWE123");
    expect(password.check("asdQWE123")).toBe(true);
});

test("Não deve verificar a senha", () => {
    const password = new WeakPassword("asdQWE123");
    expect(password.check("asdQWE")).toBe(false);
});
