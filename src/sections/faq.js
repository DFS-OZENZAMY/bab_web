import { esc, html } from '../lib/texte.js';
import { lanterne } from '../illustrations/lanterne.js';

// La première question est ouverte par défaut.
export const faq = site => `
<section class="faq-sec" id="faq">
  <div class="wrap faq">
    <div>
      <h2>${html(site.faq.titre, site)}</h2>
      <p class="intro">${html(site.faq.intro, site)}</p>
      ${lanterne()}
    </div>
    <div class="qs">
      ${site.faq.questions.map((q, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q.question)}</summary><p>${html(q.reponse, site)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;
