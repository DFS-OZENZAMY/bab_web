// Médina de nuit en bas de la section contact : coupoles, fenêtres allumées, palmiers, étoiles et croissant.
import { aleatoire } from '../lib/svg.js';

const LARGEURS = [90, 60, 120, 70, 150, 80, 60, 110, 90, 140, 70, 100, 60, 130, 80, 40];
const HAUTEURS = [90, 130, 70, 160, 100, 120, 80, 140, 95, 75, 150, 110, 85, 125, 90, 70];
const PALMIERS = [[330, 150], [980, 170]];
const NUIT = '#0A0F3D';

export function medina() {
  const hasard = aleatoire(7);
  const etoiles = Array.from({ length: 60 }, () => {
    const x = Math.round(10 + hasard() * 1420), y = Math.round(8 + hasard() * 112);
    const r = [1, 1, 1, 1.5, 2][Math.floor(hasard() * 5)];
    const o = [0.3, 0.5, 0.7][Math.floor(hasard() * 3)];
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity="${o}"/>`;
  }).join('');

  let x = 0, coupoles = '', fenetres = '';
  LARGEURS.forEach((l, i) => {
    const haut = 220 - HAUTEURS[i], r = l / 2;
    coupoles += `M${x} 220V${haut + r}A${r} ${r} 0 0 1 ${x + l} ${haut + r}V220Z`;
    if (l >= 70) {
      const cx = x + r, y = haut + HAUTEURS[i] * 0.55;
      fenetres += `<path d="M${cx - 7} ${y + 14}V${y}A7 7 0 0 1 ${cx + 7} ${y}V${y + 14}Z" fill="#F2B33D" fill-opacity=".85"/>`;
    }
    x += l;
  });

  const palmiers = PALMIERS.map(([px, h]) => {
    const tx = px + 6, ty = 220 - h;
    const palmes = [[-40, 10], [-30, -14], [0, -26], [30, -14], [42, 10]]
      .map(([dx, dy]) => `<path d="M${tx} ${ty}Q${tx + dx / 2} ${ty + dy - 12} ${tx + dx} ${ty + dy}Q${tx + dx / 2} ${ty + dy - 2} ${tx} ${ty}Z" fill="${NUIT}"/>`)
      .join('');
    return `<path d="M${px} 220C${px + 2} ${220 - h / 2} ${px - 4} ${220 - h * 0.8} ${tx} ${ty}" stroke="${NUIT}" stroke-width="6" stroke-linecap="round"/>${palmes}`;
  }).join('');

  return `<svg class="skyline" viewBox="0 0 1440 220" fill="none" aria-hidden="true">${etoiles}` +
    `<path d="M1240 70A34 34 0 1 0 1274 112A28 28 0 1 1 1240 70Z" fill="#F2B33D"/>` +
    `${palmiers}<path d="${coupoles}" fill="${NUIT}"/>${fenetres}</svg>`;
}
