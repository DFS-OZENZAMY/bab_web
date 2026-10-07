// Icônes des 10 secteurs (trait de 2 px, couleur héritée via currentColor).
// Pour ajouter un secteur : ajouter son dessin ici, puis une ligne dans site.json (secteurs.liste).

const DESSINS = {
  riad: '<path d="M10 42V20A14 14 0 0 1 38 20V42"/><path d="M17 42V24A7 7 0 0 1 31 24V42"/><path d="M6 42H42"/><circle cx="27" cy="34" r="1"/>',
  resto: '<path d="M8 32H40"/><path d="M10 32A14 14 0 0 1 38 32"/><path d="M24 18V12"/><circle cx="24" cy="10.5" r="1.8"/><path d="M6 38H42"/><path d="M14 38L16 32M34 38L32 32"/>',
  sante: '<path d="M24 12C20 8 12 8 12 16C12 24 15 28 16 38C16.5 41 19 41 19.5 38L21 30H27L28.5 38C29 41 31.5 41 32 38C33 28 36 24 36 16C36 8 28 8 24 12Z"/>',
  droit: '<path d="M24 8V40"/><path d="M14 40H34"/><path d="M10 14H38"/><path d="M14 14L8 28H20Z"/><path d="M34 14L28 28H40Z"/>',
  beaute: '<path d="M18 30A8 8 0 1 1 18 14A8 8 0 0 1 18 30Z"/><path d="M18 30V42"/><path d="M12 42H24"/><path d="M34 8V40"/><path d="M30 8H38V20Q34 22 30 20Z"/>',
  auto: '<path d="M8 30L12 20Q13 17 16 17H32Q35 17 36 20L40 30V36H8Z"/><circle cx="15" cy="36" r="3"/><circle cx="33" cy="36" r="3"/><path d="M8 28H40"/>',
  ecole: '<path d="M4 18L24 10L44 18L24 26Z"/><path d="M12 22V32Q24 38 36 32V22"/><path d="M44 18V28"/>',
  artisan: '<path d="M16 10H32"/><path d="M18 10Q14 16 14 22Q14 40 24 40Q34 40 34 22Q34 16 30 10"/><path d="M15 24H33"/><path d="M16 30H32"/>',
  immo: '<path d="M8 22L24 10L40 22"/><path d="M12 19V40H36V19"/><path d="M20 40V30A4 4 0 0 1 28 30V40"/>',
  voyage: '<path d="M6 30L42 14"/><path d="M42 14L36 26L24 24Z"/><path d="M24 24L18 34L14 26"/><path d="M6 40H42" stroke-dasharray="2 5"/>',
};

export function iconeSecteur(nom) {
  if (!DESSINS[nom]) throw new Error(`Icône de secteur inconnue : « ${nom} ». Icônes disponibles : ${Object.keys(DESSINS).join(', ')}`);
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DESSINS[nom]}</svg>`;
}

export const iconesSecteurs = Object.keys(DESSINS);
