import { esc, html, formaterMontant } from '../lib/texte.js';
import { coche, ornement, iconeOption } from '../illustrations/icones.js';

function carte(f, site) {
  const vedette = Boolean(f.vedette);
  return `
      <article class="pack${vedette ? ' featured' : ''}">
        ${ornement(vedette)}
        ${vedette ? `<span class="tag">${esc(f.vedette)}</span>` : ''}
        <h3>${esc(f.nom)}</h3>
        <p class="for">${esc(f.accroche)}</p>
        <div class="price">${formaterMontant(f.prix)}<span>${esc(site.offres.devise)}</span></div>
        <ul>
          ${f.points.map(p => `<li>${coche(vedette)}${html(p, site)}</li>`).join('\n          ')}
        </ul>
        <a class="btn" href="#contact" data-formule="${esc(f.nom)}">Choisir ${esc(f.nom)}</a>
      </article>`;
}

export function offres(site) {
  const o = site.offres;
  return `
<section id="offres">
  <div class="wrap">
    <h2>${html(o.titre, site)}</h2>
    <p class="intro">${html(o.intro, site)}</p>
    <div class="packs">${o.formules.map(f => carte(f, site)).join('')}
    </div>
    <div class="extras">
      ${o.options.map(op => `<div class="extra">${iconeOption(op.icone)}<div><b>${esc(op.nom)}</b><span>${html(op.detail, site)}</span></div></div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}
