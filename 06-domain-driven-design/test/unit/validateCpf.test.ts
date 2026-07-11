import { expect, test } from "vitest";
import { validateCpf } from "../../src/domain/validateCpf.ts";

test.each([
    "974.563.215-58",
    "71428793860",
    "87748248800"
])("Deve verificar um cpf válido: %s", (cpf: string) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
});

test.each([
    ["97456321550", "Dígito é inválido"],
    ["11111111111", "Não deve permitir cpf onde todos os dígitos sejam iguais"],
    [null, ""],
    [undefined, ""],
    ["974563215581000000000", ""]
])("Deve verificar um cpf inválido: %s motivo: %s", (cpf: any, motivo: string) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(false);
});
