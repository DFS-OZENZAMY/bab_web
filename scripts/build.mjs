#!/usr/bin/env node
// Construit le site dans dist/ à partir de src/ et public/.
//
//   node scripts/build.mjs          construit et vérifie
//
// Aucune dépendance : uniquement Node.js (version 18 ou plus).
// Si une vérification échoue, le build s'arrête avec un message clair : Cloudflare garde alors
// la version précédente en ligne, rien n'est cassé.

import { readFile, writeFile, readdir, mkdir, rm, cp, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { accueil } from '../src/pages/accueil.js';
import { introuvable } from '../src/pages/introuvable.js';
import { mentionsLegales } from '../src/pages/mentions-legales.js';
import { robotsTxt, sitemapXml, llmsTxt, manifeste } from '../src/seo/fichiers.js';
import { verifierDonnees, verifierSortie } from './verifications.mjs';
import { dessinerFavicon } from '../src/illustrations/favicon.js';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(RACINE, 'src');
const DIST = join(RACINE, 'dist');

/** Lit tous les fichiers d'un dossier ayant l'extension donnée, dans l'ordre alphabétique. */
async function lireDossier(dossier, extension) {
  const noms = (await readdir(dossier)).filter(n => n.endsWith(extension)).sort();
  return Promise.all(noms.map(n => readFile(join(dossier, n), 'utf8')));
}

/** Minification légère et sûre du CSS : commentaires, retours à la ligne, espaces inutiles. */
function minifierCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .trim();
}

/** Retire les commentaires de ligne et l'indentation du JS (sans toucher aux chaînes). */
function alleger(js) {
  return js
    .split('\n')
    .filter(l => !/^\s*\/\//.test(l))
    .map(l => l.trim())
    .filter(Boolean)
    .join('\n');
}

async function taille(chemin) {
  return ((await stat(chemin)).size / 1024).toFixed(1) + ' Ko';
}

export async function construire({ silencieux = false } = {}) {
  const debut = Date.now();
  const site = JSON.parse(await readFile(join(SRC, 'data', 'site.json'), 'utf8'));
  verifierDonnees(site);

  const fichiersCss = await lireDossier(join(SRC, 'styles'), '.css');
  const css = minifierCss(fichiersCss.join('\n'));
  const polices = minifierCss(fichiersCss[0]); // 01-polices.css, réutilisé par la page 404
  // dessinerFavicon est partagée : elle dessine favicon.svg ici et sert à l'animation dans le navigateur
  const scripts = [`const dessinerFavicon = ${dessinerFavicon.toString()};`, ...await lireDossier(join(SRC, 'scripts'), '.js')];
  const js = `(()=>{\n${alleger(scripts.join('\n'))}\n})();`;

  const pages = {
    'index.html': accueil(site, { css, js }),
    '404.html': introuvable(site, { polices }),
    'mentions-legales.html': mentionsLegales(site, { css }),
    'robots.txt': robotsTxt(site),
    'sitemap.xml': sitemapXml(site),
    'llms.txt': llmsTxt(site),
    'site.webmanifest': manifeste(site),
    'favicon.svg': dessinerFavicon() + '\n',
  };
  verifierSortie(pages, site);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await cp(join(RACINE, 'public'), DIST, { recursive: true });
  await Promise.all(Object.entries(pages).map(([nom, contenu]) => writeFile(join(DIST, nom), contenu)));

  if (!silencieux) {
    console.log(`✓ Site construit dans dist/ en ${Date.now() - debut} ms`);
    for (const nom of Object.keys(pages)) console.log(`  ${nom.padEnd(18)} ${await taille(join(DIST, nom))}`);
  }
  return site;
}

// Lancement direct : node scripts/build.mjs
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  construire().catch(erreur => {
    console.error(`\n✗ Build interrompu : ${erreur.message}\n`);
    process.exit(1);
  });
}
