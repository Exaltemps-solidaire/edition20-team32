// Transforme les valeurs des date/time pickers (ISO) vers le format d'affichage déjà utilisé (ex. "Vendredi 27 juin", "9 h – 12 h").
const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function formatJour(dateISO: string): string {
  const date = new Date(`${dateISO}T00:00:00`);
  return `${JOURS[date.getDay()]} ${date.getDate()} ${MOIS[date.getMonth()]}`;
}

export function formatHoraire(debut: string, fin: string): string {
  const formatHeure = (heure: string) => {
    const [h, m] = heure.split(":");
    return m === "00" ? `${Number(h)} h` : `${Number(h)} h ${m}`;
  };
  return `${formatHeure(debut)} – ${formatHeure(fin)}`;
}
