"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Creneau = {
  id: string;
  jour: string;
  horaire: string;
  bloque: boolean;
};

type DetailMock = {
  tarif: "Gratuite" | "Payante";
  salles: number;
  equipe: "prete" | "manquant" | "a_affecter";
};

const detailsMock: Record<string, DetailMock> = {
  "lun-matin": { tarif: "Gratuite", salles: 1, equipe: "prete" },
  "lun-aprem": { tarif: "Gratuite", salles: 1, equipe: "a_affecter" },
  "mar-matin": { tarif: "Payante", salles: 2, equipe: "manquant" },
  "mer-matin": { tarif: "Gratuite", salles: 1, equipe: "a_affecter" },
  "jeu-aprem": { tarif: "Payante", salles: 1, equipe: "prete" },
};

const libelleEquipe: Record<DetailMock["equipe"], string> = {
  prete: "Équipe prête",
  manquant: "1 formateur manquant",
  a_affecter: "À affecter",
};

export default function Home() {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

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

  const parJour = new Map<string, Creneau[]>();
  for (const creneau of creneaux) {
    const liste = parJour.get(creneau.jour) ?? [];
    liste.push(creneau);
    parJour.set(creneau.jour, liste);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.titre}>Calendrier des formations · La Cloche</h1>
        <p>Bloquez les créneaux que vous animez cette semaine.</p>
        {erreur && (
          <p className={styles.erreur} role="alert">
            {erreur}
          </p>
        )}
        <div className={styles.semaine}>
          {Array.from(parJour.entries()).map(([jour, creneauxDuJour]) => (
            <div key={jour} className={styles.jourColonne}>
              <div className={styles.jourLabel}>{jour}</div>
              <div className={styles.creneauxDuJour}>
                {creneauxDuJour.map((creneau) => (
                  <div key={creneau.id}>
                    <button
                      type="button"
                      onClick={() => (creneau.bloque ? annuler(creneau.id) : bloquer(creneau.id))}
                      className={creneau.bloque ? styles.creneauBloque : styles.creneauDispo}
                    >
                      {creneau.horaire}
                      {creneau.bloque ? " · Bloqué (annuler)" : ""}
                    </button>
                    <button type="button" className={styles.lienDetail} onClick={() => setDetailId(creneau.id)}>
                      Voir le détail
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {detailId &&
          (() => {
            const creneau = creneaux.find((c) => c.id === detailId);
            const detail = detailsMock[detailId];
            if (!creneau || !detail) return null;
            return (
              <div className={styles.vueDetail}>
                <div className={styles.vueDetailEntete}>
                  <button type="button" className={styles.lienDetail} onClick={() => setDetailId(null)}>
                    ← Retour
                  </button>
                  <h2>{creneau.jour}</h2>
                  <p>{creneau.horaire}</p>
                </div>
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
                  <strong className={styles[`pastille_${detail.equipe}`]}>{libelleEquipe[detail.equipe]}</strong>
                </div>
              </div>
            );
          })()}
      </main>
    </div>
  );
}
