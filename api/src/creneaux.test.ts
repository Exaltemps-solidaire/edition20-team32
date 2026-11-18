import { describe, expect, it } from "vitest";
import { annulerCreneau, bloquerCreneau, listerCreneaux } from "./creneaux.ts";

describe("bloquerCreneau", () => {
  it("bloque un créneau disponible", () => {
    const disponible = listerCreneaux().find((c) => !c.bloque);
    const resultat = bloquerCreneau(disponible!.id);
    expect(resultat).toEqual({ ok: true, creneau: { ...disponible, bloque: true } });
  });

  it("refuse de bloquer un créneau déjà bloqué", () => {
    const bloque = listerCreneaux().find((c) => c.bloque);
    const resultat = bloquerCreneau(bloque!.id);
    expect(resultat).toEqual({ ok: false, erreur: "deja_bloque" });
  });

  it("refuse de bloquer un créneau inconnu", () => {
    const resultat = bloquerCreneau("inexistant");
    expect(resultat).toEqual({ ok: false, erreur: "creneau_inconnu" });
  });
});

describe("annulerCreneau", () => {
  it("libère un créneau bloqué", () => {
    const bloque = listerCreneaux().find((c) => c.bloque);
    const resultat = annulerCreneau(bloque!.id);
    expect(resultat).toEqual({ ok: true, creneau: { ...bloque, bloque: false } });
  });

  it("refuse d'annuler un créneau déjà disponible", () => {
    const disponible = listerCreneaux().find((c) => !c.bloque);
    const resultat = annulerCreneau(disponible!.id);
    expect(resultat).toEqual({ ok: false, erreur: "deja_disponible" });
  });
});
