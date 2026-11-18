// Logique métier du calendrier : données en dur pour cette itération, pas de base de données.
// Un formateur bloque un créneau qu'il anime ; un créneau déjà bloqué ne peut pas l'être deux fois.

export type Creneau = {
  id: string;
  jour: string;
  horaire: string;
  bloque: boolean;
};

const creneaux: Creneau[] = [
  { id: "lun-matin", jour: "Lundi 23 juin", horaire: "9 h – 12 h", bloque: false },
  { id: "lun-aprem", jour: "Lundi 23 juin", horaire: "14 h – 17 h", bloque: false },
  { id: "mar-matin", jour: "Mardi 24 juin", horaire: "9 h 30 – 12 h", bloque: true },
  { id: "mer-matin", jour: "Mercredi 25 juin", horaire: "9 h – 17 h", bloque: false },
  { id: "jeu-aprem", jour: "Jeudi 26 juin", horaire: "14 h – 17 h", bloque: false },
];

export function listerCreneaux(): Creneau[] {
  return creneaux;
}

export type ResultatBlocage =
  | { ok: true; creneau: Creneau }
  | { ok: false; erreur: "creneau_inconnu" | "deja_bloque" };

export function bloquerCreneau(id: string): ResultatBlocage {
  const creneau = creneaux.find((c) => c.id === id);
  if (!creneau) return { ok: false, erreur: "creneau_inconnu" };
  if (creneau.bloque) return { ok: false, erreur: "deja_bloque" };
  creneau.bloque = true;
  return { ok: true, creneau };
}
