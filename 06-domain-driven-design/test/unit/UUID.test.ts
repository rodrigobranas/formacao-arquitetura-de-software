import { test, expect } from "vitest";
import UUID from "../../src/domain/UUID.ts";

test("Deve criar um UUID", () => {
    const uuid = UUID.create();
    expect(uuid).toBeDefined();
});

test("Não deve criar um UUID", () => {
    expect(() => new UUID("123546")).toThrow(new Error("Invalid UUID"));
});
