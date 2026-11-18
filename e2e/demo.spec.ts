import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je vois le calendrier de la semaine, groupé par jour", async () => {
    await expect(page.getByRole("heading", { name: /Calendrier des formations/ })).toBeVisible();
    await expect(page.locator("button:not([disabled])").first()).toBeVisible();
  });

  await test.step("Je bloque un créneau en tant que formateur", async () => {
    const creneauDisponible = page.locator("button:not([disabled])").first();
    await creneauDisponible.click();
    await expect(creneauDisponible).toBeDisabled();
    await expect(creneauDisponible).toContainText("Bloqué");
  });
});
