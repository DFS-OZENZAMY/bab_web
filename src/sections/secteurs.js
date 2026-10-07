import { esc, html } from '../lib/texte.js';
import { iconeSecteur } from '../illustrations/secteurs.js';

export const secteurs = site => `
<section class="sectors" id="secteurs">
  <div class="wrap">
    <h2>${html(site.secteurs.titre, site)}</h2>
    <p class="intro">${html(site.secteurs.intro, site)}</p>
    <ul class="grid-sec">
      ${site.secteurs.liste.map(s => `<li>${iconeSecteur(s.icone)}${esc(s.nom)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`;
