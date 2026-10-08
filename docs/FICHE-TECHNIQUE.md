# Fiche technique – Site Bab Web

Document de référence du site : ce qu'il contient, comment il fonctionne, comment le configurer et le faire évoluer.
Dernière mise à jour : 7 octobre 2026 (refactoring : source unique `site.json` et build automatique).

---

## 1. Vue d'ensemble

| Élément | Valeur |
|---|---|
| Site | https://bab-web.pages.dev/ |
| Dépôt GitHub | https://github.com/DFS-OZENZAMY/bab_web (branche `main`) |
| Hébergement | Cloudflare Pages (offre gratuite), déploiement automatique à chaque modification sur `main` |
| Type de site | Site statique d'une page, généré à partir de `src/` par un petit script Node.js sans dépendance, + une fonction serveur (`/api/lead`) |
| Langues | Français (contenu principal), une phrase en arabe |
| Coût mensuel actuel | 0 DH (hors futur nom de domaine) |

Fonctionnement du déploiement : une modification est envoyée sur GitHub → Cloudflare lance `npm run build`, qui vérifie les données et génère le site dans `dist/` → le site est mis à jour en une minute environ. Si une vérification échoue, le déploiement s'arrête et la version précédente reste en ligne.

Réglages du projet dans Cloudflare Pages (Workers & Pages → bab-web → Settings → Build) :
- Framework preset : None
- Build command : `npm run build`
- Build output directory : `dist`

---

## 2. Structure des fichiers

Règle d'or : **chaque information n'existe qu'à un seul endroit**.

| Emplacement | Rôle |
|---|---|
| `src/data/site.json` | Tous les textes, prix, coordonnées, secteurs, étapes, questions, démos. Source unique pour la page, les données Google, `llms.txt` et les emails |
| `src/styles/` | CSS découpé par rôle, dans l'ordre de chargement : `01-polices`, `02-variables` (couleurs et thème sombre), `03-base`, `10-boutons`, `11-navigation`, `20-hero`, `21-demo`, `22-frise`, `30-offres` à `34-contact`, `40-pied-de-page` |
| `src/sections/` | Le HTML de chaque section (`hero.js`, `offres.js`, etc.) |
| `src/illustrations/` | Les dessins SVG : arche, frise, lanterne, médina, icônes des secteurs et des étapes |
| `src/scripts/` | JavaScript du navigateur : `demo.js` (onglets Riad, Restaurant, Cabinet), `devis.js` (formulaire), `main.js` (démarrage) |
| `src/pages/` | Assemblage : `accueil.js`, `introuvable.js` (404), `tete.js` (balises `<head>`) |
| `src/seo/` | Données structurées Google, `llms.txt`, `robots.txt`, `sitemap.xml`, `site.webmanifest` |
| `src/lib/` | Outils partagés : format des prix, échappement HTML, liens WhatsApp |
| `public/` | Copié tel quel : polices, icônes, `og-image.png`, `_headers`, validation Google Search Console (`google8b12182a3785c621.html`, ne pas supprimer) |
| `functions/api/lead.js` | Fonction serveur du formulaire. Lit aussi `site.json` |
| `scripts/build.mjs` | Génère `dist/` (CSS et JS intégrés dans la page, une seule requête) |
| `scripts/verifications.mjs` | Contrôles automatiques à chaque build |
| `scripts/dev.mjs` | Serveur local avec reconstruction automatique |
| `dist/` | Site généré, publié par Cloudflare. Jamais modifié à la main, ignoré par git |

### Vérifications automatiques

Le build refuse de publier si :
- une rubrique manque dans `site.json`, un prix n'est pas un nombre entier, deux formules ont le même id ou plusieurs sont « vedette » ;
- l'adresse du site, le numéro WhatsApp, l'email ou la date de mise à jour sont mal formés ;
- une icône ou illustration demandée n'existe pas ;
- la page contient un repère non remplacé (`{prix:…}`), `undefined` ou `NaN` ;
- la page n'a pas exactement un titre `<h1>`, les données Google sont invalides, ou un lien du menu pointe vers une section absente ;
- la page dépasse 120 Ko.

### Repères utilisables dans les textes de `site.json`

| Repère | Remplacé par |
|---|---|
| `{prix:essentiel}`, `{prix:business}`, `{prix:premium}` | Le prix de la formule, ex. « 1 500 DH » |
| `{villes}` | La liste `villes`, ex. « Casablanca, Rabat, Marrakech… » |
| `*mots*` | Mots en italique accentué (utilisé dans le titre principal) |
| `[texte](/adresse)` | Lien, ex. `[loi 09-08](/mentions-legales#donnees-personnelles)` |

---

## Modifications courantes

**Changer un prix** : modifier `prix` de la formule dans `site.json` (nombre sans espace, ex. `1800`). Tout le reste suit, y compris les emails.

**Changer le numéro WhatsApp ou l'email** : rubrique `contact` de `site.json`.

**Ajouter une question à la FAQ** : ajouter `{ "question": "…", "reponse": "…" }` dans `faq.questions`. Elle apparaît aussi dans les données Google.

**Ajouter un secteur** : ajouter `{ "icone": "…", "nom": "…" }` dans `secteurs.liste`, avec une icône existante (`riad`, `resto`, `sante`, `droit`, `beaute`, `auto`, `ecole`, `artisan`, `immo`, `voyage`). Pour une nouvelle icône, ajouter son dessin dans `src/illustrations/secteurs.js`.

**Changer une couleur** : `src/styles/02-variables.css` (penser aussi aux valeurs du mode sombre juste en dessous).

**Passer sur un nom de domaine** : modifier `site.url` dans `site.json` (ex. `https://babweb.ma`). Balises, données Google, `robots.txt`, `sitemap.xml`, `llms.txt` et emails sont mis à jour automatiquement.

**Mentions légales** (`/mentions-legales`) : page générée par `src/pages/mentions-legales.js`. Les informations variables sont dans `site.json` → `mentionsLegales` : exploitant, adresse, identifiant (ICE ou numéro d'auto-entrepreneur), numéro de déclaration CNDP, durée de conservation des données, hébergeur. Un champ laissé vide est simplement masqué. Mettre à jour `mentionsLegales.derniereMiseAJour` à chaque changement. Si un prestataire change (par exemple un autre service d'emails que Resend), modifier la liste « Qui reçoit vos données » dans le fichier de la page. La mention « loi 09-08 » du formulaire renvoie vers `/mentions-legales#donnees-personnelles` (lien écrit `[texte](/adresse)` dans `contactSection.consentement`).

**Après une modification de contenu** : mettre à jour `site.derniereMiseAJour` (utilisé par le sitemap).

---

## 3. Contenu de la page

Sections, dans l'ordre :
1. Navigation (logo, liens Offres / Secteurs / Méthode / Questions, bouton devis)
2. En-tête : titre principal, phrase en arabe, arguments clés, illustration « bab » (arche zellige, lanterne, palmier) avec la démo interactive (riad, restaurant, cabinet) dans l'arche
3. Frise zellige
4. Tarifs (`#offres`) : formules en cartes à sommet d'arche et options
5. Secteurs (`#secteurs`) : 10 cartes avec icônes et villes desservies
6. Méthode en 4 étapes illustrées (`#methode`)
7. FAQ (`#faq`) avec illustration de lanterne
8. Contact et formulaire de devis (`#contact`), médina de nuit en bas de section
9. Pied de page + bouton WhatsApp flottant

Tarifs affichés :

| Offre | Prix |
|---|---|
| Essentiel | 1 500 DH |
| Business | 3 500 DH |
| Premium | 6 500 DH |
| Hébergement et domaine | 800 DH / an |
| Maintenance | 250 DH / mois |
| Logo | à partir de 800 DH |

Les prix se modifient uniquement dans `src/data/site.json` (voir « Modifications courantes »).

---

## 4. Identité visuelle

Refonte du 7 octobre 2026. Maquette de référence dans Figma : « Bab Web — Refonte 2026 » (https://www.figma.com/design/qvOyTFszSx0Zqbo9SJBI1y), avec la page complète en 1440 px et les composants (bouton, carte secteur, question FAQ, icônes).

Fil conducteur : la porte (« bab »). L'arche marocaine revient partout : illustration principale, sommet des cartes de tarifs et de secteurs, médina de nuit dans la section contact.

| Élément | Valeur |
|---|---|
| Bleu Majorelle | `#2438A6` (couleur principale) |
| Bleu nuit | `#16226B` / `#0E1550` (formule mise en avant, section contact) |
| Safran | `#F2B33D` (boutons, accents, étoiles zellige) |
| Vert menthe | `#1F5545` (section secteurs) |
| Terre cuite | `#B4532C` (phrase en arabe, prix, numéros d'étapes) |
| Fond ivoire | `#F8F4EC`, sable `#EFE6D4`, fond FAQ `#F3ECDD` |
| Texte | `#141A3A` / `#2B3150` |
| Police des titres | Bricolage Grotesque |
| Police du texte | Readex Pro (gère aussi l'arabe) |
| Accent du titre principal | Instrument Serif italique (`public/fonts/instrument-italic.woff2`, réduite aux caractères latins) |

Les illustrations sont des SVG générés par `src/illustrations/` et intégrés dans la page (aucune image à charger). Les animations (apparition de l'illustration, balancement de la lanterne) sont désactivées si l'appareil demande moins d'animations.

Le site s'adapte automatiquement au mode sombre du téléphone ou de l'ordinateur. Tous les contrastes de texte ont été vérifiés (norme WCAG AA, minimum 4,5:1) en mode clair et en mode sombre.

---

## 5. Référencement Google (SEO)

Déjà en place :
- Titre et description optimisés pour « création site vitrine Maroc »
- Un seul titre H1, sous-titres H2 avec mots-clés naturels, mention des villes
- Adresse canonique, balise robots, langue `fr`, région `MA`
- Données structurées Schema.org : entreprise (`ProfessionalService`), offres avec prix en MAD, site web, FAQ
- Image et balises de partage (Open Graph, Twitter)
- `sitemap.xml` et `robots.txt`
- Page 404 non indexée

Google Search Console :
- Propriété de type « Préfixe de l'URL » : `https://bab-web.pages.dev/`
- Validation par fichier HTML (`google8b12182a3785c621.html`)
- Sitemap envoyé le 7 octobre 2026 (statut « Impossible de récupérer » normal les premiers jours)

À faire :
- Ajouter le site dans Bing Webmaster Tools (import possible depuis Search Console)
- Créer la fiche Google Business Profile
- Acheter un nom de domaine, puis modifier `site.url` dans `src/data/site.json`
- Ajouter le nouveau domaine dans Search Console (méthode DNS possible à ce moment-là)

---

## 6. Visibilité dans les assistants IA (ChatGPT, Claude, Gemini, Perplexity)

Déjà en place :
- `robots.txt` autorise explicitement OAI-SearchBot, ChatGPT-User, GPTBot, Claude-SearchBot, Claude-User, ClaudeBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended
- `llms.txt` résume l'activité, les tarifs et le contact
- Données structurées et FAQ à réponses directes

Point de vigilance : lors de l'ajout d'un domaine personnalisé dans Cloudflare, vérifier dans Security → Bots → AI bots que le blocage des robots IA est désactivé (réglage sur Allow). Ne pas activer le blocage « entraînement IA », qui peut aussi bloquer Googlebot.

---

## 7. Performance

- Polices hébergées sur le site (plus aucune requête vers Google Fonts), préchargées dans le `<head>`
- Police arabe réduite aux seuls caractères utilisés (12 Ko au lieu de 76 Ko)
- Aucune image lourde dans la page, icônes en SVG
- Cache d'un an pour les polices et les images (`_headers`)

Attention : si une nouvelle phrase en arabe est ajoutée, la police arabe réduite ne contiendra pas forcément les lettres nécessaires. Il faudra régénérer `public/fonts/readex-arabe.woff2` avec tout le texte arabe de la page (outil `pyftsubset`), ou remplacer ce fichier par la version complète de Readex Pro arabe.

Objectif PageSpeed Insights : 90 ou plus dans les quatre catégories, en mobile.

---

## 8. Système de leads

### Fonctionnement

Quand un visiteur envoie le formulaire, la page appelle `POST /api/lead` (`functions/api/lead.js`) :

1. Vérifications : nom et téléphone obligatoires, format de l'email, champ invisible anti-spam (`site_web_hp`)
2. Notification Telegram instantanée (nom, téléphone, email, ville, formule, message, lien WhatsApp direct)
3. Notification par email à `OWNER_EMAIL`
4. Enregistrement dans l'historique KV `LEADS` (si configuré)
5. Si le prospect a donné son email **et** coché la case de consentement : email personnalisé rédigé par l'IA (Workers AI), envoyé via Resend, avec copie à `OWNER_EMAIL`. Les réponses du prospect arrivent chez `OWNER_EMAIL`.
6. Si l'IA échoue : envoi d'un email modèle

Le visiteur reçoit la confirmation immédiatement ; les étapes 2 à 6 se font en arrière-plan.

Sécurité anti-perte : si aucun canal de notification n'est configuré, ou si l'envoi échoue, le formulaire ouvre WhatsApp avec le message du prospect prérempli.

### Règles données à l'IA

- Français, vouvoiement, 150 à 220 mots
- Se baser uniquement sur ce que le prospect a écrit, ne rien inventer sur son entreprise
- Recommander une seule formule, avec son prix exact
- Aucune promesse de résultat garanti
- Terminer par une prise de contact (appel ou WhatsApp, devis sous 24 heures)

Modèle utilisé : `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (constante `MODELE_IA`).

### Configuration dans Cloudflare

Workers & Pages → bab-web → Settings.

**Variables and Secrets** (cocher « Encrypt » pour les clés) :

| Nom | Exemple | Rôle |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | `123456:ABC…` | Token du bot, obtenu avec @BotFather |
| `TELEGRAM_CHAT_ID` | `987654321` | Ton identifiant, obtenu avec @userinfobot |
| `RESEND_API_KEY` | `re_…` | Clé API Resend |
| `FROM_EMAIL` | `Bab Web <onboarding@resend.dev>` puis `Bab Web <contact@babweb.ma>` | Expéditeur des emails |
| `OWNER_EMAIL` | `ton.email@gmail.com` | Reçoit les leads, les copies et les réponses |
| `WHATSAPP` | `33758984318` | Optionnel : par défaut, le numéro de `site.json` est utilisé dans les emails |

**Bindings** :

| Type | Nom | Obligatoire |
|---|---|---|
| Workers AI | `AI` | Recommandé (sinon email modèle) |
| KV namespace | `LEADS` | Non (historique des leads) |

Après chaque changement : Deployments → Retry deployment.

### Limites

- Sans nom de domaine vérifié dans Resend, seuls les emails vers ta propre adresse fonctionnent. Les emails aux prospects nécessitent un domaine (ex. `babweb.ma`) vérifié dans Resend.
- Offres gratuites : Resend et Workers AI ont des quotas journaliers et mensuels, largement suffisants pour un volume normal de leads. Vérifier les quotas actuels sur leurs sites en cas de forte croissance.
- Les journaux d'erreurs sont visibles dans Cloudflare : Deployments → (dernier déploiement) → Functions → Real-time logs.

---

## 9. Informations à personnaliser

| Information | Où |
|---|---|
| Numéro WhatsApp : **+33 7 58 98 43 18** | `src/data/site.json` → `contact.whatsapp` (chiffres seuls) et `contact.whatsappAffiche` (format lisible) |
| Email (`contact@babweb.ma`) | `src/data/site.json` → `contact.email` |
| Nom de la marque, adresse du site | `src/data/site.json` → `site.nom`, `site.url`. Seuls les fichiers image (`og-image.png`, icônes) sont à refaire à la main |

---|---|
| Numéro WhatsApp : **+33 7 58 98 43 18** (configuré le 07/10/2026) | `index.html` : lien de contact, bouton flottant, constante `WHATSAPP` du script (`33758984318`) ; données structurées (`+33758984318`) ; `llms.txt` ; variable Cloudflare `WHATSAPP` |
| Email (`contact@babweb.ma`) | `index.html` (contact et données structurées) ; `llms.txt` |
| Nom de la marque | `index.html`, `llms.txt`, `site.webmanifest`, `og-image.png`, `functions/api/lead.js` |

---

## 10. Sécurité et confidentialité

- Aucune clé ni mot de passe n'est stocké dans le dépôt. Les clés sont uniquement dans les variables chiffrées de Cloudflare.
- Les tokens GitHub et clés Cloudflare partagés pendant la création du site doivent être supprimés et recréés si besoin.
- Pour donner un accès temporaire au dépôt : token GitHub « fine-grained », limité au dépôt `bab_web`, permission Contents en lecture/écriture, expiration courte.
- Formulaire : case de consentement avec lien vers la politique de données personnelles (`/mentions-legales#donnees-personnelles`). Selon le traitement, une déclaration auprès de la CNDP peut être nécessaire ; son numéro s'ajoute dans `site.json` → `mentionsLegales.declarationCndp`.
- Seul le dossier généré `dist/` est publié : la documentation, les sources (`src/`) et le code de `functions/` ne sont pas accessibles depuis le site.

---

## 11. Historique des versions

| Date | Modification |
|---|---|
| 07/10/2026 | Création du site vitrine |
| 07/10/2026 | SEO : métadonnées, données structurées, sitemap, robots, icônes, page 404 |
| 07/10/2026 | Performance : polices hébergées sur le site, préchargement |
| 07/10/2026 | Accessibilité : contrastes corrigés en mode clair et sombre |
| 07/10/2026 | Visibilité IA : robots.txt et llms.txt |
| 07/10/2026 | Validation Google Search Console |
| 07/10/2026 | Système de leads : Telegram, email, email personnalisé par IA |
| 07/10/2026 | Fiche technique |
| 07/10/2026 | Numéro WhatsApp réel : +33 7 58 98 43 18 |
| 07/10/2026 | Suppression de la mention ICE du pied de page |

---

## 12. Prochaines étapes conseillées

1. Remplacer l'email de démonstration (`contact@babweb.ma`)
2. Configurer Telegram et Resend, tester un envoi du formulaire
3. Acheter le nom de domaine et le relier à Cloudflare Pages
4. Vérifier le domaine dans Resend pour activer les emails aux prospects
5. Bing Webmaster Tools et fiche Google Business Profile
6. Ajouter une section « À propos » et des réalisations clients
7. Plus tard : version arabe complète, pages par secteur, page politique de confidentialité
