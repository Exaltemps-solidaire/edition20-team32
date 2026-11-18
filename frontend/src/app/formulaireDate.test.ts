import { describe, expect, it } from "vitest";
import { formatHoraire, formatJour } from "./formulaireDate";

describe("formatJour", () => {
  it("formate une date du samedi", () => {
    expect(formatJour("2026-06-27")).toBe("Samedi 27 juin");
  });

  it("formate une date du mercredi", () => {
    expect(formatJour("2026-06-24")).toBe("Mercredi 24 juin");
  });
});

describe("formatHoraire", () => {
  it("formate un horaire rond", () => {
    expect(formatHoraire("09:00", "12:00")).toBe("9 h – 12 h");
  });

  it("formate un horaire avec minutes", () => {
    expect(formatHoraire("09:30", "12:00")).toBe("9 h 30 – 12 h");
  });
});
