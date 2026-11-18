// Routage de l'API, sans dépendance : une fonction pure, testable sans démarrer de serveur.
// Le proxy d'entrée envoie /api/... à ce service sans retirer le préfixe : les routes métier
// se déclarent donc sous /api/v1/... ; /health et /sante restent à la racine (port 8081).
import { bloquerCreneau, listerCreneaux } from "./creneaux.ts";

export type Reponse = { statut: number; corps?: unknown };

const chemBlocage = /^\/api\/v1\/creneaux\/([^/]+)\/bloquer$/;

export function router(methode: string, url: string): Reponse {
  const chemin = new URL(url, "http://api").pathname;
  if (methode === "GET" && (chemin === "/health" || chemin === "/sante")) {
    return { statut: 200, corps: { status: "ok" } };
  }
  if (methode === "GET" && chemin === "/api/v1/creneaux") {
    return { statut: 200, corps: listerCreneaux() };
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
  return { statut: 404 };
}
