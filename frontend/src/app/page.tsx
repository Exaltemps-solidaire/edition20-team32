"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { calculerStatutEquipe, libelleStatutEquipe } from "./equipe";
import { libelleDemiJournee } from "./horaire";

type Creneau = {
  id: string;
  jour: string;
  horaire: string;
  bloque: boolean;
};

type DetailMock = {
  tarif: "Gratuite" | "Payante";
  salles: number;
};

const detailsMock: Record<string, DetailMock> = {
  "lun-matin": { tarif: "Gratuite", salles: 1 },
  "lun-aprem": { tarif: "Gratuite", salles: 1 },
  "mar-matin": { tarif: "Payante", salles: 2 },
  "mer-matin": { tarif: "Gratuite", salles: 1 },
  "jeu-aprem": { tarif: "Payante", salles: 1 },
};

const FORMATEURS_REQUIS = 2;

const formateursDisponibles = ["Amadou", "Claire", "Sofiane", "Lina"];

const assignationsInitiales: Record<string, string[]> = {
  "lun-matin": ["Amadou", "Claire"],
  "lun-aprem": [],
  "mar-matin": ["Sofiane"],
  "mer-matin": [],
  "jeu-aprem": ["Amadou", "Lina"],
};

type Dispo = { matin: boolean; aprem: boolean; indispo: boolean };

const joursDispo = ["Lundi 23 juin", "Mardi 24 juin", "Mercredi 25 juin", "Jeudi 26 juin", "Vendredi 27 juin"];

const dispoMockInitiale: Record<string, Dispo> = {
  "Lundi 23 juin": { matin: true, aprem: true, indispo: false },
  "Mardi 24 juin": { matin: true, aprem: false, indispo: false },
  "Mercredi 25 juin": { matin: false, aprem: false, indispo: true },
  "Jeudi 26 juin": { matin: true, aprem: true, indispo: false },
  "Vendredi 27 juin": { matin: false, aprem: true, indispo: false },
};

export default function Home() {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [onglet, setOnglet] = useState<"sessions" | "disponibilites">("sessions");
  const [dispos, setDispos] = useState<Record<string, Dispo>>(dispoMockInitiale);
  const [assignations, setAssignations] = useState<Record<string, string[]>>(assignationsInitiales);
  const [nouveauJour, setNouveauJour] = useState("");
  const [nouvelHoraire, setNouvelHoraire] = useState("");

  function basculerFormateur(creneauId: string, nom: string) {
    setAssignations((actuelles) => {
      const assignes = actuelles[creneauId] ?? [];
      const nouveaux = assignes.includes(nom) ? assignes.filter((n) => n !== nom) : [...assignes, nom];
      return { ...actuelles, [creneauId]: nouveaux };
    });
  }

  function basculer(jour: string, periode: "matin" | "aprem" | "indispo") {
    setDispos((actuelles) => {
      const dispo = actuelles[jour];
      if (periode === "indispo") {
        return { ...actuelles, [jour]: { matin: false, aprem: false, indispo: !dispo.indispo } };
      }
      return { ...actuelles, [jour]: { ...dispo, indispo: false, [periode]: !dispo[periode] } };
    });
  }

  useEffect(() => {
    fetch("/api/v1/creneaux")
      .then((reponse) => reponse.json())
      .then(setCreneaux)
      .catch(() => setErreur("Impossible de charger le calendrier."));
  }, []);

  async function bloquer(id: string) {
    setErreur(null);
    const reponse = await fetch(`/api/v1/creneaux/${id}/bloquer`, { method: "POST" });
    if (!reponse.ok) {
      setErreur("Ce créneau n'a pas pu être bloqué.");
      return;
    }
    const creneau: Creneau = await reponse.json();
    setCreneaux((actuels) => actuels.map((c) => (c.id === creneau.id ? creneau : c)));
  }

  async function annuler(id: string) {
    setErreur(null);
    const reponse = await fetch(`/api/v1/creneaux/${id}/annuler`, { method: "POST" });
    if (!reponse.ok) {
      setErreur("Ce créneau n'a pas pu être libéré.");
      return;
    }
    const creneau: Creneau = await reponse.json();
    setCreneaux((actuels) => actuels.map((c) => (c.id === creneau.id ? creneau : c)));
  }

  async function ajouterCreneau() {
    setErreur(null);
    const parametres = new URLSearchParams({ jour: nouveauJour, horaire: nouvelHoraire });
    const reponse = await fetch(`/api/v1/creneaux?${parametres.toString()}`, { method: "POST" });
    if (!reponse.ok) {
      setErreur("Ce créneau n'a pas pu être créé.");
      return;
    }
    const creneau: Creneau = await reponse.json();
    setCreneaux((actuels) => [...actuels, creneau]);
    setNouveauJour("");
    setNouvelHoraire("");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.identiteBarre}>La Cloche · Antenne Île-de-France</div>
        {!(onglet === "sessions" && detailId) && (
          <>
            <div className={styles.entete}>
              <div className={styles.enteteSup}>Semaine du 23 au 27 juin 2026</div>
              <h1 className={styles.enteteTitre}>Calendrier des formations</h1>
              <div className={styles.enteteSous}>Vue coordinatrice de terrain</div>
            </div>
            <div className={styles.onglets}>
              <button
                type="button"
                className={onglet === "sessions" ? styles.ongletActif : styles.ongletInactif}
                onClick={() => setOnglet("sessions")}
              >
                Sessions
              </button>
              <button
                type="button"
                className={onglet === "disponibilites" ? styles.ongletActif : styles.ongletInactif}
                onClick={() => setOnglet("disponibilites")}
              >
                Disponibilités
              </button>
            </div>
          </>
        )}
        {onglet === "sessions" && detailId
          ? (() => {
              const creneau = creneaux.find((c) => c.id === detailId);
              const detail = detailsMock[detailId];
              if (!creneau || !detail) return null;
              const assignes = assignations[detailId] ?? [];
              const statut = calculerStatutEquipe(assignes.length, FORMATEURS_REQUIS);
              const libelle = libelleStatutEquipe(statut, assignes.length, FORMATEURS_REQUIS);
              return (
                <div className={styles.ecranDetail}>
                  <button type="button" className={styles.boutonRetour} onClick={() => setDetailId(null)}>
                    ← Retour
                  </button>
                  <h2 className={styles.ecranDetailTitre}>{creneau.jour}</h2>
                  <p className={styles.ecranDetailSousTitre}>{creneau.horaire}</p>
                  <div className={styles.detailLigne}>
                    <span>Tarif</span>
                    <strong>{detail.tarif}</strong>
                  </div>
                  <div className={styles.detailLigne}>
                    <span>Salles</span>
                    <strong>{detail.salles}</strong>
                  </div>
                  <div className={styles.detailLigne}>
                    <span>Équipe</span>
                    <strong className={styles[`badge_${statut}`]}>{libelle}</strong>
                  </div>
                  <div className={styles.titreSection}>Choisir un créneau</div>
                  <button
                    type="button"
                    onClick={() => (creneau.bloque ? annuler(creneau.id) : bloquer(creneau.id))}
                    className={creneau.bloque ? styles.creneauBloque : styles.creneauDispo}
                  >
                    {creneau.bloque ? "Annuler la réservation" : "Réserver ce créneau"}
                  </button>
                  <div className={styles.formateursListe}>
                    {formateursDisponibles.map((nom) => (
                      <label key={nom} className={styles.formateurLigne}>
                        <input
                          type="checkbox"
                          checked={assignes.includes(nom)}
                          onChange={() => basculerFormateur(detailId, nom)}
                        />
                        {nom}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })()
          : onglet === "sessions" && (
              <>
                <p>Bloquez les créneaux que vous animez cette semaine.</p>
                {erreur && (
                  <p className={styles.erreur} role="alert">
                    {erreur}
                  </p>
                )}
                <div className={styles.titreSection}>Sessions prévues</div>
                <div className={styles.sessionBloc}>
                  {creneaux.map((creneau) => {
                    const [, jourNum, mois] = creneau.jour.split(" ");
                    const assignes = assignations[creneau.id] ?? [];
                    const statut = calculerStatutEquipe(assignes.length, FORMATEURS_REQUIS);
                    const libelle = libelleStatutEquipe(statut, assignes.length, FORMATEURS_REQUIS);
                    return (
                      <div key={creneau.id} className={styles.sessionLigne}>
                        <div className={styles.sessionDateBloc}>
                          <div className={styles.sessionJourNum}>{jourNum}</div>
                          <div className={styles.sessionMois}>{mois}</div>
                        </div>
                        <div className={styles.sessionCorps}>
                          <div className={styles.sessionTitre}>todo</div>
                          <div className={styles.sessionMeta}>
                            {creneau.horaire} · {libelleDemiJournee(creneau.horaire)} · todo
                          </div>
                          <button
                            type="button"
                            className={styles.lienDetail}
                            onClick={() => setDetailId(creneau.id)}
                          >
                            Voir le détail
                          </button>
                        </div>
                        <div className={styles.sessionStatut}>
                          <span className={styles[`badge_${statut}`]}>{libelle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.formulaireAjout}>
                  <input
                    type="text"
                    placeholder="Jour (ex. Vendredi 27 juin)"
                    value={nouveauJour}
                    onChange={(e) => setNouveauJour(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Horaire (ex. 9 h – 12 h)"
                    value={nouvelHoraire}
                    onChange={(e) => setNouvelHoraire(e.target.value)}
                  />
                  <button type="button" onClick={ajouterCreneau} disabled={!nouveauJour || !nouvelHoraire}>
                    Ajouter un créneau
                  </button>
                </div>
              </>
            )}
        {onglet === "disponibilites" && (
          <>
            <p>Indiquez vos créneaux disponibles pour cette semaine (non sauvegardé pour l&apos;instant).</p>
            <div className={styles.dispoListe}>
              {joursDispo.map((jour) => {
                const dispo = dispos[jour];
                return (
                  <div key={jour} className={styles.dispoLigne}>
                    <span className={styles.dispoJour}>{jour}</span>
                    <div className={styles.dispoBoutons}>
                      <button
                        type="button"
                        className={dispo.matin ? styles.dispoActif : styles.dispoInactif}
                        onClick={() => basculer(jour, "matin")}
                      >
                        Matin
                      </button>
                      <button
                        type="button"
                        className={dispo.aprem ? styles.dispoActif : styles.dispoInactif}
                        onClick={() => basculer(jour, "aprem")}
                      >
                        Après-midi
                      </button>
                      <button
                        type="button"
                        className={dispo.indispo ? styles.dispoActifIndispo : styles.dispoInactif}
                        onClick={() => basculer(jour, "indispo")}
                      >
                        Indispo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
