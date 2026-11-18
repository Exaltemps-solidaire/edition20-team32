import { describe, expect, it } from "vitest";
import { libelleDemiJournee } from "./horaire";

describe("libelleDemiJournee", () => {
  it("reconnaît un créneau du matin", () => {
    expect(libelleDemiJournee("9 h – 12 h")).toBe("Matin");
  });

  it("reconnaît un créneau de l'après-midi", () => {
    expect(libelleDemiJournee("14 h – 17 h")).toBe("Après-midi");
  });

  it("reconnaît une journée complète", () => {
    expect(libelleDemiJournee("9 h – 17 h")).toBe("Journée");
  });
});
