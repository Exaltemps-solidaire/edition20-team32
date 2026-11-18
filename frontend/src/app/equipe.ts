// Règle de complétude d'équipe : 2 formateurs requis par session (point 10 d'ITERATIONS.md).
export type StatutEquipe = "prete" | "manquant" | "a_affecter";

export function calculerStatutEquipe(assignes: number, requis: number): StatutEquipe {
  if (assignes <= 0) return "a_affecter";
  if (assignes < requis) return "manquant";
  return "prete";
}

export function libelleStatutEquipe(statut: StatutEquipe, assignes: number, requis: number): string {
  if (statut === "prete") return "Équipe prête";
  if (statut === "a_affecter") return "À affecter";
  const manquants = requis - assignes;
  return `${manquants} formateur${manquants > 1 ? "s" : ""} manquant${manquants > 1 ? "s" : ""}`;
}
