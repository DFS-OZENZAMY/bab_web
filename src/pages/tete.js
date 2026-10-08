// Balises <head> communes : SEO, partage sur les réseaux, icônes, polices préchargées.
import { esc, brut } from '../lib/texte.js';

const POLICES = ['bricolage', 'readex', 'readex-arabe', 'instrument-italic'];

export function tete(site, { titre, description, chemin = '/', indexer = true, css = '', extra = '' }) {
  const url = `${site.site.url}${chemin}`;
  const t = esc(brut(titre, site));
  const d = esc(brut(description, site));
  return `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${t}</title>
<meta name="description" content="${d}">
<meta name="robots" content="${indexer ? 'index, follow, max-image-preview:large' : 'noindex'}">
${indexer ? `<link rel="canonical" href="${url}">` : ''}
<meta name="theme-color" content="${esc(site.site.couleurTheme)}">
<meta name="author" content="${esc(site.site.nom)}">
<meta name="geo.region" content="MA">
<meta name="geo.placename" content="Maroc">

<!-- Partage sur WhatsApp, Facebook, LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:locale" content="${esc(site.site.locale)}">
<meta property="og:site_name" content="${esc(site.site.nom)}">
<meta property="og:title" content="${esc(brut(site.seo.ogTitre, site))}">
<meta property="og:description" content="${esc(brut(site.seo.ogDescription, site))}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.site.url}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.seo.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${POLICES.map(p => `<link rel="preload" href="/fonts/${p}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n')}
${extra}
<style>${css}</style>
</head>`;
}
