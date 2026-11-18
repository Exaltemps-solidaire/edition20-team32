"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Creneau = {
  id: string;
  jour: string;
  horaire: string;
  bloque: boolean;
};

export default function Home() {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

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
                  <button
                    key={creneau.id}
                    type="button"
                    onClick={() => (creneau.bloque ? annuler(creneau.id) : bloquer(creneau.id))}
                    className={creneau.bloque ? styles.creneauBloque : styles.creneauDispo}
                  >
                    {creneau.horaire}
                    {creneau.bloque ? " · Bloqué (annuler)" : ""}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
