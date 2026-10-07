import { esc, html } from '../lib/texte.js';
import { illustrationEtape } from '../illustrations/etapes.js';

export const methode = site => `
<section id="methode">
  <div class="wrap">
    <h2>${html(site.methode.titre, site)}</h2>
    <ol class="steps">
      ${site.methode.etapes.map((e, i) => `<li>
        <div class="head">${illustrationEtape(e.illustration)}<span class="num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span></div>
        <h3>${esc(e.titre)}</h3>
        <p>${html(e.texte, site)}</p>${e.badge ? `\n        <span class="badge">${esc(e.badge)}</span>` : ''}
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>`;
