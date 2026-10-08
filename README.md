# Bab Web – site vitrine

Site d'une page pour Bab Web (création de sites vitrines au Maroc), hébergé sur Cloudflare Pages.

📄 Documentation complète : [docs/FICHE-TECHNIQUE.md](docs/FICHE-TECHNIQUE.md)
🎨 Maquette Figma (desktop et mobile) : https://www.figma.com/design/qvOyTFszSx0Zqbo9SJBI1y

## Modifier un texte, un prix ou un numéro

Tout est dans **un seul fichier** : [`src/data/site.json`](src/data/site.json).
Un prix modifié là est mis à jour partout : la page, les données Google, `llms.txt` et les emails envoyés aux prospects.

Ensuite :

```bash
npm run build   # vérifie et construit le site dans dist/
git push        # Cloudflare reconstruit et met en ligne en une minute
```

Si une erreur est détectée (prix mal écrit, icône inconnue, lien cassé…), le build s'arrête avec un message en français et le site en ligne n'est pas touché.

## Travailler en local

Il faut seulement [Node.js](https://nodejs.org) 18 ou plus. Aucune installation de paquet.

```bash
npm run dev     # http://localhost:8788, reconstruit à chaque modification
```

## Organisation

```
src/
  data/site.json        textes, prix, coordonnées, FAQ, secteurs  ← 90 % des modifications
  styles/               CSS, un fichier par section (02-variables.css = couleurs)
  sections/             HTML de chaque section de la page
  illustrations/        dessins SVG (arche, lanterne, médina, icônes)
  scripts/              JavaScript du navigateur (démo, formulaire)
  pages/                assemblage des pages (accueil, mentions légales, 404, balises <head>)
  seo/                  données Google, llms.txt, robots.txt, sitemap
  lib/                  outils partagés (prix, échappement HTML)
public/                 fichiers copiés tels quels (polices, icônes, image de partage)
functions/api/lead.js   réception du formulaire (Telegram, emails, IA)
scripts/                build, vérifications, serveur local
docs/                   fiche technique
```

## Réglages Cloudflare Pages

| Réglage | Valeur |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variable d'environnement | `NODE_VERSION` = `22` (optionnel) |

Les variables et liaisons du formulaire (Telegram, Resend, IA) sont décrites dans la fiche technique.
