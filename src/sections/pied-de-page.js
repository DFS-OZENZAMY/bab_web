import { esc, lienWhatsApp } from '../lib/texte.js';
import { whatsapp } from '../illustrations/icones.js';

export const piedDePage = site => `
<footer>
  <div class="wrap">
    <span>© <span data-annee>${new Date().getFullYear()}</span> ${esc(site.site.nom)}, création de sites vitrines au Maroc</span>
    <span>${esc(site.site.statut)}</span>
  </div>
</footer>

<a class="wa-float" href="${lienWhatsApp(site)}" target="_blank" rel="noopener" aria-label="Écrire sur WhatsApp">${whatsapp()}</a>`;
