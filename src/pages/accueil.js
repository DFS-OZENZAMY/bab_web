// Page d'accueil : assemble les sections dans l'ordre d'affichage.
import { tete } from './tete.js';
import { donneesStructurees } from '../seo/donnees-structurees.js';
import { navigation } from '../sections/navigation.js';
import { hero } from '../sections/hero.js';
import { frise } from '../illustrations/frise.js';
import { offres } from '../sections/offres.js';
import { secteurs } from '../sections/secteurs.js';
import { methode } from '../sections/methode.js';
import { faq } from '../sections/faq.js';
import { contact } from '../sections/contact.js';
import { piedDePage } from '../sections/pied-de-page.js';

// Données utilisées par les scripts du navigateur (src/scripts).
const configNavigateur = site => ({ whatsapp: site.contact.whatsapp, demos: site.demos });

// Empêche une fin de balise </script> de casser le JSON intégré à la page.
const jsonDansScript = obj => JSON.stringify(obj).replace(/</g, '\\u003c');

export function accueil(site, { css, js }) {
  const jsonld = `<!-- Données structurées pour Google -->\n<script type="application/ld+json">${jsonDansScript(donneesStructurees(site))}</script>`;
  return `<!DOCTYPE html>
<html lang="${site.site.langue}">
${tete(site, { titre: site.seo.titre, description: site.seo.description, css, extra: jsonld })}
<body>
${navigation(site)}

<main>
${hero(site)}

${frise()}
${offres(site)}
${secteurs(site)}
${methode(site)}
${faq(site)}
${contact(site)}
</main>
${piedDePage(site)}

<script type="application/json" id="config-site">${jsonDansScript(configNavigateur(site))}</script>
<script>${js}</script>
</body>
</html>
`;
}
