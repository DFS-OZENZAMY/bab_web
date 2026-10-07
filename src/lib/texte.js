// Outils de texte partagés par les sections et les fichiers SEO.

/** Échappe un texte pour l'insérer dans du HTML. */
export function esc(valeur) {
  return String(valeur ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 1500 → « 1 500 » (espace insécable par défaut, pour éviter une coupure de ligne). */
export function formaterMontant(montant, espace = '\u00A0') {
  return String(montant).replace(/\B(?=(\d{3})+(?!\d))/g, espace);
}

/** 1500 → « 1 500 DH ». */
export function formaterPrix(montant, devise = 'DH', espace = '\u00A0') {
  return `${formaterMontant(montant, espace)}${espace}${devise}`;
}

/**
 * Remplace les repères écrits dans site.json :
 *   {prix:essentiel}  → prix de la formule « essentiel »
 *   {villes}          → « Casablanca, Rabat, … »
 * `texteBrut: true` donne des espaces normales (llms.txt, emails, données Google).
 */
export function interpoler(texte, site, { texteBrut = false } = {}) {
  return String(texte).replace(/\{(\w+)(?::(\w+))?\}/g, (repere, cle, param) => {
    if (cle === 'prix') {
      const formule = site.offres.formules.find(f => f.id === param);
      if (!formule) throw new Error(`Repère inconnu dans site.json : ${repere} (aucune formule « ${param} »)`);
      return formaterPrix(formule.prix, site.offres.devise, texteBrut ? ' ' : '\u00A0');
    }
    if (cle === 'villes') return site.villes.join(', ');
    throw new Error(`Repère inconnu dans site.json : ${repere}`);
  });
}

/** Comme interpoler, puis échappe pour le HTML et transforme *mots* en <em>mots</em>. */
export function html(texte, site) {
  return esc(interpoler(texte, site)).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** Version texte (sans *…*) pour les balises meta, le JSON-LD et llms.txt. */
export function brut(texte, site) {
  return interpoler(texte, site, { texteBrut: true }).replace(/\*([^*]+)\*/g, '$1');
}

/** Lien WhatsApp, avec message prérempli optionnel. */
export function lienWhatsApp(site, message) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
