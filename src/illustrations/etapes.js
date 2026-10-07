// Petites illustrations des 4 étapes de la section Méthode (120 × 96).

const SABLE = '#EFE6D4';

const DESSINS = {
  echange: `<circle cx="60" cy="48" r="44" fill="${SABLE}"/><rect x="22" y="22" width="56" height="34" rx="12" fill="#2438A6"/><path d="M34 56L30 66L44 56Z" fill="#2438A6"/><path d="M34 34H66M34 44H56" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="54" y="46" width="44" height="28" rx="10" fill="#F2B33D"/><path d="M86 74L92 82L80 74Z" fill="#F2B33D"/><circle cx="66" cy="60" r="2.5" fill="#141A3A"/><circle cx="76" cy="60" r="2.5" fill="#141A3A"/><circle cx="86" cy="60" r="2.5" fill="#141A3A"/>`,
  maquette: `<circle cx="60" cy="48" r="44" fill="${SABLE}"/><rect x="26" y="16" width="56" height="66" rx="8" fill="#fff" stroke="#141A3A" stroke-opacity=".15" stroke-width="2"/><path d="M38 70V46A16 16 0 0 1 70 46V70" stroke="#2438A6" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/><path d="M36 28H58" stroke="#141A3A" stroke-opacity=".25" stroke-width="3" stroke-linecap="round"/><path d="M96 20L74 64L70 74L78 68L100 24Z" fill="#F2B33D"/><path d="M96 20L100 24" stroke="#C8643B" stroke-width="4" stroke-linecap="round"/>`,
  reglages: `<circle cx="60" cy="48" r="44" fill="${SABLE}"/><path d="M26 32H94M26 50H94M26 68H94" stroke="#141A3A" stroke-opacity=".2" stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="32" r="8" fill="#2438A6"/><circle cx="76" cy="50" r="8" fill="#F2B33D"/><circle cx="56" cy="68" r="8" fill="#1F5545"/><circle cx="46" cy="32" r="3" fill="#fff"/><circle cx="76" cy="50" r="3" fill="#fff"/><circle cx="56" cy="68" r="3" fill="#fff"/>`,
  porte: `<circle cx="60" cy="48" r="44" fill="${SABLE}"/><path d="M34 88V44A26 26 0 0 1 86 44V88Z" fill="#2438A6"/><path d="M42 88V46A18 18 0 0 1 78 46V88Z" fill="#F7D58A"/><path d="M60 28V88" stroke="#F2B33D" stroke-width="2"/><path d="M42 88V46A18 18 0 0 1 60 28V88Z" fill="#16226B" transform="translate(-6 0) skewY(-6)"/><path d="M96 14l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#F2B33D"/><path d="M22 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#2438A6"/>`,
};

export function illustrationEtape(nom) {
  if (!DESSINS[nom]) throw new Error(`Illustration d'étape inconnue : « ${nom} ». Disponibles : ${Object.keys(DESSINS).join(', ')}`);
  return `<svg viewBox="0 0 120 96" fill="none" aria-hidden="true">${DESSINS[nom]}</svg>`;
}

export const illustrationsEtapes = Object.keys(DESSINS);
