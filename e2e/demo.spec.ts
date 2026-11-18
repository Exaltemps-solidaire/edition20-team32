import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je vois le calendrier de la semaine", async () => {
    await expect(page.getByRole("heading", { name: /Calendrier des formations/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bloquer ce créneau" }).first()).toBeVisible();
  });

  await test.step("Je bloque un créneau en tant que formateur", async () => {
    await page.getByRole("button", { name: "Bloquer ce créneau" }).first().click();
    await expect(page.getByText("Bloqué").first()).toBeVisible();
  });
});
