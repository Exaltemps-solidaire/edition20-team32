// Routage de l'API, sans dépendance : une fonction pure, testable sans démarrer de serveur.
// Le proxy d'entrée envoie /api/... à ce service sans retirer le préfixe : les routes métier
// se déclarent donc sous /api/v1/... ; /health et /sante restent à la racine (port 8081).
import { annulerCreneau, bloquerCreneau, creerCreneau, listerCreneaux } from "./creneaux.ts";

export type Reponse = { statut: number; corps?: unknown };

const chemBlocage = /^\/api\/v1\/creneaux\/([^/]+)\/bloquer$/;
const chemAnnulation = /^\/api\/v1\/creneaux\/([^/]+)\/annuler$/;

export function router(methode: string, url: string): Reponse {
  const urlObjet = new URL(url, "http://api");
  const chemin = urlObjet.pathname;
  if (methode === "GET" && (chemin === "/health" || chemin === "/sante")) {
    return { statut: 200, corps: { status: "ok" } };
  }
  if (methode === "GET" && chemin === "/api/v1/creneaux") {
    return { statut: 200, corps: listerCreneaux() };
  }
  if (methode === "POST" && chemin === "/api/v1/creneaux") {
    const resultat = creerCreneau({
      jour: urlObjet.searchParams.get("jour"),
      horaire: urlObjet.searchParams.get("horaire"),
    });
    if (!resultat.ok) {
      return { statut: 400, corps: { erreur: resultat.erreur } };
    }
    return { statut: 201, corps: resultat.creneau };
  }
  const blocage = chemin.match(chemBlocage);
  if (methode === "POST" && blocage) {
    const resultat = bloquerCreneau(blocage[1]);
    if (!resultat.ok) {
      const statut = resultat.erreur === "creneau_inconnu" ? 404 : 409;
      return { statut, corps: { erreur: resultat.erreur } };
    }
    return { statut: 200, corps: resultat.creneau };
  }
  const annulation = chemin.match(chemAnnulation);
  if (methode === "POST" && annulation) {
    const resultat = annulerCreneau(annulation[1]);
    if (!resultat.ok) {
      const statut = resultat.erreur === "creneau_inconnu" ? 404 : 409;
      return { statut, corps: { erreur: resultat.erreur } };
    }
    return { statut: 200, corps: resultat.creneau };
  }
  return { statut: 404 };
}
