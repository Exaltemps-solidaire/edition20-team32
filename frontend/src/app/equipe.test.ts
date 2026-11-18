import { describe, expect, it } from "vitest";
import { calculerStatutEquipe, libelleStatutEquipe } from "./equipe";

describe("calculerStatutEquipe", () => {
  it("aucun formateur assigné : à affecter", () => {
    expect(calculerStatutEquipe(0, 2)).toBe("a_affecter");
  });

  it("moins que le requis : manquant", () => {
    expect(calculerStatutEquipe(1, 2)).toBe("manquant");
  });

  it("le requis atteint : équipe prête", () => {
    expect(calculerStatutEquipe(2, 2)).toBe("prete");
  });
});

describe("libelleStatutEquipe", () => {
  it("affiche le nombre de formateurs manquants", () => {
    expect(libelleStatutEquipe("manquant", 1, 2)).toBe("1 formateur manquant");
  });
});
