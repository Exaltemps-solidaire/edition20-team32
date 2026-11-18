import { describe, expect, it } from "vitest";
import { annulerCreneau, bloquerCreneau, creerCreneau, listerCreneaux, modifierTitre } from "./creneaux.ts";

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
  it("crée un créneau disponible avec titre, jour et horaire", () => {
    const avant = listerCreneaux().length;
    const resultat = creerCreneau({ titre: "Écoute active", jour: "Vendredi 27 juin", horaire: "9 h – 10 h" });
    expect(resultat).toEqual({
      ok: true,
      creneau: {
        id: expect.any(String),
        titre: "Écoute active",
        jour: "Vendredi 27 juin",
        horaire: "9 h – 10 h",
        bloque: false,
      },
    });
    expect(listerCreneaux().length).toBe(avant + 1);
  });

  it("refuse un créneau sans titre", () => {
    const resultat = creerCreneau({ titre: null, jour: "Vendredi 27 juin", horaire: "9 h – 10 h" });
    expect(resultat).toEqual({ ok: false, erreur: "titre_requis" });
  });

  it("refuse un créneau sans jour", () => {
    const resultat = creerCreneau({ titre: "Écoute active", jour: null, horaire: "9 h – 10 h" });
    expect(resultat).toEqual({ ok: false, erreur: "jour_requis" });
  });

  it("refuse un créneau sans horaire", () => {
    const resultat = creerCreneau({ titre: "Écoute active", jour: "Vendredi 27 juin", horaire: null });
    expect(resultat).toEqual({ ok: false, erreur: "horaire_requis" });
  });
});

describe("modifierTitre", () => {
  it("modifie le titre d'un créneau existant", () => {
    const creneau = listerCreneaux()[0];
    const resultat = modifierTitre(creneau.id, "Nouveau titre");
    expect(resultat).toEqual({ ok: true, creneau: { ...creneau, titre: "Nouveau titre" } });
  });

  it("refuse un créneau inconnu", () => {
    const resultat = modifierTitre("inexistant", "Nouveau titre");
    expect(resultat).toEqual({ ok: false, erreur: "creneau_inconnu" });
  });

  it("refuse un titre vide", () => {
    const creneau = listerCreneaux()[0];
    const resultat = modifierTitre(creneau.id, null);
    expect(resultat).toEqual({ ok: false, erreur: "titre_requis" });
  });
});
