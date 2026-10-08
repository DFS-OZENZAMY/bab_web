// Favicon « bab » : arche safran sur tuile Majorelle, étoile au-dessus, lumière dans la porte.
//
// ⚠️ Cette fonction est AUTONOME (aucun import, aucune variable extérieure) : le build l'utilise
// pour écrire public/favicon.svg, ET l'injecte telle quelle dans le navigateur pour l'animation
// (src/scripts/favicon.js). Ne pas y faire référence à autre chose que ses paramètres.
//
//   etoile   : 0 → 1, avancement du scintillement (rotation + pulsation de l'étoile)
//   lumiere  : 0 → 1, intensité de la lumière dans la porte
export function dessinerFavicon(etoile = 0, lumiere = 0) {
  const pts = [];
  const echelle = 1 + 0.35 * Math.sin(Math.PI * etoile);
  const rotation = (72 * etoile * Math.PI) / 180;
  for (let i = 0; i < 10; i++) {
    const r = (i % 2 ? 2.9 : 7) * echelle;
    const a = -Math.PI / 2 + (i * Math.PI) / 5 + rotation;
    pts.push(`${(32 + r * Math.cos(a)).toFixed(2)},${(11 + r * Math.sin(a)).toFixed(2)}`);
  }
  const halo = lumiere > 0.01
    ? `<circle cx="32" cy="11" r="${(9 * echelle).toFixed(2)}" fill="#FFE7A3" opacity="${(0.45 * Math.sin(Math.PI * etoile)).toFixed(3)}"/>`
    : '';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="14" fill="#2438A6"/>' +
    `<path d="M19 64V36a13 13 0 0 1 26 0v28Z" fill="#FFD66E" opacity="${(0.9 * lumiere).toFixed(3)}"/>` +
    '<path d="M19 64V36a13 13 0 0 1 26 0v28" fill="none" stroke="#F2B33D" stroke-width="6"/>' +
    halo +
    `<path d="M${pts.join('L')}Z" fill="#F2B33D"/>` +
    '</svg>';
}
