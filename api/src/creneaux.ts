// Logique métier du calendrier : données en dur pour cette itération, pas de base de données.
// Un formateur bloque un créneau qu'il anime ; un créneau déjà bloqué ne peut pas l'être deux fois.

export type Creneau = {
  id: string;
  titre: string;
  jour: string;
  horaire: string;
  bloque: boolean;
};

const creneaux: Creneau[] = [
  { id: "lun-matin", titre: "todo", jour: "Lundi 23 juin", horaire: "9 h – 12 h", bloque: false },
  { id: "lun-aprem", titre: "todo", jour: "Lundi 23 juin", horaire: "14 h – 17 h", bloque: false },
  { id: "mar-matin", titre: "todo", jour: "Mardi 24 juin", horaire: "9 h 30 – 12 h", bloque: true },
  { id: "mer-matin", titre: "todo", jour: "Mercredi 25 juin", horaire: "9 h – 17 h", bloque: false },
  { id: "jeu-aprem", titre: "todo", jour: "Jeudi 26 juin", horaire: "14 h – 17 h", bloque: false },
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

export type ResultatAnnulation =
  | { ok: true; creneau: Creneau }
  | { ok: false; erreur: "creneau_inconnu" | "deja_disponible" };

export function annulerCreneau(id: string): ResultatAnnulation {
  const creneau = creneaux.find((c) => c.id === id);
  if (!creneau) return { ok: false, erreur: "creneau_inconnu" };
  if (!creneau.bloque) return { ok: false, erreur: "deja_disponible" };
  creneau.bloque = false;
  return { ok: true, creneau };
}

export type ResultatCreation =
  | { ok: true; creneau: Creneau }
  | { ok: false; erreur: "titre_requis" | "jour_requis" | "horaire_requis" };

export function creerCreneau(entree: {
  titre: string | null;
  jour: string | null;
  horaire: string | null;
}): ResultatCreation {
  if (!entree.titre) return { ok: false, erreur: "titre_requis" };
  if (!entree.jour) return { ok: false, erreur: "jour_requis" };
  if (!entree.horaire) return { ok: false, erreur: "horaire_requis" };
  const creneau: Creneau = {
    id: `creneau-${creneaux.length + 1}`,
    titre: entree.titre,
    jour: entree.jour,
    horaire: entree.horaire,
    bloque: false,
  };
  creneaux.push(creneau);
  return { ok: true, creneau };
}

export type ResultatModificationTitre =
  | { ok: true; creneau: Creneau }
  | { ok: false; erreur: "creneau_inconnu" | "titre_requis" };

export function modifierTitre(id: string, titre: string | null): ResultatModificationTitre {
  const creneau = creneaux.find((c) => c.id === id);
  if (!creneau) return { ok: false, erreur: "creneau_inconnu" };
  if (!titre) return { ok: false, erreur: "titre_requis" };
  creneau.titre = titre;
  return { ok: true, creneau };
}
