// Formes géométriques réutilisées par les illustrations.

/** Étoile zellige à 8 branches centrée en (cx, cy). */
export function etoile(cx, cy, rayon, rayonInterieur = rayon * 0.62) {
  const points = [];
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const r = i % 2 === 0 ? rayon : rayonInterieur;
    points.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return `M${points.join(' L')}Z`;
}

/** Générateur pseudo-aléatoire stable : même résultat à chaque build. */
export function aleatoire(graine = 7) {
  let s = graine;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
