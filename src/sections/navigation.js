import { esc } from '../lib/texte.js';
import { logo } from '../illustrations/icones.js';

// Liens du menu : [ancre, libellé]. L'ancre doit correspondre à l'id d'une section.
export const LIENS = [
  ['offres', 'Offres'],
  ['secteurs', 'Secteurs'],
  ['methode', 'Méthode'],
  ['faq', 'Questions'],
];

// `racine` = '/' sur les autres pages, pour que les liens ramènent aux sections de l'accueil.
export const navigation = (site, { racine = '' } = {}) => `
<nav class="nav" aria-label="Navigation principale">
  <div class="wrap">
    <a class="logo" href="${racine || '#top'}" aria-label="${esc(site.site.nom)}, accueil">${logo()}${esc(site.site.nom)}</a>
    <ul>
      ${LIENS.map(([ancre, libelle]) => `<li><a href="${racine}#${ancre}">${esc(libelle)}</a></li>`).join('\n      ')}
    </ul>
    <a class="btn" href="${racine}#contact">Demander un devis</a>
  </div>
</nav>`;
