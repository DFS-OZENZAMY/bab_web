#!/usr/bin/env node
// Serveur local avec reconstruction automatique : npm run dev → http://localhost:8788
// Chaque modification dans src/ ou public/ reconstruit le site ; il suffit de recharger la page.
// Note : le formulaire (/api/lead) ne fonctionne pas ici, il bascule sur WhatsApp comme prévu.
// Pour tester aussi la fonction : npx wrangler pages dev dist

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { construire } from './build.mjs';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RACINE, 'dist');
const PORT = Number(process.env.PORT) || 8788;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};

async function reconstruire() {
  try {
    await construire({ silencieux: true });
    console.log(`✓ ${new Date().toLocaleTimeString('fr-FR')} site reconstruit`);
  } catch (e) {
    console.error(`✗ ${e.message}`);
  }
}

await reconstruire();

let minuterie;
for (const dossier of ['src', 'public']) {
  watch(join(RACINE, dossier), { recursive: true }, () => {
    clearTimeout(minuterie);
    minuterie = setTimeout(reconstruire, 120);
  });
}

createServer(async (req, res) => {
  let chemin = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  if (chemin.endsWith('/')) chemin += 'index.html';
  let fichier = join(DIST, chemin);
  try {
    if ((await stat(fichier)).isDirectory()) fichier = join(fichier, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[extname(fichier)] || 'application/octet-stream' });
    res.end(await readFile(fichier));
  } catch {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')).catch(() => 'Introuvable'));
  }
}).listen(PORT, () => console.log(`→ http://localhost:${PORT}  (Ctrl + C pour arrêter)`));
