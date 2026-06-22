import { expect, test } from "vitest";
import { validateName } from "../../src/validateName.ts";

test("Deve validar o nome", () => {
    const name = "John Doe";
    const isValid = validateName(name);
    expect(isValid).toBe(true);
});

test.each([
    "John",
    undefined,
    null
])("Não deve validar o nome: %s", (name: any) => {
    const isValid = validateName(name);
    expect(isValid).toBe(false);
});
