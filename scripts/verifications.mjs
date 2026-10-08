// Vérifications automatiques lancées à chaque build.
// Elles attrapent les erreurs les plus courantes avant la mise en ligne.

import { iconesSecteurs } from '../src/illustrations/secteurs.js';
import { illustrationsEtapes } from '../src/illustrations/etapes.js';
import { iconesOptions } from '../src/illustrations/icones.js';

class ErreurDonnees extends Error {}
const exiger = (condition, message) => { if (!condition) throw new ErreurDonnees(message); };

/** Contrôle le contenu de src/data/site.json. */
export function verifierDonnees(site) {
  for (const cle of ['site', 'seo', 'contact', 'hero', 'demos', 'offres', 'secteurs', 'methode', 'faq', 'contactSection', 'llms', 'mentionsLegales']) {
    exiger(site[cle], `site.json : la rubrique « ${cle} » est manquante.`);
  }
  exiger(/^https:\/\/[^/]+$/.test(site.site.url), `site.json : site.url doit ressembler à « https://exemple.ma » (sans / à la fin). Valeur actuelle : ${site.site.url}`);
  exiger(/^\d{10,15}$/.test(site.contact.whatsapp), 'site.json : contact.whatsapp doit contenir uniquement des chiffres, indicatif compris (ex. 212612345678).');
  exiger(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.contact.email), 'site.json : contact.email n’est pas une adresse valide.');
  exiger(/^\d{4}-\d{2}-\d{2}$/.test(site.site.derniereMiseAJour), 'site.json : site.derniereMiseAJour doit être au format AAAA-MM-JJ.');

  const ids = new Set();
  for (const f of site.offres.formules) {
    exiger(f.id && f.nom, 'site.json : chaque formule doit avoir un « id » et un « nom ».');
    exiger(!ids.has(f.id), `site.json : l’id de formule « ${f.id} » est utilisé deux fois.`);
    ids.add(f.id);
    exiger(Number.isInteger(f.prix) && f.prix > 0, `site.json : le prix de la formule « ${f.nom} » doit être un nombre entier sans espace ni « DH » (ex. 1500).`);
    exiger(Array.isArray(f.points) && f.points.length, `site.json : la formule « ${f.nom} » n’a aucun point listé.`);
  }
  exiger(site.offres.formules.filter(f => f.vedette).length <= 1, 'site.json : une seule formule peut être mise en avant (« vedette »).');
  for (const o of site.offres.options) exiger(iconesOptions.includes(o.icone), `site.json : icône d’option inconnue « ${o.icone} ». Disponibles : ${iconesOptions.join(', ')}`);
  for (const s of site.secteurs.liste) exiger(iconesSecteurs.includes(s.icone), `site.json : icône de secteur inconnue « ${s.icone} » (${s.nom}). Disponibles : ${iconesSecteurs.join(', ')}`);
  for (const e of site.methode.etapes) exiger(illustrationsEtapes.includes(e.illustration), `site.json : illustration d’étape inconnue « ${e.illustration} ». Disponibles : ${illustrationsEtapes.join(', ')}`);
  exiger(/^\d{4}-\d{2}-\d{2}$/.test(site.mentionsLegales.derniereMiseAJour), 'site.json : mentionsLegales.derniereMiseAJour doit être au format AAAA-MM-JJ.');
  exiger(site.mentionsLegales.conservation, 'site.json : mentionsLegales.conservation (durée de conservation des données) est obligatoire.');
  exiger(site.demos.length > 0, 'site.json : il faut au moins une démo dans « demos ».');
  exiger(new Set(site.demos.map(d => d.id)).size === site.demos.length, 'site.json : deux démos ont le même id.');
}

/** Contrôle les fichiers générés avant de les écrire. */
export function verifierSortie(pages, site) {
  const page = pages['index.html'];
  const restes = page.match(/\{(prix|villes)[^}]*\}|undefined|\[object Object\]|NaN/g);
  exiger(!restes, `index.html contient des valeurs non remplacées : ${[...new Set(restes || [])].join(', ')}`);
  exiger((page.match(/<h1[\s>]/g) || []).length === 1, 'index.html doit contenir exactement un titre <h1> (important pour Google).');

  const jsonld = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  exiger(jsonld, 'index.html : données structurées (JSON-LD) absentes.');
  JSON.parse(jsonld[1]);

  const ids = new Set([...page.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const [, ancre] of page.matchAll(/href="#([^"]+)"/g)) {
    exiger(ids.has(ancre), `index.html : le lien « #${ancre} » ne mène à aucune section (id introuvable).`);
  }
  // Liens entre pages : « /mentions-legales#donnees-personnelles » doit mener à une page et une ancre existantes
  const pagesHtml = Object.entries(pages).filter(([nom]) => nom.endsWith('.html'));
  for (const [nom, contenu] of pagesHtml) {
    exiger(!/\{(prix|villes)[^}]*\}|undefined|\[object Object\]|NaN/.test(contenu), `${nom} contient une valeur non remplacée.`);
    for (const [, chemin, ancre] of contenu.matchAll(/href="\/([a-z0-9-]*)(?:#([^"]+))?"/g)) {
      const cible = chemin ? `${chemin}.html` : 'index.html';
      exiger(pages[cible] || chemin.includes('.'), `${nom} : le lien « /${chemin} » mène à une page qui n'existe pas.`);
      if (ancre && pages[cible]) exiger(pages[cible].includes(`id="${ancre}"`), `${nom} : le lien « /${chemin}#${ancre} » mène à une section introuvable.`);
    }
  }

  for (const f of site.offres.formules) {
    exiger(pages['llms.txt'].includes(f.nom), `llms.txt : la formule « ${f.nom} » est absente.`);
  }
  const ko = Buffer.byteLength(page) / 1024;
  exiger(ko < 120, `index.html pèse ${ko.toFixed(0)} Ko (limite fixée : 120 Ko). Vérifiez qu’aucune image n’a été intégrée par erreur.`);
}
