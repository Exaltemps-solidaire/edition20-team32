// Dérive un libellé demi-journée depuis l'horaire texte existant (pas de nouveau champ de données).
export function libelleDemiJournee(horaire: string): string {
  const debutMatch = horaire.match(/^(\d+)\s*h/);
  if (!debutMatch) return "todo";
  const finMatch = horaire.match(/[–-]\s*(\d+)\s*h/);
  const debut = Number(debutMatch[1]);
  const fin = finMatch ? Number(finMatch[1]) : debut;
  const matin = debut < 13;
  const apresMidi = fin > 13;
  if (matin && apresMidi) return "Journée";
  return matin ? "Matin" : "Après-midi";
}
