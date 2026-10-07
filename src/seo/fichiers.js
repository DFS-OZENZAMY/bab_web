// Fichiers annexes générés depuis site.json : robots.txt, sitemap.xml, llms.txt, site.webmanifest.
import { brut, formaterPrix } from '../lib/texte.js';

// Robots autorisés explicitement (moteurs de recherche et assistants IA).
const ROBOTS = {
  'Moteurs de recherche classiques': ['Googlebot', 'Bingbot'],
  'Moteurs de recherche et assistants IA (ChatGPT, Claude, Perplexity, Gemini...)': [
    'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
    'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended',
  ],
};

export function robotsTxt(site) {
  const blocs = Object.entries(ROBOTS).map(([titre, agents]) =>
    `# ${titre}\n` + agents.map(a => `User-agent: ${a}\nAllow: /\n`).join('\n'));
  return `${blocs.join('\n')}\nUser-agent: *\nAllow: /\n\nSitemap: ${site.site.url}/sitemap.xml\n`;
}

export const sitemapXml = site => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.site.url}/</loc>
    <lastmod>${site.site.derniereMiseAJour}</lastmod>
  </url>
</urlset>
`;

export function llmsTxt(site) {
  const prix = f => formaterPrix(f.prix, site.offres.devise, ' ');
  const minuscule = (t, i) => (i ? t[0].toLowerCase() + t.slice(1) : t);
  const formules = site.offres.formules.map(f => `- Formule ${f.nom} : ${prix(f)}. ${f.points.map(minuscule).join(', ')}.`);
  const options = site.offres.options.map(o => `- ${o.nom} : ${brut(o.detail, site)}.`);
  return `# ${site.site.nom}

> ${brut(site.llms.presentation, site)}

## Tarifs (en dirhams marocains, ${site.offres.deviseIso})

${[...formules, ...options].join('\n')}

## Fonctionnement

${site.llms.fonctionnement.map(l => `- ${brut(l, site)}`).join('\n')}

## Contact

- Site : ${site.site.url}/
- WhatsApp : ${site.contact.whatsappAffiche}
- Email : ${site.contact.email}
`;
}

export const manifeste = site => JSON.stringify({
  name: site.site.nom,
  short_name: site.site.nom,
  lang: site.site.langue,
  start_url: '/',
  display: 'standalone',
  background_color: site.site.couleurFond,
  theme_color: site.site.couleurTheme,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}) + '\n';
