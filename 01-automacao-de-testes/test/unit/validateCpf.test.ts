import { expect, test } from "vitest";
import { validateCpf } from "../../src/validateCpf.ts";

test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("Deve verificar um cpf válido: %s", (cpf: string) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
});

test.each([
    "97456321550",
    "11111111111",
    null,
    undefined,
    "974563215581000000000"
])("Deve verificar um cpf inválido: %s", (cpf: any) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(false);
});
