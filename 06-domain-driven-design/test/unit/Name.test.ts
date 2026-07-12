import { expect, test } from "vitest";
import { validateName } from "../../src/domain/validateName.ts";
import Name from "../../src/domain/Name.ts";

test("Deve validar o nome", () => {
    const name = new Name("John Doe");
    expect(name).toBeDefined();
});

test.each([
    "João Conceição",
    "Otávio Mück",
    "André Brandão",
    "Inês Façanha"
])("Deve validar o nome com acentuação: %s", (name: string) => {
    expect(new Name(name)).toBeDefined();
});

test.each([
    "John",
    undefined,
    null
])("Não deve validar o nome: %s", (name: any) => {
    expect(() => new Name(name)).toThrow(new Error("Invalid name"));
});
