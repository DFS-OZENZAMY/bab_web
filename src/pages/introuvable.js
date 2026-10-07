// Page 404 : même identité visuelle, sans être indexée par Google.
import { tete } from './tete.js';
import { esc } from '../lib/texte.js';

const CSS = `body{margin:0;min-height:100vh;display:grid;place-items:center;background:#16226B;color:#fff;font-family:"Readex Pro",system-ui,sans-serif;text-align:center;padding:2rem}
h1{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:clamp(2rem,6vw,3rem);margin:1.5rem 0 .5rem}
p{color:#C9CFF2;margin:0}
a{display:inline-block;margin-top:1.8rem;background:#F2B33D;color:#1C1606;padding:.9rem 1.5rem;border-radius:999px;text-decoration:none;font-weight:500}
a:focus-visible{outline:3px solid #fff;outline-offset:3px}
svg{width:120px;height:140px}`;

export function introuvable(site, { polices }) {
  return `<!DOCTYPE html>
<html lang="${site.site.langue}">
${tete(site, { titre: `Page introuvable | ${site.site.nom}`, description: 'Cette page n’existe pas.', indexer: false, css: polices + CSS })}
<body>
<div>
  <svg viewBox="0 0 120 140" fill="none" aria-hidden="true"><path d="M10 140V60a50 50 0 0 1 100 0v80Z" fill="#2438A6"/><path d="M28 140V64a32 32 0 0 1 64 0v76Z" fill="#0E1550"/><path d="M60 8l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#F2B33D"/></svg>
  <h1>Cette porte ne mène nulle part.</h1>
  <p>Le lien est peut-être incorrect ou la page a été déplacée.</p>
  <a href="/">Retourner à l'accueil de ${esc(site.site.nom)}</a>
</div>
</body>
</html>
`;
}
