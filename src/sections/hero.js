import { esc, html } from '../lib/texte.js';
import { arche } from '../illustrations/arche.js';
import { fleche, pastilleWhatsapp, repereCarte } from '../illustrations/icones.js';

// En-tête : texte à gauche, arche + démo interactive à droite.
// Le contenu de l'écran de démo est rempli par src/scripts/demo.js à partir de site.json (demos).
export function hero(site) {
  const h = site.hero;
  const premiere = site.demos[0];
  return `
<header class="hero" id="top">
  <div class="wrap">
    <div>
      <p class="where">${esc(h.lieu)}</p>
      <h1>${html(h.titre, site)}</h1>
      <p class="ar" lang="ar">${esc(h.arabe)}</p>
      <p class="lead">${html(h.texte, site)}</p>
      <div class="cta-row">
        <a class="btn" href="#contact">${esc(h.boutonPrincipal)} ${fleche()}</a>
        <a class="btn ghost" href="#offres">${esc(h.boutonSecondaire)}</a>
      </div>
      <ul class="facts">
        ${h.chiffres.map(c => `<li><strong>${html(c.valeur, site)}</strong>${html(c.legende, site)}</li>`).join('\n        ')}
      </ul>
    </div>

    <div class="demo">
      <div class="art">
        ${arche()}
        <div class="screen" aria-live="polite">
          <div class="top" data-demo="haut" style="background:${esc(premiere.fond)}">
            <small data-demo="lieu">${esc(premiere.lieu)}</small><b data-demo="nom">${esc(premiere.nom)}</b>
          </div>
          <div class="rows" data-demo="lignes">
            ${premiere.lignes.map(([a, b]) => `<div class="row"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}
            <div class="wa">${esc(premiere.bouton)}</div>
          </div>
        </div>
        <div class="float msg" aria-hidden="true">
          ${pastilleWhatsapp()}
          <div><b>Nouveau message</b><span data-demo="message">${esc(premiere.message)}</span></div>
        </div>
        <div class="float maps" aria-hidden="true">
          ${repereCarte()}
          <div><b>Visible sur Google Maps</b><span>Fiche Google Business optimisée</span></div>
        </div>
      </div>
      <div class="tabs" role="tablist" aria-label="Exemples de sites">
        ${site.demos.map((d, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-demo-id="${esc(d.id)}">${esc(d.onglet)}</button>`).join('\n        ')}
      </div>
    </div>
  </div>
</header>`;
}
