import { describe, expect, it } from "vitest";
import { annulerCreneau, bloquerCreneau, creerCreneau, listerCreneaux } from "./creneaux.ts";

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

describe("creerCreneau", () => {
  it("crée un créneau disponible avec jour et horaire", () => {
    const avant = listerCreneaux().length;
    const resultat = creerCreneau({ jour: "Vendredi 27 juin", horaire: "9 h – 10 h" });
    expect(resultat).toEqual({
      ok: true,
      creneau: { id: expect.any(String), jour: "Vendredi 27 juin", horaire: "9 h – 10 h", bloque: false },
    });
    expect(listerCreneaux().length).toBe(avant + 1);
  });

  it("refuse un créneau sans jour", () => {
    const resultat = creerCreneau({ jour: null, horaire: "9 h – 10 h" });
    expect(resultat).toEqual({ ok: false, erreur: "jour_requis" });
  });

  it("refuse un créneau sans horaire", () => {
    const resultat = creerCreneau({ jour: "Vendredi 27 juin", horaire: null });
    expect(resultat).toEqual({ ok: false, erreur: "horaire_requis" });
  });
});
