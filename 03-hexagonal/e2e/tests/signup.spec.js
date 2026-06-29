import { test, expect } from "@playwright/test";

test("Deve criar uma conta", async ({ page }) => {
  const input = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123"
  }
  await page.goto("http://localhost:5173");
  await page.locator(".input-name").fill(input.name);
  await page.locator(".input-email").fill(input.email);
  await page.locator(".input-document").fill(input.document);
  await page.locator(".input-password").fill(input.password);
  await page.locator(".button-signup").click();
  await expect(page.locator(".span-message")).toHaveText("success");
});

test("Não deve criar uma conta com nome inválido", async ({ page }) => {
  const input = {
    name: "John",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123"
  }
  await page.goto("http://localhost:5173");
  await page.locator(".input-name").fill(input.name);
  await page.locator(".input-email").fill(input.email);
  await page.locator(".input-document").fill(input.document);
  await page.locator(".input-password").fill(input.password);
  await page.locator(".button-signup").click();
  await expect(page.locator(".span-message")).toHaveText("Invalid name");
});
