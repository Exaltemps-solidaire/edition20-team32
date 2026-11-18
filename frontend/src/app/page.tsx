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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Calendrier des formations · La Cloche</h1>
        <p>Bloquez les créneaux que vous animez cette semaine.</p>
        {erreur && <p role="alert">{erreur}</p>}
        <ul>
          {creneaux.map((creneau) => (
            <li key={creneau.id}>
              {creneau.jour} · {creneau.horaire} —{" "}
              {creneau.bloque ? (
                <strong>Bloqué</strong>
              ) : (
                <button type="button" onClick={() => bloquer(creneau.id)}>
                  Bloquer ce créneau
                </button>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
