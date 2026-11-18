# Déploiement

Calendrier partagé des formations pour **La Cloche** (association de lutte contre l'exclusion des
personnes sans domicile) : un formateur ou une formatrice voit les créneaux de la semaine et peut
bloquer celui qu'il ou elle anime.

## Services

- `frontend/` — Next.js en export statique, servi par nginx (port 80 du conteneur, 8080 sur la VM).
  **C'est le service exposé au public.**
- `api/` — Node sans dépendance, port 8081. Reçoit les appels `/api/v1/...` relayés par le proxy
  d'entrée.

## Services externes appelés

Aucun pour l'instant. Les créneaux sont des données en dur dans `api/src/creneaux.ts`, en mémoire :
rien n'est persisté entre deux redémarrages du conteneur `api`.

## Ce qui est connu comme fragile ou inachevé

- Pas de base de données : un redémarrage de `api` réinitialise tous les créneaux (le créneau du
  mardi matin redevient « bloqué » par défaut, les autres redeviennent disponibles).
- Un seul écran : la saisie des disponibilités, la vue capacité de la coordinatrice, le calendrier
  commerçant et la réservation ne sont pas encore construits (voir `ITERATIONS.md`).
- Pas d'authentification : n'importe quel visiteur peut bloquer un créneau depuis l'écran public.

## Contact

Équipe 32 (eXaltemps Solidaire) côté build ; association La Cloche, antenne Île-de-France, côté
association — coordonnées dans la passation de l'équipe (non versée dans ce dépôt).
