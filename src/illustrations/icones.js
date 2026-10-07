// Petites icônes d'interface : logo, coches, ornements, contact.
import { etoile } from '../lib/svg.js';

export const logo = () =>
  `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#2438A6"/><path d="M11 34V20A9 9 0 0 1 29 20V34" fill="none" stroke="#F2B33D" stroke-width="3.2"/><path d="M20 8l1.6 3 3.2.4-2.3 2.2.6 3.2L20 15.3l-3.1 1.5.6-3.2-2.3-2.2 3.2-.4z" fill="#F2B33D"/></svg>`;

export const fleche = () =>
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Ornement en haut des cartes de tarifs. `vedette` = formule mise en avant (fond bleu). */
export const ornement = (vedette = false) =>
  `<svg class="orn" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="28" fill="${vedette ? '#F2B33D' : '#F8F1E2'}"/><path d="${etoile(28, 28, 14, 9)}" fill="${vedette ? '#16226B' : '#F2B33D'}"/></svg>`;

export const coche = (vedette = false) =>
  `<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="9" fill="${vedette ? '#F2B33D' : '#2438A6'}"${vedette ? '' : ' fill-opacity=".1"'}/><path d="M5.5 9.2l2.2 2.2 4.8-4.8" stroke="${vedette ? '#16226B' : '#2438A6'}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const OPTIONS = {
  domaine: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
  maintenance: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  logo: '<path d="M5 21V11a7 7 0 0 1 14 0v10"/><path d="M12 2l1 2.2 2.4.3-1.7 1.6.4 2.4L12 7.4l-2.1 1.1.4-2.4-1.7-1.6 2.4-.3z"/>',
};

export function iconeOption(nom) {
  if (!OPTIONS[nom]) throw new Error(`Icône d'option inconnue : « ${nom} ». Disponibles : ${Object.keys(OPTIONS).join(', ')}`);
  return `<svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect width="44" height="44" rx="14" fill="#2438A6"/><g transform="translate(10 10)" stroke="#F2B33D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${OPTIONS[nom]}</g></svg>`;
}
export const iconesOptions = Object.keys(OPTIONS);

const BULLE_WA = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3 0 .2 0 .7-.2 1.3Z';

/** Logo WhatsApp seul (bouton flottant). */
export const whatsapp = () => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${BULLE_WA}"/></svg>`;

/** Pastille WhatsApp ronde (carte « Nouveau message »). */
export const pastilleWhatsapp = () =>
  `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#25D366"/><path d="M20 10a10 10 0 0 0-8.6 15.1L10 30l5-1.3A10 10 0 1 0 20 10Z" fill="#fff"/></svg>`;

/** Tuiles carrées de la section contact. */
export const tuileWhatsapp = () =>
  `<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="16" fill="#25D366"/><path d="M24 13a11 11 0 0 0-9.5 16.6L13 35l5.5-1.4A11 11 0 1 0 24 13Z" fill="#fff"/></svg>`;
export const tuileEmail = () =>
  `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect width="48" height="48" rx="16" fill="#F2B33D"/><rect x="13" y="16" width="22" height="16" rx="3" stroke="#16226B" stroke-width="2"/><path d="m13 18 11 7 11-7" stroke="#16226B" stroke-width="2"/></svg>`;

export const repereCarte = () =>
  `<svg viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="11" fill="#FDF0D5"/><path d="M18 8a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Z" fill="#F2B33D"/><circle cx="18" cy="15" r="2.6" fill="#fff"/></svg>`;
