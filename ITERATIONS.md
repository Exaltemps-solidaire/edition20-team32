# Plan d'itérations — La Cloche, calendrier partagé des formations

- **Source** : proposé par l'agent (aucun plan d'itérations trouvé dans la passation : ni fichier `cadrage/*iteration*`, ni clé `iterations` dans `passation.json`).
- **Plan validé le 2026-11-18** : le développeur a validé ce plan et accordé 15 minutes (au lieu des 8 initialement annoncées) pour coder l'itération 1, en demandant d'y inclure dès maintenant un calendrier et le blocage d'un créneau côté formateur.
- **Temps restant annoncé** : 8 minutes jusqu'à la fin du build (répondu le 2026-11-18), révisé à 15 minutes pour l'itération 1 (voir ci-dessus).
- **Tour de test de l'équipe** : 10 minutes.
- **Hors périmètre déclaré** : rien n'a encore été exclu explicitement par les cadreurs (`matiere/arbitrages.md` = aucun vote consolidé) ; le découpage ci-dessous reprend l'ordre du flux décrit dans l'idée retenue (`PASSATION.md` / `cadrage/3-solution.md`).

## ✂️ Alerte de capacité — à lire avant de lancer `/iteration 1`

Le calcul de capacité (codage ≤ 10 min + publication ≈ 5 min + tour de test ≈ 10 min) demande **au moins 25 minutes** pour un cycle complet d'itération, et **au moins 15 minutes** rien que pour coder et publier. Il ne reste que **8 minutes**. De plus, la plateforme (`postgres.internal` et le reste) n'est pas démarrée : aucun conteneur `team32` ne tourne, et son démarrage seul prend « quelques minutes » d'après le `CLAUDE.md` du serveur, avant même de construire et pousser les images.

**Conséquence concrète** : même l'itération 1, réduite au strict squelette déjà présent dans le dépôt (`api/` et `frontend/` existent déjà avec leurs `Dockerfile`, `/health` et `/sante`), ne peut pas boucler jusqu'au signal PM Lab dans les 8 minutes annoncées. Je ne gonfle pas l'itération pour la faire rentrer de force : je le signale avant de coder.

❓ **Question pour toi** : comment veux-tu qu'on utilise ces 8 minutes ?
1. **Lancer quand même le démarrage de la plateforme maintenant** (en arrière-plan, ça ne consomme pas de temps de codage) et écrire les fichiers de préparation (`.env.example`, `DEPLOIEMENT.md`, `podman-compose.yml`) pendant qu'elle démarre — en acceptant que la construction/poussée/déploiement/signal déborde sur le temps déjà annoncé comme la fin du build.
2. **Ne rien lancer** et vérifier d'abord auprès des cadreurs si plus de temps est accordé, pour éviter de laisser un déploiement à moitié fait.

Le reste de ce document part du principe que tu choisis l'option 1 (c'est la plus proche de la recommandation du `CLAUDE.md` du serveur : « lance-la en arrière-plan et écris le code pendant ce temps »), mais je ne lance rien avant ta confirmation.

---

## Itération 1 : le calendrier de la semaine est en ligne, un formateur peut y bloquer un créneau

- **Dans le périmètre** :
  - démarrer la plateforme en arrière-plan, créer la base `team32` ;
  - écrire `.env.example` (toutes les variables lues par `api/` et `frontend/`) et `DEPLOIEMENT.md` ;
  - écrire `podman-compose.yml` (réseau `core-network`, ports 8080/8081, images `localhost:5000/team32/...`) ;
  - un écran calendrier (données en dur, 5 créneaux sur la semaine) avec un bouton « Bloquer ce créneau » par créneau disponible ;
  - route API `GET /api/v1/creneaux` (liste) et `POST /api/v1/creneaux/:id/bloquer` (blocage, idempotent côté erreur : 404 si inconnu, 409 si déjà bloqué) ;
  - construire, pousser, déployer les images ; vérifier `localhost:8080/` et `localhost:8081/health` depuis la machine.
- **Hors périmètre** : la saisie des disponibilités par le formateur, la vue capacité de la coordinatrice, l'affectation, la réservation commerçant, toute persistance (les créneaux sont en mémoire, réinitialisés au redémarrage du conteneur `api`).
- **Critères d'acceptation** :
  - Étant donné le calendrier affiché, quand un formateur clique sur « Bloquer ce créneau » d'un créneau disponible, alors il apparaît comme bloqué à l'écran sans rechargement de page.
  - Étant donné un créneau déjà bloqué, quand on tente de le bloquer à nouveau, alors l'API répond 409 et l'écran affiche un message d'erreur.
  - Étant donné l'application déployée, quand le développeur ouvre `$URL_PUBLIQUE/sante` dans son navigateur, alors elle répond `200` avec un corps non vide (vérifié par le développeur, hors harnais).
- **Hypothèse de l'équipe couverte** : aucune directement (les 3 hypothèses de la passation portent sur l'affectation et la réservation, pas encore construites) — cette itération pose l'écran et l'infrastructure qui les porteront.
- **Codage estimé** : 3 à 5 minutes.
- **Fichiers prévus** : `.env.example`, `DEPLOIEMENT.md`, `podman-compose.yml`, `api/src/creneaux.ts`, `api/src/routes.ts`, `frontend/src/app/page.tsx` (≤ 5 fichiers applicatifs, hors tests et Dockerfiles).
- **Tests unitaires prévus** : 3, sur `bloquerCreneau` (bloque un créneau disponible, refuse si déjà bloqué, refuse si inconnu).
- **Étapes ajoutées à la démo** (`e2e/demo.spec.ts`) : ouvrir le calendrier, bloquer un créneau disponible, vérifier qu'il s'affiche comme bloqué.
- **Bilan** :
  - Codage réel : **2 minutes** (budget de 15 minutes accordé par le développeur, largement respecté — aucun dépassement).
  - Critères satisfaits : les 3 — blocage visible sans rechargement, 409 sur double blocage (le message d'erreur affiché à l'écran est générique, pas encore spécifique « déjà bloqué » vs autre refus), `/sante` répond 200 avec corps non vide sur les deux ports (`{"status":"ok"}` et `ok`).
  - Reporté : rien de prévu n'a été coupé. `e2e/demo.spec.ts` a été mis à jour (ouvrir le calendrier, bloquer un créneau), mais son exécution locale échoue pour une raison d'environnement (bibliothèques système manquantes pour Chromium headless, `libnspr4.so` absent), pas un bug applicatif ; non traité, hors DoD (« une démo qui échoue se signale, elle ne bloque pas la publication »). `$URL_PUBLIQUE` n'a pas été testée depuis cette machine : elle y est injoignable par construction.
  - Bloqué/refusé par le harnais : rien — `./scripts/verifier-deployabilite.sh` n'a signalé aucune borne, `npm test` passait avant le signal.
  - Dépassement notable du périmètre déclaré au départ : 9 fichiers touchés au total en comptant les deux `Dockerfile` (correction nécessaire : `FROM node:24-alpine` → `FROM docker.io/library/node:24-alpine`, la résolution de nom court échoue sinon) et `api/src/creneaux.test.ts` — above la règle des « ~5 fichiers », assumé car cette itération fusionne volontairement l'infrastructure (normalement seule dans l'itération 1 du gabarit) avec la première fonctionnalité, à la demande explicite du développeur.
  - **Modifications** :
    - `api/src/creneaux.ts` — logique métier des créneaux et du blocage (en mémoire) ; sert les 3 critères.
    - `api/src/creneaux.test.ts` — 3 tests unitaires sur `bloquerCreneau`.
    - `api/src/routes.ts` — ajout des routes `GET /api/v1/creneaux` et `POST /api/v1/creneaux/:id/bloquer`.
    - `frontend/src/app/page.tsx` — écran calendrier, affichage et action de blocage.
    - `.env.example` — documente `PORT` (contrat de déployabilité).
    - `DEPLOIEMENT.md` — un-pager de déploiement (contrat de déployabilité).
    - `podman-compose.yml` — assemblage `frontend`/`api` sur `core-network`, ports 8080/8081.
    - `api/Dockerfile`, `frontend/Dockerfile` — qualification `docker.io/library/...` des images de base (sinon échec de résolution de nom court sur cette machine).
  - Version 1 signalée à PM Lab le 2026-11-18T15:46:15Z, à `https://edition20-team32.exaltemps-space.com`.

## ✂️ Alerte de capacité — à lire avant de lancer `/iteration 2`

Il reste **5 minutes** avant la fin du build (répondu le 2026-11-18), tour de test de l'équipe annoncé à 10 minutes. Le calcul de capacité (codage ≤ 10 min + publication ≈ 5 min + tour de test ≈ 10 min) ne passe pas : la seule publication (construire, pousser, redéployer, vérifier, signaler) couvre déjà tout le temps restant, même à 0 minute de codage, et il faudrait encore le tour de test. Je ne force pas une itération complète dans ce temps.

❓ **Question pour toi** : comment veux-tu qu'on utilise ces 5 minutes ?
1. **Coder le plus petit changement possible maintenant** (le calendrier en grille au lieu d'une liste, même visuel, mêmes données, même action de blocage) et accepter que publication + signal + tour de test débordent sur le temps déjà annoncé comme fin de build.
2. **Ne rien coder** et vérifier d'abord auprès des cadreurs si plus de temps est accordé, pour ne pas laisser un déploiement à moitié fait ni répéter le dépassement de l'itération 1.
3. **Traiter cette itération comme la dernière** : dans ce cas, d'après `CLAUDE.md` (« Quand le temps restant ne permet plus qu'une itération, consacre-la à stabiliser ce qui sera montré au pitch »), le plus utile n'est peut-être pas un nouvel écran mais de vérifier que l'itération 1 tient bien en ligne pour le pitch.

Le reste de cette section part du principe que tu choisis l'option 1 (même schéma que l'itération 1, et le changement demandé est purement visuel — pas de nouvelle route API, pas de nouvelle donnée), mais je ne code rien avant ta confirmation.

## Itération 2 : le calendrier se lit comme une grille de la semaine, pas une liste

- **Dans le périmètre** : remplacer l'affichage en liste (`<ul>`) par une grille visuelle regroupant les créneaux par jour (une colonne ou une ligne par jour), même données (`GET /api/v1/creneaux`), même action « Bloquer ce créneau ». Aucun changement côté `api/`.
- **Hors périmètre** : la saisie des disponibilités du formateur (reportée en position 3 de « À venir », ⚠️ à valider par les cadreurs — c'était la section « Itération 2 » avant ce message) ; toute nouvelle donnée ou route ; la persistance.
- **Critères d'acceptation** :
  - Étant donné le calendrier, quand la page se charge, alors les créneaux sont groupés visuellement par jour (plus une simple liste à puces).
  - Étant donné un créneau disponible dans la grille, quand le formateur clique sur « Bloquer ce créneau », alors il apparaît bloqué au même endroit, sans rechargement (comportement inchangé de l'itération 1).
- **Hypothèse de l'équipe couverte** : aucune — retour de l'équipe sur la lisibilité de l'écran, pas une hypothèse de la passation.
- **Codage estimé** : 2 à 3 minutes (CSS/structure du composant existant, aucune logique métier nouvelle).
- **Fichiers prévus** : `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Tests unitaires prévus** : aucun nouveau — pas de logique métier ajoutée (balisage/CSS pur), conforme à la règle « pas de test sur du balisage pur ».
- **Étapes ajoutées à la démo** : aucune — le parcours (ouvrir, bloquer un créneau) ne change pas, seul l'agencement visuel change.
- **Bilan** :
  - Temps restant annoncé au début : 5 minutes (répondu le 2026-11-18, voir l'alerte de capacité ci-dessus) ; le développeur a choisi l'option 1 (coder maintenant, accepter le dépassement) en précisant de s'appuyer sur la maquette non retenue (`passation/versions-non-retenues/v1/index.html`) pour le visuel.
  - Codage réel : **1 minute** (aucun dépassement du côté codage ; le dépassement attendu porte sur publication + signal, au-delà des 5 minutes annoncées, comme accepté par le développeur).
  - Critères satisfaits : les 2 — créneaux groupés par jour en grille (remplace la liste à puces), blocage toujours visible au même endroit sans rechargement.
  - Repris de la maquette non retenue : palette de couleurs (bleu `#004C9A`/`#E6F0FB` pour disponible, rouge `#CF4B31`/`#F3E8E6` pour bloqué, gris `#8F8F8F`, fond `#F4F6F9`), structure `jour → colonne → créneaux empilés` inspirée de `.days-row`/`.day-col`/`.slot` du prototype « Saisir mes disponibilités ».
  - Reporté : rien de nouveau. `e2e/demo.spec.ts` toujours non exécutable localement (lib système manquante pour Chromium, hors DoD) — mis à jour pour matcher les nouveaux libellés de boutons, non rejoué.
  - Bloqué/refusé par le harnais : rien — `./scripts/verifier-deployabilite.sh` n'a signalé aucune borne, `npm test` passait avant le signal (5/5, inchangé — pas de logique métier ajoutée).
  - **Modifications** :
    - `frontend/src/app/page.tsx` — regroupe les créneaux par jour (`Map`) et les affiche en grille de colonnes au lieu d'une `<ul>` ; sert les 2 critères.
    - `frontend/src/app/page.module.css` — styles de la grille (`.semaine`, `.jourColonne`, `.creneauDispo`, `.creneauBloque`...) inspirés de la maquette non retenue.
    - `e2e/demo.spec.ts` — adapte les sélecteurs de la démo aux nouveaux boutons (libellé = horaire, pas « Bloquer ce créneau »).
  - Version 2 signalée à PM Lab le 2026-11-18T15:59:12Z, à `https://edition20-team32.exaltemps-space.com`.

## À venir (objectifs ordonnés, détaillés au fil de l'eau)

3. Le·la formateur·rice saisit ses disponibilités de la semaine (données en dur) — ⚠️ repoussée depuis la position d'Itération 2, à faire valider par les cadreurs.
4. Vue « Capacité de la semaine » pour la coordinatrice, à partir des disponibilités saisies.
5. Détail d'une session + affectation de l'équipe d'animation (règle : 1 salarié·e + 1 bénévole si demi-journée, 2 salarié·es + 1 bénévole si journée entière).
6. Calendrier commerçant en lecture seule (créneaux disponibles uniquement).
7. Réservation d'un créneau par un commerçant + blocage automatique du créneau.
8. Rappel automatique 4 à 5 jours avant la formation (si le temps le permet — sinon hors périmètre du hackathon, à dire explicitement).
